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
public class TeacherUpdateRequest {

  @NotNull
  private Long id;

  @NotNull
  @NotEmpty
  private String statusCode;

  @NotNull
  @NotEmpty
  private String name;

  @Pattern(regexp = "^\\d{2,3}-\\d{3,4}-\\d{4}$", message = "사용자의 핸드폰 번호 형식을 확인해주세요. xxx-xxxx-xxxx")
  private String phone;

  @NotNull
  @NotEmpty
  private String address;

  @NotNull
  private Long tabletNo;

  public MemberEntity toEntity(MemberEntity memberEntity) {

    return MemberEntity.builder()
        .id(id)
        .governmentId(memberEntity.getGovernmentId())
        .password(memberEntity.getPassword())
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
