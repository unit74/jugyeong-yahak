package com.ssafy.sse.apis.controllers;

import com.ssafy.sse.apis.requests.ControlMicRequest;
import com.ssafy.sse.apis.requests.ConvertPageRequest;
import com.ssafy.sse.apis.requests.MoveMouseRequest;
import com.ssafy.sse.apis.responses.MoveMouseResponse;
import com.ssafy.sse.apis.services.LectureService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/sse/v1")
@RequiredArgsConstructor
public class LectureController {

    private final LectureService lectureService;

    @GetMapping(value = "/subscribe", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe(Long classId, String streamId) {
        return lectureService.subscribe(classId, streamId);
    }

    @PostMapping("/convert/page")
    public void convertPage(@RequestBody ConvertPageRequest convertPageRequest) {
        lectureService.convertPage(convertPageRequest.getClassId(),
            convertPageRequest.getStreamId(), convertPageRequest.getNumber());
    }

    @PostMapping("/mouse/pointer")
    public void moveMouseCursor(@RequestBody MoveMouseRequest moveMouseRequest) {
        lectureService.moveMousePointer(moveMouseRequest.getClassId(),
            moveMouseRequest.getStreamId(), MoveMouseResponse.builder()
                                                             .x(moveMouseRequest.getX())
                                                             .y(
                                                                 moveMouseRequest.getY())
                                                             .build());
    }

    @PostMapping("/mic/control/{userId}/to/{classId}")
    public void controlMic(@RequestBody ControlMicRequest controlMicRequest) {
        lectureService.controlMic(controlMicRequest.getClassId(), controlMicRequest.getStreamId(),
            controlMicRequest.getStatus());
    }
}
