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

    private SseEmitter createEmitter(Long classId, Long userId) {
        SseEmitter emitter = new SseEmitter(DEFAULT_TIMEOUT);
        emitterRepository.save(classId, userId, emitter);

        System.out.println("Connections : " + emitterRepository.get(classId));

        emitter.onCompletion(() -> emitterRepository.deleteById(classId, userId));
        emitter.onTimeout(() -> emitterRepository.deleteById(classId, userId));

        return emitter;
    }

    public SseEmitter subscribe(Long classId, Long userId) {
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
