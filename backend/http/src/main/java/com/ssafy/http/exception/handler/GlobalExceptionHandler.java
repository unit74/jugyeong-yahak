package com.ssafy.http.exception.handler;

import static com.ssafy.http.support.utils.ApiResponseUtil.createErrorResponse;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.ssafy.http.exception.CustomException;
import com.ssafy.http.exception.RegisterIdentificationException;
import com.ssafy.http.exception.ReissueReLoginException;
import com.ssafy.http.exception.WrongParameterException;
import com.ssafy.http.support.codes.ErrorCode;
import com.ssafy.http.support.responses.ErrorResponse;
import java.io.IOException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingRequestHeaderException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.servlet.NoHandlerFoundException;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    private final HttpStatus HTTP_STATUS_OK = HttpStatus.OK;

    @ExceptionHandler(MethodArgumentNotValidException.class)
    protected ResponseEntity<ErrorResponse> handleMethodArgumentNotValidException(
        MethodArgumentNotValidException ex) {
        log.error("handleMethodArgumentNotValidException", ex);
        BindingResult bindingResult = ex.getBindingResult();
        StringBuilder stringBuilder = new StringBuilder();
        for (FieldError fieldError : bindingResult.getFieldErrors()) {
            stringBuilder.append(fieldError.getField())
                         .append(":");
            stringBuilder.append(fieldError.getDefaultMessage());
            stringBuilder.append(", ");
        }

        return createErrorResponse(ErrorCode.NOT_VALID_ERROR, stringBuilder.toString());
    }

    @ExceptionHandler(MissingRequestHeaderException.class)
    protected ResponseEntity<ErrorResponse> handleMissingRequestHeaderException(
        MissingRequestHeaderException ex) {
        log.error("MissingRequestHeaderException", ex);
        return createErrorResponse(ErrorCode.REQUEST_BODY_MISSING_ERROR, ex.getMessage());
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    protected ResponseEntity<ErrorResponse> handleHttpMessageNotReadableException(
        HttpMessageNotReadableException ex) {
        log.error("HttpMessageNotReadableException", ex);
        return createErrorResponse(ErrorCode.REQUEST_BODY_MISSING_ERROR, ex.getMessage());
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    protected ResponseEntity<ErrorResponse> handleMissingRequestHeaderExceptionException(
        MissingServletRequestParameterException ex) {
        log.error("handleMissingServletRequestParameterException", ex);
        return createErrorResponse(ErrorCode.MISSING_REQUEST_PARAMETER_ERROR, ex.getMessage());
    }

    @ExceptionHandler(HttpClientErrorException.BadRequest.class)
    protected ResponseEntity<ErrorResponse> handleBadRequestException(HttpClientErrorException ex) {
        log.error("HttpClientErrorException.BadRequest", ex);
        return createErrorResponse(ErrorCode.BAD_REQUEST_ERROR, ex.getMessage());
    }

    @ExceptionHandler(NoHandlerFoundException.class)
    protected ResponseEntity<ErrorResponse> handleNoHandlerFoundExceptionException(
        NoHandlerFoundException ex) {
        log.error("handleNoHandlerFoundExceptionException", ex);
        return createErrorResponse(ErrorCode.NOT_FOUND_ERROR, ex.getMessage());
    }

    @ExceptionHandler(NullPointerException.class)
    protected ResponseEntity<ErrorResponse> handleNullPointerException(NullPointerException ex) {
        log.error("handleNullPointerException", ex);
        return createErrorResponse(ErrorCode.NULL_POINT_ERROR, ex.getMessage());
    }

    @ExceptionHandler(IOException.class)
    protected ResponseEntity<ErrorResponse> handleIOException(IOException ex) {
        log.error("handleIOException", ex);
        return createErrorResponse(ErrorCode.IO_ERROR, ex.getMessage());
    }

    @ExceptionHandler(JsonParseException.class)
    protected ResponseEntity<ErrorResponse> handleJsonParseExceptionException(
        JsonParseException ex) {
        log.error("handleJsonParseExceptionException", ex);
        return createErrorResponse(ErrorCode.JSON_PARSE_ERROR, ex.getMessage());
    }

    @ExceptionHandler(JsonProcessingException.class)
    protected ResponseEntity<ErrorResponse> handleJsonProcessingException(
        JsonProcessingException ex) {
        log.error("handleJsonProcessingException", ex);
        return createErrorResponse(ErrorCode.REQUEST_BODY_MISSING_ERROR, ex.getMessage());
    }

    // ==================================================================================================================

    @ExceptionHandler(RegisterIdentificationException.class)
    protected ResponseEntity<?> handleRegisterIdentificationException(CustomException ex) {
        log.error("RegisterIdentificationException", ex);
        return createErrorResponse(ErrorCode.ID_ALREADY_USE, ex.getMessage());
    }

    @ExceptionHandler(ReissueReLoginException.class)
    protected ResponseEntity<?> handleReissueReLoginException(CustomException ex) {
        log.error("ReissueReLoginException", ex);
        return createErrorResponse(ErrorCode.UNAUTHORIZED_ERROR, ex.getMessage());
    }

    @ExceptionHandler(WrongParameterException.class)
    protected ResponseEntity<?> handleWrongParameterException(CustomException ex) {
        log.error("WrongParameterException", ex);
        return createErrorResponse(ErrorCode.BAD_REQUEST_ERROR, ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    protected final ResponseEntity<ErrorResponse> handleAllExceptions(Exception ex) {
        log.error("Exception", ex);
        return createErrorResponse(ErrorCode.INTERNAL_SERVER_ERROR, ex.getMessage());
    }
}