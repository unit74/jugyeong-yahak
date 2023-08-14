package com.ssafy.http.apis.members.controllers;

import static com.ssafy.http.support.utils.ApiResponseUtil.createSuccessResponse;

import com.ssafy.http.apis.members.requests.StudentRegisterRequest;
import com.ssafy.http.apis.members.requests.StudentUpdateRequest;
import com.ssafy.http.apis.members.requests.TeacherRegisterRequest;
import com.ssafy.http.apis.members.requests.TeacherUpdateRequest;
import com.ssafy.http.apis.members.responses.StudentDetailResponse;
import com.ssafy.http.apis.members.responses.TeacherDetailResponse;
import com.ssafy.http.apis.members.services.MemberService;
import com.ssafy.http.apis.members.services.S3ImageUploadService;
import com.ssafy.http.security.utils.SecurityUtil;
import com.ssafy.http.support.codes.SuccessCode;
import java.util.List;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/private/members")
@RequiredArgsConstructor
public class MemberPrivateController {

  private final S3ImageUploadService imageUploadService;
  private final MemberService memberService;

  @PutMapping(value = "/students") //학생 수정
  public ResponseEntity<?> updateStudent(
      @Valid @RequestBody StudentUpdateRequest studentUpdateRequest) {

    StudentDetailResponse studentDetailResponse = memberService.updateStudent(studentUpdateRequest);

    return createSuccessResponse(SuccessCode.UPDATE_SUCCESS, "학생 데이터 수정하였습니다.",
        studentDetailResponse);
  }

  @GetMapping("/students/{studentId}")
  public ResponseEntity<?> getStudentDetail(@PathVariable Long studentId) {
    StudentDetailResponse studentDetailResponse = memberService.getStudentDetail(studentId);

    return createSuccessResponse(SuccessCode.SELECT_SUCCESS, "학생을 상세조회 하였습니다.",
        studentDetailResponse);
  }

  @GetMapping("/students/classes/{classId}")
  public ResponseEntity<?> getClassStudents(@PathVariable Long classId) {
    List<StudentDetailResponse> studentDetailResponses = memberService.getClassStudents(
        classId);

    return createSuccessResponse(SuccessCode.SELECT_SUCCESS, "반 학생들을 전체조회 하였습니다.",
        studentDetailResponses);

  }

//  @GetMapping("/students")
//  public ResponseEntity<?> getStudents() { // 학생 리스트
//    List<StudentDetailResponse> studentDetailResponses = memberService.getStudents();
//
//    return createSuccessResponse(SuccessCode.SELECT_SUCCESS, "학생들을 전체조회 하였습니다.",
//        studentDetailResponses);
//
//  }

  @PostMapping(value = "/students", consumes = { //학생 회원가입
      MediaType.APPLICATION_JSON_VALUE,
      MediaType.MULTIPART_FORM_DATA_VALUE})
  public ResponseEntity<?> registerStudents(
      @Valid @RequestPart StudentRegisterRequest studentRegisterRequest,
      @RequestPart MultipartFile faceImage) {
    System.out.println("학생 등록 요청 받음");

    memberService.registerStudents(SecurityUtil.getLoginUserId(), faceImage,
        studentRegisterRequest);

    return createSuccessResponse(SuccessCode.INSERT_SUCCESS, "회원 가입에 성공하였습니다.");
  }

  @PostMapping(value = "/teachers", consumes = { //강사 회원가입
      MediaType.APPLICATION_JSON_VALUE,
      MediaType.MULTIPART_FORM_DATA_VALUE})
  public ResponseEntity<?> registerTeacher(
      @Valid @RequestPart TeacherRegisterRequest teacherRegisterRequest,
      @RequestPart MultipartFile faceImage) {

    memberService.registerTeachers(SecurityUtil.getLoginUserId(), faceImage,
        teacherRegisterRequest);

    return createSuccessResponse(SuccessCode.INSERT_SUCCESS, "회원 가입에 성공하였습니다.");
  }

  @PutMapping(value = "/teachers")
  public ResponseEntity<?> updateTeacher(
      @Valid @RequestBody TeacherUpdateRequest teacherUpdateRequest) {

    TeacherDetailResponse teacherDetailDetailResponse = memberService.updateTeacher(
        teacherUpdateRequest);

    return createSuccessResponse(SuccessCode.UPDATE_SUCCESS, "강사 데이터 수정하였습니다.",
        teacherDetailDetailResponse);
  }

  @GetMapping("/teachers/{teacherId}")
  public ResponseEntity<?> getTeacherDetail(@PathVariable Long teacherId) {
    TeacherDetailResponse teacherDetailDetailResponse = memberService.getTeacherDetail(teacherId);

    return createSuccessResponse(SuccessCode.SELECT_SUCCESS, "강사를 상세조회 하였습니다.",
        teacherDetailDetailResponse);
  }

  @GetMapping("/teachers")
  public ResponseEntity<?> getStudents() { // 강사 리스트
    List<TeacherDetailResponse> teacherDetailDetailResponses = memberService.getTeachers();

    return createSuccessResponse(SuccessCode.SELECT_SUCCESS, "강사들을 전체조회 하였습니다.",
        teacherDetailDetailResponses);

  }

  @GetMapping("/key")
  public ResponseEntity<?> getMemberPrimaryKey() {
    Long id = SecurityUtil.getLoginUserId();

    return createSuccessResponse(SuccessCode.SELECT_SUCCESS, "유저의 PK를 조회하였습니다.", id);
  }

}
