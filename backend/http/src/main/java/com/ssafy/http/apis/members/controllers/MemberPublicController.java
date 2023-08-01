package com.ssafy.http.apis.members.controllers;

import com.ssafy.http.apis.members.services.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URISyntaxException;

@RestController
@RequestMapping("/api/v1/members")
@RequiredArgsConstructor
public class MemberPublicController {

    private final MemberService memberService;
    @PostMapping(value="/public/{government}/login", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public String memberLogin(@PathVariable String government, @RequestParam(value="image") MultipartFile image) throws URISyntaxException, IOException {

        System.out.println("로그인 요청 받음");
        System.out.println(government);

        String fileName = memberService.memberLogin(image, government);
        return fileName;
    }
}
