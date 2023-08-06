package com.ssafy.http.apis.classes.services;

import com.ssafy.http.apis.classes.entities.ClassEntity;
import com.ssafy.http.apis.classes.repositories.ClassRepository;
import com.ssafy.http.apis.classes.responses.ClassDetailResponse;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ClassService {

  private final ClassRepository classRepository;

  public List<ClassDetailResponse> getClassList(Long governmentId) {

    List<ClassDetailResponse> classDetailResponses = new ArrayList<>();

    List<ClassEntity> classes = classRepository.findAllByGovernmentId(governmentId);

    for (ClassEntity class_ : classes) {
      ClassDetailResponse classDetailResponse = new ClassDetailResponse();

      classDetailResponse.of(class_);

      classDetailResponses.add(classDetailResponse);
    }

    return classDetailResponses;
  }

  public List<ClassDetailResponse> getGovernmentClassList(Long governmentId) {

    List<ClassDetailResponse> classDetailResponses = new ArrayList<>();

    List<ClassEntity> classEntities = classRepository.findAllByGovernmentId(governmentId);

    for (ClassEntity entity : classEntities) {
      ClassDetailResponse response = new ClassDetailResponse();
      response.of(entity);
      classDetailResponses.add(response);
    }

    return classDetailResponses;
  }


}
