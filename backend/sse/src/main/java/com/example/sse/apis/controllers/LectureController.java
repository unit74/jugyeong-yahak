package com.example.sse.apis.controllers;

import com.example.sse.apis.requests.MicControlRequest;
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

    @GetMapping(value = "/subscribe/{userId}/to/{classId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe(@PathVariable Long userId, @PathVariable Long classId) {
        return lectureService.subscribe(userId, classId);
    }

    @PostMapping("/convert/page/{userId}/to/{classId}/{number}")
    public void convertPage(@PathVariable Long userId, @PathVariable Long classId,
        @PathVariable Long number) {
        lectureService.convertPage(classId, userId, number);
    }

    @PostMapping("/mouse/pointer/{userId}/to/{classId}")
    public void moveMouseCursor(@PathVariable Long userId, @PathVariable Long classId,
        @RequestBody MoveMouseRequest moveMouseRequest) {
        lectureService.moveMousePointer(classId, userId, moveMouseRequest);
    }

    @PostMapping("/mic/control/{userId}/to/{classId}")
    public void micControl(@PathVariable Long userId, @PathVariable Long classId,
        @RequestBody MicControlRequest micControlRequest) {
        System.out.println(micControlRequest);
        lectureService.micControl(classId, userId, micControlRequest);
    }
}
