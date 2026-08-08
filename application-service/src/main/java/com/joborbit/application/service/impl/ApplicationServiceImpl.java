package com.joborbit.application.service.impl;

import com.joborbit.application.dto.*;
import com.joborbit.application.entity.ApplicationStatus;
import com.joborbit.application.entity.JobApplication;
import com.joborbit.application.exception.DuplicateResourceException;
import com.joborbit.application.exception.ResourceNotFoundException;
import com.joborbit.application.exception.UnauthorizedException;
import com.joborbit.application.repository.JobApplicationRepository;
import com.joborbit.application.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

/**
 * WHY THIS CLASS EXISTS:
 * Holds all business rules for the apply/withdraw/shortlist/reject workflow:
 *  - Prevents a job seeker from applying twice to the same job (unique
 *    jobId+applicantId constraint enforced at both entity and service level).
 *  - Enforces that only the applicant can withdraw THEIR OWN application.
 *  - Enforces that only the recruiter who owns the job can change an
 *    application's status (shortlist/reject/hire).
 *
 * HOW IT CONNECTS TO OTHER LAYERS:
 * controller -> [this service] -> repository -> database (application_db)
 */
@Service
@RequiredArgsConstructor
public class ApplicationServiceImpl implements ApplicationService {

    private final JobApplicationRepository applicationRepository;

    @Override
    @Transactional
    public ApplicationResponseDto apply(Long applicantId, ApplyRequestDto dto) {
        if (applicationRepository.existsByJobIdAndApplicantId(dto.getJobId(), applicantId)) {
            throw new DuplicateResourceException("You have already applied to this job");
        }

        JobApplication application = JobApplication.builder()
                .jobId(dto.getJobId())
                .applicantId(applicantId)
                .recruiterId(dto.getRecruiterId())
                .coverLetter(dto.getCoverLetter())
                .resumeUrl(dto.getResumeUrl())
                .status(ApplicationStatus.APPLIED)
                .build();

        return toDto(applicationRepository.save(application));
    }

    @Override
    @Transactional
    public void withdraw(Long applicantId, Long applicationId) {
        JobApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found: " + applicationId));

        if (!application.getApplicantId().equals(applicantId)) {
            throw new UnauthorizedException("You can only withdraw your own application");
        }

        application.setStatus(ApplicationStatus.WITHDRAWN);
        applicationRepository.save(application);
    }

    @Override
    public PagedResponse<ApplicationResponseDto> getMyApplications(Long applicantId, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "appliedAt"));
        return toPagedResponse(applicationRepository.findByApplicantId(applicantId, pageRequest));
    }

    @Override
    public PagedResponse<ApplicationResponseDto> getApplicantsForJob(Long jobId, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "appliedAt"));
        return toPagedResponse(applicationRepository.findByJobId(jobId, pageRequest));
    }

    @Override
    public PagedResponse<ApplicationResponseDto> getApplicationsForRecruiter(Long recruiterId, ApplicationStatus status, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "appliedAt"));
        Page<JobApplication> result = (status == null)
                ? applicationRepository.findByRecruiterId(recruiterId, pageRequest)
                : applicationRepository.findByRecruiterIdAndStatus(recruiterId, status, pageRequest);
        return toPagedResponse(result);
    }

    @Override
    @Transactional
    public ApplicationResponseDto updateStatus(Long recruiterId, Long applicationId, ApplicationStatus status) {
        JobApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found: " + applicationId));

        if (!application.getRecruiterId().equals(recruiterId)) {
            throw new UnauthorizedException("You can only update applications for jobs you posted");
        }

        application.setStatus(status);
        return toDto(applicationRepository.save(application));
    }

    // ---------- helpers ----------

    private PagedResponse<ApplicationResponseDto> toPagedResponse(Page<JobApplication> page) {
        return PagedResponse.<ApplicationResponseDto>builder()
                .content(page.getContent().stream().map(this::toDto).collect(Collectors.toList()))
                .pageNumber(page.getNumber())
                .pageSize(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }

    private ApplicationResponseDto toDto(JobApplication a) {
        return ApplicationResponseDto.builder()
                .id(a.getId())
                .jobId(a.getJobId())
                .applicantId(a.getApplicantId())
                .recruiterId(a.getRecruiterId())
                .coverLetter(a.getCoverLetter())
                .resumeUrl(a.getResumeUrl())
                .status(a.getStatus())
                .appliedAt(a.getAppliedAt())
                .updatedAt(a.getUpdatedAt())
                .build();
    }
}
