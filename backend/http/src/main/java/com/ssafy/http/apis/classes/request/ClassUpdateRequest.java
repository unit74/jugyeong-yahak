package com.ssafy.http.apis.classes.request;

import com.ssafy.http.apis.classes.entities.ClassEntity;
import com.ssafy.http.apis.commoncodes.CommonCode;
import com.ssafy.http.apis.commoncodes.entities.CommonCodeEntity;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClassUpdateRequest {

  @NotNull
  private Long id;

  @NotNull
  @NotEmpty
  private String status;

  @NotNull
  @NotEmpty
  private String name;

  @Max(value = 23, message = "시의 범위는 0~23 입니다.")
  @Min(value = 0, message = "시의 범위는 0~23 입니다.")
  private int hour;

  @Max(value = 59, message = "분의 범위는 0~59 입니다.")
  @Min(value = 0, message = "분의 범위는 0~59 입니다.")
  private int minute;

  public ClassEntity toEntity(Long governmentId) {
    return ClassEntity.builder()
        .id(id)
        .className(name)
        .commonCode(CommonCodeEntity.builder().commonCode(CommonCode.valueOf(status)).build())
        .governmentId(governmentId)
        .lectureTime(toLocalTime(hour, minute))
        .build();
  }

  public LocalDateTime toLocalTime(int hour, int minute) {

    LocalTime localTime = LocalTime.of(hour, minute);
    return LocalDateTime.of(LocalDate.now(), localTime);
  }
}
