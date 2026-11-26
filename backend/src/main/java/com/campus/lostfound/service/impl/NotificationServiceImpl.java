package com.campus.lostfound.service.impl;

import com.campus.lostfound.entity.Notification;
import com.campus.lostfound.entity.User;
import com.campus.lostfound.exception.ResourceNotFoundException;
import com.campus.lostfound.exception.UnauthorizedException;
import com.campus.lostfound.repository.NotificationRepository;
import com.campus.lostfound.service.NotificationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationServiceImpl(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Override
    @Transactional
    public Notification sendNotification(User recipient, String title, String message, String type, String referenceId) {
        Notification notification = new Notification(recipient, title, message, type, referenceId);
        return notificationRepository.save(notification);
    }

    @Override
    public List<Notification> getRecentNotifications(User user) {
        return notificationRepository.findTop10ByUserOrderByCreatedAtDesc(user);
    }

    @Override
    public Page<Notification> getAllNotifications(User user, Pageable pageable) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user, pageable);
    }

    @Override
    public long getUnreadCount(User user) {
        return notificationRepository.countByUserAndIsReadFalse(user);
    }

    @Override
    @Transactional
    public void markAsRead(Long notificationId, User user) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with ID: " + notificationId));

        if (!notification.getUser().getId().equals(user.getId()) && !user.isAdmin()) {
            throw new UnauthorizedException("You are not authorized to update this notification.");
        }

        notification.setIsRead(true);
        notificationRepository.save(notification);
    }

    @Override
    @Transactional
    public void markAllAsRead(User user) {
        List<Notification> unread = notificationRepository.findTop10ByUserOrderByCreatedAtDesc(user);
        for (Notification n : unread) {
            n.setIsRead(true);
        }
        notificationRepository.saveAll(unread);
    }
}

