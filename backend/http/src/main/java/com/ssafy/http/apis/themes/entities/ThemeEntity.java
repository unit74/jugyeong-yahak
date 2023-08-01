package com.ssafy.http.apis.themes.entities;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity(name = "themes")
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

    @Builder
    public ThemeEntity(Long id, String theme, String themeImageUrl, String situation, String situationJournal,
                       LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
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
