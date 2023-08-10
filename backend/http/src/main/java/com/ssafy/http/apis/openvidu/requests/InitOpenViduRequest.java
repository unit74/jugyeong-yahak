package com.ssafy.http.apis.openvidu.requests;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InitOpenViduRequest {

  @NotNull
  @NotEmpty
  private String customSessionId;

}
