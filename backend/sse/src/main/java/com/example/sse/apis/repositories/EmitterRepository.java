package com.example.sse.apis.repositories;

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

    private final Map<Long, List<SseEmitter>> emitters = new ConcurrentHashMap<>();

    public void save(Long id, SseEmitter emitter) {
        emitters.computeIfAbsent(id, k -> new ArrayList<>())
                .add(emitter);
    }

    public void deleteById(Long id) {
        emitters.remove(id);
    }

    public List<SseEmitter> get(Long id) {
        return emitters.get(id);
    }
}
