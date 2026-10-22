package com.cureconnect.admin.repository;

import com.cureconnect.admin.entity.DoctorAvailabilitySchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DoctorAvailabilityScheduleRepository extends JpaRepository<DoctorAvailabilitySchedule, Long> {

}