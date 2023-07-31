package com.ssafy.http.apis.governments.controllers;

import com.ssafy.http.apis.governments.dtos.GovernmentRegisterDto;
import com.ssafy.http.support.utils.ApiResponseUtil;
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
        @Valid @RequestBody GovernmentRegisterDto governmentRegisterDto) {
        System.out.println(governmentRegisterDto);

        return ApiResponseUtil.createSuccessResponse("회원 가입에 성공하였습니다.");
    }
}
