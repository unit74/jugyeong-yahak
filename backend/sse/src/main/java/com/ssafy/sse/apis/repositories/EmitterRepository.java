package com.ssafy.sse.apis.repositories;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Repository
@RequiredArgsConstructor
public class EmitterRepository {

    private final Map<Long, Map<Long, SseEmitter>> emitters = new ConcurrentHashMap<>(); // { classId, users }

    public void save(Long classId, Long userId, SseEmitter emitter) {
        emitters.computeIfAbsent(classId, k -> new ConcurrentHashMap<>())
                .put(userId, emitter);
    }

    public void deleteById(Long classId, Long userId) {
        emitters.get(classId)
                .remove(userId);
    }

    public List<SseEmitter> get(Long classId) {
        List<SseEmitter> classUsers = new ArrayList<>();
        emitters.get(classId)
                .forEach((userId, emitter) -> {
                    classUsers.add(emitter);
                });

        return classUsers;
    }
}
