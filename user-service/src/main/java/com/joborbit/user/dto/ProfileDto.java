package com.joborbit.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * WHY: The single response/request shape for a job seeker's full profile,
 * aggregating profile + nested education/experience/skills so the frontend
 * can render (and edit) everything with one API call instead of four.
 */
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProfileDto {
    private Long id;
    private Long userId;

    @Size(max = 100)
    private String fullName;

    @Email(message = "Email must be valid")
    private String email;

    @Pattern(regexp = "^$|^[0-9]{10}$", message = "Phone must be a 10-digit number")
    private String phone;

    @Size(max = 150)
    private String headline;

    private String location;
    private String summary;
    private String resumeFileName;
    private String resumeFileUrl;

    private List<EducationDto> education;
    private List<ExperienceDto> experience;
    private List<SkillDto> skills;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
