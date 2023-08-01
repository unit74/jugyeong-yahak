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
import java.util.ArrayList;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/private/themes")
@RequiredArgsConstructor
public class ThemePrivateController {

    private final ThemeService themeService;

    @GetMapping("/list")
    public ResponseEntity<?> getThemeList() {

        ArrayList<Object[]> themeList = themeService.getThemeList();

        return createSuccessResponse(SuccessCode.SELECT_SUCCESS, themeList);
    }

    @GetMapping("/{themeId}")
    public ResponseEntity<?> getTheme(@Valid @PathVariable("themeId") Long themeId) {

        Optional<ThemeEntity> theme = themeService.getTheme(themeId);

        return createSuccessResponse(SuccessCode.SELECT_SUCCESS, theme.get());
    }

    @GetMapping("/{themeId}/{wordId}")
    public ResponseEntity<?> getThemeProblem(@Valid @PathVariable("themeId") Long themeId,
                                             @Valid @PathVariable("wordId") Long wordId) {

        if(wordId == -1) {  // 첫번째 단어의 경우 몇번인지 모름, 걍 정해진 숫자 주면 알아서 첫번째 단어 주기
            Optional<WordEntity> word = themeService.getFirstWord(themeId);

            return createSuccessResponse(SuccessCode.SELECT_SUCCESS, word.get());
        }

        // 방금 푼 문제 번호 넘겨주면 다음 문제 검색해서 주기
        Optional<WordEntity> word = themeService.getWord(wordId + 1);

        // 언제 단어가 끝나는지 모름 그래서 그냥 themeId가 다르면 끝난걸루, 근데 이거 문제들이 전부 theme 순서대로 들어간다는 가정하에 한거긴함
        if(themeId != word.get().getThemeId()) return createSuccessResponse(SuccessCode.REQUEST_SUCCESS,"end");

        return createSuccessResponse(SuccessCode.SELECT_SUCCESS, word.get());
    }


}
