package com.ssafy.http.apis.classes.request;

import com.ssafy.http.apis.classes.entities.ClassEntity;
import com.ssafy.http.apis.commoncodes.CommonCode;
import com.ssafy.http.apis.commoncodes.entities.CommonCodeEntity;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClassRegisterRequest {
  
  @NotNull
  @NotEmpty
  private String status;
  @NotNull
  @NotEmpty
  private String name;
  @NotNull
  @NotEmpty
  private int hour;
  @NotNull
  @NotEmpty
  private int minute;

  public ClassEntity toEntity(Long governmentId) {
    //등록 로직
    return ClassEntity.builder()
        .className(name)
        .commonCode(CommonCodeEntity.builder().commonCode(CommonCode.A03).build())
        .governmentId(governmentId)
        .lectureTime(toLocalTime(hour, minute))
        .build();

  }

  private LocalDateTime toLocalTime(int hour, int minute) {

    LocalTime localTime = LocalTime.of(hour, minute);
    return LocalDateTime.of(LocalDate.now(), localTime);
  }
}
