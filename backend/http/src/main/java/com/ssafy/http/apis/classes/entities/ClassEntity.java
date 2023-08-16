package com.ssafy.http.apis.classes.entities;

import com.ssafy.http.apis.commoncodes.entities.CommonCodeEntity;
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
@Table(name = "classes")
public class ClassEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;

  private Long governmentId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "status_code", nullable = false)
  private CommonCodeEntity commonCode;

  @Column(nullable = false)
  private String className;

  @Column(nullable = false)
  private LocalDateTime lectureTime;

  @Column(nullable = false)
  private LocalDateTime createdAt;

  @Column(nullable = false)
  private LocalDateTime updatedAt;

  @Builder
  public ClassEntity(long id, Long governmentId, CommonCodeEntity commonCode,
      String className, LocalDateTime lectureTime, LocalDateTime createdAt,
      LocalDateTime updatedAt) {
    this.id = id;
    this.governmentId = governmentId;
    this.commonCode = commonCode;
    this.className = className;
    this.lectureTime = lectureTime;
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
