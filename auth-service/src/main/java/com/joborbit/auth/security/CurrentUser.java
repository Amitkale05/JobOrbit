package com.joborbit.auth.security;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CurrentUser {
    private final Long userId;
    private final String username;
    private final String role;
}
