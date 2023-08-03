package com.ssafy.http.apis.classes.repositories;

import com.ssafy.http.apis.classes.entities.ClassEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClassRepository extends JpaRepository<ClassEntity, Long> {

    List<ClassEntity> findAllByGovernmentId(Long governmentId);
}
