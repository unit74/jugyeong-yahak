package com.ssafy.http.apis.governments.repositories;

import com.ssafy.http.apis.governments.entities.GovernmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GovernmentRepository extends JpaRepository<GovernmentEntity, Long> {

}
