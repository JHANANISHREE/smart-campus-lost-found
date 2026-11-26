package com.campus.lostfound.controller;

import com.campus.lostfound.dto.request.LoginRequest;
import com.campus.lostfound.dto.request.RegisterRequest;
import com.campus.lostfound.dto.response.ApiResponse;
import com.campus.lostfound.dto.response.AuthResponse;
import com.campus.lostfound.dto.response.UserProfileResponse;
import com.campus.lostfound.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> loginStudent(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.loginStudent(request);
        return ResponseEntity.ok(ApiResponse.success("Student authentication successful", response));
    }

    @PostMapping("/admin/login")
    public ResponseEntity<ApiResponse<AuthResponse>> loginAdmin(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.loginAdmin(request);
        return ResponseEntity.ok(ApiResponse.success("Administrator authentication verified", response));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> registerStudent(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.registerStudent(request);
        return ResponseEntity.ok(ApiResponse.success("Student registered successfully", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getCurrentUser() {
        UserProfileResponse profile = authService.getCurrentUserProfile();
        return ResponseEntity.ok(ApiResponse.success(profile));
    }
}

