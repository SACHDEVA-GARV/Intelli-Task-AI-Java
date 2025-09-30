package com.taskpilot.intellitask_backend.entity;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class UserTest {
    @Test
    void testUserGettersAndSetters() {
        User user = new User();
        user.setFirstName("Test");
        user.setEmail("test@example.com");

        assertEquals("Test", user.getFirstName());
        assertEquals("test@example.com", user.getEmail());
    }
}