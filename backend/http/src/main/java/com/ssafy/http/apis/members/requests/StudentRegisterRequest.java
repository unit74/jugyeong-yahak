package com.ssafy.http.apis.members.requests;

import com.ssafy.http.apis.members.entities.MemberEntity;
import com.ssafy.http.apis.roles.Role;
import com.ssafy.http.apis.roles.entities.RoleEntity;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentRegisterRequest {

  @NotNull
  @NotEmpty
  private String name;

  @Min(value = 0, message = "값의 범위가 0~1입니다.")
  @Max(value = 1, message = "값의 범위가 0~1입니다.")
  private int gender;

  @Pattern(regexp = "^\\d{2,3}-\\d{3,4}-\\d{4}$", message = "사용자의 핸드폰 번호 형식을 확인해주세요. xxx-xxxx-xxxx")
  private String phone;

  @NotNull
  @NotEmpty
  private String address;

  @NotNull
  @NotEmpty
  @Pattern(regexp = "^\\d{2,3}-\\d{3,4}-\\d{4}$", message = "보호자의 핸드폰 번호 형식을 확인해주세요. xxx-xxxx-xxxx")
  private String firstResponder;

  @NotNull
  private Long classId;

  @NotNull
  @NotEmpty
  private String statusCode;

  @NotNull
  private Long tabletNo;

  public MemberEntity toEntity(String urlPrefix, String urlPostfix, Long governmentId,
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
}

