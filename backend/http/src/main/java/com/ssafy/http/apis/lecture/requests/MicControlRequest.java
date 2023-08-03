package com.ssafy.http.apis.lecture.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MicControlRequest {
    private String streamId;
    private Boolean status;
}
