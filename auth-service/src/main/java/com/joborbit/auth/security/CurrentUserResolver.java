package com.joborbit.auth.security;

import com.joborbit.auth.exception.InvalidCredentialsException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

/** WHY: For the admin-only endpoints living inside Auth Service itself
 * (list/manage users), trusts the X-User-Role header injected by the
 * Gateway, exactly like every other downstream microservice does. */
@Component
public class CurrentUserResolver {

    public CurrentUser resolve(HttpServletRequest request) {
        String userIdHeader = request.getHeader("X-User-Id");
        String username = request.getHeader("X-User-Name");
        String role = request.getHeader("X-User-Role");
        if (userIdHeader == null || userIdHeader.isBlank() || role == null) {
            throw new InvalidCredentialsException("Missing identity headers - request must go through the API Gateway");
        }
        return new CurrentUser(Long.valueOf(userIdHeader), username, role);
    }

    public void requireRole(CurrentUser user, String... allowedRoles) {
        for (String role : allowedRoles) {
            if (role.equalsIgnoreCase(user.getRole())) return;
        }
        throw new InvalidCredentialsException("You do not have permission to perform this action");
    }
}
