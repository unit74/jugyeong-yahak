package com.ssafy.sse.apis.services;

import com.ssafy.sse.apis.repositories.EmitterRepository;
import java.io.IOException;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Service
@RequiredArgsConstructor
public class LectureService {

    private static final Long DEFAULT_TIMEOUT = 60L * 1000 * 60;

    private final EmitterRepository emitterRepository;

    private SseEmitter createEmitter(Long classId, String streamId) {
        SseEmitter emitter = new SseEmitter(DEFAULT_TIMEOUT);
        emitterRepository.save(classId, streamId, emitter);

        emitter.onCompletion(() -> emitterRepository.deleteById(classId, streamId));
        emitter.onTimeout(() -> emitterRepository.deleteById(classId, streamId));

        return emitter;
    }

    public SseEmitter subscribe(Long classId, String streamId) {
        SseEmitter emitter = createEmitter(classId, streamId);

        sendToClients(classId, "connect", "EventStream Created. [class=" + classId + "]");
        return emitter;
    }
    public void convertPage(Long classId, Object event) {
        sendToClients(classId,"page", event);
    }

    private void sendToClients(Long classId, String name, Object data) {
        Map<String, SseEmitter> emitters = emitterRepository.get(classId);
        emitters.forEach((id, emitter) -> {
            try {
                emitter.send(SseEmitter.event()
                                       .name(name)
                                       .data(data));
            } catch (IOException exception) {
                emitterRepository.deleteById(classId, id);
                emitter.completeWithError(exception);
            }
        });
    }
}
