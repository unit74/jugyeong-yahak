package com.example.demo.controller;

import com.example.demo.common.Detect;
import java.io.IOException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DetectController {

    @GetMapping("/{image}")
    public void detect(@PathVariable String image) throws IOException {
        Detect.detectDocumentText("C:\\" + image);
    }

}
