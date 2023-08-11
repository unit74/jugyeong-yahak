package com.ssafy.http.apis.classes.services;

import com.ssafy.http.apis.classes.entities.ClassEntity;
import com.ssafy.http.apis.classes.repositories.ClassRepository;
import com.ssafy.http.apis.classes.request.ClassRequest;
import com.ssafy.http.apis.classes.responses.ClassDetailResponse;
import com.ssafy.http.apis.members.entities.MemberEntity;
import com.ssafy.http.apis.members.repositories.MemberRepository;
import com.ssafy.http.apis.roles.Role;
import com.ssafy.http.apis.roles.entities.RoleEntity;
import com.ssafy.http.exception.CustomException;
import com.ssafy.http.support.codes.ErrorCode;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
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
    Optional<ClassEntity> classEntity = classRepository.findById(classId);

    if (classEntity.isPresent()) {
      ClassDetailResponse classDetailResponse = new ClassDetailResponse();
      classDetailResponse.of(classEntity.get());
      return classDetailResponse;
    }

    throw new CustomException(ErrorCode.IO_ERROR);
  }

  @Transactional
  public void updateClass(ClassRequest classRequest, Long governmentId) {

    Optional<ClassEntity> classEntity = classRepository.findById(classRequest.getId());

    if (classEntity.isPresent()) {
      ClassEntity entity = classEntity.get();

      // 엔티티의 빌더 메서드를 사용하여 필드 값을 수정
      entity = classRequest.toEntity(governmentId);

      // 수정된 엔티티 저장
      classRepository.save(entity);

    } else {
      throw new CustomException(ErrorCode.IO_ERROR);
    }

  }

  @Transactional
  public void registClass(ClassRequest classRequest, Long governmentId) {

    ClassEntity classEntity = classRequest.toEntity(governmentId);

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

}
