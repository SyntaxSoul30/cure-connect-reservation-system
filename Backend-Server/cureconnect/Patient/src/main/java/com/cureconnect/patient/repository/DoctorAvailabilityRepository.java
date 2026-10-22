package com.cureconnect.patient.repository;

import com.cureconnect.patient.entity.DoctorAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorAvailabilityRepository extends JpaRepository<DoctorAvailability, Long> {
    @Query("SELECT das FROM DoctorAvailability das " +
            "JOIN FETCH das.facility f " +
            "WHERE das.doctor.id = :doctorId " +
            "AND f.isActive = true " +
            "ORDER BY f.facilityName ASC, das.startTime ASC")
    List<DoctorAvailability> findActiveSchedulesByDoctor(@Param("doctorId") Long doctorId);

    @Query("SELECT das FROM DoctorAvailability das " +
            "JOIN FETCH das.doctor d " +
            "JOIN FETCH d.user du " +
            "JOIN FETCH das.facility f " +
            "JOIN FETCH das.room r " +
            "WHERE d.id = :doctorId " +
            "AND f.id = :facilityId " +
            "AND du.isActive = true " +
            "AND f.isActive = true " +
            "AND r.isActive = true")
    Optional<DoctorAvailability> findBookingAuthority(
            @Param("doctorId") Long doctorId,
            @Param("facilityId") Long facilityId
    );
}
