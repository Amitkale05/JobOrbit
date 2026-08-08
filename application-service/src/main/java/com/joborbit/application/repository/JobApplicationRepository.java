package com.joborbit.application.repository;

import com.joborbit.application.entity.ApplicationStatus;
import com.joborbit.application.entity.JobApplication;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    Optional<JobApplication> findByJobIdAndApplicantId(Long jobId, Long applicantId);
    boolean existsByJobIdAndApplicantId(Long jobId, Long applicantId);

    Page<JobApplication> findByApplicantId(Long applicantId, Pageable pageable);
    Page<JobApplication> findByJobId(Long jobId, Pageable pageable);
    Page<JobApplication> findByRecruiterId(Long recruiterId, Pageable pageable);
    Page<JobApplication> findByRecruiterIdAndStatus(Long recruiterId, ApplicationStatus status, Pageable pageable);
}
