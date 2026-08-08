package com.joborbit.auth.exception;

/** WHY: Thrown when login email/password combination is wrong. Kept distinct
 * from generic AuthenticationException so we can map it to a clear 401 with
 * a client-safe message ("Invalid email or password") without leaking which
 * field was wrong (security best practice - avoids user enumeration). */
public class InvalidCredentialsException extends RuntimeException {
    public InvalidCredentialsException(String message) {
        super(message);
    }
}
