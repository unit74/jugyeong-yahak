package com.ssafy.http.exception;

import com.ssafy.http.support.codes.ErrorCode;
import java.io.Serializable;

public class WrongParameterException extends CustomException implements Serializable {

    public WrongParameterException(ErrorCode errorCode) {
        super(errorCode);
    }

}