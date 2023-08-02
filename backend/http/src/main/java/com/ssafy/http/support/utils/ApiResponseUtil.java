package com.ssafy.http.support.utils;

import com.ssafy.http.support.codes.ErrorCode;
import com.ssafy.http.support.codes.SuccessCode;
import com.ssafy.http.support.responses.ErrorResponse;
import com.ssafy.http.support.responses.SuccessResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;

public class ApiResponseUtil {

    // ErrorResponse 를 만들어서 리턴하는 메서드
    public static ResponseEntity<ErrorResponse> createErrorResponse(ErrorCode code) {
        return new ResponseEntity<>(ErrorResponse.of(code), HttpStatus.valueOf(code.getStatus()));
    }

    public static ResponseEntity<ErrorResponse> createErrorResponse(ErrorCode code, String reason) {
        return new ResponseEntity<>(ErrorResponse.of(code, reason),
            HttpStatus.valueOf(code.getStatus()));
    }

    public static ResponseEntity<ErrorResponse> createErrorResponse(ErrorCode code,
        BindingResult bindingResult) {
        return new ResponseEntity<>(ErrorResponse.of(code, bindingResult),
            HttpStatus.valueOf(code.getStatus()));
    }

    // SuccessResponse 를 만들어서 리턴하는 메서드
    public static <T> ResponseEntity<SuccessResponse<T>> createSuccessResponse(SuccessCode code) {
        return new ResponseEntity<>(SuccessResponse.ofStatus(code),
            HttpStatus.valueOf(code.getStatus()));
    }

    public static <T> ResponseEntity<SuccessResponse<T>> createSuccessResponse(SuccessCode code,
        String message) {
        return new ResponseEntity<>(SuccessResponse.ofStatusAndMessage(code, message),
            HttpStatus.valueOf(code.getStatus()));
    }

    public static <T> ResponseEntity<SuccessResponse<T>> createSuccessResponse(SuccessCode code,
        T data) {
        return new ResponseEntity<>(SuccessResponse.ofStatusAndData(code, data),
            HttpStatus.valueOf(code.getStatus()));
    }

    public static <T> ResponseEntity<SuccessResponse<T>> createSuccessResponse(SuccessCode code,
        String message, T data) {
        return new ResponseEntity<>(SuccessResponse.ofStatusAndMessageAndData(code, message, data),
            HttpStatus.valueOf(code.getStatus()));
    }
}
