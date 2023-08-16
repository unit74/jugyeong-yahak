package com.ssafy.sse.apis.controllers;

import com.ssafy.sse.apis.requests.ConvertPageRequest;
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
        lectureService.convertPage(convertPageRequest.getClassId(), null);
    }

}
