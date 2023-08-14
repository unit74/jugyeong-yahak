package com.ssafy.http.apis.members.requests;

import com.ssafy.http.apis.members.entities.MemberEntity;
import com.ssafy.http.apis.roles.Role;
import com.ssafy.http.apis.roles.entities.RoleEntity;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentUpdateRequest {

  @NotNull
  @NotEmpty
  private Long id;

  @NotNull
  @NotEmpty
  private String name;

  @NotNull
  @NotEmpty
  private String phone;

  @NotNull
  @NotEmpty
  private String address;

  @NotNull
  @NotEmpty
  private String firstResponder;

  @NotNull
  @NotEmpty
  private Long classId;

  @NotNull
  @NotEmpty
  private String statusCode;

  @NotNull
  @NotEmpty
  private Long tabletNo;

  public MemberEntity toEntity(MemberEntity entity) {
    return MemberEntity.builder()
        .id(id)
        .governmentId(entity.getGovernmentId())
        .password(entity.getPassword())
        .classId(classId)
        .role(RoleEntity.builder()
            .role(Role.STUDENT)
            .build())
        .statusCode(statusCode)
        .name(name)
        .phone(phone)
        .address(address)
        .firstResponder(firstResponder)
        .tabletNo(tabletNo)
        .uuid(entity.getUuid())
        .faceImageUrl(entity.getFaceImageUrl())
        .gender(entity.getGender())
        .build();
  }
}
