package com.ssafy.http.apis.governments.entities;

import java.time.LocalDateTime;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;

@Data
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity(name = "governments")
public class GovernmentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String identification;
    private String password;
    private String name;
    private String phone;
    private String address;
    private String email;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Builder
    public GovernmentEntity(Long id, String identification, String password, String name,
        String phone,
        String address, String email, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.identification = identification;
        this.password = password;
        this.name = name;
        this.phone = phone;
        this.address = address;
        this.email = email;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public void encodePassword(PasswordEncoder passwordEncoder) {
        password = passwordEncoder.encode(password);
    }

    @PrePersist
    public void createTimeStamps() {
        updatedAt = LocalDateTime.now();
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    public void updateTimeStamps() {
        updatedAt = LocalDateTime.now();
    }
}
