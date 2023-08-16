package com.ssafy.http.apis.members.requests;

import com.ssafy.http.apis.members.entities.MemberEntity;
import com.ssafy.http.apis.roles.Role;
import com.ssafy.http.apis.roles.entities.RoleEntity;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentUpdateRequest {

  @NotNull
  private Long id;

  @NotNull
  @NotEmpty
  private String name;

  @Pattern(regexp = "^\\d{2,3}-\\d{3,4}-\\d{4}$", message = "사용자의 핸드폰 번호 형식을 확인해주세요. xxx-xxxx-xxxx")
  private String phone;

  @NotNull
  @NotEmpty
  private String address;

  @Pattern(regexp = "^\\d{2,3}-\\d{3,4}-\\d{4}$", message = "보호자의 핸드폰 번호 형식을 확인해주세요. xxx-xxxx-xxxx")
  private String firstResponder;

  @NotNull
  private Long classId;

  @NotNull
  @NotEmpty
  private String statusCode;

  @NotNull
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
