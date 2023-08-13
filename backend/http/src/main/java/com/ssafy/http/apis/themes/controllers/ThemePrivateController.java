package com.ssafy.http.apis.themes.controllers;

import static com.ssafy.http.support.utils.ApiResponseUtil.createSuccessResponse;

import com.ssafy.http.apis.homeworkhistories.services.HomeworkService;
import com.ssafy.http.apis.themes.responses.ThemeAndWordsResponse;
import com.ssafy.http.apis.themes.responses.ThemeNameResponse;
import com.ssafy.http.apis.themes.responses.ThemeStageResponse;
import com.ssafy.http.apis.themes.responses.WordDetailResponse;
import com.ssafy.http.apis.themes.services.ThemeService;
import com.ssafy.http.apis.themes.services.WordService;
import com.ssafy.http.security.utils.SecurityUtil;
import com.ssafy.http.support.codes.SuccessCode;
import java.util.Collections;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/themes")
@RequiredArgsConstructor
public class ThemePrivateController {

  private final static char[] choseong = {'ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ',
      'ㅌ', 'ㅍ', 'ㅎ'};

  private final ThemeService themeService;
  private final WordService wordService;
  private final HomeworkService homeworkService;

  //GetMapping() -> 전체 반의 테마 리스트도 필요하면 구현해야함

  @GetMapping // 해당 반의 테마 리스트 반환
  public ResponseEntity<?> getThemeList() {

    List<ThemeNameResponse> themeNameResponses = themeService.getClassThemeList(
        SecurityUtil.getLoginUserId());

    return createSuccessResponse(SuccessCode.SELECT_SUCCESS, "반의 테마 리스트를 조회하였습니다.",
        themeNameResponses);
  }

  @GetMapping("/stages/{themeName}")
  public ResponseEntity<?> getThemeStages(@PathVariable String themeName) {
    List<ThemeStageResponse> temeStageResponses = themeService.getClassCurriculums(
        themeName, SecurityUtil.getLoginUserId());

    return createSuccessResponse(SuccessCode.SELECT_SUCCESS, "반의 커리큘럼 리스트를 조회하였습니다.",
        temeStageResponses);
  }

  @GetMapping("/{curriculumId}")   // 강사 실시간 시 -> 선택된 테마 내용 반환
  public ResponseEntity<?> getTheme(@PathVariable("curriculumId") Long curriculumId) {

    Long loginUserId = 4L;

    if (SecurityUtil.getLoginUserId() != null) {
      loginUserId = SecurityUtil.getLoginUserId();
    }

    ThemeAndWordsResponse themeAndWordsResponse = themeService.getThemeAndWordsForLecture(
        curriculumId, loginUserId);

    return createSuccessResponse(SuccessCode.SELECT_SUCCESS, "선택된 테마 상세 내용 및 단어 문제를 반환합니다.",
        themeAndWordsResponse);
  }

  @GetMapping("/review") //학생이 복습 컨텐츠 요청하는 부분인가?
  public ResponseEntity<?> review() {

    Long loginUserId = 4L;

    if (SecurityUtil.getLoginUserId() != null) {
      loginUserId = SecurityUtil.getLoginUserId();
    }

    long curriculumId = homeworkService.getThemeId(loginUserId);

    ThemeAndWordsResponse themeAndWordsResponse = themeService.getThemeAndWordsForLecture(
        curriculumId, loginUserId);

    return createSuccessResponse(SuccessCode.SELECT_SUCCESS, "선택된 테마 상세 내용 및 단어 문제를 반환합니다.",
        themeAndWordsResponse);
  }

  @GetMapping("/choseong")
  public ResponseEntity<?> startChoseong() {

//    ArrayList<String choseongList = new ArrayList<>();
//
//    for (int i = 0; i < 5; i++) {
//      choseongList.add(String.valueOf(choseong[(int) (Math.random() * 13)]) + String.valueOf(
//          choseong[(int) (Math.random() * 13)]));
//    }

    String choseonhResult = String.valueOf(choseong[(int) (Math.random() * 13)]) + String.valueOf(
        choseong[(int) (Math.random() * 13)]);

    return createSuccessResponse(SuccessCode.SELECT_SUCCESS, "초성을 랜덤으로 1개 반환합니다.", choseonhResult);
  }

  @GetMapping("/{themeId}/reasoning")
  public ResponseEntity<?> startReasoning(@PathVariable("themeId") Long themeId) {

    List<WordDetailResponse> words = wordService.getWords(themeId);

    Collections.shuffle(words);

    return createSuccessResponse(SuccessCode.SELECT_SUCCESS, "해당 테마의 단어를 셔플하여 반환합니다.", words);
  }


  @PostMapping("/review/{themeId}")
  public ResponseEntity<?> reviewDone(@PathVariable("themeId") Long themeId) {

    Long loginUserId = 4L;

    if (SecurityUtil.getLoginUserId() != null) {
      loginUserId = SecurityUtil.getLoginUserId();
    }

    homeworkService.reviewDone(themeId, loginUserId);

    return createSuccessResponse(SuccessCode.SELECT_SUCCESS, "복습 완료");
  }


}
