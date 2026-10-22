package com.cureconnect.login.controller;

import com.cureconnect.login.model.request.LoginRequest;
import com.cureconnect.login.model.request.SignUpRequest;
import com.cureconnect.login.service.LoginService;
import com.cureconnect.login.service.SessionManagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Objects;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
public class LoginController {

    private final LoginService loginService;
    private final SessionManagementService sessionManagementService;

    @PostMapping("/register")
    public ResponseEntity<Boolean> registerUser(@RequestBody SignUpRequest request) {
        var isRegSuccess = loginService.register(request);
        return ResponseEntity.ok(isRegSuccess);
    }

    @PostMapping("/login")
    public ResponseEntity<Boolean> loginUser(@RequestBody LoginRequest request) {
        var sessionKey =  loginService.processLogin(request);
        return !Objects.equals(sessionKey, "") ? ResponseEntity.ok().header(
                HttpHeaders.SET_COOKIE, sessionManagementService.createCookie(sessionKey, 7 * 24 * 60 * 60)
        ).body(true) : ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(false);
    }

    @GetMapping("/logout")
    public ResponseEntity<Boolean> logout(@CookieValue(name = "session_key") String sessionKey) {
        var isLogoutSuccess = sessionManagementService.deleteSession(sessionKey);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, sessionManagementService.createCookie("", 0))
                .body(isLogoutSuccess);
    }

    // forgot password integration pending
}
