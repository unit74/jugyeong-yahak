package com.ssafy.http.apis.members.controllers;

import static com.ssafy.http.support.utils.ApiResponseUtil.createSuccessResponse;

import com.ssafy.http.apis.members.requests.StudentRequest;
import com.ssafy.http.apis.members.requests.TeacherRequest;
import com.ssafy.http.apis.members.responses.StudentDetailResponse;
import com.ssafy.http.apis.members.responses.TeacherDetailResponse;
import com.ssafy.http.apis.members.services.MemberService;
import com.ssafy.http.apis.members.services.S3ImageUploadService;
import com.ssafy.http.security.utils.SecurityUtil;
import com.ssafy.http.support.codes.SuccessCode;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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

  @PutMapping(value = "/students/{studentId}")
  public ResponseEntity<?> updateStudent(@PathVariable Long studentId,
      @RequestPart StudentRequest studentRequest) {

    StudentDetailResponse studentDetailResponse = memberService.updateStudent(studentId,
        studentRequest);

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

  @PostMapping(value = "/students/register/{governmentId}", consumes = { //학생 회원가입
      MediaType.APPLICATION_JSON_VALUE,
      MediaType.MULTIPART_FORM_DATA_VALUE})
  public ResponseEntity<?> registerStudents(
      @PathVariable Long governmentId,
      @RequestPart StudentRequest studentRequest,
      @RequestPart MultipartFile faceImage) {
    System.out.println("학생 등록 요청 받음");

    memberService.registerStudents(governmentId, faceImage, studentRequest);

    return createSuccessResponse(SuccessCode.INSERT_SUCCESS, "회원 가입에 성공하였습니다.");
  }

  @PostMapping(value = "/teachers/register/{governmentId}", consumes = { //강사 회원가입
      MediaType.APPLICATION_JSON_VALUE,
      MediaType.MULTIPART_FORM_DATA_VALUE})
  public ResponseEntity<?> registerTeacher(
      @PathVariable Long governmentId,
      @RequestPart TeacherRequest teacherRequest,
      @RequestPart MultipartFile faceImage) {

    memberService.registerTeachers(governmentId, faceImage, teacherRequest);

    return createSuccessResponse(SuccessCode.INSERT_SUCCESS, "회원 가입에 성공하였습니다.");
  }

  //복붙 시작
  @PutMapping(value = "/teachers/{teacherId}")
  public ResponseEntity<?> updateTeacher(@PathVariable Long teacherId,
      @RequestPart TeacherRequest teacherRequest) {

    TeacherDetailResponse teacherDetailDetailResponse = memberService.updateTeacher(teacherId,
        teacherRequest);

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
