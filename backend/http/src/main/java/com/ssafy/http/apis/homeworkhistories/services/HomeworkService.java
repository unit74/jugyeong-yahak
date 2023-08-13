package com.ssafy.http.apis.homeworkhistories.services;

import com.ssafy.http.apis.homeworkhistories.repositories.HomeworkHistoryRepository;
import com.ssafy.http.apis.homeworkhistories.responses.LibraryResponse;
import com.ssafy.http.apis.members.entities.MemberEntity;
import com.ssafy.http.apis.members.repositories.MemberRepository;
import com.ssafy.http.exception.CustomException;
import com.ssafy.http.support.codes.ErrorCode;
import java.util.List;
import javax.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class HomeworkService {

  private final MemberRepository memberRepository;
  private final HomeworkHistoryRepository homeworkHistoryRepository;
  private final EntityManager em;


  public LibraryResponse getLibraryList(Long studentId) {
    MemberEntity memberEntity = memberRepository.findById(studentId).orElseThrow(
        () -> new CustomException(ErrorCode.ID_NOTFOUND)
    );

    List<Object[]> resultList = homeworkHistoryRepository.findStudentLibrary(memberEntity);

    LibraryResponse response = new LibraryResponse();

    response.of(resultList);

    return response;

  }

  public long getThemeId(Long studentId) {

    List<Long> themeId = homeworkHistoryRepository.findFirstByMemberId(studentId);

    // 일단 지금 할당된 숙제 없으면 30 나오게 해놨음
    if (themeId.size() == 0) {
      return 30L;
    }

    return themeId.get(0);
  }


}
