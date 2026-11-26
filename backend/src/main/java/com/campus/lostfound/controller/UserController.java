package com.campus.lostfound.controller;

import com.campus.lostfound.dto.response.ApiResponse;
import com.campus.lostfound.dto.response.DashboardStatsResponse;
import com.campus.lostfound.entity.User;
import com.campus.lostfound.service.AdminService;
import com.campus.lostfound.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final AuthService authService;
    private final AdminService adminService;

    public UserController(AuthService authService, AdminService adminService) {
        this.authService = authService;
        this.adminService = adminService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getStudentDashboard() {
        User currentUser = authService.getCurrentAuthenticatedUser();
        DashboardStatsResponse stats = adminService.getStudentDashboardMetrics(currentUser);
        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}

