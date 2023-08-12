package com.ssafy.http.apis.diaries.controllers;


import static com.ssafy.http.support.utils.ApiResponseUtil.createSuccessResponse;

import com.ssafy.http.apis.diaries.requests.DiaryRegisterRequest;
import com.ssafy.http.apis.diaries.responses.DiaryDetailResponse;
import com.ssafy.http.apis.diaries.services.DiaryService;
import com.ssafy.http.security.utils.SecurityUtil;
import com.ssafy.http.support.codes.SuccessCode;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/v1/diaries")
@RequiredArgsConstructor
public class DiaryPrivateController {

  private final DiaryService diaryService;

  @GetMapping("/{diaryId}")
  public ResponseEntity<?> getDiary(@PathVariable long diaryId) {

    DiaryDetailResponse diaryDetailResponse = diaryService.getDiary(diaryId);

    return createSuccessResponse(SuccessCode.SELECT_SUCCESS, "일기 하나를 조회하였습니다.",
        diaryDetailResponse);
  }

  @GetMapping
  public ResponseEntity getDiaries() {

    List<DiaryDetailResponse> diaryDetailResponses = diaryService.getDiaries(
        SecurityUtil.getLoginUserId());

    return createSuccessResponse(SuccessCode.SELECT_SUCCESS, "일기 리스트를 조회하였습니다.",
        diaryDetailResponses);
  }

  @PostMapping
  public ResponseEntity registerDiary(@RequestBody DiaryRegisterRequest diaryRegisterRequest) {

    diaryService.registerDiary(SecurityUtil.getLoginUserId(), diaryRegisterRequest);

    return createSuccessResponse(SuccessCode.INSERT_SUCCESS, "일기 등록을 성공했습니다.");
  }
}
