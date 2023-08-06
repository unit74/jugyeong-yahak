package com.ssafy.http.apis.classes.controllers;

import static com.ssafy.http.support.utils.ApiResponseUtil.createSuccessResponse;

import com.ssafy.http.apis.classes.responses.ClassDetailResponse;
import com.ssafy.http.apis.classes.services.ClassService;
import com.ssafy.http.apis.members.services.MemberService;
import com.ssafy.http.security.utils.SecurityUtil;
import com.ssafy.http.support.codes.SuccessCode;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/classes") // -> api/v1/private/classes
@RequiredArgsConstructor
public class ClassPrivateController {

  private final ClassService classService;
  private final MemberService memberService;

  @GetMapping("/list") //교사가 속한 반 전체 조회
  public ResponseEntity<?> getTeacherClasses() {

    Long governmentId = memberService.getGovernmentId(SecurityUtil.getLoginUserId());

    List<ClassDetailResponse> classDetailResponses = classService.getClassList(governmentId);

    return createSuccessResponse(SuccessCode.SELECT_SUCCESS, "교사가 속한 지자체의 반을 전체조회 하였습니다.",
        classDetailResponses);
  }

  @GetMapping("/{governmentId}/list") //지자체가 만든 반 전체 조회
  public ResponseEntity<?> getGovernmentClasses(@PathVariable Long governmentId) {

    List<ClassDetailResponse> classDetailsResponse = classService.getGovernmentClassList(
        governmentId);

    return createSuccessResponse(SuccessCode.SELECT_SUCCESS, "지자체가 만든 반을 전체조회 하였습니다.",
        classDetailsResponse);
  }


}
