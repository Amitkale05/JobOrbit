package com.joborbit.job.dto;

import lombok.*;

import java.util.List;

/** WHY: Uniform pagination envelope returned by search/list endpoints so the
 * React frontend can render page controls consistently across the app. */
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PagedResponse<T> {
    private List<T> content;
    private int pageNumber;
    private int pageSize;
    private long totalElements;
    private int totalPages;
    private boolean last;
}
