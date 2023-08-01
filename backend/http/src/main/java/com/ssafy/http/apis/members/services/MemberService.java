package com.ssafy.http.apis.members.services;

import com.ssafy.http.apis.members.entities.MemberEntity;
import com.ssafy.http.apis.members.repositories.MemberRepository;
import com.ssafy.http.apis.members.responses.StudentDetailResponse;
import com.ssafy.http.exception.WrongParameterException;
import com.ssafy.http.support.codes.ErrorCode;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;

    public StudentDetailResponse getStudentDetail(Long studentId) {
        StudentDetailResponse studentDetailResponse = new StudentDetailResponse();

        studentDetailResponse.of(memberRepository.findById(studentId)
                                                 .orElseThrow(
                                                     () -> new WrongParameterException(
                                                         ErrorCode.BAD_REQUEST_ERROR)));

        return studentDetailResponse;
    }

    public List<StudentDetailResponse> getClassStudents(Long classId) {
        List<StudentDetailResponse> studentDetailResponses = new ArrayList<>();

        List<MemberEntity> students = memberRepository.findAllByClassId(classId);
        
        for (MemberEntity student : students) {
            StudentDetailResponse studentDetailResponse = new StudentDetailResponse();

            studentDetailResponse.of(student);

            studentDetailResponses.add(studentDetailResponse);
        }

        return studentDetailResponses;
    }
}
