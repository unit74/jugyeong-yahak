package com.ssafy.http.apis.auth.responses;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import java.time.LocalTime;
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
  @JsonInclude(Include.NON_NULL)
  public static class Info {

    private Long classId;
    private String role;
    private String name;
    private Integer gender;
    private LocalTime lectureTime;

  }

}
