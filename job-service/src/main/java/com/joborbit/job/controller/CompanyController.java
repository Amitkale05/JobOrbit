package com.joborbit.job.controller;

import com.joborbit.job.dto.ApiResponse;
import com.joborbit.job.dto.CompanyDto;
import com.joborbit.job.security.CurrentUser;
import com.joborbit.job.security.CurrentUserResolver;
import com.joborbit.job.service.CompanyService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs/companies")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;
    private final CurrentUserResolver currentUserResolver;

    @PostMapping
    public ResponseEntity<ApiResponse<CompanyDto>> create(HttpServletRequest request, @Valid @RequestBody CompanyDto dto) {
        CurrentUser user = currentUserResolver.resolve(request);
        currentUserResolver.requireRole(user, "RECRUITER", "ADMIN");
        CompanyDto created = companyService.createCompany(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Company created", created));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CompanyDto>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success("Companies fetched", companyService.getAllCompanies()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CompanyDto>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Company fetched", companyService.getCompanyById(id)));
    }
}
