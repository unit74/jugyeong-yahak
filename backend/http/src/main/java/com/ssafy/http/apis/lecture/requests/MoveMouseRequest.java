package com.ssafy.http.apis.lecture.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MoveMouseRequest {

    private Long classId;
    private String streamId;
    private Long x;
    private Long y;
}
