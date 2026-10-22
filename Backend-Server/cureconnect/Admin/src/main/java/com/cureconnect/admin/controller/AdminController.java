package com.cureconnect.admin.controller;

import com.cureconnect.admin.entity.Doctor;
import com.cureconnect.admin.entity.Facility;
import com.cureconnect.admin.model.OnboardDoctorRequest;
import com.cureconnect.admin.model.OnboardFacilityRequest;
import com.cureconnect.admin.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("api/v1/admin")
@RequiredArgsConstructor
public class AdminController {
    private final AdminService adminService;

    @PostMapping("/onboardDoctor")
    public ResponseEntity<Boolean> onboardDoctor(@RequestBody OnboardDoctorRequest request) {
        return ResponseEntity.ok(adminService.onboardDoctor(request));
    }

    @GetMapping("/getAllDoctors")
    public ResponseEntity<List<Doctor>> allDoctors() {
        return ResponseEntity.ok(adminService.getAllDoctors());
    }

    @GetMapping("/getDoctor/{id}")
    public ResponseEntity<Doctor> getDoctor(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getDoctorDetails(id));
    }

    @PostMapping("/updateDoctor/{id}")
    public ResponseEntity<Boolean> updateDoctor(@PathVariable Long id, @RequestBody OnboardDoctorRequest request) {
        return ResponseEntity.ok(adminService.updateDoctorDetails(id, request));
    }

    @GetMapping("/deleteDoctor/{id}")
    public ResponseEntity<Boolean> deleteDoctor(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.deleteDoctor(id));
    }

    @PostMapping("/onboardFacility")
    public ResponseEntity<Boolean> onboardFacility(@RequestBody OnboardFacilityRequest request) {
        return ResponseEntity.ok(adminService.onboardFacility(request));
    }

    @GetMapping("/getAllFacilities")
    public ResponseEntity<List<Facility>> allFacilities() {
        return ResponseEntity.ok(adminService.getAllFacilities());
    }

    @GetMapping("/getFacility/{id}")
    public ResponseEntity<Facility> getFacility(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getFacilityDetails(id));
    }

    @PostMapping("/updateFacility/{id}")
    public ResponseEntity<Boolean> updateFacility(@PathVariable Long id, @RequestBody OnboardFacilityRequest request) {
        return ResponseEntity.ok(adminService.updateFacilityDetails(id, request));
    }

    @GetMapping("/deleteFacility/{id}")
    public ResponseEntity<Boolean> deleteFacility(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.deleteFacility(id));
    }
    @GetMapping("/deleteRoom/{roomId}")
    public ResponseEntity<Boolean> deleteFacilityRoom(@PathVariable("roomId") Long roomId) {
        return ResponseEntity.ok(adminService.deleteFacilityRoomById(roomId));
    }

}