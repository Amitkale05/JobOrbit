package com.joborbit.user.dto;

import com.joborbit.user.entity.Skill;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SkillDto {
    private Long id;

    @NotBlank(message = "Skill name is required")
    private String name;

    private Skill.ProficiencyLevel proficiency;
}
