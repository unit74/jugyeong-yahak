package com.ssafy.http.apis.auth.controllers;

import static com.ssafy.http.support.utils.ApiResponseUtil.createSuccessResponse;

import com.ssafy.http.apis.auth.responses.GovernmentLoginResponse;
import com.ssafy.http.apis.auth.services.AuthService;
import com.ssafy.http.exception.ReissueReLoginException;
import com.ssafy.http.jwt.dtos.TokenDto;
import com.ssafy.http.support.codes.ErrorCode;
import com.ssafy.http.support.codes.SuccessCode;
import com.ssafy.http.support.responses.SuccessResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/private/auth")
@RequiredArgsConstructor
public class AuthPrivateController {

    private final AuthService authService;
    private final long COOKIE_EXPIRATION = 7776000; // 90일

    @PostMapping("/validate")
    public ResponseEntity<?> validate(@RequestHeader("Authorization") String requestAccessToken) {
        if (authService.validate(requestAccessToken)) {
            throw new ReissueReLoginException(ErrorCode.UNAUTHORIZED_ERROR);
        }

        return createSuccessResponse(SuccessCode.REQUEST_SUCCESS, "유효한 토큰입니다.");
    }

    // 토큰 재발급
    @PostMapping("/reissue")
    public ResponseEntity<?> reissue(
        @CookieValue(name = "refresh-token") String requestRefreshToken,
        @RequestHeader("Authorization") String requestAccessToken) {
        TokenDto reissuedTokenDto = authService.reissue(requestAccessToken,
            requestRefreshToken);

        if (reissuedTokenDto != null) { // 토큰 재발급 성공
            // RT 저장
            ResponseCookie responseCookie = ResponseCookie.from("refresh-token",
                                                              reissuedTokenDto.getRefreshToken())
                                                          .maxAge(COOKIE_EXPIRATION)
                                                          .httpOnly(true)
                                                          .secure(true)
                                                          .build();

            return ResponseEntity
                .status(HttpStatus.OK)
                .header(HttpHeaders.SET_COOKIE, responseCookie.toString())
                // AT 저장
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + reissuedTokenDto.getAccessToken())
                .body(SuccessResponse.ofStatusAndMessageAndData(SuccessCode.REQUEST_SUCCESS,
                    "로그인에 성공하였습니다.", GovernmentLoginResponse.builder()
                                                            .token("Bearer "
                                                                + reissuedTokenDto.getAccessToken())
                                                            .build()));

        } else { // Refresh Token 탈취 가능성
            // Cookie 삭제 후 재로그인 유도
            ResponseCookie responseCookie = ResponseCookie.from("refresh-token", "")
                                                          .maxAge(0)
                                                          .path("/")
                                                          .build();

            throw new ReissueReLoginException(ErrorCode.UNAUTHORIZED_ERROR);
        }
    }

    // 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String requestAccessToken) {
        authService.logout(requestAccessToken);
        ResponseCookie responseCookie = ResponseCookie.from("refresh-token", "")
                                                      .maxAge(0)
                                                      .path("/")
                                                      .build();
        return ResponseEntity
            .status(HttpStatus.OK)
            .header(HttpHeaders.SET_COOKIE, responseCookie.toString())
            .body(SuccessResponse.ofStatusAndMessage(SuccessCode.REQUEST_SUCCESS,
                "로그아웃에 성공하였습니다."));
    }
}
