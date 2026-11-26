package com.campus.lostfound.service;

import com.campus.lostfound.dto.request.LostItemRequest;
import com.campus.lostfound.dto.request.StatusUpdateRequest;
import com.campus.lostfound.entity.ItemStatus;
import com.campus.lostfound.entity.LostItem;
import com.campus.lostfound.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface LostItemService {
    LostItem reportLostItem(LostItemRequest request, User reporter);
    Page<LostItem> searchLostItems(String keyword, Long categoryId, String location, ItemStatus status,
                                   LocalDate fromDate, LocalDate toDate, Pageable pageable);
    LostItem getLostItemById(Long id);
    Page<LostItem> getMyLostItems(User user, Pageable pageable);
    LostItem updateLostItem(Long id, LostItemRequest request, User user);
    LostItem updateLostItemStatus(Long id, StatusUpdateRequest request, User user);
    void deleteLostItem(Long id, User user);
    List<LostItem> getRecentLostItems();
}

