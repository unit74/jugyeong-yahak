package com.ssafy.http.apis.themes.responses;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.ssafy.http.apis.themes.entities.ThemeEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ThemeStageResponse {

  private long curriculumnId;
  private String curriculumName;
  private String curriculumImage;

  public void of(ThemeEntity themeEntity) {
    this.curriculumnId = themeEntity.getId();
    this.curriculumName = themeEntity.getSituation();
    this.curriculumImage = themeEntity.getThemeImageUrl();

    if (themeEntity.getThemeImageUrl() == null) {
      this.curriculumImage = "https://www.bizforms.co.kr/form/image/thumb_ing.gif";
    }
  }

}
