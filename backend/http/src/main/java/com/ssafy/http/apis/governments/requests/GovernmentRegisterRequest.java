package com.ssafy.http.apis.governments.requests;

import com.ssafy.http.apis.governments.entities.GovernmentEntity;
import com.ssafy.http.apis.roles.Role;
import com.ssafy.http.apis.roles.entities.RoleEntity;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/*
    여기에 정규식 적용해야함
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GovernmentRegisterRequest {

    @NotNull
    @NotEmpty
    private String identification;

    @NotNull
    @NotEmpty
    private String password;

    @NotNull
    @NotEmpty
    private String name;

    @NotNull
    @NotEmpty
    private String phone;

    @NotNull
    @NotEmpty
    private String address;

    @Email
    @NotNull
    private String email;

    public GovernmentEntity toEntity() {
        return GovernmentEntity.builder()
                               .role(RoleEntity.builder()
                                               .role(Role.GOVERNMENT)
                                               .build())
                               .identification(identification)
                               .password(password)
                               .name(name)
                               .phone(phone)
                               .address(address)
                               .email(email)
                               .build();
    }
}
