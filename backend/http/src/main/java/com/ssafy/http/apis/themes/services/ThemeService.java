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

    public Optional<WordEntity> getWord(Long id) {
        return wordRepository.findById(id);
    }

    public Optional<WordEntity> getFirstWord(Long themeId) {
        return wordRepository.findTop1ByThemeId(themeId);
    }
}
