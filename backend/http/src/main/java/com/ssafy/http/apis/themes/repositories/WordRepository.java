package com.ssafy.http.apis.themes.repositories;

import com.ssafy.http.apis.themes.entities.WordEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface WordRepository extends JpaRepository<WordEntity, Long> {

    Optional<WordEntity> findById(Long id);

    Optional<WordEntity> findTop1ByThemeId(Long themeId);
}
