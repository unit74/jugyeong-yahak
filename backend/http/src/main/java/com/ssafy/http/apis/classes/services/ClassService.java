package com.ssafy.http.apis.classes.services;

import com.ssafy.http.apis.classes.repositories.ClassRepository;
import com.ssafy.http.apis.members.entities.MemberEntity;
import com.ssafy.http.apis.members.repositories.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ClassService {

    private final ClassRepository classRepository;
    private final MemberRepository memberRepository;

    public Optional<MemberEntity> getGovernmentId(Long loginUserId) {
        return memberRepository.findById(loginUserId);
    }


    public ArrayList<Object[]> getClassList(Long governmentId) {
        return classRepository.findByGovernmentId(governmentId);
    }



}
