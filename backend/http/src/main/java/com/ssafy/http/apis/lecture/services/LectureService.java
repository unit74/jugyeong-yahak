package com.ssafy.http.apis.lecture.services;

import com.ssafy.http.apis.lecture.requests.ControlMicRequest;
import com.ssafy.http.apis.lecture.requests.ConvertPageRequest;
import com.ssafy.http.apis.lecture.requests.MoveMouseRequest;
import java.net.URI;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class LectureService {

    @Value("${sse.server.url}")
    private String BASE_URL;

    public void controlMic(ControlMicRequest controlMicRequest) {
        RestTemplate restTemplate = new RestTemplate();

        HttpEntity<ControlMicRequest> request = new HttpEntity<>(controlMicRequest);

        URI uri = UriComponentsBuilder.fromHttpUrl(BASE_URL)
                                      .path("/mic/control")
                                      .build()
                                      .toUri();

        restTemplate.postForLocation(uri, request);
    }

    public void moveMousePointer(MoveMouseRequest moveMouseRequest) {
        RestTemplate restTemplate = new RestTemplate();

        HttpEntity<MoveMouseRequest> request = new HttpEntity<>(moveMouseRequest);

        URI uri = UriComponentsBuilder.fromHttpUrl(BASE_URL)
                                      .path("/mouse/pointer")
                                      .build()
                                      .toUri();

        restTemplate.postForLocation(uri, request);
    }

    public void convertPage(ConvertPageRequest convertPageRequest) {
        RestTemplate restTemplate = new RestTemplate();

        HttpEntity<ConvertPageRequest> request = new HttpEntity<>(convertPageRequest);

        URI uri = UriComponentsBuilder.fromHttpUrl(BASE_URL)
                                      .path("/convert/page")
                                      .build()
                                      .toUri();

        restTemplate.postForLocation(uri, request);
    }

}
