package com.ssafy.http.apis.governments.controllers;

import static com.ssafy.http.support.utils.ApiResponseUtil.createSuccessResponse;

import com.ssafy.http.apis.governments.requests.GovernmentRegisterRequest;
import com.ssafy.http.apis.governments.services.GovernmentService;
import com.ssafy.http.support.codes.SuccessCode;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/governments")
@RequiredArgsConstructor
public class GovernmentPublicController {

    private final GovernmentService governmentService;

    @PostMapping
    public ResponseEntity<?> registerGovernment(
        @Valid @RequestBody GovernmentRegisterRequest governmentRegisterRequest) {

        governmentService.registerGovernment(governmentRegisterRequest);

        return createSuccessResponse(SuccessCode.INSERT_SUCCESS, "회원 가입에 성공하였습니다.");
    }
}
