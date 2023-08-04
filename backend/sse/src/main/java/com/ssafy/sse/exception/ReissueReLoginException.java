package com.ssafy.sse.exception;

import com.ssafy.sse.support.codes.ErrorCode;
import java.io.Serializable;

public class ReissueReLoginException extends CustomException implements Serializable {

    public ReissueReLoginException(ErrorCode errorCode) {
        super(errorCode);
    }

}