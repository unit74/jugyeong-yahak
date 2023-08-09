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
public class StudentRequest {
  
  private Long classId;

  //private Long role;

  @NotNull
  @NotEmpty
  private String statusCode;

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
  private Long tabletNo;

  @NotNull
  private Integer gender;

  public MemberEntity toEntityForRegister(String urlPrefix, String urlPostfix, Long governmentId,
      String uuid) {

    return MemberEntity.builder()
        .governmentId(governmentId)
        .password(uuid)
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
        .uuid(uuid)
        .faceImageUrl(urlPrefix + governmentId + "/" + uuid + urlPostfix)
        .gender(gender)
        .build();
  }

  public MemberEntity toEntityForUpdate(MemberEntity entity) {

    return MemberEntity.builder()
        .id(entity.getId())
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

