package com.cureconnect.patient.repository;

import com.cureconnect.patient.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    @Query("SELECT a FROM Appointment a " +
            "WHERE a.doctor.id = :doctorId " +
            "AND a.visitDate = :date " +
            "AND a.status = 'CONFIRMED' " +
            "ORDER BY a.scheduledStartTime ASC")
    List<Appointment> findConfirmedByDoctorAndDate(
            @Param("doctorId") Long doctorId,
            @Param("date") LocalDate date
    );

    @Query("SELECT a FROM Appointment a " +
            "JOIN FETCH a.doctor d " +
            "JOIN FETCH d.user du " +
            "JOIN FETCH a.room r " +
            "JOIN FETCH r.facility f " +
            "WHERE a.patient.id = :patientId")
    List<Appointment> findAllByPatientId(@Param("patientId") Long patientId);
}
