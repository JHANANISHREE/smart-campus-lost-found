package com.campus.lostfound.service.impl;

import com.campus.lostfound.dto.request.FoundItemRequest;
import com.campus.lostfound.dto.request.StatusUpdateRequest;
import com.campus.lostfound.entity.*;
import com.campus.lostfound.exception.ResourceNotFoundException;
import com.campus.lostfound.exception.UnauthorizedException;
import com.campus.lostfound.repository.CategoryRepository;
import com.campus.lostfound.repository.FoundItemRepository;
import com.campus.lostfound.repository.ItemHistoryRepository;
import com.campus.lostfound.service.FoundItemService;
import com.campus.lostfound.service.NotificationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class FoundItemServiceImpl implements FoundItemService {

    private final FoundItemRepository foundItemRepository;
    private final CategoryRepository categoryRepository;
    private final ItemHistoryRepository itemHistoryRepository;
    private final NotificationService notificationService;

    public FoundItemServiceImpl(FoundItemRepository foundItemRepository,
                                CategoryRepository categoryRepository,
                                ItemHistoryRepository itemHistoryRepository,
                                NotificationService notificationService) {
        this.foundItemRepository = foundItemRepository;
        this.categoryRepository = categoryRepository;
        this.itemHistoryRepository = itemHistoryRepository;
        this.notificationService = notificationService;
    }

    @Override
    @Transactional
    public FoundItem reportFoundItem(FoundItemRequest request, User reporter) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + request.getCategoryId()));

        String itemCode = "FND-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        FoundItem foundItem = new FoundItem(
                itemCode,
                request.getItemName().trim(),
                category,
                request.getDescription().trim(),
                request.getLocation().trim(),
                request.getImageUrl(),
                request.getIdentifyingDetails(),
                reporter,
                request.getDateFound(),
                request.getTimeFound()
        );

        FoundItem saved = foundItemRepository.save(foundItem);

        itemHistoryRepository.save(new ItemHistory(
                ItemType.FOUND,
                saved.getId(),
                "REPORT_CREATED",
                reporter,
                "Reported found item: " + saved.getItemName() + " at " + saved.getLocation()
        ));

        notificationService.sendNotification(
                reporter,
                "Found Item Registered",
                "Thank you for registering found item (" + saved.getItemCode() + " - " + saved.getItemName() + "). It is now listed for rightful owners to claim.",
                "ITEM",
                saved.getItemCode()
        );

        return saved;
    }

    @Override
    public Page<FoundItem> searchFoundItems(String keyword, Long categoryId, String location, ItemStatus status,
                                            LocalDate fromDate, LocalDate toDate, Pageable pageable) {
        return foundItemRepository.searchFoundItems(keyword, categoryId, location, status, fromDate, toDate, pageable);
    }

    @Override
    public FoundItem getFoundItemById(Long id) {
        return foundItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Found item record not found with ID: " + id));
    }

    @Override
    public Page<FoundItem> getMyFoundItems(User user, Pageable pageable) {
        return foundItemRepository.findByReportedBy(user, pageable);
    }

    @Override
    @Transactional
    public FoundItem updateFoundItem(Long id, FoundItemRequest request, User user) {
        FoundItem item = getFoundItemById(id);

        if (!item.getReportedBy().getId().equals(user.getId()) && !user.isAdmin()) {
            throw new UnauthorizedException("You are not authorized to update this found item listing.");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + request.getCategoryId()));

        item.setItemName(request.getItemName().trim());
        item.setCategory(category);
        item.setDescription(request.getDescription().trim());
        item.setDateFound(request.getDateFound());
        item.setTimeFound(request.getTimeFound());
        item.setLocation(request.getLocation().trim());
        if (request.getImageUrl() != null && !request.getImageUrl().isBlank()) {
            item.setImageUrl(request.getImageUrl());
        }
        item.setIdentifyingDetails(request.getIdentifyingDetails());

        FoundItem saved = foundItemRepository.save(item);

        itemHistoryRepository.save(new ItemHistory(
                ItemType.FOUND,
                saved.getId(),
                "REPORT_UPDATED",
                user,
                "Found item report updated by " + user.getFullName()
        ));

        return saved;
    }

    @Override
    @Transactional
    public FoundItem updateFoundItemStatus(Long id, StatusUpdateRequest request, User user) {
        FoundItem item = getFoundItemById(id);

        if (!item.getReportedBy().getId().equals(user.getId()) && !user.isAdmin()) {
            throw new UnauthorizedException("You are not permitted to change status for this found item.");
        }

        item.setStatus(request.getStatus());
        FoundItem saved = foundItemRepository.save(item);

        itemHistoryRepository.save(new ItemHistory(
                ItemType.FOUND,
                saved.getId(),
                "STATUS_UPDATED",
                user,
                "Status updated to " + request.getStatus() + ". Remarks: " + (request.getRemarks() != null ? request.getRemarks() : "None")
        ));

        return saved;
    }

    @Override
    @Transactional
    public void deleteFoundItem(Long id, User user) {
        FoundItem item = getFoundItemById(id);

        if (!item.getReportedBy().getId().equals(user.getId()) && !user.isAdmin()) {
            throw new UnauthorizedException("You are not permitted to remove this found item.");
        }

        itemHistoryRepository.save(new ItemHistory(
                ItemType.FOUND,
                item.getId(),
                "REPORT_DELETED",
                user,
                "Listing removed by " + user.getFullName()
        ));

        foundItemRepository.delete(item);
    }

    @Override
    public List<FoundItem> getRecentAvailableFoundItems() {
        return foundItemRepository.findTop6ByStatusOrderByCreatedAtDesc(ItemStatus.AVAILABLE);
    }
}

