package com.ssafy.http.apis.auth.requests;

import com.ssafy.http.apis.governments.entities.GovernmentEntity;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GovernmentLoginRequest {

    @NotNull
    @NotEmpty
    private String identification;

    @NotNull
    @NotEmpty
    private String password;

    public GovernmentEntity toEntity() {
        return GovernmentEntity.builder()
                               .identification(identification)
                               .password(password)
                               .build();
    }

}
