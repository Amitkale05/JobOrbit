package com.joborbit.job.util;

import com.joborbit.job.entity.Job;
import com.joborbit.job.entity.JobStatus;
import com.joborbit.job.entity.JobType;
import org.springframework.data.jpa.domain.Specification;

/**
 * WHY THIS CLASS EXISTS:
 * Builds a single, combinable JPA Specification from a set of OPTIONAL search
 * criteria (keyword, location, job type, min/max salary). Using
 * Specifications instead of many @Query variants keeps JobServiceImpl clean
 * and lets any combination of filters be applied together (e.g. keyword +
 * location + full-time only), which is exactly what "search + filter" on
 * the Job Seeker dashboard needs.
 */
public class JobSpecification {

    public static Specification<Job> withFilters(String keyword, String location, JobType jobType,
                                                   Double minSalary, Double maxSalary) {
        return (root, query, cb) -> {
            var predicates = cb.conjunction();

            predicates = cb.and(predicates, cb.equal(root.get("status"), JobStatus.OPEN));

            if (keyword != null && !keyword.isBlank()) {
                String like = "%" + keyword.toLowerCase() + "%";
                predicates = cb.and(predicates, cb.or(
                        cb.like(cb.lower(root.get("title")), like),
                        cb.like(cb.lower(root.get("description")), like),
                        cb.like(cb.lower(root.get("skillsRequired")), like)
                ));
            }

            if (location != null && !location.isBlank()) {
                predicates = cb.and(predicates, cb.like(cb.lower(root.get("location")), "%" + location.toLowerCase() + "%"));
            }

            if (jobType != null) {
                predicates = cb.and(predicates, cb.equal(root.get("jobType"), jobType));
            }

            if (minSalary != null) {
                predicates = cb.and(predicates, cb.greaterThanOrEqualTo(root.get("maxSalary"), minSalary));
            }

            if (maxSalary != null) {
                predicates = cb.and(predicates, cb.lessThanOrEqualTo(root.get("minSalary"), maxSalary));
            }

            return predicates;
        };
    }

    public static Specification<Job> byRecruiter(Long recruiterId) {
        return (root, query, cb) -> cb.equal(root.get("recruiterId"), recruiterId);
    }
}
