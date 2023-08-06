package com.ssafy.http.apis.auth.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MemberLoginResponse {

  private String token;
  private Info info;

  @Data
  @Builder
  @AllArgsConstructor
  @NoArgsConstructor
  public static class Info {

    private Long classId;
    private String role;
    private String name;

  }

}
