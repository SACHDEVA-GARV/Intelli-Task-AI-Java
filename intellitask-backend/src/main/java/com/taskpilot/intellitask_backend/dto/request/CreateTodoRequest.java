package com.taskpilot.intellitask_backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateTodoRequest {
    
    @NotBlank(message = "Task name is required")
    private String task;
    
    private LocalDate date;
}
