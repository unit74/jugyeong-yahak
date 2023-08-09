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
public class TeacherRequest {

  //@NotNull
  private Long classId;

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
  private Integer gender;

  @NotNull
  private Long tabletNo;

  public MemberEntity toEntityForRegister(String urlPrefix, String urlPostfix, Long governmentId,
      String uuid) {

    return MemberEntity.builder()
        .governmentId(governmentId)
        .password(uuid)
        .classId(classId)
        .role(RoleEntity.builder()
            .role(Role.TEACHER)
            .build())
        .statusCode(statusCode)
        .name(name)
        .phone(phone)
        .address(address)
        .tabletNo(tabletNo)
        .uuid(uuid)
        .faceImageUrl(urlPrefix + governmentId + "/" + uuid + urlPostfix)
        .gender(gender)
        .build();
  }

  public MemberEntity toEntityForUpdate(MemberEntity memberEntity) {

    return MemberEntity.builder()
        .governmentId(memberEntity.getGovernmentId())
        .password(memberEntity.getPassword())
        .classId(classId)
        .role(RoleEntity.builder()
            .role(Role.TEACHER)
            .build())
        .statusCode(statusCode)
        .name(name)
        .phone(phone)
        .address(address)
        .tabletNo(tabletNo)
        .uuid(memberEntity.getUuid())
        .faceImageUrl(memberEntity.getFaceImageUrl())
        .gender(memberEntity.getGender())
        .build();
  }
}
