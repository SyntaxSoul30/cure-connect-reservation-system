package com.cureconnect.login.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SessionData {
    String email;
    String mobile;
    String fullName;
    // additional elements to be kept here as per requirement update
}