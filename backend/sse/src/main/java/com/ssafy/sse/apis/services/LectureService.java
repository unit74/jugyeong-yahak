package com.ssafy.sse.apis.services;

import com.ssafy.sse.apis.repositories.EmitterRepository;
import com.ssafy.sse.exception.LoginInfoNotExistException;
import com.ssafy.sse.exception.ReissueReLoginException;
import com.ssafy.sse.support.codes.ErrorCode;
import com.ssafy.sse.support.utils.JsonUtil;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Service
@RequiredArgsConstructor
public class LectureService {

    private static final Long DEFAULT_TIMEOUT = 60L * 1000 * 60;

    private final EmitterRepository emitterRepository;

    private SseEmitter createEmitter(Long classId, Long userId) {
        SseEmitter emitter = new SseEmitter(DEFAULT_TIMEOUT);
        emitterRepository.save(classId, userId, emitter);

        System.out.println("Connections : " + emitterRepository.get(classId));

        emitter.onCompletion(() -> emitterRepository.deleteById(classId, userId));
        emitter.onTimeout(() -> emitterRepository.deleteById(classId, userId));

        return emitter;
    }

    public SseEmitter subscribe(Long classId, String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", accessToken);

        HttpEntity<String> entity = new HttpEntity<String>("parameters", headers);

        RestTemplate restTemplate = new RestTemplate();

        ResponseEntity<String> response = restTemplate.exchange(
            "https://i9e206.p.ssafy.io/api/v1/private/members/key",
            HttpMethod.GET, entity,
            String.class);

        if (response.getStatusCode() == HttpStatus.FORBIDDEN) {
            throw new LoginInfoNotExistException(ErrorCode.FORBIDDEN_ERROR);
        } else if (response.getStatusCode() == HttpStatus.UNAUTHORIZED) {
            throw new ReissueReLoginException(ErrorCode.UNAUTHORIZED_ERROR);
        }

        Map<String, Object> json = JsonUtil.fromJson(response.getBody());

        Long userId = Long.valueOf((Integer) json.get("data")); //

        SseEmitter emitter = createEmitter(classId, userId);

        sendToClient(classId, userId, "connect", "EventStream Created. [id=" + classId + "]");
        return emitter;
    }

    public void micControl(Long classId, Long userId, Object event) {
        sendToClient(classId, userId, "mic", event);
    }

    public void moveMousePointer(Long classId, Long userId, Object event) {
        sendToClient(classId, userId, "mouse", event);
    }

    public void convertPage(Long classId, Long userId, Object event) {
        sendToClient(classId, userId, "page", event);
    }

    private void sendToClient(Long classId, Long userId, String name, Object data) {
        List<SseEmitter> emitters = emitterRepository.get(classId);
        System.out.println(classId);
        System.out.println(name);
        System.out.println(emitters);
        emitters.forEach(emitter -> {
            try {
                emitter.send(SseEmitter.event()
//                                       .id(String.valueOf(id))
                                       .name(name)
                                       .data(data));
            } catch (IOException exception) {
                emitterRepository.deleteById(classId, userId);
                emitter.completeWithError(exception);
            }
        });
    }
}
