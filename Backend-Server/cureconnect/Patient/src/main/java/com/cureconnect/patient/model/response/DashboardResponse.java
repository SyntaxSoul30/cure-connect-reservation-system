package com.cureconnect.patient.model.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DashboardResponse {
    PatientProfile profile;
    AppointmentSummary nextAppointment;
    List<AppointmentSummary> upcomingVisits;
    List<AppointmentSummary> visitHistory;
}