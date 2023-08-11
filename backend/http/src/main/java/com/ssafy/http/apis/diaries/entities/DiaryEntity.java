package com.ssafy.http.apis.diaries.entities;

import com.ssafy.http.apis.members.entities.MemberEntity;
import java.time.LocalDateTime;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.PrePersist;
import javax.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "diaries")
public class DiaryEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "member_id", nullable = false)
  private MemberEntity memberEntity;

  @Column(name = "created_at", nullable = false)
  private LocalDateTime createdAt;

  @Column(name = "image_url")
  private String imageUrl;

  @Builder
  public DiaryEntity(Long id, MemberEntity memberEntity, String imageUrl, LocalDateTime createdAt) {
    this.id = id;
    this.memberEntity = memberEntity;
    this.imageUrl = imageUrl;
    this.createdAt = createdAt;
  }

  @PrePersist
  public void createTimeStamps() {
    createdAt = LocalDateTime.now();
  }

}
