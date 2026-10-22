package com.cureconnect.patient.service;

import com.cureconnect.patient.entity.Appointment;
import com.cureconnect.patient.model.request.BookingRequest;
import com.cureconnect.patient.model.request.CancelAppointmentRequest;
import com.cureconnect.patient.model.request.SlotRequest;
import com.cureconnect.patient.model.response.AvailableSlotsResponse;
import com.cureconnect.patient.model.response.BookingConfirmationResponse;
import com.cureconnect.patient.repository.AppointmentRepository;
import com.cureconnect.patient.repository.DoctorAvailabilityRepository;
import com.cureconnect.patient.repository.PatientRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AppointmentService {
    private final DoctorAvailabilityRepository availabilityRepo;
    private final AppointmentRepository appointmentRepo;
    private final PatientRepository patientRepo;
    private final SessionManagementService sessionManagementService;

    public AvailableSlotsResponse calculateAvailableSlots(SlotRequest request) {
        var visitDate = LocalDate.parse(request.getDate());
        int dayOfWeek = visitDate.getDayOfWeek().getValue();

        var schedule = availabilityRepo.findActiveSchedulesByDoctor(request.getDoctorId())
                .stream()
                .filter(s -> s.getDayOfCycle() == dayOfWeek &&
                        s.getFacility().getId().equals(request.getFacilityId()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No schedule found for this day."));

        var existingBookings = appointmentRepo.findConfirmedByDoctorAndDate(request.getDoctorId(), visitDate);
        List<String> availableSlots = new ArrayList<>();
        var shiftStartTime = schedule.getStartTime();
        var shiftEnd = schedule.getEndTime();
        var noteTakingTime = 5;

        while (
                shiftStartTime.plusMinutes(request.getSessionLength()).isBefore(shiftEnd) ||
                shiftStartTime.plusMinutes(request.getSessionLength()).equals(shiftEnd)
        ) {

            var requestedSlotEnd = shiftStartTime.plusMinutes(request.getSessionLength());
            var conflict = findConflictingAppointment(shiftStartTime, requestedSlotEnd, existingBookings);
            var isPastTime = visitDate.equals(LocalDate.now()) && shiftStartTime.isBefore(LocalTime.now());

            if (conflict.isEmpty() && !isPastTime) {
                availableSlots.add(shiftStartTime.toString());
                shiftStartTime = requestedSlotEnd.plusMinutes(noteTakingTime);
            } else if (conflict.isPresent()) {
                Appointment appointment = conflict.get();
                shiftStartTime = appointment.getScheduledStartTime()
                        .plusMinutes(appointment.getDurationInMin())
                        .plusMinutes(noteTakingTime);
            } else {
                shiftStartTime = shiftStartTime.plusMinutes(5);
            }
        }

        return new AvailableSlotsResponse(availableSlots, BigDecimal.valueOf(120));
    }

    private Optional<Appointment> findConflictingAppointment(LocalTime start, LocalTime end, List<Appointment> bookings) {
        return bookings.stream().filter(appointment -> {
            var existingSlotEnd = appointment.getScheduledStartTime().plusMinutes(appointment.getDurationInMin());
            return start.isBefore(existingSlotEnd) && end.isAfter(appointment.getScheduledStartTime());
        }).findFirst();
    }

    @Transactional
    public BookingConfirmationResponse bookAppointment(BookingRequest request, String sessionKey) {
        var session = sessionManagementService.getSession(sessionKey);
        var patient = patientRepo.findByEmail(session.getEmail())
                .orElseThrow(() -> new RuntimeException("Patient profile not found"));
        var bookingAuthority = availabilityRepo.findBookingAuthority(request.getDoctorId(), request.getFacilityId())
                .orElseThrow(() -> new RuntimeException("This doctor is not authorized for this location."));

        var doctor = bookingAuthority.getDoctor();
        var facility = bookingAuthority.getFacility();
        var room = bookingAuthority.getRoom();
        var visitDate = LocalDate.parse(request.getVisitDate());
        var startTime = LocalTime.parse(request.getStartTime());
        var consultationCharge = BigDecimal.valueOf(120);

        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setRoom(room);
        appointment.setVisitDate(visitDate);
        appointment.setScheduledStartTime(startTime);
        appointment.setDurationInMin(request.getDuration());
        appointment.setBaseAmount(consultationCharge);
        appointment.setStatus("CONFIRMED");
        var confirmationCode = RandomStringUtils.randomAlphanumeric(10).toUpperCase();
        appointment.setConfirmationCode(confirmationCode);
        appointmentRepo.save(appointment);

        return new BookingConfirmationResponse(
                confirmationCode,
                "Dr. " + doctor.getUser().getFirstName() + " " + doctor.getUser().getLastName(),
                request.getVisitDate() + " at " + request.getStartTime(),
                facility.getFacilityName() + " - " + room.getRoomNumber(),
                consultationCharge,
                patient.getCardLastFourDigits()
        );
    }

    @Transactional
    public Boolean cancelAppointment(CancelAppointmentRequest request) {
        var appointment = appointmentRepo.findById(request.getAppointmentId())
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        if (request.getIsPenaltyRequired()) {
            BigDecimal penalty = appointment.getBaseAmount().add(BigDecimal.valueOf(50));
            appointment.setPenaltyFee(penalty);
        }
        appointment.setStatus("CANCELLED");
        appointmentRepo.save(appointment);
        return true;
    }

}