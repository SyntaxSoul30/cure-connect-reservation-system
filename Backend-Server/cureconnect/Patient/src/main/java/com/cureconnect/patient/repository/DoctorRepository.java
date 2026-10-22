package com.cureconnect.patient.repository;

import com.cureconnect.patient.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    @Query("SELECT d FROM Doctor d JOIN FETCH d.user u WHERE u.isActive = true")
    List<Doctor> findAllActiveDoctors();

    @Query("SELECT d FROM Doctor d " +
            "JOIN FETCH d.user u " +
            "WHERE d.id = :id AND u.isActive = true")
    Optional<Doctor> findActiveById(@Param("id") Long id);
}