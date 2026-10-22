package com.cureconnect.patient.model.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SlotRequest {
    private Long doctorId;
    private Long facilityId;
    private String date;
    private int sessionLength;
}