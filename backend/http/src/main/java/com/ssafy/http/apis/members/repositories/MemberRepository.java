package com.ssafy.http.apis.members.repositories;

import com.ssafy.http.apis.members.entities.MemberEntity;
import com.ssafy.http.apis.roles.entities.RoleEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MemberRepository extends JpaRepository<MemberEntity, Long> {

  List<MemberEntity> findAllByClassId(Long classId);

  Optional<MemberEntity> findMemberEntityByUuid(String uuid);

  Optional<MemberEntity> findMemberEntityByPhone(String phone);

  List<MemberEntity> findUuidByGovernmentId(Long governmentId);

  Optional<MemberEntity> findMemberEntityById(Long id);

  List<MemberEntity> findAllByRoleAndGovernmentId(RoleEntity role, Long governmentId);

  List<MemberEntity> findAllByRoleAndClassId(RoleEntity role, Long classId);

  //Optional<MemberEntity> findTeacherByRoleAndClassId(RoleEntity role, Long classId);
  List<MemberEntity> findTeacherByRoleAndClassId(RoleEntity role, Long classId);

  @Query("SELECT m FROM MemberEntity m WHERE m.classId = :classId And m.role.id = 4")
  Optional<MemberEntity> findClassIdByRole(@Param("classId") Long classId);

}
