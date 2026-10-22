package com.cureconnect.patient;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import java.util.HashMap;

@SpringBootApplication
@EntityScan(basePackages = {"com.cureconnect.patient.entity"})
@EnableJpaRepositories(basePackages = {"com.cureconnect.patient.repository"})
public class PatientApplication {

	public static void main(String[] args) {
		SpringApplication.run(PatientApplication.class, args);
	}

}
