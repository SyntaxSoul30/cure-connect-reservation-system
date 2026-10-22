package com.cureconnect.patient.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SessionData {
    String email;
    String mobile;
    String fullName;
    String role;
    String id; // 'patient then patientId' or 'doctor then doctorId'
    // additional elements to be kept here as per logic update
}