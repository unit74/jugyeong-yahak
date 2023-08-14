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
public class TeacherRegisterRequest {

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

  @Min(value = 0, message = "값의 범위가 0~1입니다.")
  @Max(value = 1, message = "값의 범위가 0~1입니다.")
  private Integer gender;

  @NotNull
  private Long tabletNo;

  public MemberEntity toEntity(String urlPrefix, String urlPostfix, Long governmentId,
      String uuid) {

    return MemberEntity.builder()
        .governmentId(governmentId)
        .password(uuid)
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

}
