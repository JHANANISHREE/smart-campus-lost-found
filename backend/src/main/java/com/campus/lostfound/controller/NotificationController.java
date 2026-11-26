package com.campus.lostfound.controller;

import com.campus.lostfound.dto.response.ApiResponse;
import com.campus.lostfound.entity.Notification;
import com.campus.lostfound.entity.User;
import com.campus.lostfound.service.AuthService;
import com.campus.lostfound.service.NotificationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final AuthService authService;

    public NotificationController(NotificationService notificationService, AuthService authService) {
        this.notificationService = notificationService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Notification>>> getRecentNotifications() {
        User currentUser = authService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(ApiResponse.success(notificationService.getRecentNotifications(currentUser)));
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<Page<Notification>>> getAllNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(ApiResponse.success(notificationService.getAllNotifications(currentUser, PageRequest.of(page, size))));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getUnreadCount() {
        User currentUser = authService.getCurrentAuthenticatedUser();
        Map<String, Long> res = new HashMap<>();
        res.put("unreadCount", notificationService.getUnreadCount(currentUser));
        return ResponseEntity.ok(ApiResponse.success(res));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(@PathVariable Long id) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        notificationService.markAsRead(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read", null));
    }

    @PutMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead() {
        User currentUser = authService.getCurrentAuthenticatedUser();
        notificationService.markAllAsRead(currentUser);
        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read", null));
    }
}

