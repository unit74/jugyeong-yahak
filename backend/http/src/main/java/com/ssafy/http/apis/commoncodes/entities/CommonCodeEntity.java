package com.ssafy.http.apis.commoncodes.entities;

import com.ssafy.http.apis.commoncodes.CommonCode;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity(name = "common_codes")
public class CommonCodeEntity {

  @Id
  private String statusCode;

  @Column(nullable = false)
  private String statusName;

  @Builder
  public CommonCodeEntity(CommonCode commonCode) {
    this.statusCode = commonCode.getStatusCode();
    this.statusName = commonCode.getStatusName();
  }
}
