package com.cureconnect.patient.model.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AppointmentSummary {
    private Long id;
    private String doctorName;
    private String facilityName;
    private String date;
    private String time;
    private String status;
    private BigDecimal baseAmount;
    private  BigDecimal penaltyFee;
    private BigDecimal totalAmount;
}