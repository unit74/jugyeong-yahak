package com.ssafy.http.security.utils;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

public class SecurityUtil {

    public static String getLoginUsername() {
        UserDetails user = (UserDetails) SecurityContextHolder.getContext()
                                                              .getAuthentication()
                                                              .getPrincipal();

        return user.getUsername();
    }

    public static Long getLoginUserId() {
        Object principal = SecurityContextHolder.getContext()
                                                .getAuthentication()
                                                .getPrincipal();

//        if (principal instanceof CustomUserDetails) {
//            return ((CustomUserDetails) principal).getUserId();
//        }

        return null;
    }

}