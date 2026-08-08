package com.joborbit.user.service;

import com.joborbit.user.dto.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * WHY: Contract for all profile-related business logic (profile CRUD, resume
 * upload, and nested education/experience/skill management). Controller
 * depends on this interface, not the concrete implementation.
 */
public interface ProfileService {
    ProfileDto getOrCreateProfile(Long userId, String fullName, String email);
    ProfileDto getProfileByUserId(Long userId);
    ProfileDto updateProfile(Long userId, ProfileDto dto);
    String uploadResume(Long userId, MultipartFile file);

    EducationDto addEducation(Long userId, EducationDto dto);
    EducationDto updateEducation(Long userId, Long educationId, EducationDto dto);
    void deleteEducation(Long userId, Long educationId);

    ExperienceDto addExperience(Long userId, ExperienceDto dto);
    ExperienceDto updateExperience(Long userId, Long experienceId, ExperienceDto dto);
    void deleteExperience(Long userId, Long experienceId);

    SkillDto addSkill(Long userId, SkillDto dto);
    void deleteSkill(Long userId, Long skillId);
}
