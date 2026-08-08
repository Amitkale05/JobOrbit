package com.joborbit.auth.controller;

import com.joborbit.auth.dto.ApiResponse;
import com.joborbit.auth.dto.StatusUpdateDto;
import com.joborbit.auth.dto.UserSummaryDto;
import com.joborbit.auth.entity.User;
import com.joborbit.auth.exception.ResourceNotFoundException;
import com.joborbit.auth.repository.UserRepository;
import com.joborbit.auth.security.CurrentUser;
import com.joborbit.auth.security.CurrentUserResolver;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * WHY THIS CLASS EXISTS:
 * Gives the ADMIN role platform-wide visibility over accounts (job seekers
 * and recruiters) - list everyone, and enable/disable an account. Kept as a
 * thin controller: identity/role check via CurrentUserResolver, everything
 * else is a direct, simple repository operation (no separate service layer
 * needed for something this small - avoids over-engineering).
 */
@RestController
@RequestMapping("/api/auth/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final CurrentUserResolver currentUserResolver;

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserSummaryDto>>> getAllUsers(HttpServletRequest request) {
        CurrentUser current = currentUserResolver.resolve(request);
        currentUserResolver.requireRole(current, "ADMIN");

        List<UserSummaryDto> users = userRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("Users fetched", users));
    }

    @PatchMapping("/users/{id}/status")
    @Transactional
    public ResponseEntity<ApiResponse<UserSummaryDto>> updateStatus(HttpServletRequest request, @PathVariable Long id,
                                                                       @Valid @RequestBody StatusUpdateDto dto) {
        CurrentUser current = currentUserResolver.resolve(request);
        currentUserResolver.requireRole(current, "ADMIN");

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
        user.setEnabled(dto.getEnabled());
        userRepository.save(user);

        return ResponseEntity.ok(ApiResponse.success("User status updated", toDto(user)));
    }

    private UserSummaryDto toDto(User u) {
        return UserSummaryDto.builder()
                .id(u.getId())
                .fullName(u.getFullName())
                .email(u.getEmail())
                .role(u.getRole().getName().name())
                .enabled(u.isEnabled())
                .createdAt(u.getCreatedAt())
                .build();
    }
}
