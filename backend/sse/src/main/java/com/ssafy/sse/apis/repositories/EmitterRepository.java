package com.ssafy.sse.apis.repositories;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Repository
@RequiredArgsConstructor
public class EmitterRepository {

    private final Map<Long, Map<String, SseEmitter>> emitters = new ConcurrentHashMap<>(); // { classId, users }

    public void save(Long classId, String streamId, SseEmitter emitter) {
        emitters.computeIfAbsent(classId, k -> new ConcurrentHashMap<>())
                .put(streamId, emitter);
    }

    public void deleteById(Long classId, String streamId) {
        emitters.get(classId)
                .remove(streamId);
    }

    public Map<String, SseEmitter> get(Long classId) {
        return emitters.get(classId);
    }

    public SseEmitter get(Long classId, String streamId) {
        return emitters.get(classId)
                       .get(streamId);
    }
}
