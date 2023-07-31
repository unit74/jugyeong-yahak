package com.ssafy.http.support.responses;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.ssafy.http.support.codes.ErrorCode;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.validation.BindingResult;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {

    private int status;                 // 에러 상태 코드
    private String message;           // 에러 메시지
    private List<FieldError> errors;    // 상세 에러 메시지
    private String reason;              // 에러 이유

    @Builder
    protected ErrorResponse(ErrorCode code) {
        this.message = code.getMessage();
        this.status = code.getStatus();
        this.errors = new ArrayList<>();
    }

    @Builder
    protected ErrorResponse(final ErrorCode code, final String reason) {
        this.message = code.getMessage();
        this.status = code.getStatus();
        this.reason = reason;
    }

    @Builder
    protected ErrorResponse(final ErrorCode code, final List<FieldError> errors) {
        this.message = code.getMessage();
        this.status = code.getStatus();
        this.errors = errors;
    }


    /**
     * Global Exception 전송 타입-1
     *
     * @param code          ErrorCode
     * @param bindingResult BindingResult
     * @return ErrorResponse
     */
    public static ErrorResponse of(final ErrorCode code, final BindingResult bindingResult) {
        return new ErrorResponse(code, FieldError.of(bindingResult));
    }

    /**
     * Global Exception 전송 타입-2
     *
     * @param code ErrorCode
     * @return ErrorResponse
     */
    public static ErrorResponse of(final ErrorCode code) {
        return new ErrorResponse(code);
    }

    /**
     * Global Exception 전송 타입-3
     *
     * @param code   ErrorCode
     * @param reason String
     * @return ErrorResponse
     */
    public static ErrorResponse of(final ErrorCode code, final String reason) {
        return new ErrorResponse(code, reason);
    }


    /**
     * 에러를 e.getBindingResult() 형태로 전달 받는 경우 해당 내용을 상세 내용으로 변경하는 기능을 수행한다.
     */
    @Getter
    public static class FieldError {

        private final String field;
        private final String value;
        private final String reason;

        public static List<FieldError> of(final String field, final String value,
            final String reason) {
            List<FieldError> fieldErrors = new ArrayList<>();
            fieldErrors.add(new FieldError(field, value, reason));
            return fieldErrors;
        }

        private static List<FieldError> of(final BindingResult bindingResult) {
            final List<org.springframework.validation.FieldError> fieldErrors = bindingResult.getFieldErrors();
            return fieldErrors.stream()
                              .map(error -> new FieldError(
                                  error.getField(),
                                  error.getRejectedValue() == null ? "" : error.getRejectedValue()
                                                                               .toString(),
                                  error.getDefaultMessage()))
                              .collect(Collectors.toList());
        }

        @Builder
        FieldError(String field, String value, String reason) {
            this.field = field;
            this.value = value;
            this.reason = reason;
        }
    }
}