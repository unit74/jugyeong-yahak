package com.example.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {
    @GetMapping("/")
    public String testMapppgin(){
        System.out.println("응답이 도착했습니다");
        return "서버에서 응답이 도착했습니다.";
    }
}
