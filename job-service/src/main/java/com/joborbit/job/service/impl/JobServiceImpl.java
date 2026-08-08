package com.joborbit.job.service.impl;

import com.joborbit.job.dto.*;
import com.joborbit.job.entity.Company;
import com.joborbit.job.entity.Job;
import com.joborbit.job.entity.JobStatus;
import com.joborbit.job.entity.JobType;
import com.joborbit.job.exception.ResourceNotFoundException;
import com.joborbit.job.exception.UnauthorizedException;
import com.joborbit.job.repository.CompanyRepository;
import com.joborbit.job.repository.JobRepository;
import com.joborbit.job.service.JobService;
import com.joborbit.job.util.JobSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

/**
 * WHY THIS CLASS EXISTS:
 * Holds all business rules for job postings: creating/updating/deleting jobs
 * (with ownership enforcement so a recruiter can only touch their own
 * postings), fetching a single job, and running keyword/location/type/
 * salary-range search with pagination for the Job Seeker dashboard.
 *
 * HOW IT CONNECTS TO OTHER LAYERS:
 * controller -> [this service] -> repository (+ JobSpecification for
 * dynamic filters) -> database (job_db)
 */
@Service
@RequiredArgsConstructor
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;

    @Override
    @Transactional
    public JobResponseDto createJob(Long recruiterId, JobRequestDto dto) {
        Company company = companyRepository.findById(dto.getCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Company not found: " + dto.getCompanyId()));

        Job job = Job.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .location(dto.getLocation())
                .jobType(dto.getJobType())
                .experienceRequired(dto.getExperienceRequired())
                .minSalary(dto.getMinSalary())
                .maxSalary(dto.getMaxSalary())
                .skillsRequired(dto.getSkillsRequired())
                .status(JobStatus.OPEN)
                .recruiterId(recruiterId)
                .company(company)
                .build();

        return toDto(jobRepository.save(job));
    }

    @Override
    @Transactional
    public JobResponseDto updateJob(Long actingUserId, boolean isAdmin, Long jobId, JobRequestDto dto) {
        Job job = getOwnedJob(actingUserId, isAdmin, jobId);

        Company company = companyRepository.findById(dto.getCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Company not found: " + dto.getCompanyId()));

        job.setTitle(dto.getTitle());
        job.setDescription(dto.getDescription());
        job.setLocation(dto.getLocation());
        job.setJobType(dto.getJobType());
        job.setExperienceRequired(dto.getExperienceRequired());
        job.setMinSalary(dto.getMinSalary());
        job.setMaxSalary(dto.getMaxSalary());
        job.setSkillsRequired(dto.getSkillsRequired());
        job.setCompany(company);

        return toDto(jobRepository.save(job));
    }

    @Override
    @Transactional
    public void deleteJob(Long actingUserId, boolean isAdmin, Long jobId) {
        Job job = getOwnedJob(actingUserId, isAdmin, jobId);
        jobRepository.delete(job);
    }

    @Override
    public JobResponseDto getJobById(Long jobId) {
        return toDto(jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found: " + jobId)));
    }

    @Override
    public PagedResponse<JobResponseDto> searchJobs(String keyword, String location, JobType jobType,
                                                      Double minSalary, Double maxSalary, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Job> result = jobRepository.findAll(
                JobSpecification.withFilters(keyword, location, jobType, minSalary, maxSalary), pageRequest);
        return toPagedResponse(result);
    }

    @Override
    public PagedResponse<JobResponseDto> getJobsByRecruiter(Long recruiterId, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Job> result = jobRepository.findAll(JobSpecification.byRecruiter(recruiterId), pageRequest);
        return toPagedResponse(result);
    }

    @Override
    public PagedResponse<JobResponseDto> getAllJobsForAdmin(int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return toPagedResponse(jobRepository.findAll(pageRequest));
    }

    // ---------- helpers ----------

    private Job getOwnedJob(Long actingUserId, boolean isAdmin, Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found: " + jobId));
        if (!isAdmin && !job.getRecruiterId().equals(actingUserId)) {
            throw new UnauthorizedException("You can only modify jobs that you posted");
        }
        return job;
    }

    private PagedResponse<JobResponseDto> toPagedResponse(Page<Job> page) {
        return PagedResponse.<JobResponseDto>builder()
                .content(page.getContent().stream().map(this::toDto).collect(Collectors.toList()))
                .pageNumber(page.getNumber())
                .pageSize(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }

    private JobResponseDto toDto(Job job) {
        Company c = job.getCompany();
        CompanyDto companyDto = CompanyDto.builder()
                .id(c.getId()).name(c.getName()).industry(c.getIndustry())
                .location(c.getLocation()).description(c.getDescription())
                .website(c.getWebsite()).logoUrl(c.getLogoUrl()).build();

        return JobResponseDto.builder()
                .id(job.getId())
                .title(job.getTitle())
                .description(job.getDescription())
                .location(job.getLocation())
                .jobType(job.getJobType())
                .experienceRequired(job.getExperienceRequired())
                .minSalary(job.getMinSalary())
                .maxSalary(job.getMaxSalary())
                .skillsRequired(job.getSkillsRequired())
                .status(job.getStatus())
                .recruiterId(job.getRecruiterId())
                .company(companyDto)
                .createdAt(job.getCreatedAt())
                .updatedAt(job.getUpdatedAt())
                .build();
    }
}
