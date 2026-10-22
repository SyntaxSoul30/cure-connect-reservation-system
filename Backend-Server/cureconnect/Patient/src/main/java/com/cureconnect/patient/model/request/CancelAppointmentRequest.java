package com.cureconnect.patient.model.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CancelAppointmentRequest {
    private Long appointmentId;
    private Boolean isPenaltyRequired;
}