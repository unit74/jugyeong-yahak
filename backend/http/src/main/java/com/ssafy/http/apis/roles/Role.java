package com.ssafy.http.apis.roles;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum Role {
    ADMIN(1L, "ROLE_ADMIN"),
    GOVERNMENT(2L, "ROLE_GOVERNMENT"),
    STUDENT(3L, "ROLE_STUDENT"),
    TEACHER(4L, "ROLE_TEACHER"),
    ;

    private Long id;
    private String role;
}
