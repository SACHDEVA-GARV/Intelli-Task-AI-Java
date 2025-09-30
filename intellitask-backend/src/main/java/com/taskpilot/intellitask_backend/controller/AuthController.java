package com.taskpilot.intellitask_backend.controller;

import com.taskpilot.intellitask_backend.dto.request.LoginRequest;
import com.taskpilot.intellitask_backend.dto.request.SignUpRequest;
import com.taskpilot.intellitask_backend.dto.response.JwtResponse;
import com.taskpilot.intellitask_backend.dto.response.UserDto;
import com.taskpilot.intellitask_backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;
    
    @PostMapping("/signup")
    public ResponseEntity<JwtResponse> register(@Valid @RequestBody SignUpRequest request) {
        JwtResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@Valid @RequestBody LoginRequest request) {
        JwtResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = Long.parseLong(userDetails.getUsername());
        UserDto user = authService.getProfile(userId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("user", user);
        
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/account")
    public ResponseEntity<Map<String, Object>> deleteAccount(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = Long.parseLong(userDetails.getUsername());
        authService.deleteAccount(userId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Account deleted successfully");
        
        return ResponseEntity.ok(response);
    }
}