package com.ssafy.http.apis.members.controllers;

import com.ssafy.http.apis.members.services.S3ImageUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/members")
@RequiredArgsConstructor
public class MemberPrivateController {
    private final S3ImageUploadService imageUploadService;
    @PostMapping(value="/private/{government}/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public String memberLogin(@PathVariable String government, @RequestParam(value="image") MultipartFile image) throws IOException {

        System.out.println("이미지 등록 요청 받음");
        System.out.println(government);

        String fileName = imageUploadService.uploadImage(government, image);
        return fileName;
    }
}
