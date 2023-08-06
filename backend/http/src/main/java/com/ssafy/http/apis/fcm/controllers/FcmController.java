package com.ssafy.http.apis.fcm.controllers;

import com.ssafy.http.apis.fcm.services.FcmService;
import com.ssafy.http.support.codes.SuccessCode;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.Map;

import static com.ssafy.http.support.utils.ApiResponseUtil.createSuccessResponse;

@RestController
@RequestMapping("/api/v1/fcm")
@RequiredArgsConstructor
public class FcmController {

    private final FcmService fcmService;

    // 알림 test용
    @PostMapping("/sendMessage")
    public ResponseEntity<?> sendMessage(@RequestBody(required = false) Map<String, Object> params) throws Exception{

        fcmService.sendMessage(String.valueOf(params.get("token")));

        return createSuccessResponse(SuccessCode.SELECT_SUCCESS, "fcm send message");
    }



}
