package com.ssafy.http.support.messages;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public enum ErrorCode {
    BAD_REQUEST_ERROR(400, "Bad Request Exception"),
    REQUEST_BODY_MISSING_ERROR(400, "Required request body is missing"),
    INVALID_TYPE_VALUE(400, "Invalid Type Value"),
    MISSING_REQUEST_PARAMETER_ERROR(400, "Missing Servlet RequestParameter Exception"),
    IO_ERROR(400, "I/O Exception"),
    JSON_PARSE_ERROR(400, "JsonParseException"),
    JACKSON_PROCESS_ERROR(400, "com.fasterxml.jackson.core Exception"),
    FORBIDDEN_ERROR(403, "Forbidden Exception"),
    NOT_FOUND_ERROR(404, "Not Found Exception"),
    NULL_POINT_ERROR(404, "Null Point Exception"),
    NOT_VALID_ERROR(404, "handle Validation Exception"),
    NOT_VALID_HEADER_ERROR(404, "Header에 데이터가 존재하지 않는 경우 "),
    INTERNAL_SERVER_ERROR(500, "Internal Server Error Exception"),
    ;

    private final int status;
    private final String message;
}
