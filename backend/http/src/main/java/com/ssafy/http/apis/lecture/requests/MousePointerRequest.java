package com.ssafy.http.apis.lecture.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MousePointerRequest {
    private Long x;
    private Long y;
}
