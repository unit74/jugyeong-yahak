package com.ssafy.http.apis.commoncodes;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum CommonCode {
  A01("A01", "ACTIVE"),
  A02("A02", "INACTIVE"),
  B01("B01", "받아쓰기"),
  B02("B02", "읽기"),
  ;

  private String statusCode;
  private String statusName;

}
