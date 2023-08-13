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
  String content;

  @NotNull
  @NotEmpty
  String imageUrl;

  //image??

  public DiaryEntity toEntity(MemberEntity memberEntity) {
    return DiaryEntity.builder()
        .memberEntity(memberEntity)
        .content(this.content)
        .imageUrl(this.imageUrl)
        .build();
  }

}
