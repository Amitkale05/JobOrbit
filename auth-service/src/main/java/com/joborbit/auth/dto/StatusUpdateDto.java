package com.joborbit.auth.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class StatusUpdateDto {
    @NotNull(message = "enabled flag is required")
    private Boolean enabled;
}
