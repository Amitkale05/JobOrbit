package com.joborbit.auth.dto;

import com.joborbit.auth.entity.RoleName;
import jakarta.validation.constraints.*;
import lombok.*;

/**
 * WHY: DTOs decouple the API contract from JPA entities. We never expose
 * User (entity) directly in a controller - clients send/receive DTOs only.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterRequest {

    @NotBlank(message = "Full name is required")
    @Size(min = 3, max = 100, message = "Full name must be between 3 and 100 characters")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 100, message = "Password must be at least 6 characters")
    @Pattern(
        regexp = "^(?=.*[A-Za-z])(?=.*\\d).+$",
        message = "Password must contain at least one letter and one number"
    )
    private String password;

    @NotNull(message = "Role is required")
    private RoleName role;
}
