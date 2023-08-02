package com.ssafy.http.apis.themes.controllers;

import static com.ssafy.http.support.utils.ApiResponseUtil.createSuccessResponse;

import com.ssafy.http.apis.themes.entities.ThemeEntity;
import com.ssafy.http.apis.themes.entities.WordEntity;
import com.ssafy.http.apis.themes.services.ThemeService;
import com.ssafy.http.support.codes.SuccessCode;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/themes")
@RequiredArgsConstructor
public class ThemePrivateController {

    private final ThemeService themeService;

    @GetMapping("/list")    // 테마 리스트 반환
    public ResponseEntity<?> getThemeList() {

        ArrayList<Object[]> themeList = themeService.getThemeList();

        return createSuccessResponse(SuccessCode.SELECT_SUCCESS, themeList);
    }

    @GetMapping("/{themeId}")   // 선택된 테마 내용 반환
    public ResponseEntity<?> getTheme(@PathVariable("themeId") Long themeId) {

        Optional<ThemeEntity> theme = themeService.getTheme(themeId);

        ArrayList<WordEntity> words = themeService.getWords(themeId);

        theme.get().setWordList(words);

        return createSuccessResponse(SuccessCode.SELECT_SUCCESS, theme.get());
    }

    @GetMapping("/word")   // 단어들 확인 test용
    public ResponseEntity<?> getWord() {

        ArrayList<WordEntity> wordlist = themeService.getWordList();

        return createSuccessResponse(SuccessCode.SELECT_SUCCESS, wordlist);
    }

//    @GetMapping("/{themeId}/reasoning/{wordId}")
//    public ResponseEntity<?> startReasoning(@PathVariable("themeId") Long themeId,
//                                            @PathVariable("wordId") Long wordId) {
//
//        Optional<WordEntity> word = themeService.getWord(themeId,wordId);
//
//        return createSuccessResponse(SuccessCode.SELECT_SUCCESS, word.get());
//    }

//    @GetMapping("/{themeId}/reasoning/{wordId}")
//    public ResponseEntity<?> startChoseong(@PathVariable("themeId") Long themeId,
//                                            @PathVariable("wordId") Long wordId) {
//
////        char CHoseong
//
//        return createSuccessResponse(SuccessCode.SELECT_SUCCESS, word.get());
//    }




}
