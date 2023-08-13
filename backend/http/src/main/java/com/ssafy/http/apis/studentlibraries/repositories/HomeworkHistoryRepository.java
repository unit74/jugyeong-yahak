package com.ssafy.http.apis.studentlibraries.repositories;

import com.ssafy.http.apis.members.entities.MemberEntity;
import com.ssafy.http.apis.studentlibraries.entities.HomeworkHistoriesEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface HomeworkHistoryRepository extends JpaRepository<HomeworkHistoriesEntity, Long> {

  @Query("SELECT t.theme, COUNT(CASE WHEN h.statusCode = 'C03' THEN 1 ELSE NULL END) "
      + "FROM HomeworkHistoriesEntity h RIGHT JOIN h.themeEntity t "
      + "ON t.id = h.themeEntity.id AND h.memberEntity = :memberEntity "
      + "GROUP BY t.theme")
  List<Object[]> findStudentLibrary(@Param("memberEntity") MemberEntity memberEntity);

//  @Query("SELECT h.themeEntity.id FROM HomeworkHistoriesEntity h WHERE h.memberId = :memberId and h.status = 'C01' order by h.createdAt")
//  Long findFirstByMemberId(@Param("memberId") Long memberId);
}
