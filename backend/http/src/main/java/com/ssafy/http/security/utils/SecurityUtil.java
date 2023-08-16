package com.ssafy.http.security.utils;

import com.ssafy.http.apis.roles.Role;
import com.ssafy.http.security.services.CustomUserDetails;
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

    if (principal instanceof CustomUserDetails) {
      return ((CustomUserDetails) principal).getUserId();
    }

    return null;
  }

  public static Role getLoginUserRole() {
    Object principal = SecurityContextHolder.getContext()
        .getAuthentication()
        .getPrincipal();

    if (principal instanceof CustomUserDetails) {
      return ((CustomUserDetails) principal).getRole();
    }

    return null;
  }

}