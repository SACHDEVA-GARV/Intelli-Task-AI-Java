package com.taskpilot.intellitask_backend.entity;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import java.time.LocalDate;

class TodoItemTest {
    @Test
    void testTodoItemProperties() {
        TodoItem item = new TodoItem();
        item.setTask("Deploy the application");
        item.setCompleted(false);
        item.setDate(LocalDate.now());

        assertEquals("Deploy the application", item.getTask());
        assertFalse(item.isCompleted());
        assertNotNull(item.getDate());
    }
}