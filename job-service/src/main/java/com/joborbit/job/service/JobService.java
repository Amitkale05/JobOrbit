package com.joborbit.job.service;

import com.joborbit.job.dto.JobRequestDto;
import com.joborbit.job.dto.JobResponseDto;
import com.joborbit.job.dto.PagedResponse;
import com.joborbit.job.entity.JobType;

/**
 * WHY: Contract for all job posting/search business logic. Kept separate
 * from CompanyService (Single Responsibility Principle) even though both
 * live in the same microservice.
 */
public interface JobService {
    JobResponseDto createJob(Long recruiterId, JobRequestDto dto);
    JobResponseDto updateJob(Long actingUserId, boolean isAdmin, Long jobId, JobRequestDto dto);
    void deleteJob(Long actingUserId, boolean isAdmin, Long jobId);
    JobResponseDto getJobById(Long jobId);

    PagedResponse<JobResponseDto> searchJobs(String keyword, String location, JobType jobType,
                                              Double minSalary, Double maxSalary, int page, int size);

    PagedResponse<JobResponseDto> getJobsByRecruiter(Long recruiterId, int page, int size);

    PagedResponse<JobResponseDto> getAllJobsForAdmin(int page, int size);
}
