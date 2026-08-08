package com.joborbit.job.service;

import com.joborbit.job.dto.CompanyDto;
import java.util.List;

public interface CompanyService {
    CompanyDto createCompany(CompanyDto dto);
    List<CompanyDto> getAllCompanies();
    CompanyDto getCompanyById(Long id);
}
