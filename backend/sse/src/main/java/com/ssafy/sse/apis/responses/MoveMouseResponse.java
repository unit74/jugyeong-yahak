package com.ssafy.sse.apis.responses;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class MoveMouseResponse {

    private Long x;
    private Long y;
}
