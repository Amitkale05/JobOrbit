package com.joborbit.application.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ApplyRequestDto {

    @NotNull(message = "Job ID is required")
    private Long jobId;

    @NotNull(message = "Recruiter ID is required")
    private Long recruiterId;

    private String coverLetter;
    private String resumeUrl;
}
