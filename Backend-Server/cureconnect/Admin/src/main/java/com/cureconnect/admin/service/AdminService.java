package com.cureconnect.admin.service;

import com.cureconnect.admin.entity.*;
import com.cureconnect.admin.model.OnboardDoctorRequest;
import com.cureconnect.admin.model.OnboardFacilityRequest;
import com.cureconnect.admin.repository.*;
import com.cureconnect.login.entity.User;
import com.cureconnect.login.entity.UserRole;
import com.cureconnect.login.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final ModelMapper modelMapper;
    private final UserRepository userRepo;
    private final DoctorRepository doctorRepo;
    private final FacilityRepository facilityRepo;
    private final FacilityRoomRepository roomRepo;
    private final DoctorSpecialityLicenseRepository licenseRepo;
    private final DoctorAvailabilityScheduleRepository scheduleRepo;
    private final BCryptPasswordEncoder passwordEncoder;

    @Transactional
    public Boolean onboardDoctor(OnboardDoctorRequest request) {
        try {
            User user = new User();
            user.setEmail(request.getEmail());
            user.setMobileNumber(request.getMobileNumber());
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setRole(UserRole.valueOf("DOCTOR"));
            var rawPass = UUID.randomUUID().toString().substring(0, 8);
            user.setPassword(passwordEncoder.encode(rawPass));
            User savedUser = userRepo.save(user);
            Doctor doctor = new Doctor();
            doctor.setUser(savedUser);
            Doctor savedDoctor = doctorRepo.save(doctor);
            request.getLicenses().forEach(l -> {
                var license = new DoctorSpecialityLicense();
                license.setDoctor(savedDoctor);
                license.setStateCode(l.getStateCode());
                license.setSpecialty(l.getSpecialty());
                licenseRepo.save(license);
            });

            var start = LocalTime.parse(request.getPreferredStartTime());
            var end = LocalTime.parse(request.getPreferredEndTime());
            for (int day = 1; day <= 14; day++) {
                var schedule = new DoctorAvailabilitySchedule();
                schedule.setDoctor(savedDoctor);
                schedule.setDayOfCycle(day);
                schedule.setStartTime(start);
                schedule.setEndTime(end);
                scheduleRepo.save(schedule);
            }

            System.out.println("Onboarded Dr. " + request.getLastName() + " | Temp Pass: " + rawPass);
            return true;
        } catch (Exception ex) {
            ex.printStackTrace();
            return false;
        }
    }

    @Transactional
    public Boolean updateDoctorDetails(Long id, OnboardDoctorRequest request) {
        try {
            var doctor = doctorRepo.findById(id).orElseThrow(() -> new RuntimeException("Doctor not found"));
            modelMapper.map(request, doctor.getUser());
            modelMapper.map(request, doctor);

            if (request.getLicenses() != null) {
                licenseRepo.deleteByDoctorId(id);
                request.getLicenses().forEach(l -> {
                    var license = new DoctorSpecialityLicense();
                    license.setDoctor(doctor);
                    license.setStateCode(l.getStateCode());
                    license.setSpecialty(l.getSpecialty());
                    licenseRepo.save(license);
                });
            }

            userRepo.save(doctor.getUser());
            doctorRepo.save(doctor);
            return true;
        } catch (Exception ex) {
            ex.printStackTrace();
            return false;
        }
    }

    @Transactional
    public Boolean deleteDoctor(Long id) {
        try {
            var doctor = doctorRepo.findById(id).orElseThrow(() -> new RuntimeException("Doctor not found"));
            userRepo.deleteById(doctor.getUser().getId());
            return true;
        } catch (Exception ex) {
            ex.printStackTrace();
            return false;
        }
    }

    public List<Doctor> getAllDoctors() {
        return doctorRepo.findAll();
    }

    public Doctor getDoctorDetails(Long id) {
        return doctorRepo.findById(id).orElseThrow(() -> new RuntimeException("Doctor not found"));
    }

    @Transactional
    public Boolean onboardFacility(OnboardFacilityRequest request) {
        try {
            Facility facility = new Facility();
            facility.setFacilityName(request.getFacilityName());
            facility.setAddress(request.getAddress());
            facility.setState(request.getState());
            facility.setOpenTime(LocalTime.parse(request.getOpenTime()));
            facility.setCloseTime(LocalTime.parse(request.getCloseTime()));
            Facility savedFacility = facilityRepo.save(facility);

            for (int i = 1; i <= request.getRoomCount(); i++) {
                var room = new FacilityRoom();
                room.setFacility(savedFacility);
                room.setRoomNumber("RM-" + (100 + i));
                String specialty = request.getSupportedSpecialties().get(i % request.getSupportedSpecialties().size());
                room.setAssignedSpecialty(specialty);
                roomRepo.save(room);
            }

            return true;
        } catch (Exception ex) {
            ex.printStackTrace();
            return false;
        }
    }

    @Transactional
    public Boolean updateFacilityDetails(Long id, OnboardFacilityRequest request) {
        try {
            var facility = facilityRepo.findById(id).orElseThrow(() -> new RuntimeException("Facility not found"));
            modelMapper.map(request, facility);
            facilityRepo.save(facility);

            if (request.getRooms() != null && !request.getRooms().isEmpty()) {
                for (var roomReq : request.getRooms()) {
                    if (roomReq.getRoomId() != null) {
                        var existingRoom = roomRepo.findById(roomReq.getRoomId())
                                .orElseThrow(() -> new RuntimeException("Room not found"));
                        existingRoom.setRoomNumber(roomReq.getRoomNumber());
                        existingRoom.setAssignedSpecialty(roomReq.getAssignedSpecialty());
                        roomRepo.save(existingRoom);
                    } else {
                        var newRoom = new FacilityRoom();
                        newRoom.setFacility(facility);
                        newRoom.setRoomNumber(roomReq.getRoomNumber());
                        newRoom.setAssignedSpecialty(roomReq.getAssignedSpecialty());
                        roomRepo.save(newRoom);
                    }
                }
            }

            return true;
        } catch (Exception ex) {
            ex.printStackTrace();
            return false;
        }
    }

    @Transactional
    public Boolean deleteFacility(Long id) {
        try {
            facilityRepo.deleteById(id);
            return true;
        } catch (Exception ex) {
            ex.printStackTrace();
            return false;
        }
    }

    @Transactional
    public Boolean deleteFacilityRoomById(Long id) {
        try {
            facilityRepo.deleteById(id);
            return true;
        } catch (Exception ex) {
            ex.printStackTrace();
            return false;
        }
    }

    public List<Facility> getAllFacilities() {
        try {
            return facilityRepo.findAll();
        } catch (Exception ex) {
            ex.printStackTrace();
            return List.of(new Facility());
        }
    }

    public Facility getFacilityDetails(Long id) {
        return facilityRepo.findById(id).orElseThrow(() -> new RuntimeException("Facility not found"));
    }

}