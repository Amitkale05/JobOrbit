package com.joborbit.job.dto;

import com.joborbit.job.entity.JobStatus;
import com.joborbit.job.entity.JobType;
import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class JobResponseDto {
    private Long id;
    private String title;
    private String description;
    private String location;
    private JobType jobType;
    private String experienceRequired;
    private Double minSalary;
    private Double maxSalary;
    private String skillsRequired;
    private JobStatus status;
    private Long recruiterId;
    private CompanyDto company;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
