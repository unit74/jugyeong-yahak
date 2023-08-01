package com.ssafy.http.apis.governments.services;

import com.ssafy.http.apis.governments.entities.GovernmentEntity;
import com.ssafy.http.apis.governments.repositories.GovernmentRepository;
import com.ssafy.http.apis.governments.requests.GovernmentRegisterRequest;
import com.ssafy.http.exception.RegisterIdentificationException;
import com.ssafy.http.support.codes.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GovernmentService {

    private final GovernmentRepository governmentRepository;
    private final PasswordEncoder passwordEncoder;

    public void registerGovernment(GovernmentRegisterRequest governmentRegisterRequest) {
        GovernmentEntity requestEntity = governmentRegisterRequest.toEntity();

        governmentRepository.findByIdentification(requestEntity.getIdentification())
                            .ifPresent((government) -> new RegisterIdentificationException(
                                ErrorCode.ID_ALREADY_USE));

        requestEntity.encodePassword(passwordEncoder);
        governmentRepository.save(requestEntity);
    }
}
