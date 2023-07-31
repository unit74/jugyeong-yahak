package com.ssafy.http.apis.governments.controllers;

import static com.ssafy.http.support.utils.ApiResponseUtil.createSuccessResponse;

import com.ssafy.http.apis.governments.requests.GovernmentRegisterRequest;
import com.ssafy.http.support.codes.SuccessCode;
import javax.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/governments")
public class GovernmentPublicController {

    @PostMapping
    public ResponseEntity<?> registerGovernment(
        @Valid @RequestBody GovernmentRegisterRequest governmentRegisterDto) {

        return createSuccessResponse(SuccessCode.REQUEST_SUCCESS, "회원 가입에 성공하였습니다.");
    }
}
