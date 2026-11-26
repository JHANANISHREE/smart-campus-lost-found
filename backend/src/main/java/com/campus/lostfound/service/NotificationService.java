package com.campus.lostfound.service;

import com.campus.lostfound.entity.Notification;
import com.campus.lostfound.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface NotificationService {
    Notification sendNotification(User recipient, String title, String message, String type, String referenceId);
    List<Notification> getRecentNotifications(User user);
    Page<Notification> getAllNotifications(User user, Pageable pageable);
    long getUnreadCount(User user);
    void markAsRead(Long notificationId, User user);
    void markAllAsRead(User user);
}

