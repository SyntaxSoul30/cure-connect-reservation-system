package com.cureconnect.doctor.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "users", schema = "cureconnect")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(name = "mobile_number", unique = true, nullable = false)
    private String mobileNumber;

    @Column(nullable = false)
    private String password;

    private String role = "PATIENT";

    @Column(name = "created_at")
    private OffsetDateTime createdAt = OffsetDateTime.now();
}