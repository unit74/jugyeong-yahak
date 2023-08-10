package com.ssafy.http.apis.studentlibraries.repositories;

import com.ssafy.http.apis.studentlibraries.entities.HomeworkHistoriesEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HomeworkHistoryRepository extends JpaRepository<HomeworkHistoriesEntity, Long> {

}
