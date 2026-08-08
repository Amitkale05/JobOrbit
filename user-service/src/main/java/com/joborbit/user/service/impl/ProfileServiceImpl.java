package com.joborbit.user.service.impl;

import com.joborbit.user.dto.*;
import com.joborbit.user.entity.Education;
import com.joborbit.user.entity.Experience;
import com.joborbit.user.entity.Profile;
import com.joborbit.user.entity.Skill;
import com.joborbit.user.exception.ResourceNotFoundException;
import com.joborbit.user.exception.UnauthorizedException;
import com.joborbit.user.repository.EducationRepository;
import com.joborbit.user.repository.ExperienceRepository;
import com.joborbit.user.repository.ProfileRepository;
import com.joborbit.user.repository.SkillRepository;
import com.joborbit.user.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * WHY THIS CLASS EXISTS:
 * Holds all business rules for the profile module: creating a profile lazily
 * on first access, updating it, managing the resume file on disk, and
 * managing the nested Education/Experience/Skill collections while enforcing
 * that a user can only ever modify THEIR OWN profile's child records
 * (ownership check via profile.getUserId().equals(userId)).
 *
 * HOW IT CONNECTS TO OTHER LAYERS:
 * controller -> [this service] -> repository -> database (user_db)
 */
@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final ProfileRepository profileRepository;
    private final EducationRepository educationRepository;
    private final ExperienceRepository experienceRepository;
    private final SkillRepository skillRepository;

    @Value("${app.upload.dir}")
    private String uploadDir;

    @Override
    @Transactional
    public ProfileDto getOrCreateProfile(Long userId, String fullName, String email) {
        Profile profile = profileRepository.findByUserId(userId)
                .orElseGet(() -> profileRepository.save(
                        Profile.builder()
                                .userId(userId)
                                .fullName(fullName)
                                .email(email)
                                .build()
                ));
        return toDto(profile);
    }

    @Override
    public ProfileDto getProfileByUserId(Long userId) {
        Profile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("This candidate has not created a profile yet"));
        return toDto(profile);
    }

    @Override
    @Transactional
    public ProfileDto updateProfile(Long userId, ProfileDto dto) {
        Profile profile = getOwnedProfile(userId);
        profile.setFullName(dto.getFullName());
        profile.setPhone(dto.getPhone());
        profile.setHeadline(dto.getHeadline());
        profile.setLocation(dto.getLocation());
        profile.setSummary(dto.getSummary());
        return toDto(profileRepository.save(profile));
    }

    @Override
    @Transactional
    public String uploadResume(Long userId, MultipartFile file) {
        Profile profile = getOwnedProfile(userId);

        if (file.isEmpty()) {
            throw new IllegalArgumentException("Uploaded file is empty");
        }

        try {
            Path uploadPath = Path.of(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalName = file.getOriginalFilename();
            String extension = originalName != null && originalName.contains(".")
                    ? originalName.substring(originalName.lastIndexOf('.'))
                    : "";
            String storedName = "resume_" + userId + "_" + UUID.randomUUID() + extension;

            Path target = uploadPath.resolve(storedName);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

            profile.setResumeFileName(originalName);
            profile.setResumeFileUrl("/api/users/profile/resume/" + storedName);
            profileRepository.save(profile);

            return profile.getResumeFileUrl();
        } catch (IOException e) {
            throw new RuntimeException("Failed to store resume file: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional
    public EducationDto addEducation(Long userId, EducationDto dto) {
        Profile profile = getOwnedProfile(userId);
        Education education = Education.builder()
                .institution(dto.getInstitution())
                .degree(dto.getDegree())
                .fieldOfStudy(dto.getFieldOfStudy())
                .startYear(dto.getStartYear())
                .endYear(dto.getEndYear())
                .grade(dto.getGrade())
                .profile(profile)
                .build();
        return toDto(educationRepository.save(education));
    }

    @Override
    @Transactional
    public EducationDto updateEducation(Long userId, Long educationId, EducationDto dto) {
        Education education = educationRepository.findById(educationId)
                .orElseThrow(() -> new ResourceNotFoundException("Education record not found: " + educationId));
        assertOwnership(education.getProfile().getUserId(), userId);

        education.setInstitution(dto.getInstitution());
        education.setDegree(dto.getDegree());
        education.setFieldOfStudy(dto.getFieldOfStudy());
        education.setStartYear(dto.getStartYear());
        education.setEndYear(dto.getEndYear());
        education.setGrade(dto.getGrade());
        return toDto(educationRepository.save(education));
    }

    @Override
    @Transactional
    public void deleteEducation(Long userId, Long educationId) {
        Education education = educationRepository.findById(educationId)
                .orElseThrow(() -> new ResourceNotFoundException("Education record not found: " + educationId));
        assertOwnership(education.getProfile().getUserId(), userId);
        educationRepository.delete(education);
    }

    @Override
    @Transactional
    public ExperienceDto addExperience(Long userId, ExperienceDto dto) {
        Profile profile = getOwnedProfile(userId);
        Experience experience = Experience.builder()
                .companyName(dto.getCompanyName())
                .jobTitle(dto.getJobTitle())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .currentlyWorking(dto.isCurrentlyWorking())
                .description(dto.getDescription())
                .profile(profile)
                .build();
        return toDto(experienceRepository.save(experience));
    }

    @Override
    @Transactional
    public ExperienceDto updateExperience(Long userId, Long experienceId, ExperienceDto dto) {
        Experience experience = experienceRepository.findById(experienceId)
                .orElseThrow(() -> new ResourceNotFoundException("Experience record not found: " + experienceId));
        assertOwnership(experience.getProfile().getUserId(), userId);

        experience.setCompanyName(dto.getCompanyName());
        experience.setJobTitle(dto.getJobTitle());
        experience.setStartDate(dto.getStartDate());
        experience.setEndDate(dto.getEndDate());
        experience.setCurrentlyWorking(dto.isCurrentlyWorking());
        experience.setDescription(dto.getDescription());
        return toDto(experienceRepository.save(experience));
    }

    @Override
    @Transactional
    public void deleteExperience(Long userId, Long experienceId) {
        Experience experience = experienceRepository.findById(experienceId)
                .orElseThrow(() -> new ResourceNotFoundException("Experience record not found: " + experienceId));
        assertOwnership(experience.getProfile().getUserId(), userId);
        experienceRepository.delete(experience);
    }

    @Override
    @Transactional
    public SkillDto addSkill(Long userId, SkillDto dto) {
        Profile profile = getOwnedProfile(userId);
        Skill skill = Skill.builder()
                .name(dto.getName())
                .proficiency(dto.getProficiency())
                .profile(profile)
                .build();
        return toDto(skillRepository.save(skill));
    }

    @Override
    @Transactional
    public void deleteSkill(Long userId, Long skillId) {
        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found: " + skillId));
        assertOwnership(skill.getProfile().getUserId(), userId);
        skillRepository.delete(skill);
    }

    // ---------- helpers ----------

    private Profile getOwnedProfile(Long userId) {
        return profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for current user"));
    }

    private void assertOwnership(Long ownerId, Long requesterId) {
        if (!ownerId.equals(requesterId)) {
            throw new UnauthorizedException("You are not allowed to modify this record");
        }
    }

    private ProfileDto toDto(Profile p) {
        return ProfileDto.builder()
                .id(p.getId())
                .userId(p.getUserId())
                .fullName(p.getFullName())
                .email(p.getEmail())
                .phone(p.getPhone())
                .headline(p.getHeadline())
                .location(p.getLocation())
                .summary(p.getSummary())
                .resumeFileName(p.getResumeFileName())
                .resumeFileUrl(p.getResumeFileUrl())
                .education(p.getEducation().stream().map(this::toDto).collect(Collectors.toList()))
                .experience(p.getExperience().stream().map(this::toDto).collect(Collectors.toList()))
                .skills(p.getSkills().stream().map(this::toDto).collect(Collectors.toList()))
                .createdAt(p.getCreatedAt())
                .updatedAt(p.getUpdatedAt())
                .build();
    }

    private EducationDto toDto(Education e) {
        return EducationDto.builder()
                .id(e.getId()).institution(e.getInstitution()).degree(e.getDegree())
                .fieldOfStudy(e.getFieldOfStudy()).startYear(e.getStartYear()).endYear(e.getEndYear())
                .grade(e.getGrade()).build();
    }

    private ExperienceDto toDto(Experience e) {
        return ExperienceDto.builder()
                .id(e.getId()).companyName(e.getCompanyName()).jobTitle(e.getJobTitle())
                .startDate(e.getStartDate()).endDate(e.getEndDate())
                .currentlyWorking(e.isCurrentlyWorking()).description(e.getDescription()).build();
    }

    private SkillDto toDto(Skill s) {
        return SkillDto.builder().id(s.getId()).name(s.getName()).proficiency(s.getProficiency()).build();
    }
}
