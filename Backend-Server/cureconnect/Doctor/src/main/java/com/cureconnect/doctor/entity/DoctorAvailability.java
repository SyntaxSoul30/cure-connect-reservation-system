package com.cureconnect.doctor.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalTime;

@Entity
@Table(name = "doctor_availability_schedule", schema = "cureconnect")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DoctorAvailability {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    @ManyToOne
    @JoinColumn(name = "facility_id")
    private Facility facility;

    @Column(name = "day_of_cycle")
    private Integer dayOfCycle;

    private LocalTime startTime;
    private LocalTime endTime;
}