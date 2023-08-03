package com.ssafy.http.apis.lecture.services;

import com.ssafy.http.apis.members.services.MemberService;
import java.net.URI;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import org.springframework.web.util.UriComponentsBuilder;

@Service
@RequiredArgsConstructor
public class LectrueService {

    private final MemberService memberService;

    public SseEmitter startLecture(Long id) {
        Long classId = memberService.getClassId(id);

        URI uri = UriComponentsBuilder.fromUriString("http://localhost:8082")
                                      .path("/api/v1/sse/subscribe")
                                      .path("/" + classId)
                                      .build()
                                      .toUri();

        RestTemplate restTemplate = new RestTemplate();

        return null;
//        return restTemplate.postForEntity(uri, SseEmitter.class);
    }
}
