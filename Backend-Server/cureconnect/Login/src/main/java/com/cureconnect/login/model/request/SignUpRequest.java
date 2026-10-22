package com.cureconnect.login.model.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SignUpRequest {
    private String firstName;
    private String lastName;
    private String mobileNumber;
    private String email;
    private String password;
    private String preferredLocation;
    private String creditCardNumber;
    private String cardholderName;
    private String expirationDate;
    private String billingZip;
    private String cvv;
}