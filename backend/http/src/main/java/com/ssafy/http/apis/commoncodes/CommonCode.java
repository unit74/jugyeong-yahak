package com.ssafy.http.apis.commoncodes;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum CommonCode {
  A01("A01", "ACTIVE"),
  A02("A02", "INACTIVE"),
  A03("A03", "UNASSIGNED"),
  B01("B01", "받아쓰기"),
  B02("B02", "읽기"),
  C01("C01", "NOT_SOLVED"),
  C02("C02", "IN_PROGRESS"),
  C03("C03", "SOLVED");

  private String statusCode;
  private String statusName;

}
