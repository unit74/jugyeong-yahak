package com.ssafy.http.apis.themes.services;

import com.ssafy.http.apis.themes.entities.WordEntity;
import com.ssafy.http.apis.themes.repositories.WordRepository;
import com.ssafy.http.apis.themes.responses.WordDetailResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WordService {

    private final WordRepository wordRepository;

    public List<WordDetailResponse> getWords(Long themeId) {

        List<WordDetailResponse> wordDetailResponses = new ArrayList<>();

        List<WordEntity> words = wordRepository.findAllByThemeId(themeId);

        for(WordEntity word : words) {
            WordDetailResponse wordDetailResponse = new WordDetailResponse();

            wordDetailResponse.of(word);

            wordDetailResponses.add(wordDetailResponse);
        }

        return wordDetailResponses;
    }
}
