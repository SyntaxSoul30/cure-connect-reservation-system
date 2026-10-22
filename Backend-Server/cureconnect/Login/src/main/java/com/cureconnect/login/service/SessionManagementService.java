package com.cureconnect.login.service;

import com.cureconnect.login.entity.User;
import com.cureconnect.login.model.SessionData;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class SessionManagementService {
    private final RedisTemplate<String, Object> redisTemplate;
    private static final long SESSION_EXPIRY = 7 * 24 * 60 * 60; // 7 Days

    public String createSession(User user) {
        var sessionKey = UUID.randomUUID().toString();
        var sessionKeyLocator = "WE_CURE_IT_USER_" + user.getEmail();
        var data = new SessionData(user.getEmail(), user.getMobileNumber(),
                user.getFirstName() + " " + user.getLastName());
        redisTemplate.opsForValue().set(sessionKey, data, SESSION_EXPIRY, TimeUnit.SECONDS);
        redisTemplate.opsForValue().set(sessionKeyLocator, sessionKey, SESSION_EXPIRY, TimeUnit.SECONDS);
        return sessionKey;
    }

    public Object getExistingSessionKey(String userSessionKey) {
        return redisTemplate.opsForValue().get(userSessionKey);
    }

    public SessionData getSession(String sessionKey) {
        if (sessionKey == null) return null;
        return (SessionData) redisTemplate.opsForValue().get(sessionKey);
    }

    public boolean deleteSession(String sessionKey) {
        if (sessionKey != null) return redisTemplate.delete(sessionKey);
        else return false;
    }

    /**
     * SameSite=None + Secure so the session cookie is sent on credentialed XHR/fetch
     * from the SPA (e.g. http://localhost:5173) to this API on HTTPS (e.g. ngrok).
     * Lax would not attach the cookie on cross-site API calls.
     */
    public String createCookie(String key, long maxAge) {
        return ResponseCookie.from("session_key", key)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(maxAge)
                .sameSite("None")
                .build()
                .toString();
    }

}