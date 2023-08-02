package com.ssafy.http.apis.members.repositories;

import com.ssafy.http.apis.members.entities.MemberEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<MemberEntity, Long> {

    List<MemberEntity> findAllByClassId(Long classId);
}
