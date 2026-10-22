package com.cureconnect.admin;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan(basePackages = {"com.cureconnect.admin.entity", "com.cureconnect.login.entity"})
@EnableJpaRepositories(basePackages = {"com.cureconnect.admin.repository", "com.cureconnect.login.repository"})
public class AdminApplication {

	public static void main(String[] args) {
		SpringApplication.run(AdminApplication.class, args);
	}

}
