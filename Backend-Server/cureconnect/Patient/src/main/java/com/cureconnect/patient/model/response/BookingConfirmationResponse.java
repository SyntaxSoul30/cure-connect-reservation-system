package com.cureconnect.patient.model.response;

import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookingConfirmationResponse {
    private String confirmationCode;
    private String doctorName;
    private String dateTime;
    private String location;
    private BigDecimal fee;
    private String cardLastFour;
}