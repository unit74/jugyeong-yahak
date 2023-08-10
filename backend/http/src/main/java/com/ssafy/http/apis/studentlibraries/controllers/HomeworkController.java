package com.ssafy.http.apis.studentlibraries.controllers;

import static com.ssafy.http.support.utils.ApiResponseUtil.createSuccessResponse;

import com.ssafy.http.apis.studentlibraries.responses.LibraryResponse;
import com.ssafy.http.apis.studentlibraries.services.HomeworkService;
import com.ssafy.http.security.utils.SecurityUtil;
import com.ssafy.http.support.codes.SuccessCode;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/members/libraries")
public class HomeworkController {

  private final HomeworkService homeworkService;

  @GetMapping //추후에 private
  public ResponseEntity<?> getLibraryList() { //학생이 getLibraryList() 호출함

    LibraryResponse result = homeworkService.getLibraryList(SecurityUtil.getLoginUserId());

    return createSuccessResponse(SuccessCode.SELECT_SUCCESS,
        "책장 정보를 불러왔습니다.",
        result);

  }

}
