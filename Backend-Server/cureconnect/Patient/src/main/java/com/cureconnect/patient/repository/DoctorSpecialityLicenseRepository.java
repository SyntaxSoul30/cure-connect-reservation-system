package com.cureconnect.patient.repository;

import com.cureconnect.patient.entity.DoctorSpecialityLicense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorSpecialityLicenseRepository extends JpaRepository<DoctorSpecialityLicense, Long> {
    List<DoctorSpecialityLicense> findAllByDoctorId(Long doctorId);
}