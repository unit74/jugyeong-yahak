package com.ssafy.http.apis.lecturehistories.entities;

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
@Table(name = "lecture_learning_histories")
public class LectureHistoryEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private Long classId;

  @Column(nullable = false)
  private Long teacherId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "curriculum_id")
  private ThemeEntity themeEntity;

  @Column(nullable = false)
  private LocalDateTime createdAt;

  @Column(nullable = false)
  private LocalDateTime updatedAt;

  @PrePersist
  public void createTimeStamps() {
    createdAt = LocalDateTime.now();
    updatedAt = LocalDateTime.now();
  }

  @PreUpdate
  public void updateTimeStamps() {
    updatedAt = LocalDateTime.now();
  }

  @Builder
  public LectureHistoryEntity(Long id, Long classId, Long teacherId, ThemeEntity themeEntity,
      LocalDateTime createdAt, LocalDateTime endedAt) {
    this.id = id;
    this.classId = classId;
    this.teacherId = teacherId;
    this.themeEntity = themeEntity;
    this.createdAt = createdAt;
    this.updatedAt = endedAt;
  }

//  public void endLecture() {
//    endedAt = LocalDateTime.now();
//  }
}
