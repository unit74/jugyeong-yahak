package com.ssafy.http.apis.auth.controllers;

import com.ssafy.http.apis.auth.requests.GovernmentLoginRequest;
import com.ssafy.http.apis.auth.responses.GovernmentLoginResponse;
import com.ssafy.http.apis.auth.services.AuthService;
import com.ssafy.http.jwt.dtos.TokenDto;
import com.ssafy.http.support.codes.SuccessCode;
import com.ssafy.http.support.responses.SuccessResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpCookie;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthPublicController {

    private final AuthService authService;

    private final long COOKIE_EXPIRATION = 90 * 24 * 60 * 60; // 90일

    @PostMapping("/governments/login")
    public ResponseEntity<?> governmentLogin(
        @RequestBody GovernmentLoginRequest governmentLoginRequest) {
        // User 등록 및 Refresh Token 저장
        TokenDto tokenDto = authService.login(governmentLoginRequest);

        // RT 저장
        HttpCookie httpCookie = ResponseCookie.from("refresh-token", tokenDto.getRefreshToken())
                                              .maxAge(COOKIE_EXPIRATION)
                                              .httpOnly(true)
                                              .secure(true)
                                              .build();

        return ResponseEntity
            .status(HttpStatus.OK)
            .header(HttpHeaders.SET_COOKIE, httpCookie.toString())
            .body(SuccessResponse.ofStatusAndMessageAndData(SuccessCode.REQUEST_SUCCESS,
                "로그인에 성공하였습니다.", GovernmentLoginResponse.builder()
                                                        .token(
                                                            "Bearer " + tokenDto.getAccessToken())
                                                        .build()));
    }

    @PostMapping("/students/login")
    public ResponseEntity<?> studentLogin() {
        return ResponseEntity.status(HttpStatus.OK)
                             .body(SuccessResponse.ofStatusAndMessage(SuccessCode.REQUEST_SUCCESS,
                                 "로그인에 성공하였습니다."));
    }
}
