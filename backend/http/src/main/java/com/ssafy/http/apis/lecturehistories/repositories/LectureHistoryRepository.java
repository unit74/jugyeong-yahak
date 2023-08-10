package com.ssafy.http.apis.lecturehistories.repositories;

import com.ssafy.http.apis.classes.entities.ClassEntity;
import com.ssafy.http.apis.themes.entities.ThemeEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface LectureHistoryRepository extends JpaRepository<ClassEntity, Long> {

  @Query("SELECT t.theme, COUNT(lh) FROM LectureHistoryEntity lh "
      + "RIGHT JOIN lh.themeEntity t "
      + "ON lh.classId = :classId AND t.id = lh.themeEntity.id "
      + "GROUP BY t.theme")
  List<Object[]> findThemeNameAllForClass(@Param("classId") Long classId);

  @Query("SELECT t FROM LectureHistoryEntity lh "
      + "RIGHT JOIN lh.themeEntity t "
      + "ON lh.classId = :classId AND t.id = lh.themeEntity.id "
      + "WHERE t.theme = :themeName AND lh.id IS NULL")
  List<ThemeEntity> findStagesAllForClass(@Param("themeName") String themeName,
      @Param("classId") Long classId);

}
