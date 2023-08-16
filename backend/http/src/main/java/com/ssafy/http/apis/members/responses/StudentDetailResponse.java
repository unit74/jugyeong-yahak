package com.ssafy.http.apis.members.responses;

import com.ssafy.http.apis.members.entities.MemberEntity;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
//@JsonInclude(JsonInclude.Include.NON_NULL)
public class StudentDetailResponse {

  private Long id;
  private Long governmentId;
  private Long classId;
  private String role;
  private String statusCode;
  private String name;
  private String phone;
  private String address;
  private String faceImageUrl;
  private String firstResponder;
  private Long tabletNo;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
  private String gender;

  public void of(MemberEntity memberEntity) {
    this.id = memberEntity.getId();
    this.governmentId = memberEntity.getGovernmentId();
    this.classId = memberEntity.getClassId();
    this.role = memberEntity.getRole()
        .getRole();
    this.statusCode = memberEntity.getStatusCode();
    this.name = memberEntity.getName();
    this.phone = memberEntity.getPhone();
    this.address = memberEntity.getAddress();
    this.faceImageUrl = memberEntity.getFaceImageUrl();
    this.firstResponder = memberEntity.getFirstResponder();
    this.tabletNo = memberEntity.getTabletNo();
    this.createdAt = memberEntity.getCreatedAt();
    this.updatedAt = memberEntity.getUpdatedAt();
    this.gender = (memberEntity.getGender() == 1) ? "MAN" : "WOMAN";
  }
}
