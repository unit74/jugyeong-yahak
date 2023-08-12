package com.ssafy.http.apis.diaries.repositories;

import com.ssafy.http.apis.diaries.entities.DiaryEntity;
import com.ssafy.http.apis.members.entities.MemberEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DiaryRepository extends JpaRepository<DiaryEntity, Long> {

  List<DiaryEntity> findAllByMemberEntity(MemberEntity memberEntity);
}
