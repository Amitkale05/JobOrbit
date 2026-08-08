package com.joborbit.job.dto;

import com.joborbit.job.entity.JobType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

/** WHY: Separate request DTO (recruiter input) from response DTO -
 * request never includes server-controlled fields like id/status/createdAt. */
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class JobRequestDto {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Job type is required")
    private JobType jobType;

    private String experienceRequired;

    @Positive(message = "Minimum salary must be positive")
    private Double minSalary;

    @Positive(message = "Maximum salary must be positive")
    private Double maxSalary;

    private String skillsRequired;

    @NotNull(message = "Company ID is required")
    private Long companyId;
}
