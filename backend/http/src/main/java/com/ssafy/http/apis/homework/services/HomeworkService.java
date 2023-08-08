package com.ssafy.http.apis.homework.services;

import com.ssafy.http.apis.homework.responses.LibraryResponse;
import com.ssafy.http.apis.members.entities.MemberEntity;
import com.ssafy.http.apis.members.repositories.MemberRepository;
import java.util.List;
import java.util.Optional;
import javax.persistence.EntityManager;
import javax.persistence.Query;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class HomeworkService {
  
  private final MemberRepository memberRepository;
  private final EntityManager em;


  public LibraryResponse getLibraryList(Long studentId) {
    Optional<MemberEntity> memberEntity = memberRepository.findById(studentId);

    //테마명(th), 완료수(h), 미완료수(h) (group by stage)

    Query query = em.createQuery(
            "SELECT t.theme, COUNT(CASE WHEN h.status = 'C03' THEN 1 ELSE NULL END) FROM HomeworkHistoriesEntity h "
                + "RIGHT JOIN h.themeEntity t ON t.id = h.themeEntity.id "
                + "AND h.classId = :classId AND h.memberId = :id "
                + "GROUP BY t.theme")
        .setParameter("classId", memberEntity.get().getClassId())
        .setParameter("id", memberEntity.get().getId());

    List<Object[]> resultList = query.getResultList();

    LibraryResponse response = new LibraryResponse();

    response.of(resultList);

    return response;

  }
}
