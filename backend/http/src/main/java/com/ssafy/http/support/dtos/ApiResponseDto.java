package com.ssafy.http.support.dtos;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponseDto<T> {

    private Integer status;
    private String message;
    private T data;

    public ApiResponseDto(Integer status, String message) {
        this(status, message, null);
    }
}