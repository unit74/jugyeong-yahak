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
public class ThemeDetailResponse {

    private long id;
    private String theme;
    private String themeImageUrl;

    public void of(ThemeEntity themeEntity) {
        this.id = themeEntity.getId();
        this.theme = themeEntity.getTheme();
        this.themeImageUrl = themeEntity.getThemeImageUrl();
    }

}
