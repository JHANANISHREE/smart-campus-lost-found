package com.campus.lostfound.controller;

import com.campus.lostfound.dto.request.FoundItemRequest;
import com.campus.lostfound.dto.request.StatusUpdateRequest;
import com.campus.lostfound.dto.response.ApiResponse;
import com.campus.lostfound.entity.FoundItem;
import com.campus.lostfound.entity.ItemStatus;
import com.campus.lostfound.entity.User;
import com.campus.lostfound.service.AuthService;
import com.campus.lostfound.service.FoundItemService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/found-items")
public class FoundItemController {

    private final FoundItemService foundItemService;
    private final AuthService authService;

    public FoundItemController(FoundItemService foundItemService, AuthService authService) {
        this.foundItemService = foundItemService;
        this.authService = authService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<FoundItem>> reportFoundItem(@Valid @RequestBody FoundItemRequest request) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        FoundItem created = foundItemService.reportFoundItem(request, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Found item report registered successfully", created));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<FoundItem>>> searchFoundItems(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) ItemStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort) {

        String[] sortParams = sort.split(",");
        String sortField = sortParams[0];
        Sort.Direction direction = sortParams.length > 1 && "asc".equalsIgnoreCase(sortParams[1])
                ? Sort.Direction.ASC : Sort.Direction.DESC;

        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(direction, sortField));
        Page<FoundItem> items = foundItemService.searchFoundItems(keyword, categoryId, location, status, fromDate, toDate, pageRequest);

        return ResponseEntity.ok(ApiResponse.success(items));
    }

    @GetMapping("/recent")
    public ResponseEntity<ApiResponse<List<FoundItem>>> getRecentFoundItems() {
        return ResponseEntity.ok(ApiResponse.success(foundItemService.getRecentAvailableFoundItems()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FoundItem>> getFoundItemById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(foundItemService.getFoundItemById(id)));
    }

    @GetMapping("/my-items")
    public ResponseEntity<ApiResponse<Page<FoundItem>>> getMyFoundItems(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(ApiResponse.success(foundItemService.getMyFoundItems(currentUser, pageRequest)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FoundItem>> updateFoundItem(
            @PathVariable Long id,
            @Valid @RequestBody FoundItemRequest request) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        FoundItem updated = foundItemService.updateFoundItem(id, request, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Found item report updated", updated));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<FoundItem>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        FoundItem updated = foundItemService.updateFoundItemStatus(id, request, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Found item status updated", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteFoundItem(@PathVariable Long id) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        foundItemService.deleteFoundItem(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Found item report deleted", null));
    }
}

