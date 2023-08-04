package com.ssafy.http.apis.themes.repositories;

import com.ssafy.http.apis.themes.entities.WordEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WordRepository extends JpaRepository<WordEntity, Long> {

    List<WordEntity> findAllByThemeId(Long themeId);
}
