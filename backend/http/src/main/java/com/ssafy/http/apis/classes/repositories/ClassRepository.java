package com.ssafy.http.apis.classes.repositories;

import com.ssafy.http.apis.classes.entities.ClassEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.ArrayList;

public interface ClassRepository extends JpaRepository<ClassEntity, Long> {

    ArrayList<Object[]> findByGovernmentId(Long governmentId);

}
