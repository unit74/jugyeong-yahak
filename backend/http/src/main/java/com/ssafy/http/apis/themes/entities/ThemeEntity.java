package com.ssafy.http.apis.themes.entities;

import com.ssafy.http.apis.themes.responses.WordDetailResponse;
import java.time.LocalDateTime;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;
import javax.persistence.Transient;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "themes")
public class ThemeEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;

  @Column(nullable = false)
  private String theme;

  @Column(nullable = false)
  private String themeImageUrl;

  @Column(nullable = false)
  private String situation;

  @Column(nullable = false)
  private String situationJournal;

  @Column(nullable = false)
  private LocalDateTime createdAt;

  @Column(nullable = false)
  private LocalDateTime updatedAt;

  @Column(nullable = false)
  private Integer stage;

  @Transient
  private List<WordDetailResponse> wordList;

  public void setWordList(List<WordDetailResponse> wordList) {
    this.wordList = wordList;
  }

  @Builder
  public ThemeEntity(Long id, String theme, String themeImageUrl, String situation,
      String situationJournal,
      LocalDateTime createdAt, LocalDateTime updatedAt, Integer stage) {
    this.id = id;
    this.stage = stage;
    this.theme = theme;
    this.themeImageUrl = themeImageUrl;
    this.situation = situation;
    this.situationJournal = situationJournal;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
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
