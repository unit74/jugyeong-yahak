package com.ssafy.sse.apis.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ControlMicRequest {

    private Long classId;
    private String streamId;
    private Boolean status;
}
