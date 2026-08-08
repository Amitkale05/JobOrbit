package com.joborbit.auth.service;

import com.joborbit.auth.dto.AuthResponse;
import com.joborbit.auth.dto.LoginRequest;
import com.joborbit.auth.dto.RegisterRequest;

/**
 * WHY: Defines the CONTRACT for authentication business logic, independent of
 * how it's implemented. Controllers depend on this interface (not the impl),
 * which follows the Dependency Inversion Principle (the "D" in SOLID) and
 * makes the implementation swappable/mockable in unit tests.
 */
public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
