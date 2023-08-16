package com.ssafy.http.apis.homeworkhistories.services;

import com.ssafy.http.apis.homeworkhistories.entities.HomeworkHistoriesEntity;
import com.ssafy.http.apis.homeworkhistories.repositories.HomeworkHistoryRepository;
import com.ssafy.http.apis.homeworkhistories.responses.LibraryResponse;
import com.ssafy.http.apis.members.entities.MemberEntity;
import com.ssafy.http.apis.members.repositories.MemberRepository;
import com.ssafy.http.exception.CustomException;
import com.ssafy.http.support.codes.ErrorCode;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class HomeworkService {

  private final MemberRepository memberRepository;
  private final HomeworkHistoryRepository homeworkHistoryRepository;

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

    List<Long> themeId = homeworkHistoryRepository.findFirstByMemberId(studentId,
        PageRequest.of(0, 1));

    // 일단 지금 할당된 숙제 없으면 30 나오게 해놨음
    if (themeId.size() == 0) {
      return 30L;
    }

    return themeId.get(0);
  }

  public void reviewDone(Long themeId, Long loginUserId) {

    List<HomeworkHistoriesEntity> currentHomeworks = homeworkHistoryRepository.findByThemeIdAndMemberId(
        themeId, loginUserId, PageRequest.of(0, 1));

    if (currentHomeworks.size() == 1) {
      HomeworkHistoriesEntity currentHomework = currentHomeworks.get(0);

      currentHomework.setStatusCode("C03");

      homeworkHistoryRepository.save(currentHomework);
    }
  }
}
