package com.taskpilot.intellitask_backend.dto.request;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class SignUpRequestTest {
    @Test
    void testSignUpRequest() {
        SignUpRequest request = new SignUpRequest(
            "Garv",
            "Sachdeva",
            "test@example.com",
            "password123"
        );

        assertEquals("Garv", request.getFirstName());
        assertEquals("test@example.com", request.getEmail());
        assertEquals(11, request.getPassword().length());
    }
}