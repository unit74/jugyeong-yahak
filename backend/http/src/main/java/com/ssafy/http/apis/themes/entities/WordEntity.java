package com.ssafy.http.apis.themes.entities;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

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

    @Column(nullable = false)
    private String wordImageUrl;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Builder
    public WordEntity(Long id, Long themeId, String word, String wordImageUrl,
                      LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.themeId = themeId;
        this.word = word;
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
