package com.ssafy.http.apis.themes.repositories;

import com.ssafy.http.apis.themes.entities.ThemeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.ArrayList;
import java.util.Optional;

public interface ThemeRepository extends JpaRepository<ThemeEntity, Long> {

    @Query("select w.id, w.theme, w.themeImageUrl from themes w")
    ArrayList<Object[]> findAllColumns();

    Optional<ThemeEntity> findById(Long themeId);

}
