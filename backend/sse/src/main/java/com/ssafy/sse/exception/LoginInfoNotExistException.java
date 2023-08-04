package com.ssafy.sse.exception;

import com.ssafy.sse.support.codes.ErrorCode;
import java.io.Serializable;

public class LoginInfoNotExistException extends CustomException implements Serializable {

    public LoginInfoNotExistException(ErrorCode errorCode) {
        super(errorCode);
    }

}