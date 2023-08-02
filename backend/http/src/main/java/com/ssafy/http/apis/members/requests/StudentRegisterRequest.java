package com.ssafy.http.apis.members.requests;

import com.ssafy.http.apis.members.entities.MemberEntity;
import com.ssafy.http.apis.roles.Role;
import com.ssafy.http.apis.roles.entities.RoleEntity;
import java.util.UUID;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentRegisterRequest {

  //@NotNull
  private Long governmentId;

  //@NotNull
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

  public MemberEntity toEntity(String urlPrefix, String urlPostfix, Long governmentId) {
    String uuid = UUID.randomUUID().toString();

    return MemberEntity.builder()
        .governmentId(governmentId)
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
        .build();
  }
}
