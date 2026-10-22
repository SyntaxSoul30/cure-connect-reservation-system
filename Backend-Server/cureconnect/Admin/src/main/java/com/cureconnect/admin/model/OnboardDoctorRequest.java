package com.cureconnect.admin.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OnboardDoctorRequest {
    private String email;
    private String mobileNumber;
    private String firstName;
    private String lastName;
    private String preferredStartTime;
    private String preferredEndTime;
    private List<DoctorLicenseInfo> licenses;
}