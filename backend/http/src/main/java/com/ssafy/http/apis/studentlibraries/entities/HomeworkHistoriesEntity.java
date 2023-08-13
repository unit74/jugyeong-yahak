package com.ssafy.http.apis.studentlibraries.entities;

import com.ssafy.http.apis.members.entities.MemberEntity;
import com.ssafy.http.apis.themes.entities.ThemeEntity;
import java.time.LocalDateTime;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "homework_histories")
public class HomeworkHistoriesEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "member_id", nullable = false)
  private MemberEntity memberEntity;

  @ManyToOne
  @JoinColumn(name = "theme_id", nullable = false)
  private ThemeEntity themeEntity;

  @Column(nullable = false)
  private String statusCode;

  @Column(nullable = false)
  private LocalDateTime createdAt;

  @Column(nullable = false)
  private LocalDateTime updatedAt;


  @Builder
  public HomeworkHistoriesEntity(Long id, MemberEntity memberEntity, ThemeEntity themeEntity,
      String statusCode, LocalDateTime createdAt, LocalDateTime updatedAt) {
    this.id = id;
    this.memberEntity = memberEntity;
    this.themeEntity = themeEntity;
    this.statusCode = statusCode;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;

  }

  public void setStatusCode(String statusCode) {
    this.statusCode = statusCode;
  }

  @PrePersist
  public void createTimeStamps() {
    updatedAt = LocalDateTime.now();
    createdAt = LocalDateTime.now();
  }

  @PreUpdate
  public void updateTimeStamps() {
    updatedAt = LocalDateTime.now();
  }
}
