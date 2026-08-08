package com.joborbit.user.security;

import com.joborbit.user.exception.UnauthorizedException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

/**
 * WHY THIS CLASS EXISTS:
 * Since microservices behind the Gateway do NOT re-validate JWTs themselves
 * (the Gateway already did that), this resolver simply trusts and reads the
 * X-User-Id / X-User-Name / X-User-Role headers the Gateway injected. This
 * keeps every downstream service lightweight (no JWT parsing dependency
 * needed here) while still giving controllers/services a reliable way to
 * know "who is calling right now".
 *
 * In production this trust boundary is safe ONLY because the microservices
 * are not directly reachable from the public internet - only the Gateway is.
 */
@Component
public class CurrentUserResolver {

    public CurrentUser resolve(HttpServletRequest request) {
        String userIdHeader = request.getHeader("X-User-Id");
        String username = request.getHeader("X-User-Name");
        String role = request.getHeader("X-User-Role");

        if (userIdHeader == null || userIdHeader.isBlank() || username == null || role == null) {
            throw new UnauthorizedException("Missing identity headers - request must go through the API Gateway");
        }

        return new CurrentUser(Long.valueOf(userIdHeader), username, role);
    }

    public void requireRole(CurrentUser user, String... allowedRoles) {
        for (String role : allowedRoles) {
            if (role.equalsIgnoreCase(user.getRole())) {
                return;
            }
        }
        throw new UnauthorizedException("You do not have permission to perform this action");
    }
}
