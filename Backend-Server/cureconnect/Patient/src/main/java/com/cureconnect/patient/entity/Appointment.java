package com.cureconnect.patient.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;

@Entity
@Table(name = "appointments", schema = "cureconnect")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private FacilityRoom room;

    @Column(name = "duration_in_min")
    private Long durationInMin;

    @Column(name = "visit_date", nullable = false)
    private LocalDate visitDate;
    @Column(name = "scheduled_start_time", nullable = false)
    private LocalTime scheduledStartTime;
    private String status;
    private BigDecimal baseAmount = BigDecimal.ZERO;
    private BigDecimal penaltyFee = BigDecimal.ZERO;
    private OffsetDateTime cancelledAt;
    private String confirmationCode;
}