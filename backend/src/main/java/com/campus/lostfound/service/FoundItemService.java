package com.campus.lostfound.service;

import com.campus.lostfound.dto.request.FoundItemRequest;
import com.campus.lostfound.dto.request.StatusUpdateRequest;
import com.campus.lostfound.entity.FoundItem;
import com.campus.lostfound.entity.ItemStatus;
import com.campus.lostfound.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface FoundItemService {
    FoundItem reportFoundItem(FoundItemRequest request, User reporter);
    Page<FoundItem> searchFoundItems(String keyword, Long categoryId, String location, ItemStatus status,
                                     LocalDate fromDate, LocalDate toDate, Pageable pageable);
    FoundItem getFoundItemById(Long id);
    Page<FoundItem> getMyFoundItems(User user, Pageable pageable);
    FoundItem updateFoundItem(Long id, FoundItemRequest request, User user);
    FoundItem updateFoundItemStatus(Long id, StatusUpdateRequest request, User user);
    void deleteFoundItem(Long id, User user);
    List<FoundItem> getRecentAvailableFoundItems();
}

