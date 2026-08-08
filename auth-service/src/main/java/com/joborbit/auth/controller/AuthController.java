package com.joborbit.auth.controller;

import com.joborbit.auth.dto.ApiResponse;
import com.joborbit.auth.dto.AuthResponse;
import com.joborbit.auth.dto.LoginRequest;
import com.joborbit.auth.dto.RegisterRequest;
import com.joborbit.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * WHY THIS CLASS EXISTS:
 * The HTTP entry point for authentication. Deliberately thin - it only:
 *  1. Accepts a validated DTO (@Valid triggers Bean Validation).
 *  2. Delegates to AuthService for all business logic.
 *  3. Wraps the result in a standard ApiResponse + correct HTTP status.
 * No business logic (password hashing, JWT creation, DB queries) lives here.
 *
 * Both endpoints below are PUBLIC (see SecurityConfig + Gateway's
 * PUBLIC_ENDPOINTS whitelist) since a user obviously can't have a token
 * before they've logged in.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Registration successful", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }
}
