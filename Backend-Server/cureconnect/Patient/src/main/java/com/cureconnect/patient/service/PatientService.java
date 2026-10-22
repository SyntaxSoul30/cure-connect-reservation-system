package com.cureconnect.patient.service;

import com.cureconnect.patient.entity.*;
import com.cureconnect.patient.model.request.UpdateProfileRequest;
import com.cureconnect.patient.model.response.*;
import com.cureconnect.patient.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PatientService {
    private final SessionManagementService sessionManagementService;
    private final PatientRepository patientRepo;
    private final UserRepository userRepo;
    private final AppointmentRepository appointmentRepo;
    private final DoctorRepository doctorRepo;
    private final DoctorSpecialityLicenseRepository licenseRepo;
    private final DoctorAvailabilityRepository availabilityRepo;
    private final ModelMapper modelMapper;

    public DashboardResponse getPatientDashboard(String sessionKey) {
        var patient = getPatientFromSession(sessionKey);
        var user = patient.getUser();
        var patientProfile = new PatientProfile(
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getMobileNumber(),
                patient.getPreferredLocation(),
                patient.getCardholderName(),
                patient.getCardLastFourDigits(),
                patient.getExpirationDate()
        );
        var allAppointments = appointmentRepo.findAllByPatientId(patient.getId());
        var today = LocalDate.now();

        var upcomingVisits = allAppointments.stream()
                .filter(appointment -> "CONFIRMED".equalsIgnoreCase(appointment.getStatus())
                        && !appointment.getVisitDate().isBefore(today))
                .sorted(Comparator.comparing(Appointment::getVisitDate)
                        .thenComparing(Appointment::getScheduledStartTime))
                .map(this::mapToSummary)
                .toList();

        var visitHistory = allAppointments.stream()
                .filter(appointment -> appointment.getVisitDate().isBefore(today) ||
                        "COMPLETED".equalsIgnoreCase(appointment.getStatus()) ||
                        "CANCELLED".equalsIgnoreCase(appointment.getStatus()))
                .sorted(Comparator.comparing(Appointment::getVisitDate).reversed())
                .map(this::mapToSummary)
                .toList();

        return new DashboardResponse(
                patientProfile,
                upcomingVisits.isEmpty() ? null : upcomingVisits.getFirst(),
                upcomingVisits,
                visitHistory
        );
    }

    @Transactional
    public Boolean updateProfile(UpdateProfileRequest request, String sessionKey) {
        try {
            var patient = getPatientFromSession(sessionKey);
            var user = patient.getUser();
            modelMapper.map(request, user);
            modelMapper.map(request, patient);

            if (request.getCardNumber() != null && !request.getCardNumber().isBlank()) {
                var cardNumber = request.getCardNumber().replaceAll("\\s+", "");
                if (cardNumber.length() >= 4) {
                    patient.setCardLastFourDigits(cardNumber.substring(cardNumber.length() - 4));
                }
                patient.setCreditCardNumber(null);
                patient.setCvv(null);
            }

            userRepo.save(user);
            patientRepo.save(patient);
            return true;
        } catch (Exception ex) {
            ex.printStackTrace();
            return false;
        }
    }

    public List<AllDoctorsResponse> getAllActiveDoctors() {
        return doctorRepo.findAllActiveDoctors()
                .stream()
                .map(doctor -> {
                    List<String> specialties = licenseRepo.findAllByDoctorId(doctor.getId())
                            .stream()
                            .map(DoctorSpecialityLicense::getSpecialty)
                            .distinct()
                            .toList();
                    return new AllDoctorsResponse(
                            doctor.getId(),
                            "Dr. " + doctor.getUser().getFirstName() + " " + doctor.getUser().getLastName(),
                            doctor.getDegree(),
                            specialties,
                            doctor.getBio()
                    );
                }).toList();
    }

    public DoctorProfileResponse getDoctorProfile(Long doctorId) {
        var doctor = doctorRepo.findActiveById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found or inactive"));

        List<String> specialties = licenseRepo.findAllByDoctorId(doctorId)
                .stream()
                .map(DoctorSpecialityLicense::getSpecialty)
                .distinct()
                .toList();
        List<FacilityAvailability> locations = availabilityRepo.findActiveSchedulesByDoctor(doctorId)
                .stream()
                .map(this::mapToAvailability)
                .toList();

        return new DoctorProfileResponse(
                "Dr. " + doctor.getUser().getFirstName() + " " + doctor.getUser().getLastName(),
                doctor.getDegree(),
                doctor.getBio(),
                specialties,
                locations
        );
    }

    private FacilityAvailability mapToAvailability(DoctorAvailability schedule) {
        return new FacilityAvailability(
                schedule.getFacility().getId(),
                schedule.getFacility().getFacilityName(),
                schedule.getFacility().getAddress(),
                List.of(schedule.getDayOfCycle()),
                schedule.getStartTime() + " - " + schedule.getEndTime(),
                BigDecimal.valueOf(120)
        );
    }

    private AppointmentSummary mapToSummary(Appointment appointment) {
        var baseFee = appointment.getBaseAmount() != null ? appointment.getBaseAmount() : BigDecimal.ZERO;
        var penalty = appointment.getPenaltyFee() != null ? appointment.getPenaltyFee() : BigDecimal.ZERO;
        return new AppointmentSummary(
                appointment.getId(),
                "Dr. " + appointment.getDoctor().getUser().getFirstName() + " " + appointment.getDoctor().getUser().getLastName(),
                appointment.getRoom().getFacility().getFacilityName(),
                appointment.getVisitDate().toString(),
                appointment.getScheduledStartTime().toString(),
                appointment.getStatus(),
                baseFee,
                penalty,
                baseFee.add(penalty)
        );
    }
    private Patient getPatientFromSession(String sessionKey) {
        var session = sessionManagementService.getSession(sessionKey);
        if (session == null) throw new RuntimeException("Session Expired");
        return patientRepo.findByEmail(session.getEmail())
                .filter(patient -> patient.getUser().isActive())
                .orElseThrow(() -> new RuntimeException("Active Patient profile not found"));
    }

}
