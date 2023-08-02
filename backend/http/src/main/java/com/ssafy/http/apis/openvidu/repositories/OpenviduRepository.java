package com.ssafy.http.apis.openvidu.repositories;

import com.ssafy.http.apis.members.entities.MemberEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface OpenviduRepository extends JpaRepository<MemberEntity, Long> {

    @Query("select w.classId from members w where w.id = ?1 ")
    Optional<Long> findByMyId(long loginUserId);

}
