package com.ssafy.http.apis.classes.controllers;

import com.ssafy.http.apis.classes.entities.ClassEntity;
import com.ssafy.http.apis.classes.services.ClassService;
import com.ssafy.http.security.utils.SecurityUtil;
import com.ssafy.http.support.codes.SuccessCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;

import static com.ssafy.http.support.utils.ApiResponseUtil.createSuccessResponse;

@RestController
@RequestMapping("/api/v1/private/classes")
public class ClassPrivateController {

    private ClassService classService;

    @GetMapping("/list")    // 테마 리스트 반환
    public ResponseEntity<?> getClassList() {

        Long governmentId = classService.getGovernmentId(SecurityUtil.getLoginUserId()).get().getGovernmentId();

        ArrayList<Object[]> classList = classService.getClassList(governmentId);

        return createSuccessResponse(SuccessCode.SELECT_SUCCESS, classList);
    }


}
