package com.ssafy.http.apis.governments.requests;

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
}
