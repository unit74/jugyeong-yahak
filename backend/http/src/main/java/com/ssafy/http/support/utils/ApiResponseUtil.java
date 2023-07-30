package com.ssafy.http.support.utils;

import com.ssafy.http.support.dtos.ApiResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class ApiResponseUtil {

    public static <T> ResponseEntity<ApiResponseDto<T>> createSuccessResponse(String message,
        T data) {
        ApiResponseDto<T> apiResponse = new ApiResponseDto<>(HttpStatus.OK.value(), message, data);
        return ResponseEntity.ok(apiResponse);
    }

    public static <T> ResponseEntity<ApiResponseDto<T>> createSuccessResponse(String message) {
        return createSuccessResponse(message, null);
    }

    public static <T> ResponseEntity<ApiResponseDto<T>> createErrorResponse(HttpStatus status,
        String message) {
        ApiResponseDto<T> apiResponse = new ApiResponseDto<>(status.value(),
            message, null);
        return ResponseEntity.status(status)
                             .body(apiResponse);
    }
}
