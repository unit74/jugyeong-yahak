package com.ssafy.http.apis.members.controllers;

import static com.ssafy.http.support.utils.ApiResponseUtil.createSuccessResponse;

import com.ssafy.http.apis.members.responses.StudentDetailResponse;
import com.ssafy.http.apis.members.services.MemberService;
import com.ssafy.http.support.codes.SuccessCode;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/private/members")
@RequiredArgsConstructor
public class MemberPrivateController {

    private final MemberService memberService;

    @GetMapping("/students/{studentId}")
    public ResponseEntity<?> getStudentDetail(@PathVariable Long studentId) {
        StudentDetailResponse studentDetailResponse = memberService.getStudentDetail(studentId);

        return createSuccessResponse(SuccessCode.SELECT_SUCCESS, "학생을 상세조회 하였습니다.",
            studentDetailResponse);
    }

    @GetMapping("/students/{classId}")
    public ResponseEntity<?> getStudentsClass(@PathVariable Long classId) {
        return null;
    }
}
