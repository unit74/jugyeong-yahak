package com.ssafy.http.apis.lecture.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ControlMicRequest {

    private Long classId;
    private String streamId;
    private Boolean status;
}
