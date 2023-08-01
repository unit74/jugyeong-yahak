package com.ssafy.http.apis.members.services;

import com.ssafy.http.apis.members.repositories.MemberRepository;
import com.ssafy.http.apis.members.responses.StudentDetailResponse;
import com.ssafy.http.exception.WrongParameterException;
import com.ssafy.http.support.codes.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;

    public StudentDetailResponse getStudentDetail(Long id) {
        StudentDetailResponse studentDetailResponse = new StudentDetailResponse();

        studentDetailResponse.of(memberRepository.findById(id)
                                                 .orElseThrow(
                                                     () -> new WrongParameterException(
                                                         ErrorCode.BAD_REQUEST_ERROR)));

        return studentDetailResponse;
    }
}
