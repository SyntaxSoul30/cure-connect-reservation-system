package com.cureconnect.admin.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
        name = "doctor_facility_authorization",
        schema = "cureconnect",
        uniqueConstraints = @UniqueConstraint(columnNames = {"doctor_id", "facility_id", "authorized_specialty"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DoctorFacilityAuthorization {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @ManyToOne
    @JoinColumn(name = "facility_id", nullable = false)
    private Facility facility;

    @Column(name = "authorized_specialty")
    private String authorizedSpecialty;
}