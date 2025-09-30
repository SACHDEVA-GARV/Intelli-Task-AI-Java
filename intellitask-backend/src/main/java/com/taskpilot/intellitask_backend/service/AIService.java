package com.taskpilot.intellitask_backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.taskpilot.intellitask_backend.dto.response.UpdatePrioritiesResponse;
import com.taskpilot.intellitask_backend.entity.TodoItem;
import com.taskpilot.intellitask_backend.repository.TodoItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
@Slf4j
public class AIService {
    
    private final TodoItemRepository todoItemRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    @Value("${gemini.api.key}")
    private String geminiApiKey;
    
    @Value("${gemini.api.url}")
    private String geminiApiUrl;
    
    private final WebClient webClient = WebClient.builder().build();
    
    public Integer generateTaskPriority(String task, LocalDate dueDate) {
        try {
            String prompt = buildPriorityPrompt(task, dueDate);
            String response = callGeminiApi(prompt);
            return parsePriorityResponse(response);
        } catch (Exception e) {
            log.error("Error generating task priority: ", e);
            return 3; // Default to medium priority
        }
    }
    
    public String generateDailySummary(List<TodoItem> tasks) {
        try {
            if (tasks.isEmpty()) {
                return "No tasks for today. It's a great day to plan ahead!";
            }
            
            String prompt = buildDailySummaryPrompt(tasks);
            String response = callGeminiApi(prompt);
            return parseSummaryResponse(response);
        } catch (Exception e) {
            log.error("Error generating daily summary: ", e);
            return "You have tasks to complete today. Stay focused and tackle them one by one!";
        }
    }
    
    @Transactional
    public UpdatePrioritiesResponse updateAllPriorities(Long userId) {
        List<TodoItem> incompleteTasks = todoItemRepository.findByUserIdAndCompletedFalse(userId);
        
        if (incompleteTasks.isEmpty()) {
            return new UpdatePrioritiesResponse("No incomplete tasks to update", 0);
        }
        
        int updatedCount = 0;
        for (TodoItem task : incompleteTasks) {
            try {
                Integer priority = generateTaskPriority(task.getTask(), task.getDate());
                task.setAiPriority(priority);
                todoItemRepository.save(task);
                updatedCount++;
                log.debug("Updated priority for task: {} -> Priority: {}", task.getTask(), priority);
                
                // Add small delay to avoid rate limiting
                Thread.sleep(100);
            } catch (Exception e) {
                log.error("Error updating priority for task: {}", task.getTask(), e);
            }
        }
        
        return new UpdatePrioritiesResponse(
            String.format("Successfully updated priorities for %d tasks", updatedCount),
            updatedCount
        );
    }
    
    private String buildPriorityPrompt(String task, LocalDate dueDate) {
        return String.format("""
            You are an expert productivity assistant. Analyze the following task and assign a priority score from 1-5:
            
            Task: "%s"
            Due Date: %s
            Today's Date: %s
            
            Consider:
            - How soon the due date is (the closer, the higher the priority)
            - If the task sounds urgent, important, or time-sensitive
            - If the task has keywords like urgent, ASAP, deadline, important, critical, etc.
            - If the task is routine or can be delayed, assign a lower priority
            
            Respond with ONLY a number from 1-5. No explanations, just the number.
            1 = Minimal, 2 = Low, 3 = Medium, 4 = High, 5 = Critical
            """,
            task,
            dueDate != null ? dueDate.format(DateTimeFormatter.ISO_LOCAL_DATE) : "No due date",
            LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE)
        );
    }
    
    private String buildDailySummaryPrompt(List<TodoItem> tasks) {
        StringBuilder taskList = new StringBuilder();
        tasks.stream()
            .filter(task -> !task.getCompleted())
            .sorted((a, b) -> {
                int priorityCompare = Integer.compare(
                    b.getAiPriority() != null ? b.getAiPriority() : 3,
                    a.getAiPriority() != null ? a.getAiPriority() : 3
                );
                return priorityCompare;
            })
            .limit(10)
            .forEach(task -> {
                String dueDate = task.getDate() != null ? 
                    task.getDate().format(DateTimeFormatter.ISO_LOCAL_DATE) : "No due date";
                taskList.append(String.format("- %s (Priority: %d, Due: %s)\n", 
                    task.getTask(), 
                    task.getAiPriority() != null ? task.getAiPriority() : 3,
                    dueDate
                ));
            });
        
        return String.format("""
            Generate a motivational daily summary for these pending tasks. Keep it to 2-3 sentences maximum.
            Focus on the highest priority items and encourage productivity.
            
            Tasks:
            %s
            
            Today's Date: %s
            
            Make the summary:
            - Encouraging and positive
            - Brief (2-3 sentences max)
            - Focus on top priorities
            - Actionable
            """,
            taskList.toString(),
            LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE)
        );
    }
    
    private String callGeminiApi(String prompt) {
        try {
            Map<String, Object> requestBody = new HashMap<>();
            Map<String, Object> content = new HashMap<>();
            Map<String, Object> part = new HashMap<>();
            
            part.put("text", prompt);
            content.put("parts", List.of(part));
            requestBody.put("contents", List.of(content));
            
            String responseBody = webClient.post()
                .uri(geminiApiUrl + "?key=" + geminiApiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(Mono.just(requestBody), Map.class)
                .retrieve()
                .bodyToMono(String.class)
                .block();
            
            JsonNode jsonNode = objectMapper.readTree(responseBody);
            return jsonNode.path("candidates").get(0)
                .path("content").path("parts").get(0)
                .path("text").asText();
                
        } catch (Exception e) {
            log.error("Error calling Gemini API: ", e);
            throw new RuntimeException("Failed to call Gemini API", e);
        }
    }
    
    private Integer parsePriorityResponse(String response) {
        try {
            String cleaned = response.trim().replaceAll("[^0-9]", "");
            int priority = Integer.parseInt(cleaned.substring(0, 1));
            return Math.max(1, Math.min(5, priority));
        } catch (Exception e) {
            log.warn("Failed to parse priority response: {}, defaulting to 3", response);
            return 3;
        }
    }
    
    private String parseSummaryResponse(String response) {
        // Clean up the response and ensure it's not too long
        String cleaned = response.trim();
        if (cleaned.length() > 500) {
            cleaned = cleaned.substring(0, 497) + "...";
        }
        return cleaned;
    }
}