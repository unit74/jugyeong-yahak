package com.ssafy.http.apis.diaries.responses;

import com.ssafy.http.apis.diaries.entities.DiaryEntity;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
//@JsonInclude(JsonInclude.Include.NON_NULL)
public class DiaryDetailResponse {

  private long id;
  private String content;
  private String imageUrl;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;

  public void of(DiaryEntity diaryEntity) {

    this.id = diaryEntity.getId();
    this.content = diaryEntity.getContent();
    this.imageUrl = diaryEntity.getImageUrl();
    if (diaryEntity.getImageUrl() == null) {
      this.imageUrl = "https://www.bizforms.co.kr/form/image/thumb_ing.gif";
    }
    this.createdAt = diaryEntity.getCreatedAt();
    this.updatedAt = diaryEntity.getUpdatedAt();
  }
}
