package com.cureconnect.admin.repository;

import com.cureconnect.admin.entity.FacilityRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FacilityRoomRepository extends JpaRepository<FacilityRoom, Long> {

}