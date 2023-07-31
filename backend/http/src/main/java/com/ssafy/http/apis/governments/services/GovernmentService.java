package com.ssafy.http.apis.governments.services;

import com.ssafy.http.apis.governments.repositories.GovernmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GovernmentService {

    private GovernmentRepository governmentRepository;
    private PasswordEncoder passwordEncoder;


}
