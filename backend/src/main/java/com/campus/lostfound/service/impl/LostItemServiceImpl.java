package com.campus.lostfound.service.impl;

import com.campus.lostfound.dto.request.LostItemRequest;
import com.campus.lostfound.dto.request.StatusUpdateRequest;
import com.campus.lostfound.entity.*;
import com.campus.lostfound.exception.ResourceNotFoundException;
import com.campus.lostfound.exception.UnauthorizedException;
import com.campus.lostfound.repository.CategoryRepository;
import com.campus.lostfound.repository.ItemHistoryRepository;
import com.campus.lostfound.repository.LostItemRepository;
import com.campus.lostfound.service.LostItemService;
import com.campus.lostfound.service.NotificationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class LostItemServiceImpl implements LostItemService {

    private final LostItemRepository lostItemRepository;
    private final CategoryRepository categoryRepository;
    private final ItemHistoryRepository itemHistoryRepository;
    private final NotificationService notificationService;

    public LostItemServiceImpl(LostItemRepository lostItemRepository,
                               CategoryRepository categoryRepository,
                               ItemHistoryRepository itemHistoryRepository,
                               NotificationService notificationService) {
        this.lostItemRepository = lostItemRepository;
        this.categoryRepository = categoryRepository;
        this.itemHistoryRepository = itemHistoryRepository;
        this.notificationService = notificationService;
    }

    @Override
    @Transactional
    public LostItem reportLostItem(LostItemRequest request, User reporter) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + request.getCategoryId()));

        String itemCode = "LOST-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        LostItem lostItem = new LostItem(
                itemCode,
                request.getItemName().trim(),
                category,
                request.getDescription().trim(),
                request.getLocation().trim(),
                request.getImageUrl(),
                request.getIdentifyingDetails(),
                reporter,
                request.getDateLost(),
                request.getTimeLost(),
                request.getContactPreference()
        );

        LostItem saved = lostItemRepository.save(lostItem);

        // Record Audit Trail
        itemHistoryRepository.save(new ItemHistory(
                ItemType.LOST,
                saved.getId(),
                "REPORT_CREATED",
                reporter,
                "Reported missing item: " + saved.getItemName() + " at " + saved.getLocation()
        ));

        // Send confirmation notification
        notificationService.sendNotification(
                reporter,
                "Lost Item Report Registered",
                "Your lost item report (" + saved.getItemCode() + " - " + saved.getItemName() + ") has been published.",
                "ITEM",
                saved.getItemCode()
        );

        return saved;
    }

    @Override
    public Page<LostItem> searchLostItems(String keyword, Long categoryId, String location, ItemStatus status,
                                          LocalDate fromDate, LocalDate toDate, Pageable pageable) {
        return lostItemRepository.searchLostItems(keyword, categoryId, location, status, fromDate, toDate, pageable);
    }

    @Override
    public LostItem getLostItemById(Long id) {
        return lostItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lost item report not found with ID: " + id));
    }

    @Override
    public Page<LostItem> getMyLostItems(User user, Pageable pageable) {
        return lostItemRepository.findByReportedBy(user, pageable);
    }

    @Override
    @Transactional
    public LostItem updateLostItem(Long id, LostItemRequest request, User user) {
        LostItem item = getLostItemById(id);

        if (!item.getReportedBy().getId().equals(user.getId()) && !user.isAdmin()) {
            throw new UnauthorizedException("You are not permitted to modify reports filed by other users.");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + request.getCategoryId()));

        item.setItemName(request.getItemName().trim());
        item.setCategory(category);
        item.setDescription(request.getDescription().trim());
        item.setDateLost(request.getDateLost());
        item.setTimeLost(request.getTimeLost());
        item.setLocation(request.getLocation().trim());
        if (request.getImageUrl() != null && !request.getImageUrl().isBlank()) {
            item.setImageUrl(request.getImageUrl());
        }
        item.setIdentifyingDetails(request.getIdentifyingDetails());
        item.setContactPreference(request.getContactPreference());

        LostItem saved = lostItemRepository.save(item);

        itemHistoryRepository.save(new ItemHistory(
                ItemType.LOST,
                saved.getId(),
                "REPORT_UPDATED",
                user,
                "Report details updated by " + user.getFullName()
        ));

        return saved;
    }

    @Override
    @Transactional
    public LostItem updateLostItemStatus(Long id, StatusUpdateRequest request, User user) {
        LostItem item = getLostItemById(id);

        if (!item.getReportedBy().getId().equals(user.getId()) && !user.isAdmin()) {
            throw new UnauthorizedException("You are not permitted to update the status of this report.");
        }

        item.setStatus(request.getStatus());
        LostItem saved = lostItemRepository.save(item);

        itemHistoryRepository.save(new ItemHistory(
                ItemType.LOST,
                saved.getId(),
                "STATUS_UPDATED",
                user,
                "Status changed to " + request.getStatus() + ". Remarks: " + (request.getRemarks() != null ? request.getRemarks() : "None")
        ));

        return saved;
    }

    @Override
    @Transactional
    public void deleteLostItem(Long id, User user) {
        LostItem item = getLostItemById(id);

        if (!item.getReportedBy().getId().equals(user.getId()) && !user.isAdmin()) {
            throw new UnauthorizedException("You are not permitted to delete this report.");
        }

        itemHistoryRepository.save(new ItemHistory(
                ItemType.LOST,
                item.getId(),
                "REPORT_DELETED",
                user,
                "Report removed by " + user.getFullName()
        ));

        lostItemRepository.delete(item);
    }

    @Override
    public List<LostItem> getRecentLostItems() {
        return lostItemRepository.findTop5ByOrderByCreatedAtDesc();
    }
}

