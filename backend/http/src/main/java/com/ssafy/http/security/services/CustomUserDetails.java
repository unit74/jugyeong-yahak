package com.ssafy.http.security.services;

import com.ssafy.http.apis.governments.entities.GovernmentEntity;
import java.util.ArrayList;
import java.util.Collection;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class CustomUserDetails implements UserDetails {

    private GovernmentEntity governmentEntity;

    public CustomUserDetails(GovernmentEntity governmentEntity) {
        this.governmentEntity = governmentEntity;
    }

    public Long getUserId() {
        return governmentEntity.getId();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Collection<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(() -> governmentEntity.getRole()
                                              .getRole());
        return authorities;
    }

    @Override
    public String getPassword() {
        return governmentEntity.getPassword();
    }

    @Override
    public String getUsername() {
        return governmentEntity.getIdentification();
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