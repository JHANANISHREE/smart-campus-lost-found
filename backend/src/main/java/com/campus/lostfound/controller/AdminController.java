package com.campus.lostfound.controller;

import com.campus.lostfound.dto.request.ClaimReviewRequest;
import com.campus.lostfound.dto.response.AdminDashboardResponse;
import com.campus.lostfound.dto.response.ApiResponse;
import com.campus.lostfound.entity.AccountStatus;
import com.campus.lostfound.entity.Claim;
import com.campus.lostfound.entity.ClaimStatus;
import com.campus.lostfound.entity.ItemHistory;
import com.campus.lostfound.entity.User;
import com.campus.lostfound.service.AdminService;
import com.campus.lostfound.service.AuthService;
import com.campus.lostfound.service.ClaimService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final ClaimService claimService;
    private final AuthService authService;

    public AdminController(AdminService adminService, ClaimService claimService, AuthService authService) {
        this.adminService = adminService;
        this.claimService = claimService;
        this.authService = authService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<AdminDashboardResponse>> getAdminDashboard() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getAdminDashboardMetrics()));
    }

    @GetMapping("/claims")
    public ResponseEntity<ApiResponse<Page<Claim>>> getAllClaims(
            @RequestParam(required = false) ClaimStatus status,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "submittedAt"));
        return ResponseEntity.ok(ApiResponse.success(claimService.getAllClaimsForAdmin(status, search, pageRequest)));
    }

    @PutMapping("/claims/{id}/review")
    public ResponseEntity<ApiResponse<Claim>> reviewClaim(
            @PathVariable Long id,
            @Valid @RequestBody ClaimReviewRequest request) {
        User admin = authService.getCurrentAuthenticatedUser();
        Claim updated = claimService.reviewClaim(id, request, admin);
        return ResponseEntity.ok(ApiResponse.success("Claim reviewed successfully", updated));
    }

    @PutMapping("/claims/{id}/approve")
    public ResponseEntity<ApiResponse<Claim>> approveClaim(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        User admin = authService.getCurrentAuthenticatedUser();
        String remarks = body != null ? body.get("remarks") : "Claim verified and approved by campus security.";
        Claim updated = claimService.approveClaim(id, remarks, admin);
        return ResponseEntity.ok(ApiResponse.success("Claim approved successfully", updated));
    }

    @PutMapping("/claims/{id}/reject")
    public ResponseEntity<ApiResponse<Claim>> rejectClaim(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        User admin = authService.getCurrentAuthenticatedUser();
        String remarks = body != null ? body.get("remarks") : "Verification failed. Item characteristics did not match.";
        Claim updated = claimService.rejectClaim(id, remarks, admin);
        return ResponseEntity.ok(ApiResponse.success("Claim rejected", updated));
    }

    @PutMapping("/claims/{id}/complete")
    public ResponseEntity<ApiResponse<Claim>> completeClaim(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        User admin = authService.getCurrentAuthenticatedUser();
        String remarks = body != null ? body.get("remarks") : "Item handed over to verified owner.";
        Claim updated = claimService.completeClaim(id, remarks, admin);
        return ResponseEntity.ok(ApiResponse.success("Item recovery completed and handed over", updated));
    }

    @GetMapping("/students")
    public ResponseEntity<ApiResponse<Page<User>>> getAllStudents(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(ApiResponse.success(adminService.getAllStudents(search, pageRequest)));
    }

    @PatchMapping("/students/{id}/status")
    public ResponseEntity<ApiResponse<User>> updateStudentStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        User admin = authService.getCurrentAuthenticatedUser();
        AccountStatus status = AccountStatus.valueOf(body.get("status"));
        User updated = adminService.updateStudentAccountStatus(id, status, admin);
        return ResponseEntity.ok(ApiResponse.success("Student account status updated to " + status, updated));
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<ApiResponse<List<ItemHistory>>> getRecentAuditLogs() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getRecentAuditLogs()));
    }
}

