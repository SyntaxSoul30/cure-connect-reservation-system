package com.cureconnect.admin.repository;

import com.cureconnect.admin.entity.DoctorSpecialityLicense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DoctorSpecialityLicenseRepository extends JpaRepository<DoctorSpecialityLicense, Long> {
    void deleteByDoctorId(Long doctorId);

}
