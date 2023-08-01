package com.ssafy.http.support.codes;

import lombok.AllArgsConstructor;
import lombok.Getter;


@Getter
@AllArgsConstructor
public enum SuccessCode {
    REQUEST_SUCCESS(200, "REQUEST SUCCESS"),
    SELECT_SUCCESS(200, "SELECT SUCCESS"),
    DELETE_SUCCESS(200, "DELETE SUCCESS"),
    INSERT_SUCCESS(201, "INSERT SUCCESS"),
    UPDATE_SUCCESS(204, "UPDATE SUCCESS"),
    ;

    private final Integer status;
    private final String message;
}
