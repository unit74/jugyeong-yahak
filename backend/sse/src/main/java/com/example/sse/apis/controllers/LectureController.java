package com.example.sse.apis.controllers;

import com.example.sse.apis.services.LectureService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/api/v1/sse")
@RequiredArgsConstructor
public class LectureController {

    private final LectureService lectureService;

    @GetMapping(value = "/subscribe/{teacherId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe(@PathVariable Long teacherId) {
        return lectureService.subscribe(teacherId);
    }

    @GetMapping("/convert/page/{number}")
    public void sendData(@PathVariable Long number) {
        lectureService.convertPage(1L, number);
    }
}
