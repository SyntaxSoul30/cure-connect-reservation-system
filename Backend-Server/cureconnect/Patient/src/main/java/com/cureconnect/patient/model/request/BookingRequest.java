package com.cureconnect.patient.model.request;

import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequest {
    private Long doctorId;
    private Long facilityId;
    private String visitDate;
    private String startTime;
    private Long duration;
}