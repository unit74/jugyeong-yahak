package com.ssafy.http.apis.themes.responses;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.ssafy.http.apis.themes.entities.WordEntity;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class WordDetailResponse {

  private long id;
  private String word;
  //단어 설명
  private String wordExplanation;
  private String wordImageUrl;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;


  public void of(WordEntity wordEntity) {
    this.id = wordEntity.getId();
    this.word = wordEntity.getWord();
    this.wordExplanation = wordEntity.getWordExplanation();
    if (wordEntity.getWordExplanation() == null) {
      this.wordExplanation = "단어 설명 부분 준비중입니다.";
    }
    this.wordImageUrl = wordEntity.getWordImageUrl();
    this.createdAt = wordEntity.getCreatedAt();
    this.updatedAt = wordEntity.getUpdatedAt();
  }

}
