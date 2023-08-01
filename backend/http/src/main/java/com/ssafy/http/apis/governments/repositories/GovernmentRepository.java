package com.ssafy.http.apis.governments.repositories;

import com.ssafy.http.apis.governments.entities.GovernmentEntity;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GovernmentRepository extends JpaRepository<GovernmentEntity, Long> {

    Optional<GovernmentEntity> findByIdentification(String identification);
}
