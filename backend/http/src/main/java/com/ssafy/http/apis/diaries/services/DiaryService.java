package com.ssafy.http.apis.diaries.services;

import com.ssafy.http.apis.diaries.entities.DiaryEntity;
import com.ssafy.http.apis.diaries.repositories.DiaryRepository;
import com.ssafy.http.apis.diaries.responses.DiaryDetailResponse;
import com.ssafy.http.apis.members.entities.MemberEntity;
import com.ssafy.http.apis.members.repositories.MemberRepository;
import com.ssafy.http.exception.CustomException;
import com.ssafy.http.support.codes.ErrorCode;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class DiaryService {

  private final DiaryRepository diaryRepository;
  private final MemberRepository memberRepository;

  public DiaryDetailResponse getDiary(Long diaryId) {
    DiaryEntity diaryEntity = diaryRepository.findById(diaryId).orElseThrow(
        () -> new CustomException(ErrorCode.NOT_FOUND_ERROR)
    );

    DiaryDetailResponse diaryDetailResponse = new DiaryDetailResponse();
    diaryDetailResponse.of(diaryEntity);

    return diaryDetailResponse;
  }

  public List<DiaryDetailResponse> getDiaries(Long loginUserId) {

    List<DiaryDetailResponse> diaryDetailResponses = new ArrayList<>();

    MemberEntity memberEntity = memberRepository.findMemberEntityById(loginUserId).orElseThrow(
        () -> new CustomException(ErrorCode.ID_NOTFOUND)
    );

    List<DiaryEntity> diaryEntities = diaryRepository.findAllByMemberEntity(memberEntity);

    for (DiaryEntity diaryEntity : diaryEntities) {

      DiaryDetailResponse diaryDetailResponse = new DiaryDetailResponse();
      diaryDetailResponse.of(diaryEntity);
      diaryDetailResponses.add(diaryDetailResponse);
    }
    return diaryDetailResponses;
  }
}
