package com.ssafy.http.apis.openvidu.services;

import com.ssafy.http.apis.openvidu.repositories.OpenviduRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OpenviduService {

    private OpenviduRepository openviduRepository;

    public Optional<Long> getSessionId(Long loginUserId) {
        return openviduRepository.findByMyId(loginUserId);
    }
}
