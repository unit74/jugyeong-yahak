package com.ssafy.http.apis.members.services;

import com.ssafy.http.apis.lecturehistories.entities.LectureHistoryEntity;
import com.ssafy.http.apis.lecturehistories.repositories.LectureHistoryRepository;
import com.ssafy.http.apis.members.entities.MemberEntity;
import com.ssafy.http.apis.members.repositories.MemberRepository;
import com.ssafy.http.apis.members.requests.StudentRegisterRequest;
import com.ssafy.http.apis.members.requests.StudentUpdateRequest;
import com.ssafy.http.apis.members.requests.TeacherRegisterRequest;
import com.ssafy.http.apis.members.requests.TeacherUpdateRequest;
import com.ssafy.http.apis.members.responses.StudentDetailResponse;
import com.ssafy.http.apis.members.responses.TeacherDetailResponse;
import com.ssafy.http.apis.roles.Role;
import com.ssafy.http.apis.roles.entities.RoleEntity;
import com.ssafy.http.exception.CustomException;
import com.ssafy.http.exception.RegisterIdentificationException;
import com.ssafy.http.exception.WrongParameterException;
import com.ssafy.http.support.codes.ErrorCode;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;


@Service
@RequiredArgsConstructor
public class MemberService {

  private final MemberRepository memberRepository;
  private final PasswordEncoder passwordEncoder;
  private final S3ImageUploadService s3ImageUploadService;
  private final LectureHistoryRepository lectureHistoryRepository;
  @Value("${cloud.aws.s3.url}")
  private String url;

  private String imageType = ".png";

  @Transactional
  public void deleteTeacherClassId(Long loginUserId) {
    Optional<MemberEntity> memberEntityOptional = memberRepository.findMemberEntityById(
        loginUserId);

    MemberEntity memberEntity = memberEntityOptional.orElseThrow(
        () -> new CustomException(ErrorCode.NOT_FOUND_ERROR)
    );

    Long classId = memberEntity.getClassId();

    // 강의 종료 로그 -> 커리큘럼 null
    LectureHistoryEntity lectureHistoryEntity = LectureHistoryEntity.builder()
        .classId(classId)
        .teacherId(loginUserId)
        .build();

    lectureHistoryRepository.save(lectureHistoryEntity);

    //강사 classId null로 처리
    memberEntity.setClassId(null);
    memberRepository.save(memberEntity);

  }

  @Transactional
  public MemberEntity setTeacherClassId(Long loginUserId, Long classId) {

    if (classId != 206L) {
      // 해당 반이 임의의 선생에게 이미 할당이 되어 있는지 체크
      Optional<MemberEntity> entity = memberRepository.findClassIdByRole(classId);

      if (entity.isPresent()) { //값이 있을때 예외를 던젼야함
        throw new CustomException(ErrorCode.ID_ALREADY_USE);
      }

    }
    //반이 free한 상태
    Optional<MemberEntity> teacherOptionalEntity = memberRepository.findById(loginUserId);

    teacherOptionalEntity.ifPresentOrElse(
        (teacherEntity) -> {
          teacherEntity.setClassId(classId);
          memberRepository.save(teacherEntity);
        },
        () -> {
          throw new CustomException(ErrorCode.NOT_FOUND_ERROR);
        }
    );

    return teacherOptionalEntity.get();

  }

  @Transactional
  public StudentDetailResponse updateStudent(StudentUpdateRequest studentUpdateRequest) {

    StudentDetailResponse studentDetailResponse = new StudentDetailResponse();

    MemberEntity studentEntity = memberRepository.findMemberEntityById(studentUpdateRequest.getId())
        .orElseThrow(
            () -> new CustomException(ErrorCode.IO_ERROR)
        );

    studentEntity = studentUpdateRequest.toEntity(studentEntity);
    memberRepository.save(studentEntity);

    studentDetailResponse.of(studentEntity);

    return studentDetailResponse;
  }

  public StudentDetailResponse getStudentDetail(Long studentId) {
    StudentDetailResponse studentDetailResponse = new StudentDetailResponse();

    studentDetailResponse.of(memberRepository.findById(studentId)
        .orElseThrow(
            () -> new WrongParameterException(
                ErrorCode.BAD_REQUEST_ERROR)));

    return studentDetailResponse;
  }

  public List<StudentDetailResponse> getClassStudents(Long classId) {
    List<StudentDetailResponse> studentDetailResponses = new ArrayList<>();

    List<MemberEntity> students = memberRepository.findAllByRoleAndClassId(
        RoleEntity.builder().role(Role.STUDENT).build(), classId);

    for (MemberEntity student : students) {
      StudentDetailResponse studentDetailResponse = new StudentDetailResponse();

      studentDetailResponse.of(student);

      studentDetailResponses.add(studentDetailResponse);
    }

    return studentDetailResponses;
  }

  public void registerStudents(Long governmentId, MultipartFile faceImage,
      StudentRegisterRequest studentRegisterRequest) {

    String uuid = UUID.randomUUID().toString();

    MemberEntity memberEntity = studentRegisterRequest.toEntity(url, imageType,
        governmentId, uuid);

    String folder = String.valueOf(governmentId);

    memberRepository.findMemberEntityByPhone(memberEntity.getPhone())
        .ifPresent((student) -> {
          throw new RegisterIdentificationException(
              ErrorCode.ID_ALREADY_USE);
        });

    try {
      s3ImageUploadService.uploadImage(folder, uuid, imageType, faceImage);
    } catch (IOException e) {
      throw new RegisterIdentificationException(ErrorCode.IO_ERROR);
    }

    memberEntity.encodePassword(passwordEncoder);
    memberRepository.save(memberEntity);
  }

  public void registerTeachers(Long governmentId, MultipartFile faceImage,
      TeacherRegisterRequest teacherRegisterRequest) {

    String uuid = UUID.randomUUID().toString();

    MemberEntity memberEntity = teacherRegisterRequest.toEntity(url, imageType,
        governmentId,
        uuid);

    String folder = memberEntity.getGovernmentId().toString();

    memberRepository.findMemberEntityByPhone(memberEntity.getPhone())
        .ifPresent((student) -> new RegisterIdentificationException(
            ErrorCode.ID_ALREADY_USE));

    try {
      s3ImageUploadService.uploadImage(folder, uuid, imageType, faceImage);
    } catch (IOException e) {
      throw new RegisterIdentificationException(ErrorCode.IO_ERROR);
    }

    memberEntity.encodePassword(passwordEncoder);
    memberRepository.save(memberEntity);
  }

  @Transactional //강사 update
  public TeacherDetailResponse updateTeacher(TeacherUpdateRequest teacherUpdateRequest) {

    TeacherDetailResponse teacherDetailResponse = new TeacherDetailResponse();

    MemberEntity teacherEntity = memberRepository.findMemberEntityById(teacherUpdateRequest.getId())
        .orElseThrow(
            () -> new CustomException(ErrorCode.IO_ERROR)
        );

    teacherEntity = teacherUpdateRequest.toEntity(teacherEntity);
    memberRepository.save(teacherEntity);

    teacherDetailResponse.of(teacherEntity);

    return teacherDetailResponse;
  }

  //강사 상세 조회
  public TeacherDetailResponse getTeacherDetail(Long teacherId) {
    TeacherDetailResponse teacherDetailResponse = new TeacherDetailResponse();

    teacherDetailResponse.of(memberRepository.findById(teacherId)
        .orElseThrow(
            () -> new WrongParameterException(
                ErrorCode.BAD_REQUEST_ERROR)));

    return teacherDetailResponse;
  }

  public List<TeacherDetailResponse> getTeachers(Long governmentId) {

    List<TeacherDetailResponse> teacherDetailResponses = new ArrayList<>();

    List<MemberEntity> teachers = memberRepository.findAllByRoleAndGovernmentId(
        RoleEntity.builder().role(Role.TEACHER).build(), governmentId);

    for (MemberEntity teacher : teachers) {
      TeacherDetailResponse teacherDetailResponse = new TeacherDetailResponse();

      teacherDetailResponse.of(teacher);

      teacherDetailResponses.add(teacherDetailResponse);
    }

    return teacherDetailResponses;
  }

  public List<StudentDetailResponse> getStudentList(Long loginUserId, Role loginUserRole) {

    Long governmentId = loginUserId; //지자체 번호

    if (loginUserRole.getId() == Role.TEACHER.getId()) { //강사의 경우
      MemberEntity memberEntity = memberRepository.findById(loginUserId).orElseThrow(
          () -> new CustomException(ErrorCode.ID_NOTFOUND)
      );

      governmentId = memberEntity.getGovernmentId();
    }

    List<StudentDetailResponse> studentDetailResponses = new ArrayList<>();

    List<MemberEntity> students = memberRepository.findAllByRoleAndGovernmentId(
        RoleEntity.builder().role(Role.STUDENT).build(), governmentId);

    for (MemberEntity student : students) {
      StudentDetailResponse studentDetailResponse = new StudentDetailResponse();
      studentDetailResponse.of(student);

      studentDetailResponses.add(studentDetailResponse);
    }

    return studentDetailResponses;
  }

  public Long getClassId(Long id) {
    MemberEntity memberEntity = memberRepository.findById(id)
        .orElseThrow(() -> new WrongParameterException(
            ErrorCode.BAD_REQUEST_ERROR));

    return memberEntity.getClassId();
  }

  public Long getGovernmentId(Long id) {
    MemberEntity memberEntity = memberRepository.findById(id)
        .orElseThrow(() -> new WrongParameterException(
            ErrorCode.BAD_REQUEST_ERROR));

    return memberEntity.getGovernmentId();
  }


}
