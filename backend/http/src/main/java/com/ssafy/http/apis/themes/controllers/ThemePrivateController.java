package com.ssafy.http.apis.themes.controllers;

import static com.ssafy.http.support.utils.ApiResponseUtil.createSuccessResponse;

import com.ssafy.http.apis.themes.entities.ThemeEntity;
import com.ssafy.http.apis.themes.entities.WordEntity;
import com.ssafy.http.apis.themes.responses.ThemeDetailResponse;
import com.ssafy.http.apis.themes.responses.WordDetailResponse;
import com.ssafy.http.apis.themes.services.ThemeService;
import com.ssafy.http.apis.themes.services.WordService;
import com.ssafy.http.support.codes.SuccessCode;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.context.Theme;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/themes")
@RequiredArgsConstructor
public class ThemePrivateController {

    private final static char[] choseong = {'ㄱ', 'ㄴ','ㄷ','ㄹ','ㅁ','ㅂ','ㅅ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'};

    private final ThemeService themeService;
    private final WordService wordService;

    @GetMapping("/list")    // 테마 리스트 반환
    public ResponseEntity<?> getThemeList() {

        List<ThemeDetailResponse> themeDetailResponses = themeService.getThemeList();

        return createSuccessResponse(SuccessCode.SELECT_SUCCESS, "전체 테마 리스트를 조회하였습니다.", themeDetailResponses);
    }

    @GetMapping("/{id}")   // 선택된 테마 내용 반환
    public ResponseEntity<?> getTheme(@PathVariable("id") Long id) {

        ThemeEntity themeEntity = themeService.getTheme(id);

        List<WordDetailResponse> words = wordService.getWords(id);

        themeEntity.setWordList(words);

        return createSuccessResponse(SuccessCode.SELECT_SUCCESS, "선택된 테마 상세 내용 및 단어 문제를 반환합니다.", themeEntity);
    }

    @GetMapping("/choseong")
    public ResponseEntity<?> startChoseong() {

        ArrayList<String> choseongList = new ArrayList<>();

        for(int i = 0 ; i < 5 ; i++) {
            choseongList.add(String.valueOf(choseong[(int)(Math.random() * 13)]) + String.valueOf(choseong[(int)(Math.random() * 13)]));
        }

        return createSuccessResponse(SuccessCode.SELECT_SUCCESS, "초성을 랜덤으로 5개 반환합니다.", choseongList);
    }

    @GetMapping("/{themeId}/reasoning")
    public ResponseEntity<?> startReasoning(@PathVariable("themeId") Long themeId) {

        List<WordDetailResponse> words = wordService.getWords(themeId);

        Collections.shuffle(words);

        return createSuccessResponse(SuccessCode.SELECT_SUCCESS, "해당 테마의 단어를 셔플하여 반환합니다.", words);
    }
}
