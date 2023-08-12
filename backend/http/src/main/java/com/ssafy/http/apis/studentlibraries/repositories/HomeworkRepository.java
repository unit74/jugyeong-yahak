package com.ssafy.http.apis.studentlibraries.repositories;

import com.ssafy.http.apis.studentlibraries.entities.HomeworkEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface HomeworkRepository extends JpaRepository<HomeworkEntity, Long> {

    @Query("SELECT m.themeId FROM HomeworkEntity m WHERE m.memberId = :memberId and m.statusCode = '0' order by m.createdAt")
    Long findFirstByMemberId(Long memberId);
}