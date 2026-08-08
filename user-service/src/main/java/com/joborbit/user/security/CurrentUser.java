package com.joborbit.user.security;

import lombok.AllArgsConstructor;
import lombok.Getter;

/** WHY: Simple immutable holder for the identity forwarded by the Gateway,
 * extracted once per-request from headers so services don't scatter
 * request.getHeader(...) calls throughout the codebase. */
@Getter
@AllArgsConstructor
public class CurrentUser {
    private final Long userId;
    private final String username;
    private final String role;
}
