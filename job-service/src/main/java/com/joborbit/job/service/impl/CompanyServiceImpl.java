package com.joborbit.job.service.impl;

import com.joborbit.job.dto.CompanyDto;
import com.joborbit.job.entity.Company;
import com.joborbit.job.exception.ResourceNotFoundException;
import com.joborbit.job.repository.CompanyRepository;
import com.joborbit.job.service.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * WHY: Companies are simple reference data (recruiters attach jobs to a
 * company). Kept intentionally simple - no update/delete required by the
 * spec, only create + list + fetch-by-id.
 */
@Service
@RequiredArgsConstructor
public class CompanyServiceImpl implements CompanyService {

    private final CompanyRepository companyRepository;

    @Override
    @Transactional
    public CompanyDto createCompany(CompanyDto dto) {
        Company company = Company.builder()
                .name(dto.getName())
                .industry(dto.getIndustry())
                .location(dto.getLocation())
                .description(dto.getDescription())
                .website(dto.getWebsite())
                .logoUrl(dto.getLogoUrl())
                .build();
        return toDto(companyRepository.save(company));
    }

    @Override
    public List<CompanyDto> getAllCompanies() {
        return companyRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public CompanyDto getCompanyById(Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found: " + id));
        return toDto(company);
    }

    private CompanyDto toDto(Company c) {
        return CompanyDto.builder()
                .id(c.getId()).name(c.getName()).industry(c.getIndustry())
                .location(c.getLocation()).description(c.getDescription())
                .website(c.getWebsite()).logoUrl(c.getLogoUrl()).build();
    }
}
