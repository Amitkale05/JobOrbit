package com.joborbit.job.repository;

import com.joborbit.job.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

/**
 * WHY: Extends JpaSpecificationExecutor in addition to JpaRepository so the
 * service layer can build dynamic, combinable search/filter queries
 * (keyword + location + job type + salary range) via Specifications instead
 * of writing a combinatorial explosion of @Query methods.
 */
public interface JobRepository extends JpaRepository<Job, Long>, JpaSpecificationExecutor<Job> {
}
