package com.ssafy.http.apis.classes.repositories;

import com.ssafy.http.apis.classes.entities.ClassEntity;
import com.ssafy.http.apis.roles.entities.RoleEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ClassRepository extends JpaRepository<ClassEntity, Long> {

  List<ClassEntity> findAllByGovernmentId(Long governmentId);

  @Query("SELECT c"
      + "  FROM ClassEntity c"
      + "  LEFT JOIN MemberEntity m ON c.id = m.classId AND m.role = :teacherRole"
      + "  WHERE c.governmentId = :governmentId AND m.classId IS NULL")
  List<ClassEntity> findUnassignedClassList(@Param("governmentId") Long governmentId,
      @Param("teacherRole") RoleEntity teacherRole);

  /*
@Query("SELECT c FROM ClassEntity c "
      + "LEFT JOIN MemberEntity m "
      + "ON c.id = m.classId "
      + "WHERE c.governmentId = :governmentId AND m.role = :teacherRole")
 */

}
