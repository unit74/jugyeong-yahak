package com.ssafy.http.apis.members.repositories;

import com.ssafy.http.apis.members.entities.MemberEntity;
import com.ssafy.http.apis.roles.entities.RoleEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<MemberEntity, Long> {

  List<MemberEntity> findAllByClassId(Long classId);

  Optional<MemberEntity> findMemberEntityByUuid(String uuid);

  Optional<MemberEntity> findMemberEntityByPhone(String phone);

  List<MemberEntity> findUuidByGovernmentId(Long governmentId);

  Optional<MemberEntity> findMemberEntityById(Long id);

  List<MemberEntity> findAllByRole(RoleEntity role);
}
