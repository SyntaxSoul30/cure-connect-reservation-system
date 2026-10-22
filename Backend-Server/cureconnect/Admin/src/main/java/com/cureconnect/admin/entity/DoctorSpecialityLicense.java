package com.cureconnect.admin.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "doctor_speciality_licenses", schema = "cureconnect")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DoctorSpecialityLicense {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    @Column(name = "state_code", length = 2, nullable = false)
    private String stateCode;

    @Column(nullable = false)
    private String specialty;
}