package com.joborbit.job.controller;

import com.joborbit.job.dto.*;
import com.joborbit.job.entity.JobType;
import com.joborbit.job.security.CurrentUser;
import com.joborbit.job.security.CurrentUserResolver;
import com.joborbit.job.service.JobService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * WHY THIS CLASS EXISTS:
 * HTTP layer for /api/jobs/**. Public search/view endpoints require no
 * particular role (any authenticated user - job seekers browse jobs);
 * create/update/delete are restricted to RECRUITER (or ADMIN) via
 * CurrentUserResolver.requireRole, enforced here before delegating to
 * JobService so unauthorized writes never reach the service layer.
 */
@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;
    private final CurrentUserResolver currentUserResolver;

    @PostMapping
    public ResponseEntity<ApiResponse<JobResponseDto>> create(HttpServletRequest request, @Valid @RequestBody JobRequestDto dto) {
        CurrentUser user = currentUserResolver.resolve(request);
        currentUserResolver.requireRole(user, "RECRUITER", "ADMIN");
        JobResponseDto created = jobService.createJob(user.getUserId(), dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Job created", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<JobResponseDto>> update(HttpServletRequest request, @PathVariable Long id,
                                                                @Valid @RequestBody JobRequestDto dto) {
        CurrentUser user = currentUserResolver.resolve(request);
        currentUserResolver.requireRole(user, "RECRUITER", "ADMIN");
        boolean isAdmin = "ADMIN".equalsIgnoreCase(user.getRole());
        return ResponseEntity.ok(ApiResponse.success("Job updated", jobService.updateJob(user.getUserId(), isAdmin, id, dto)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(HttpServletRequest request, @PathVariable Long id) {
        CurrentUser user = currentUserResolver.resolve(request);
        currentUserResolver.requireRole(user, "RECRUITER", "ADMIN");
        boolean isAdmin = "ADMIN".equalsIgnoreCase(user.getRole());
        jobService.deleteJob(user.getUserId(), isAdmin, id);
        return ResponseEntity.ok(ApiResponse.success("Job deleted", null));
    }

    @GetMapping("/admin/all")
    public ResponseEntity<ApiResponse<PagedResponse<JobResponseDto>>> allJobsForAdmin(
            HttpServletRequest request,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        CurrentUser user = currentUserResolver.resolve(request);
        currentUserResolver.requireRole(user, "ADMIN");
        return ResponseEntity.ok(ApiResponse.success("All jobs fetched", jobService.getAllJobsForAdmin(page, size)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<JobResponseDto>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Job fetched", jobService.getJobById(id)));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PagedResponse<JobResponseDto>>> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) JobType jobType,
            @RequestParam(required = false) Double minSalary,
            @RequestParam(required = false) Double maxSalary,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PagedResponse<JobResponseDto> result = jobService.searchJobs(keyword, location, jobType, minSalary, maxSalary, page, size);
        return ResponseEntity.ok(ApiResponse.success("Jobs fetched", result));
    }

    @GetMapping("/my-jobs")
    public ResponseEntity<ApiResponse<PagedResponse<JobResponseDto>>> myJobs(
            HttpServletRequest request,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        CurrentUser user = currentUserResolver.resolve(request);
        currentUserResolver.requireRole(user, "RECRUITER", "ADMIN");
        return ResponseEntity.ok(ApiResponse.success("Your jobs fetched", jobService.getJobsByRecruiter(user.getUserId(), page, size)));
    }
}
