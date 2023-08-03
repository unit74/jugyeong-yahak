package com.ssafy.http.apis.mute.controllers;

import com.ssafy.http.security.utils.SecurityUtil;
import com.ssafy.http.support.codes.SuccessCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

import static com.ssafy.http.support.utils.ApiResponseUtil.createSuccessResponse;

@RestController
@RequestMapping("/api/v1/mute")
public class MutePrivateController {

    @PostMapping("/all")
    public ResponseEntity<?> muteAll() {



        return createSuccessResponse(SuccessCode.SELECT_SUCCESS, "mute All done");
    }

    @PostMapping("/{userId}")
    public ResponseEntity<?> muteOne(@PathVariable("userId") String userId) {



        return createSuccessResponse(SuccessCode.SELECT_SUCCESS, "mute" + userId + "done");
    }

}
