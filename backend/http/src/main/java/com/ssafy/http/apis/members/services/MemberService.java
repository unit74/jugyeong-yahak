package com.ssafy.http.apis.members.services;

import com.ssafy.http.apis.members.entities.MemberEntity;
import com.ssafy.http.apis.members.repositories.MemberRepository;
import com.ssafy.http.apis.members.requests.StudentRequest;
import com.ssafy.http.apis.members.requests.TeacherRegisterRequest;
import com.ssafy.http.apis.members.responses.StudentDetailResponse;
import com.ssafy.http.exception.CustomException;
import com.ssafy.http.exception.RegisterIdentificationException;
import com.ssafy.http.exception.WrongParameterException;
import com.ssafy.http.support.codes.ErrorCode;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
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

  @Value("${cloud.aws.s3.url}")
  private String url;

  private String imageType = ".png";

  @Transactional
  public StudentDetailResponse updateStudent(Long studentId,
      StudentRequest studentRequest) {
    StudentDetailResponse studentDetailResponse = new StudentDetailResponse();

    MemberEntity studentEntity = memberRepository.findMemberEntityById(studentId).orElseThrow(
        () -> new CustomException(ErrorCode.IO_ERROR)
    );

    studentEntity = studentRequest.toEntityForUpdate(studentEntity);
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

    List<MemberEntity> students = memberRepository.findAllByClassId(classId);

    for (MemberEntity student : students) {
      StudentDetailResponse studentDetailResponse = new StudentDetailResponse();

      studentDetailResponse.of(student);

      studentDetailResponses.add(studentDetailResponse);
    }

    return studentDetailResponses;
  }

  public void registerStudents(Long governmentId, MultipartFile faceImage,
      StudentRequest studentRequest) {

    String uuid = UUID.randomUUID().toString();

    MemberEntity memberEntity = studentRequest.toEntityForRegister(url, imageType,
        governmentId, uuid);

    String folder = memberEntity.getGovernmentId()
        .toString();

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

  public void registerTeachers(Long governmentId, MultipartFile faceImage,
      TeacherRegisterRequest teacherRegisterRequest) {

    MemberEntity memberEntity = teacherRegisterRequest.toEntity(url, imageType, governmentId);

    String folder = memberEntity.getGovernmentId().toString();
    String uuid = memberEntity.getUuid();

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
