package com.joborbit.application.dto;

import com.joborbit.application.entity.ApplicationStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ApplicationResponseDto {
    private Long id;
    private Long jobId;
    private Long applicantId;
    private Long recruiterId;
    private String coverLetter;
    private String resumeUrl;
    private ApplicationStatus status;
    private LocalDateTime appliedAt;
    private LocalDateTime updatedAt;
}
