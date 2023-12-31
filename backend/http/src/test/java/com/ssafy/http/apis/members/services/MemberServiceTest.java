package com.ssafy.http.apis.members.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.BDDMockito.anyLong;
import static org.mockito.BDDMockito.given;

import com.ssafy.http.apis.members.entities.MemberEntity;
import com.ssafy.http.apis.members.repositories.MemberRepository;
import com.ssafy.http.apis.members.responses.StudentDetailResponse;
import com.ssafy.http.apis.members.responses.TeacherDetailResponse;
import com.ssafy.http.apis.roles.Role;
import com.ssafy.http.apis.roles.entities.RoleEntity;
import com.ssafy.http.exception.WrongParameterException;
import java.time.LocalDateTime;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class MemberServiceTest {

  @InjectMocks
  private MemberService memberService;

  @Mock
  private MemberRepository memberRepository;

  private MemberEntity testMemberEntity;
  private MemberEntity testTeacherEntity;
  private StudentDetailResponse testStudentDetailResponse;

  private TeacherDetailResponse testTeacherDetailResponse;

  @BeforeEach
  public void setup() {
    testMemberEntity = MemberEntity.builder()
        .id(1L)
        .governmentId(1L)
        .classId(2L)
        .role(RoleEntity.builder()
            .role(Role.STUDENT)
            .build())
        .statusCode("Active")
        .name("Test Member")
        .phone("1234567890")
        .address("Test Address")
        .faceImageUrl("TestImageUrl")
        .firstResponder("FirstResponder")
        .tabletNo(1L)
        .createdAt(LocalDateTime.now())
        .updatedAt(LocalDateTime.now())
        .gender(1)
        .build();

    testStudentDetailResponse = new StudentDetailResponse();
    testStudentDetailResponse.of(testMemberEntity);

    testTeacherEntity = MemberEntity.builder()
        .id(2L)
        .governmentId(1L)
        .classId(14L)
        .role(RoleEntity.builder()
            .role(Role.TEACHER)
            .build())
        .statusCode("C03")
        .name("test teacher")
        .phone("12312321")
        .address("test Add")
        .faceImageUrl("test")
        .tabletNo(100L)
        .createdAt(LocalDateTime.now())
        .updatedAt(LocalDateTime.now())
        .gender(1)
        .build();

    testTeacherDetailResponse = new TeacherDetailResponse();
    testTeacherDetailResponse.of(testTeacherEntity);
  }

//  @Test
//  public void setTeacherClassIdSuccessTest() {
//    given(memberRepository.save(testTeacherEntity)).wait();
//
//    List<TeacherDetailResponse> teachers = memberService.getTeachers();
//    for (TeacherDetailResponse t : teachers) {
//      System.out.println(t);
//    }
//    MemberEntity entity = memberService.setTeacherClassId(16L, 13L);
//
//    System.out.println(entity);
//
//    assertNotNull(entity);
//
//  }
//
//  @Test
//  public void setTeacherClassIdFailTest() {
//    given(memberRepository.findClassIdByRole(14L)).willReturn(Optional.of(testTeacherEntity));
//
//    Optional<MemberEntity> entity = memberService.setTeacherClassId(2L, 13L);
//
//    assertNull(entity);
//
//  }

  @Test
  public void getStudentDetailTest() {
    given(memberRepository.findById(anyLong())).willReturn(Optional.of(testMemberEntity));

    StudentDetailResponse result = memberService.getStudentDetail(1L);

    assertNotNull(result);
    assertEquals(testStudentDetailResponse, result);
  }

//  @Test
//  public void getClassStudentsTest() {
//    given(memberRepository.findAllByClassId(anyLong())).willReturn(
//        Arrays.asList(testMemberEntity));
//
//    List<StudentDetailResponse> result = memberService.getClassStudents(2L);
//
//    System.out.println(result);
//
//    assertNotNull(result);
//    assertEquals(1, result.size());
//    assertEquals(testStudentDetailResponse, result.get(0));
//  }

  @Test
  public void getStudentDetailNotFoundTest() {
    given(memberRepository.findById(anyLong())).willReturn(Optional.empty());

    assertThrows(WrongParameterException.class, () -> memberService.getStudentDetail(1L));
  }
}
