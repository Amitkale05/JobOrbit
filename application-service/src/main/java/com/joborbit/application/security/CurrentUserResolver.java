package com.joborbit.application.security;

import com.joborbit.application.exception.UnauthorizedException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

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
