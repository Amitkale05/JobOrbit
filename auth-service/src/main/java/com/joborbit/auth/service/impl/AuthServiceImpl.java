package com.joborbit.auth.service.impl;

import com.joborbit.auth.dto.AuthResponse;
import com.joborbit.auth.dto.LoginRequest;
import com.joborbit.auth.dto.RegisterRequest;
import com.joborbit.auth.entity.Role;
import com.joborbit.auth.entity.User;
import com.joborbit.auth.exception.DuplicateResourceException;
import com.joborbit.auth.exception.InvalidCredentialsException;
import com.joborbit.auth.exception.ResourceNotFoundException;
import com.joborbit.auth.repository.RoleRepository;
import com.joborbit.auth.repository.UserRepository;
import com.joborbit.auth.service.AuthService;
import com.joborbit.auth.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * WHY THIS CLASS EXISTS:
 * Holds ALL business logic for registration/login. Controllers stay thin -
 * they only translate HTTP <-> DTOs and delegate here. Nothing about
 * HTTP (ResponseEntity, status codes) leaks into this class; that keeps the
 * business logic reusable and independently testable.
 *
 * HOW IT WORKS:
 * - register(): checks email uniqueness, looks up the requested Role,
 *   hashes the password with BCrypt, persists the User, then issues a JWT.
 * - login(): looks up the user by email, verifies the raw password against
 *   the stored BCrypt hash, then issues a JWT on success.
 *
 * HOW IT CONNECTS TO OTHER LAYERS:
 * controller -> [this service] -> repository -> database
 * Uses JwtUtil (util layer) to mint tokens and PasswordEncoder (Spring
 * Security) for hashing/verification.
 */
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("An account with this email already exists");
        }

        Role role = roleRepository.findByName(request.getRole())
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + request.getRole()));

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .build();

        User saved = userRepository.save(user);
        String token = jwtUtil.generateToken(saved);

        return buildResponse(saved, token);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        if (!user.isEnabled()) {
            throw new InvalidCredentialsException("This account has been disabled");
        }

        String token = jwtUtil.generateToken(user);
        return buildResponse(user, token);
    }

    private AuthResponse buildResponse(User user, String token) {
        return AuthResponse.builder()
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole().getName().name())
                .token(token)
                .tokenType("Bearer")
                .build();
    }
}
