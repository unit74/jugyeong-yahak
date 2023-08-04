package com.ssafy.http.apis.themes.repositories;

import com.ssafy.http.apis.themes.entities.ThemeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ThemeRepository extends JpaRepository<ThemeEntity, Long> {

}
