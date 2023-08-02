package com.ssafy.http.apis.governments.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/private/governments")
public class GovernmentPrivateController {

    @GetMapping
    public void test() {

    }
}
