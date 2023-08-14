package com.ssafy.http.apis.classes.controllers;

import static com.ssafy.http.support.utils.ApiResponseUtil.createErrorResponse;
import static com.ssafy.http.support.utils.ApiResponseUtil.createSuccessResponse;

import com.ssafy.http.apis.classes.request.ClassRegisterRequest;
import com.ssafy.http.apis.classes.request.ClassUpdateRequest;
import com.ssafy.http.apis.classes.responses.ClassDetailResponse;
import com.ssafy.http.apis.classes.services.ClassService;
import com.ssafy.http.security.utils.SecurityUtil;
import com.ssafy.http.support.codes.ErrorCode;
import com.ssafy.http.support.codes.SuccessCode;
import java.util.List;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/classes") // -> api/v1/private/classes
@RequiredArgsConstructor
public class ClassPrivateController {

  private final ClassService classService;

  @PostMapping
  public ResponseEntity<?> registClasses(
      @Valid @RequestBody ClassRegisterRequest classRegisterRequest) {

    classService.registClass(classRegisterRequest, SecurityUtil.getLoginUserId());

    return createSuccessResponse(SuccessCode.INSERT_SUCCESS, "반 등록에 성공하였습니다.");
  }


  @GetMapping
  public ResponseEntity<?> getClasses() {

    List<ClassDetailResponse> classDetailResponses = classService.getClassList(
        SecurityUtil.getLoginUserId(), SecurityUtil.getLoginUserRole());

    return createSuccessResponse(SuccessCode.SELECT_SUCCESS, "반을 전체조회 하였습니다.",
        classDetailResponses);
  }

  @GetMapping("/unassigned")
  public ResponseEntity<?> getClassesUnassigned() {

    List<ClassDetailResponse> classDetailResponses = classService.getUnassignedClassList(
        SecurityUtil.getLoginUserId()
    );

    return createSuccessResponse(SuccessCode.SELECT_SUCCESS, "수업 가능한 반을 전체조회 하였습니다.",
        classDetailResponses);
  }

  @DeleteMapping("/{classId}")
  public ResponseEntity<?> deleteClass(
      @PathVariable Long classId) {

    if (classId == null) {
      return createErrorResponse(ErrorCode.REQUEST_BODY_MISSING_ERROR, "방의 id 값을 포함하지 않았습니다");
    }

    classService.deleteOne(classId);

    return createSuccessResponse(SuccessCode.DELETE_SUCCESS,
        classId + " 반을 삭제하였습니다.",
        classService.getClassList(SecurityUtil.getLoginUserId(), SecurityUtil.getLoginUserRole())
    );
  }

  @PutMapping
  public ResponseEntity<?> putClass(@Valid @RequestBody ClassUpdateRequest classUpdateRequest) {

    classService.updateClass(classUpdateRequest, SecurityUtil.getLoginUserId()); //지자체 ID가 들어가게 될 것

    //204라서 response가 안보임
    return createSuccessResponse(SuccessCode.UPDATE_SUCCESS,
        " 반을 수정하였습니다.",
        classService.getClassList(SecurityUtil.getLoginUserId(), SecurityUtil.getLoginUserRole())
        //상세 보기로 변경?
    );
  }

  @GetMapping("/{classId}")
  public ResponseEntity<?> getClassDetails(@PathVariable Long classId) {
    
    if (classId == null) {
      return createErrorResponse(ErrorCode.REQUEST_BODY_MISSING_ERROR, "방의 id 값을 포함하지 않았습니다");
    }

    ClassDetailResponse classDetailResponse = classService.selectOne(classId);

    return createSuccessResponse(SuccessCode.SELECT_SUCCESS,
        classDetailResponse.getId() + " 반을 상세 조회하였습니다.",
        classDetailResponse);
  }

}
