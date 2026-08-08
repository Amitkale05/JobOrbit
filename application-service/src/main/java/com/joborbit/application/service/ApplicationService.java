package com.joborbit.application.service;

import com.joborbit.application.dto.*;
import com.joborbit.application.entity.ApplicationStatus;

/**
 * WHY: Contract for all application-workflow business logic: applying,
 * withdrawing, viewing "my applications" (job seeker view), viewing
 * applicants for a job (recruiter view), and updating status
 * (shortlist/reject/hire).
 */
public interface ApplicationService {
    ApplicationResponseDto apply(Long applicantId, ApplyRequestDto dto);
    void withdraw(Long applicantId, Long applicationId);
    PagedResponse<ApplicationResponseDto> getMyApplications(Long applicantId, int page, int size);

    PagedResponse<ApplicationResponseDto> getApplicantsForJob(Long jobId, int page, int size);
    PagedResponse<ApplicationResponseDto> getApplicationsForRecruiter(Long recruiterId, ApplicationStatus status, int page, int size);

    ApplicationResponseDto updateStatus(Long recruiterId, Long applicationId, ApplicationStatus status);
}
