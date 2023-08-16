package com.ssafy.http.apis.auth.dtos;


import com.ssafy.http.apis.members.entities.MemberEntity;
import com.ssafy.http.jwt.dtos.TokenDto;
import java.time.LocalTime;
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
  private Long id;
  private Long classId;
  private String role;
  private String name;
  private Integer gender;
  private LocalTime lectureTime;

  //학생
  public void of(TokenDto token, MemberEntity memberEntity, LocalTime lectureTime) {
    this.token = token;
    this.id = memberEntity.getId();
    this.classId = memberEntity.getClassId();
    this.role = memberEntity.getRole().getRole();
    this.name = memberEntity.getName();
    this.gender = memberEntity.getGender();
    this.lectureTime = lectureTime;
  }

  //강사
  public void of(TokenDto token, MemberEntity memberEntity) {
    this.id = memberEntity.getId();
    this.token = token;
    this.classId = memberEntity.getClassId();
    this.role = memberEntity.getRole().getRole();
    this.name = memberEntity.getName();
    this.gender = memberEntity.getGender();
  }
}