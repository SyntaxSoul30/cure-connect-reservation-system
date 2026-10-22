package com.cureconnect.patient.model.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FacilityAvailability {
    private Long facilityId;
    private String facilityName;
    private String address;
    private List<Integer> daysOfCycle;
    private String hours;
    private BigDecimal consultationFee;
}