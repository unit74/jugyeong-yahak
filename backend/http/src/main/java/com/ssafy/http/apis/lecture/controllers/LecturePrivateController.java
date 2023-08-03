package com.ssafy.http.apis.lecture.controllers;

import com.ssafy.http.apis.lecture.requests.MicControlRequest;
import com.ssafy.http.apis.lecture.requests.MousePointerRequest;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/private/lecture")
public class LecturePrivateController {

    @GetMapping("/convert/page/{number}")
    public void convertPage(@PathVariable Long number) {
    }

    @PostMapping("/mouse/pointer")
    public void moveMouseCursor(@RequestBody MousePointerRequest mousePointerRequest) {
    }

    @PostMapping("/mic/control")
    public void micControl(@RequestBody MicControlRequest micControlRequest) {


    }
}
