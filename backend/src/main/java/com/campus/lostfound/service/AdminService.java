package com.campus.lostfound.service;

import com.campus.lostfound.dto.response.AdminDashboardResponse;
import com.campus.lostfound.dto.response.DashboardStatsResponse;
import com.campus.lostfound.entity.AccountStatus;
import com.campus.lostfound.entity.ItemHistory;
import com.campus.lostfound.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface AdminService {
    AdminDashboardResponse getAdminDashboardMetrics();
    DashboardStatsResponse getStudentDashboardMetrics(User student);
    Page<User> getAllStudents(String search, Pageable pageable);
    User updateStudentAccountStatus(Long studentId, AccountStatus status, User admin);
    List<ItemHistory> getRecentAuditLogs();
}

