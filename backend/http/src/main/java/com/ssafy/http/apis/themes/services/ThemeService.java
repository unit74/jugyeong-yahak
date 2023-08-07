package com.ssafy.http.apis.themes.services;

import com.ssafy.http.apis.themes.entities.ThemeEntity;
import com.ssafy.http.apis.themes.entities.WordEntity;
import com.ssafy.http.apis.themes.repositories.ThemeRepository;
import com.ssafy.http.apis.themes.responses.ThemeDetailResponse;
import com.ssafy.http.exception.WrongParameterException;
import com.ssafy.http.support.codes.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ThemeService {

    private final ThemeRepository themeRepository;

    public List<ThemeDetailResponse> getThemeList() {

        List<ThemeDetailResponse> themeDetailResponses = new ArrayList<>();

        List<ThemeEntity> themes = themeRepository.findAll();

        for(ThemeEntity theme : themes) {
            ThemeDetailResponse themeDetailResponse = new ThemeDetailResponse();

            themeDetailResponse.of(theme);

            themeDetailResponses.add(themeDetailResponse);
        }

        return themeDetailResponses;
    }

    public ThemeEntity getTheme(Long id) {

        ThemeEntity themeEntity = themeRepository.findById(id)
                .orElseThrow(() -> new WrongParameterException(
                        ErrorCode.BAD_REQUEST_ERROR));

        return themeEntity;
    }
}
