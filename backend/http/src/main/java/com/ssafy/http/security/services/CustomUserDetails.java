package com.ssafy.http.security.services;

import com.ssafy.http.apis.governments.entities.GovernmentEntity;
import com.ssafy.http.apis.members.entities.MemberEntity;
import com.ssafy.http.apis.roles.Role;
import java.util.ArrayList;
import java.util.Collection;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class CustomUserDetails implements UserDetails {

  private GovernmentEntity governmentEntity;
  private MemberEntity memberEntity;

  public CustomUserDetails(GovernmentEntity governmentEntity) {
    this.governmentEntity = governmentEntity;
  }

  public CustomUserDetails(MemberEntity memberEntity) {
    this.memberEntity = memberEntity;
  }

  public Long getUserId() {
    if (governmentEntity != null) {
      return governmentEntity.getId();
    }

    return memberEntity.getId();
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    Collection<GrantedAuthority> authorities = new ArrayList<>();

    if (governmentEntity != null) {
      authorities.add(() -> governmentEntity.getRole()
          .getRole());
    } else {
      authorities.add(() -> memberEntity.getRole()
          .getRole());
    }

    return authorities;
  }

  @Override
  public String getPassword() {
    if (governmentEntity != null) {
      return governmentEntity.getPassword();
    }
    return memberEntity.getPassword();

  }

  @Override
  public String getUsername() {
    if (governmentEntity != null) {
      return governmentEntity.getIdentification();
    }

    return String.valueOf(memberEntity.getId());

  }

  public Role getRole() {
    if (governmentEntity != null) {
      return Role.GOVERNMENT;
    }

    if (memberEntity.getRole().getId() == Role.TEACHER.getId()) {
      return Role.TEACHER;
    }

    if (memberEntity.getRole().getId() == Role.STUDENT.getId()) {
      return Role.STUDENT;
    }

    return Role.ADMIN;
  }

  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  @Override
  public boolean isAccountNonLocked() {
    return true;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  public boolean isEnabled() {
    return true;
  }
}