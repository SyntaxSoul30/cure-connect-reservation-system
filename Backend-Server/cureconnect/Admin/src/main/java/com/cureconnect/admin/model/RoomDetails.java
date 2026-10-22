package com.cureconnect.admin.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RoomDetails {
    private Long roomId;
    private String roomNumber;
    private String assignedSpecialty;
}