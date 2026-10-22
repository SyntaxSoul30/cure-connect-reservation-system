package com.cureconnect.patient.model.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DoctorProfileResponse{
    private String fullName;
    private String degree;
    private String bio;
    private List<String> specialties;
    private List<FacilityAvailability> availableLocations;
}