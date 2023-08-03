package com.ssafy.http.apis.themes.responses;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.ssafy.http.apis.themes.entities.WordEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class WordDetailResponse {

    private long id;
    private String word;
    private String wordImageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public void of(WordEntity wordEntity) {
        this.id = wordEntity.getId();
        this.word = wordEntity.getWord();
        this.wordImageUrl = wordEntity.getWordImageUrl();
        this.createdAt = wordEntity.getCreatedAt();
        this.updatedAt = wordEntity.getUpdatedAt();
    }

}
