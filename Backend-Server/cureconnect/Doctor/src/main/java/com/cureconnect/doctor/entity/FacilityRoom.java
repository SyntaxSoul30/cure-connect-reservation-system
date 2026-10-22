package com.cureconnect.doctor.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "facility_rooms", schema = "cureconnect")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FacilityRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "facility_id")
    private Facility facility;

    @Column(name = "room_number", nullable = false)
    private String roomNumber;

    @Column(name = "assigned_specialty")
    private String assignedSpecialty = "General Medicine";
}