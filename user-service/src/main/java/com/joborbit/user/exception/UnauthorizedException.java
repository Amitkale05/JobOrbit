package com.joborbit.user.exception;

/** WHY: Thrown when a caller's identity headers (from the Gateway) are
 * missing/malformed, or when a user attempts to access a profile that isn't
 * their own. */
public class UnauthorizedException extends RuntimeException {
    public UnauthorizedException(String message) { super(message); }
}
