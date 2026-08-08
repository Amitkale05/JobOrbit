package com.joborbit.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class EducationDto {
    private Long id;

    @NotBlank(message = "Institution is required")
    private String institution;

    @NotBlank(message = "Degree is required")
    private String degree;

    private String fieldOfStudy;
    private Integer startYear;
    private Integer endYear;
    private String grade;
}
