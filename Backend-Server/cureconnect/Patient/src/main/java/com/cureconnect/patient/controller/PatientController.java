package com.cureconnect.patient.controller;

import com.cureconnect.patient.model.request.BookingRequest;
import com.cureconnect.patient.model.request.CancelAppointmentRequest;
import com.cureconnect.patient.model.request.SlotRequest;
import com.cureconnect.patient.model.request.UpdateProfileRequest;
import com.cureconnect.patient.model.response.*;
import com.cureconnect.patient.service.AppointmentService;
import com.cureconnect.patient.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("api/v1/patient")
@RequiredArgsConstructor
public class PatientController {
    private final PatientService patientService;
    private final AppointmentService appointmentService;

    @GetMapping("/getDashboard")
    public ResponseEntity<DashboardResponse> getDashboard(@CookieValue(name = "session_key") String sessionKey) {
        return ResponseEntity.ok(patientService.getPatientDashboard(sessionKey));
    }

    @GetMapping("/getAllDoctors")
    public ResponseEntity<List<AllDoctorsResponse>> getAllDoctors() {
        return ResponseEntity.ok(patientService.getAllActiveDoctors());
    }

    @PostMapping("/updateProfile")
    public ResponseEntity<Boolean> updateProfile(
            @RequestBody UpdateProfileRequest request,
            @CookieValue(name = "session_key") String sessionKey) {
        return ResponseEntity.ok(patientService.updateProfile(request, sessionKey));
    }

    @GetMapping("/getDoctorDetails/{id}")
    public ResponseEntity<DoctorProfileResponse> getDoctorDetails(@PathVariable Long id) {
        return ResponseEntity.ok(patientService.getDoctorProfile(id));
    }

    @PostMapping("/getAvailableSlots")
    public ResponseEntity<AvailableSlotsResponse> getAvailableSlots(@RequestBody SlotRequest request) {
        return ResponseEntity.ok(appointmentService.calculateAvailableSlots(request));
    }

    @PostMapping("/confirmBooking")
    public ResponseEntity<BookingConfirmationResponse> confirmBooking(
            @RequestBody BookingRequest request,
            @CookieValue(name = "session_key") String sessionKey) {
        return ResponseEntity.ok(appointmentService.bookAppointment(request, sessionKey));
    }

    @GetMapping("/cancelAppointment")
    public ResponseEntity<Boolean> cancelAppointment(
            @RequestBody CancelAppointmentRequest request) {
        return ResponseEntity.ok(appointmentService.cancelAppointment(request));
    }

}