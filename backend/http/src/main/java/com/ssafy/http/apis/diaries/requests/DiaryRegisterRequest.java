package com.ssafy.http.apis.diaries.requests;

import com.ssafy.http.apis.diaries.entities.DiaryEntity;
import com.ssafy.http.apis.members.entities.MemberEntity;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DiaryRegisterRequest {

  @NotNull
  @NotEmpty
  private String content;

  @NotNull
  @NotEmpty
  private String imageUrl;

  public DiaryEntity toEntity(MemberEntity memberEntity, String imageUrl) {
    return DiaryEntity.builder()
        .memberEntity(memberEntity)
        .imageUrl(imageUrl)
        .content(this.content)
        .build();
  }

}
