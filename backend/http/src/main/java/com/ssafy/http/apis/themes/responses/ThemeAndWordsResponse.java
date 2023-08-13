package com.ssafy.http.apis.themes.responses;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.ssafy.http.apis.themes.entities.ThemeEntity;
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
  private String theme;
  private String themeImageUrl;
  private List<WordDetailResponse> wordList;

  public void of(ThemeEntity themeEntity, List<WordDetailResponse> wordDetailResponses) {
    this.id = themeEntity.getId();
    this.theme = themeEntity.getTheme();
    this.themeImageUrl = themeEntity.getThemeImageUrl();
    if (themeEntity.getThemeImageUrl() == null) {
      this.themeImageUrl = "https://www.bizforms.co.kr/form/image/thumb_ing.gif";
    }
    this.wordList = wordDetailResponses;
  }

}
