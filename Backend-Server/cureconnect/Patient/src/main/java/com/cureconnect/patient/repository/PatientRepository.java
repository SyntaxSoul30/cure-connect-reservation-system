package com.cureconnect.patient.repository;

import com.cureconnect.patient.entity.Patient;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    @Query("Select p from Patient p Join p.user u where u.email = :email")
    Optional<Patient> findByEmail(@Param("email") String email);
}