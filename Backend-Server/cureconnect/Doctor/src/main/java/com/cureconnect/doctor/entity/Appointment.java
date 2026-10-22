package com.cureconnect.doctor.entity;

import jakarta.persistence.*;
import lombok.*;

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

    @Column(name = "visit_date", nullable = false)
    private LocalDate visitDate;

    @Column(name = "scheduled_start_time", nullable = false)
    private LocalTime scheduledStartTime;

    @Column(name = "scheduled_end_time", nullable = false)
    private LocalTime scheduledEndTime;

    private OffsetDateTime actualStartTime;
    private OffsetDateTime actualEndTime;

    private String status = "CONFIRMED";
    private BigDecimal baseAmount = BigDecimal.ZERO;
    private BigDecimal penaltyFee = BigDecimal.ZERO;
    private BigDecimal overageFee = BigDecimal.ZERO;
    private OffsetDateTime cancelledAt;
}