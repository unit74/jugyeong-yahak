package com.ssafy.http.apis.members.controllers;

import static com.ssafy.http.support.utils.ApiResponseUtil.createSuccessResponse;

import com.ssafy.http.apis.members.requests.StudentRegisterRequest;
import com.ssafy.http.apis.members.responses.StudentDetailResponse;
import com.ssafy.http.apis.members.services.MemberService;
import com.ssafy.http.apis.members.services.S3ImageUploadService;
import com.ssafy.http.support.codes.SuccessCode;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/private/members")
@RequiredArgsConstructor
public class MemberPrivateController {
    private final S3ImageUploadService imageUploadService;
    private final MemberService memberService;

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

    @PostMapping(value = "/{government}/register", consumes = {MediaType.APPLICATION_JSON_VALUE,
        MediaType.MULTIPART_FORM_DATA_VALUE})
    public String registerStudent(
        @PathVariable String government,
        @RequestPart StudentRegisterRequest studentRegisterRequest,
        @RequestPart MultipartFile faceImage) throws IOException {
        System.out.println("이미지 등록 요청 받음");
        System.out.println(government);

        String fileName = imageUploadService.uploadImage(government, faceImage);
        return fileName;
    }

}
