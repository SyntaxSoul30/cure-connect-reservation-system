package com.cureconnect.doctor.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "patients", schema = "cureconnect")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private String preferredLocation;
    private String cardholderName;
    private String creditCardNumber;
    @Column(name = "card_last_four", length = 4)
    private String cardLastFourDigits;
    private String expirationDate;
    private String cvv;
    private String billingZip;
}
