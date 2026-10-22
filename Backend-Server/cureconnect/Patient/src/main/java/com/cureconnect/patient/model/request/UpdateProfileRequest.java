package com.cureconnect.patient.model.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String mobileNumber;
    private String preferredLocation;
    private String cardholderName;
    private String cardNumber;
    private String expirationDate;
    private String cvv; 
    private String billingZip;
}