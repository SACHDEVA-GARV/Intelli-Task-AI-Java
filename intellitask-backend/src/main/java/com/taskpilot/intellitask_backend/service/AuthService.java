package com.taskpilot.intellitask_backend.service;

import com.taskpilot.intellitask_backend.dto.request.LoginRequest;
import com.taskpilot.intellitask_backend.dto.request.SignUpRequest;
import com.taskpilot.intellitask_backend.dto.response.JwtResponse;
import com.taskpilot.intellitask_backend.dto.response.UserDto;
import com.taskpilot.intellitask_backend.entity.User;
import com.taskpilot.intellitask_backend.exception.BadRequestException;
import com.taskpilot.intellitask_backend.exception.ResourceNotFoundException;
import com.taskpilot.intellitask_backend.exception.UnauthorizedException;
import com.taskpilot.intellitask_backend.repository.TodoItemRepository;
import com.taskpilot.intellitask_backend.repository.UserRepository;
import com.taskpilot.intellitask_backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    
    private final UserRepository userRepository;
    private final TodoItemRepository todoItemRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    
    @Transactional
    public JwtResponse register(SignUpRequest request) {
        // Check if user already exists
        if (userRepository.existsByEmail(request.getEmail().toLowerCase())) {
            throw new BadRequestException("User already exists with this email");
        }
        
        // Create new user
        User user = new User();
        user.setFirstName(request.getFirstName().trim());
        user.setLastName(request.getLastName() != null ? request.getLastName().trim() : null);
        user.setEmail(request.getEmail().toLowerCase().trim());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        
        user = userRepository.save(user);
        
        // Generate token
        String token = jwtUtil.generateToken(user.getId().toString());
        
        // Create response
        UserDto userDto = mapToUserDto(user);
        return new JwtResponse(token, userDto);
    }
    
    public JwtResponse login(LoginRequest request) {
        // Find user by email
        User user = userRepository.findByEmail(request.getEmail().toLowerCase())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));
        
        // Check password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid email or password");
        }
        
        // Generate token
        String token = jwtUtil.generateToken(user.getId().toString());
        
        // Create response
        UserDto userDto = mapToUserDto(user);
        return new JwtResponse(token, userDto);
    }
    
    public UserDto getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        return mapToUserDto(user);
    }
    
    @Transactional
    public void deleteAccount(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        // Delete all todos (cascade will handle this, but let's log it)
        int deletedTodos = user.getTodoItems().size();
        log.info("Deleting {} todos for user {}", deletedTodos, userId);
        
        // Delete user (this will cascade delete todos)
        userRepository.delete(user);
        log.info("Successfully deleted user account: {}", userId);
    }
    
    private UserDto mapToUserDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .createdAt(user.getCreatedAt())
                .build();
    }
}