package com.cureconnect.login.service;

import com.cureconnect.login.entity.Patient;
import com.cureconnect.login.entity.User;
import com.cureconnect.login.model.request.LoginRequest;
import com.cureconnect.login.model.request.SignUpRequest;
import com.cureconnect.login.repository.PatientRepository;
import com.cureconnect.login.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LoginService {
    private final BCryptPasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final SessionManagementService sessionManagementService;

    @Transactional
    public Boolean register(SignUpRequest request) {
        try {
            var user = new User();
            user.setEmail(request.getEmail());
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setMobileNumber(request.getMobileNumber());
            user.setRole("PATIENT");
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            var savedUser = userRepository.save(user);
            var patient = new Patient();
            patient.setUser(savedUser);
            patient.setPreferredLocation(request.getPreferredLocation());
            if (request.getCreditCardNumber() != null && !request.getCreditCardNumber().isBlank()) {
                mapPatientCCDetails(request, patient);
            }
            patientRepository.save(patient);
            return true;
        } catch (Exception ex) {
            ex.printStackTrace();
            return false;
        }
    }

    public void mapPatientCCDetails(SignUpRequest request, Patient patient) {
        var ccNumber = request.getCreditCardNumber();
        patient.setCardholderName(request.getCardholderName());
        patient.setCardLastFourDigits(ccNumber.substring(ccNumber.length() - 4));
        patient.setCreditCardNumber(passwordEncoder.encode(ccNumber));
        patient.setExpirationDate(request.getExpirationDate());
        patient.setBillingZip(request.getBillingZip());
        patient.setCvv(passwordEncoder.encode(request.getCvv()));
    }

    public String processLogin(LoginRequest request) {
        try {
            var user = userRepository.findByEmail(request.getEmail()).orElse(null);
            if ((user == null) || (!passwordEncoder.matches(request.getPassword(), user.getPassword()))) {
                return "";
            }
            var existingSessionKeyIfExists = "WE_CURE_IT_USER_" + user.getEmail();
            var checkExistingSessionKey = sessionManagementService.getExistingSessionKey(existingSessionKeyIfExists);
            if (checkExistingSessionKey != null) {
                return checkExistingSessionKey.toString();
            } else return sessionManagementService.createSession(user);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return "";
    }

}