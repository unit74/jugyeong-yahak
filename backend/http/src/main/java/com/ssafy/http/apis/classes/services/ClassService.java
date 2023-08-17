package com.ssafy.http.apis.classes.services;

import com.ssafy.http.apis.classes.entities.ClassEntity;
import com.ssafy.http.apis.classes.repositories.ClassRepository;
import com.ssafy.http.apis.classes.request.ClassRegisterRequest;
import com.ssafy.http.apis.classes.request.ClassUpdateRequest;
import com.ssafy.http.apis.classes.responses.ClassDetailResponse;
import com.ssafy.http.apis.members.entities.MemberEntity;
import com.ssafy.http.apis.members.repositories.MemberRepository;
import com.ssafy.http.apis.roles.Role;
import com.ssafy.http.apis.roles.entities.RoleEntity;
import com.ssafy.http.exception.CustomException;
import com.ssafy.http.support.codes.ErrorCode;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ClassService {

  private final ClassRepository classRepository;
  private final MemberRepository memberRepository;

  @Transactional
  public List<ClassDetailResponse> getUnassignedClassList(Long loginUserId) {

    List<ClassDetailResponse> classDetailResponses = new ArrayList<>();

    MemberEntity memberEntity = memberRepository.findMemberEntityById(loginUserId).orElseThrow(() ->
        new CustomException(ErrorCode.ID_NOTFOUND)
    );

    List<ClassEntity> classEntities = classRepository.findUnassignedClassList(
        memberEntity.getGovernmentId(),
        RoleEntity.builder()
            .role(Role.TEACHER)
            .build());

    for (ClassEntity classEntity : classEntities) {
      ClassDetailResponse classDetailResponse = new ClassDetailResponse();

      classDetailResponse.of(classEntity);

      classDetailResponses.add(classDetailResponse);
    }

    return classDetailResponses;
  }

  @Transactional
  public ClassDetailResponse selectOne(Long classId) {

    ClassEntity classEntity = classRepository.findById(classId).orElseThrow(
        () -> new CustomException(ErrorCode.ID_NOTFOUND)
    );

    ClassDetailResponse classDetailResponse = new ClassDetailResponse();
    classDetailResponse.of(classEntity);

    return classDetailResponse;
  }

  @Transactional
  public void updateClass(ClassUpdateRequest classUpdateRequest, Long governmentId) {

    ClassEntity classEntity = classRepository.findById(classUpdateRequest.getId()).orElseThrow(
        () -> new CustomException(ErrorCode.ID_NOTFOUND)
    );

    //update 요청 정보 기준으로 update 시킴
    classEntity = ClassEntity.builder()
        .id(classUpdateRequest.getId())
        .governmentId(governmentId)
        .commonCode(classEntity.getCommonCode())
        .className(classUpdateRequest.getName())
        .lectureTime(classUpdateRequest.toLocalTime(classUpdateRequest.getHour(),
            classUpdateRequest.getMinute()))
        .build();

    classRepository.save(classEntity);
  }

  @Transactional
  public void registClass(ClassRegisterRequest classRegisterRequest, Long governmentId) {

    ClassEntity classEntity = classRegisterRequest.toEntity(governmentId);

    classRepository.save(classEntity);

  }

  @Transactional
  public List<ClassDetailResponse> getClassList(Long governmentId, Role loginUserRole) {

    List<ClassDetailResponse> classDetailResponses = new ArrayList<>();

    if (loginUserRole == Role.TEACHER) {
      governmentId = memberRepository.findById(governmentId).get().getGovernmentId();
    }

    List<ClassEntity> classes = classRepository.findAllByGovernmentId(governmentId);

    for (ClassEntity class_ : classes) {
      ClassDetailResponse classDetailResponse = new ClassDetailResponse();

      classDetailResponse.of(class_);

      classDetailResponses.add(classDetailResponse);
    }

    return classDetailResponses;
  }

  public void deleteOne(Long id) {

    try {
      classRepository.deleteById(id);
    } catch (Exception e) {
      throw new CustomException(ErrorCode.IO_ERROR);
    }

  }

  public void checkLive(Long classId) {

    //테스트용
    List<MemberEntity> teachers = memberRepository.findTeacherByRoleAndClassId(
        RoleEntity.builder().role(Role.TEACHER).build(),
        classId);

    if (teachers.size() == 0) {
      throw new CustomException(ErrorCode.NOT_LIVE_ERROR);
    }

    if (teachers.size() > 1) {
      throw new CustomException(ErrorCode.DUPLICATE_CLASSID_ERROR);
    }

    //실제 서비스 코드
//    memberRepository.findTeacherByRoleAndClassId(RoleEntity.builder().role(Role.TEACHER).build(),
//        classId).orElseThrow(
//        () -> new CustomException(ErrorCode.NOT_LIVE_ERROR)
//    );
  }
}
