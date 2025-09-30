package com.taskpilot.intellitask_backend.controller;

import com.taskpilot.intellitask_backend.dto.request.CreateTodoRequest;
import com.taskpilot.intellitask_backend.dto.request.UpdateCompletionRequest;
import com.taskpilot.intellitask_backend.dto.response.DailySummaryResponse;
import com.taskpilot.intellitask_backend.dto.response.TodoItemDto;
import com.taskpilot.intellitask_backend.dto.response.UpdatePrioritiesResponse;
import com.taskpilot.intellitask_backend.entity.TodoItem;
import com.taskpilot.intellitask_backend.repository.TodoItemRepository;
import com.taskpilot.intellitask_backend.service.AIService;
import com.taskpilot.intellitask_backend.service.TodoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/todo")
@RequiredArgsConstructor
public class TodoController {
    
    private final TodoService todoService;
    private final TodoItemRepository todoItemRepository;
    private final AIService aiService;
    
    @GetMapping
    public ResponseEntity<List<TodoItemDto>> getTodoItems(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = Long.parseLong(userDetails.getUsername());
        List<TodoItemDto> items = todoService.getUserTodos(userId);
        return ResponseEntity.ok(items);
    }
    
    @PostMapping
    public ResponseEntity<TodoItemDto> createTodoItem(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateTodoRequest request) {
        Long userId = Long.parseLong(userDetails.getUsername());
        TodoItemDto item = todoService.createTodo(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(item);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodoItem(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        Long userId = Long.parseLong(userDetails.getUsername());
        todoService.deleteTodo(userId, id);
        return ResponseEntity.noContent().build();
    }
    
    @PutMapping("/{id}/completed")
    public ResponseEntity<TodoItemDto> markCompleted(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestBody UpdateCompletionRequest request) {
        Long userId = Long.parseLong(userDetails.getUsername());
        TodoItemDto item = todoService.toggleCompletion(userId, id, request.getCompleted());
        return ResponseEntity.ok(item);
    }
    
    @GetMapping("/ai/daily-summary")
    public ResponseEntity<DailySummaryResponse> getDailySummary(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = Long.parseLong(userDetails.getUsername());
        List<TodoItem> userTasks = todoItemRepository.findByUserIdAndCompletedFalse(userId);
        
        if (userTasks.isEmpty()) {
            return ResponseEntity.ok(new DailySummaryResponse("All your tasks are completed! Great job staying productive."));
        }
        
        String summary = aiService.generateDailySummary(userTasks);
        return ResponseEntity.ok(new DailySummaryResponse(summary));
    }
    
    @PostMapping("/ai/update-priorities")
    public ResponseEntity<UpdatePrioritiesResponse> updatePriorities(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = Long.parseLong(userDetails.getUsername());
        UpdatePrioritiesResponse response = aiService.updateAllPriorities(userId);
        return ResponseEntity.ok(response);
    }
}