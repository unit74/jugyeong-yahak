package com.example.sse.apis.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MicControlRequest {

    private Long userId;
    private Boolean status;
}
