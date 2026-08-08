package com.joborbit.application.controller;

import com.joborbit.application.dto.*;
import com.joborbit.application.entity.ApplicationStatus;
import com.joborbit.application.security.CurrentUser;
import com.joborbit.application.security.CurrentUserResolver;
import com.joborbit.application.service.ApplicationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * WHY THIS CLASS EXISTS:
 * HTTP layer for /api/applications/**. Thin controller: resolves the caller
 * via CurrentUserResolver, enforces role where relevant, and delegates to
 * ApplicationService for everything else.
 */
@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;
    private final CurrentUserResolver currentUserResolver;

    // ---------- Job Seeker actions ----------

    @PostMapping
    public ResponseEntity<ApiResponse<ApplicationResponseDto>> apply(HttpServletRequest request,
                                                                       @Valid @RequestBody ApplyRequestDto dto) {
        CurrentUser user = currentUserResolver.resolve(request);
        currentUserResolver.requireRole(user, "JOB_SEEKER");
        ApplicationResponseDto result = applicationService.apply(user.getUserId(), dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Application submitted", result));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> withdraw(HttpServletRequest request, @PathVariable Long id) {
        CurrentUser user = currentUserResolver.resolve(request);
        currentUserResolver.requireRole(user, "JOB_SEEKER");
        applicationService.withdraw(user.getUserId(), id);
        return ResponseEntity.ok(ApiResponse.success("Application withdrawn", null));
    }

    @GetMapping("/my-applications")
    public ResponseEntity<ApiResponse<PagedResponse<ApplicationResponseDto>>> myApplications(
            HttpServletRequest request,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        CurrentUser user = currentUserResolver.resolve(request);
        currentUserResolver.requireRole(user, "JOB_SEEKER");
        return ResponseEntity.ok(ApiResponse.success("Applications fetched",
                applicationService.getMyApplications(user.getUserId(), page, size)));
    }

    // ---------- Recruiter actions ----------

    @GetMapping("/job/{jobId}")
    public ResponseEntity<ApiResponse<PagedResponse<ApplicationResponseDto>>> applicantsForJob(
            HttpServletRequest request, @PathVariable Long jobId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        CurrentUser user = currentUserResolver.resolve(request);
        currentUserResolver.requireRole(user, "RECRUITER", "ADMIN");
        return ResponseEntity.ok(ApiResponse.success("Applicants fetched",
                applicationService.getApplicantsForJob(jobId, page, size)));
    }

    @GetMapping("/recruiter")
    public ResponseEntity<ApiResponse<PagedResponse<ApplicationResponseDto>>> applicationsForRecruiter(
            HttpServletRequest request,
            @RequestParam(required = false) ApplicationStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        CurrentUser user = currentUserResolver.resolve(request);
        currentUserResolver.requireRole(user, "RECRUITER", "ADMIN");
        return ResponseEntity.ok(ApiResponse.success("Applications fetched",
                applicationService.getApplicationsForRecruiter(user.getUserId(), status, page, size)));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<ApplicationResponseDto>> updateStatus(HttpServletRequest request,
                                                                              @PathVariable Long id,
                                                                              @Valid @RequestBody StatusUpdateDto dto) {
        CurrentUser user = currentUserResolver.resolve(request);
        currentUserResolver.requireRole(user, "RECRUITER", "ADMIN");
        return ResponseEntity.ok(ApiResponse.success("Status updated",
                applicationService.updateStatus(user.getUserId(), id, dto.getStatus())));
    }
}
