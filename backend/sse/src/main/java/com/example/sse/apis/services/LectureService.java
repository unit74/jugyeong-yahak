package com.example.sse.apis.services;

import com.example.sse.apis.repositories.EmitterRepository;
import java.io.IOException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Service
@RequiredArgsConstructor
public class LectureService {

    private static final Long DEFAULT_TIMEOUT = 60L * 1000 * 60;

    private final EmitterRepository emitterRepository;

    private SseEmitter createEmitter(Long id) {
        SseEmitter emitter = new SseEmitter(DEFAULT_TIMEOUT);
        emitterRepository.save(id, emitter);

        emitter.onCompletion(() -> emitterRepository.deleteById(id));
        emitter.onTimeout(() -> emitterRepository.deleteById(id));

        return emitter;
    }

    public SseEmitter subscribe(Long teacherId) {
        SseEmitter emitter = createEmitter(teacherId);

        sendToClient(teacherId, "connect", "EventStream Created. [id=" + teacherId + "]");
        return emitter;
    }

    public void moveMousePointer(Long teacherId, Object event) {
        sendToClient(teacherId, "mouse", event);
    }

    public void convertPage(Long teacherId, Object event) {
        sendToClient(teacherId, "page", event);
    }

    private void sendToClient(Long id, String name, Object data) {
        List<SseEmitter> emitters = emitterRepository.get(id);
        emitters.forEach(emitter -> {
            try {
                emitter.send(SseEmitter.event()
//                                       .id(String.valueOf(id))
                                       .name(name)
                                       .data(data));
            } catch (IOException exception) {
                emitterRepository.deleteById(id);
                emitter.completeWithError(exception);
            }
        });
    }
}
