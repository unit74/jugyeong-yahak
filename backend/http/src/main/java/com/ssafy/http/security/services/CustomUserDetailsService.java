package com.ssafy.http.security.services;

import com.ssafy.http.apis.governments.entities.GovernmentEntity;
import com.ssafy.http.apis.governments.repositories.GovernmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final GovernmentRepository governmentRepository;

    @Override
    public UserDetails loadUserByUsername(String identification) throws UsernameNotFoundException {
        GovernmentEntity findUser = governmentRepository.findByIdentification(
                                                            identification)
                                                        .orElseThrow(
                                                            () -> new UsernameNotFoundException(
                                                                "Can't find user with this email. -> "
                                                                    + identification));
        if (findUser != null) {
            CustomUserDetails customUserDetails = new CustomUserDetails(findUser);
            return customUserDetails;
        }

        return null;
    }
}