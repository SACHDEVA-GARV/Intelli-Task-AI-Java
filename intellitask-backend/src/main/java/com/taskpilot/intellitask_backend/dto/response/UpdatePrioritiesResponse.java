package com.taskpilot.intellitask_backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePrioritiesResponse {
    private String message;
    private Integer updatedCount;
}