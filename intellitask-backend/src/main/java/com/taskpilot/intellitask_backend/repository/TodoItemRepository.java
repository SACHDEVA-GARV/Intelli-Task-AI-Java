package com.taskpilot.intellitask_backend.repository;

import com.taskpilot.intellitask_backend.entity.TodoItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TodoItemRepository extends JpaRepository<TodoItem, Long> {
    List<TodoItem> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<TodoItem> findByUserIdAndCompletedFalse(Long userId);
    Optional<TodoItem> findByIdAndUserId(Long id, Long userId);
    void deleteByIdAndUserId(Long id, Long userId);
    int countByUserIdAndCompletedFalse(Long userId);
}
