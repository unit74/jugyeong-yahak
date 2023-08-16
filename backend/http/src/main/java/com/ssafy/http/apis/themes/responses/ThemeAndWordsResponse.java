package com.ssafy.http.apis.themes.responses;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.ssafy.http.apis.themes.entities.ThemeEntity;
import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ThemeAndWordsResponse {

  private long id;
  private int stage;
  private String theme;
  private String themeImageUrl;
  private String situation;
  private String situationJournal;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;

  private List<WordDetailResponse> wordList;

  public void of(ThemeEntity themeEntity, List<WordDetailResponse> wordDetailResponses) {
    this.id = themeEntity.getId();
    this.theme = themeEntity.getTheme();
    this.stage = themeEntity.getStage();
    this.situation = themeEntity.getSituation();
    this.situationJournal = themeEntity.getSituationJournal();
    this.createdAt = themeEntity.getCreatedAt();
    this.updatedAt = themeEntity.getUpdatedAt();
    
    this.themeImageUrl = themeEntity.getThemeImageUrl();
    if (themeEntity.getThemeImageUrl() == null) {
      this.themeImageUrl = "https://www.bizforms.co.kr/form/image/thumb_ing.gif";
    }
    this.wordList = wordDetailResponses;
  }

}
