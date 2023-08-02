package com.ssafy.http.apis.themes.services;

import com.ssafy.http.apis.themes.entities.ThemeEntity;
import com.ssafy.http.apis.themes.entities.WordEntity;
import com.ssafy.http.apis.themes.repositories.ThemeRepository;
import com.ssafy.http.apis.themes.repositories.WordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ThemeService {

    private final ThemeRepository themeRepository;
    private final WordRepository wordRepository;

    public ArrayList<Object[]> getThemeList() {

        return themeRepository.findAllColumns();
    }

    public Optional<ThemeEntity> getTheme(Long themeId) {

        return themeRepository.findById(themeId);
    }

    public ArrayList<WordEntity> getWordList() {
        return wordRepository.findAll();
    }

    public ArrayList<WordEntity> getWords(Long themeId) {
        return wordRepository.findByThemeId(themeId);
    }

}
