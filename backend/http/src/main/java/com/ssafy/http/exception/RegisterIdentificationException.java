package com.ssafy.http.exception;

import com.ssafy.http.support.codes.ErrorCode;
import java.io.Serializable;

public class RegisterIdentificationException extends CustomException implements Serializable {

    public RegisterIdentificationException(ErrorCode errorCode) {
        super(errorCode);
    }

}