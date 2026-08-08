package com.joborbit.auth.dto;

import lombok.*;

/**
 * WHY: Returned after a successful login/register. Frontend stores the token
 * (e.g. in memory/localStorage) and attaches it as "Authorization: Bearer <token>"
 * on every subsequent request to the Gateway.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private Long userId;
    private String fullName;
    private String email;
    private String role;
    private String token;
    private String tokenType;
}
