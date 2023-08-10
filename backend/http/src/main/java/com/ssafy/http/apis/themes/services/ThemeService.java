package com.ssafy.http.apis.themes.services;

import com.ssafy.http.apis.lecturehistories.repositories.LectureHistoryRepository;
import com.ssafy.http.apis.members.entities.MemberEntity;
import com.ssafy.http.apis.members.repositories.MemberRepository;
import com.ssafy.http.apis.themes.entities.ThemeEntity;
import com.ssafy.http.apis.themes.repositories.ThemeRepository;
import com.ssafy.http.apis.themes.responses.ThemeDetailResponse;
import com.ssafy.http.apis.themes.responses.ThemeNameResponse;
import com.ssafy.http.apis.themes.responses.ThemeStageResponse;
import com.ssafy.http.exception.CustomException;
import com.ssafy.http.exception.WrongParameterException;
import com.ssafy.http.support.codes.ErrorCode;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ThemeService {

  private final ThemeRepository themeRepository;
  private final LectureHistoryRepository lectureHistoryRepository;
  private final MemberRepository memberRepository;

  @Transactional
  public List<ThemeNameResponse> getClassThemeList(Long loginUserId) {
    List<ThemeNameResponse> themeNameResponses = new ArrayList<>();

    Optional<MemberEntity> memberEntityOptional = memberRepository.findMemberEntityById(
        loginUserId);

    MemberEntity memberEntity = memberEntityOptional.orElseThrow(
        () -> new CustomException(ErrorCode.NOT_FOUND_ERROR)
    );

    List<Object[]> themes = lectureHistoryRepository.findThemeNameAllForClass(
        memberEntity.getClassId());

    for (Object[] theme : themes) {
      String themeName = (String) theme[0];
      long themeCount = (Long) theme[1];

      if (themeCount < 5) {
        ThemeNameResponse themeNameResponse = new ThemeNameResponse();
        themeNameResponse.setThemeName(themeName);
        themeNameResponses.add(themeNameResponse);
      }

    }

    return themeNameResponses;
  }

  public List<ThemeStageResponse> getClassCurriculums(String themeName, Long loginUserId) {

    List<ThemeStageResponse> themeStageResponses = new ArrayList<>();

    Optional<MemberEntity> memberEntityOptional = memberRepository.findMemberEntityById(
        loginUserId);

    MemberEntity memberEntity = memberEntityOptional.orElseThrow(
        () -> new CustomException(ErrorCode.NOT_FOUND_ERROR)
    );

    List<ThemeEntity> stages = lectureHistoryRepository.findStagesAllForClass(
        themeName, memberEntity.getClassId());

    for (ThemeEntity stage : stages) {
      ThemeStageResponse response = new ThemeStageResponse();
      response.of(stage);
      themeStageResponses.add(response);
    }

    return themeStageResponses;
  }


  public List<ThemeDetailResponse> getThemeList() {

    List<ThemeDetailResponse> themeDetailResponses = new ArrayList<>();

    List<ThemeEntity> themes = themeRepository.findAll();

    for (ThemeEntity theme : themes) {
      ThemeDetailResponse themeDetailResponse = new ThemeDetailResponse();

      themeDetailResponse.of(theme);

      themeDetailResponses.add(themeDetailResponse);
    }

    return themeDetailResponses;
  }

  public ThemeEntity getTheme(Long id) {

    ThemeEntity themeEntity = themeRepository.findById(id)
        .orElseThrow(() -> new WrongParameterException(
            ErrorCode.BAD_REQUEST_ERROR));

    return themeEntity;
  }
}
