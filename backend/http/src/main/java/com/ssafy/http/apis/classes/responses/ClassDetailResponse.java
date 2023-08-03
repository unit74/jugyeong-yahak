package com.ssafy.http.apis.classes.responses;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.ssafy.http.apis.classes.entities.ClassEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ClassDetailResponse {

    private long id;
    private String className;
    private LocalDateTime lectureTime;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public void of(ClassEntity classEntity) {
        this.id = classEntity.getId();
        this.className = classEntity.getClassName();
        this.lectureTime = classEntity.getLectureTime();
        this.createdAt = classEntity.getCreatedAt();
        this.updatedAt = classEntity.getUpdatedAt();
    }

}
