package com.cureconnect.patient.model.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PatientProfile {
    private String firstName;
    private String lastName;
    private String email;
    private String mobileNumber;
    private String preferredLocation;
    private String cardholderName;
    private String cardLastFourDigits;
    private String expirationDate;
}