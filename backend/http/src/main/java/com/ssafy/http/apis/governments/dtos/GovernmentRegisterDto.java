package com.ssafy.http.apis.governments.dtos;

import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GovernmentRegisterDto {

    @NotNull(message = "널이야!")
    private String identification;

    private String password;

    private String name;

    private String phone;

    private String address;

    private String email;
}
