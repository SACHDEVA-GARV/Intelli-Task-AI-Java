package com.taskpilot.intellitask_backend.service;

import com.taskpilot.intellitask_backend.dto.request.CreateTodoRequest;
import com.taskpilot.intellitask_backend.dto.response.TodoItemDto;
import com.taskpilot.intellitask_backend.entity.TodoItem;
import com.taskpilot.intellitask_backend.entity.User;
import com.taskpilot.intellitask_backend.exception.BadRequestException;
import com.taskpilot.intellitask_backend.exception.ResourceNotFoundException;
import com.taskpilot.intellitask_backend.repository.TodoItemRepository;
import com.taskpilot.intellitask_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TodoService {
    
    private final TodoItemRepository todoItemRepository;
    private final UserRepository userRepository;
    private final AIService aiService;
    
    @Transactional
    public TodoItemDto createTodo(Long userId, CreateTodoRequest request) {
        if (request.getTask() == null || request.getTask().trim().isEmpty()) {
            throw new BadRequestException("Task name is required");
        }
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        // Generate AI priority for the new task
        Integer aiPriority = aiService.generateTaskPriority(request.getTask().trim(), request.getDate());
        
        TodoItem todoItem = new TodoItem();
        todoItem.setTask(request.getTask().trim());
        todoItem.setDate(request.getDate());
        todoItem.setUser(user);
        todoItem.setAiPriority(aiPriority);
        todoItem.setCompleted(false);
        
        todoItem = todoItemRepository.save(todoItem);
        
        return mapToDto(todoItem);
    }
    
    public List<TodoItemDto> getUserTodos(Long userId) {
        List<TodoItem> todoItems = todoItemRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return todoItems.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public void deleteTodo(Long userId, Long todoId) {
        TodoItem todoItem = todoItemRepository.findByIdAndUserId(todoId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        
        todoItemRepository.delete(todoItem);
    }
    
    @Transactional
    public TodoItemDto toggleCompletion(Long userId, Long todoId, Boolean completed) {
        TodoItem todoItem = todoItemRepository.findByIdAndUserId(todoId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        
        if (completed != null) {
            todoItem.setCompleted(completed);
        } else {
            todoItem.setCompleted(!todoItem.getCompleted());
        }
        
        todoItem = todoItemRepository.save(todoItem);
        return mapToDto(todoItem);
    }
    
    private TodoItemDto mapToDto(TodoItem todoItem) {
        return TodoItemDto.builder()
                .id(todoItem.getId())
                .name(todoItem.getTask())
                .dueDate(todoItem.getDate())
                .completed(todoItem.getCompleted())
                .aiPriority(todoItem.getAiPriority())
                .createdAt(todoItem.getCreatedAt())
                .updatedAt(todoItem.getUpdatedAt())
                .build();
    }
}