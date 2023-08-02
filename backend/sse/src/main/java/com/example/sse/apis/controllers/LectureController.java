package com.example.sse.apis.controllers;

import com.example.sse.apis.requests.MoveMouseRequest;
import com.example.sse.apis.services.LectureService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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

    @PostMapping("/convert/page/{teacherId}/{number}")
    public void convertPage(@PathVariable Long teacherId, @PathVariable Long number) {
        lectureService.convertPage(teacherId, number);
    }

    @PostMapping("/mouse/pointer/{teacherId}")
    public void moveMouseCursor(@PathVariable Long teacherId,
        @RequestBody MoveMouseRequest moveMouseRequest) {
        lectureService.moveMousePointer(teacherId, moveMouseRequest);
    }
}
