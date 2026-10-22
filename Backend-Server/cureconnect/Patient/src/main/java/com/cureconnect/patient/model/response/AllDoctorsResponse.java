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
public class AllDoctorsResponse {
    private Long id;
    private String fullName;
    private String degree;
    private List<String> specialties;
    private String bio;
}
