package com.joborbit.application.dto;

import com.joborbit.application.entity.ApplicationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class StatusUpdateDto {

    @NotNull(message = "Status is required")
    private ApplicationStatus status;
}
