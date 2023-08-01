package com.ssafy.http.exception;

import com.ssafy.http.support.codes.ErrorCode;
import java.io.Serializable;

public class ReissueReLoginException extends CustomException implements Serializable {

    public ReissueReLoginException(ErrorCode errorCode) {
        super(errorCode);
    }

}