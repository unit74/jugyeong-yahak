package com.ssafy.http.apis.auth.dtos;


import com.ssafy.http.apis.members.entities.MemberEntity;
import com.ssafy.http.jwt.dtos.TokenDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MemberLoginDto {

  private TokenDto token;
  private Long classId;
  private String role;
  private String name;
  private Integer gender;

  public void of(TokenDto token, MemberEntity memberEntity) {
    this.token = token;
    this.classId = memberEntity.getClassId();
    this.role = memberEntity.getRole().getRole();
    this.name = memberEntity.getName();
    this.gender = memberEntity.getGender();
  }
}