package com.ssafy.http.apis.themes.entities;

import java.time.LocalDateTime;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity(name = "words")
public class WordEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;

  @Column(nullable = false)
  private long themeId;

  @Column(nullable = false)
  private String word;

  @Column
  private String wordExplanation;

  @Column(nullable = false)
  private String wordImageUrl;

  @Column(nullable = false)
  private LocalDateTime createdAt;

  @Column(nullable = false)
  private LocalDateTime updatedAt;

  @Builder
  public WordEntity(Long id, Long themeId, String word, String wordImageUrl,
      LocalDateTime createdAt, LocalDateTime updatedAt, String wordExplanation) {
    this.id = id;
    this.themeId = themeId;
    this.word = word;
    this.wordExplanation = wordExplanation;
    this.wordImageUrl = wordImageUrl;
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
