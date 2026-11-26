package com.campus.lostfound.controller;

import com.campus.lostfound.dto.request.LostItemRequest;
import com.campus.lostfound.dto.request.StatusUpdateRequest;
import com.campus.lostfound.dto.response.ApiResponse;
import com.campus.lostfound.entity.ItemStatus;
import com.campus.lostfound.entity.LostItem;
import com.campus.lostfound.entity.User;
import com.campus.lostfound.service.AuthService;
import com.campus.lostfound.service.LostItemService;
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
@RequestMapping("/api/lost-items")
public class LostItemController {

    private final LostItemService lostItemService;
    private final AuthService authService;

    public LostItemController(LostItemService lostItemService, AuthService authService) {
        this.lostItemService = lostItemService;
        this.authService = authService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<LostItem>> reportLostItem(@Valid @RequestBody LostItemRequest request) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        LostItem created = lostItemService.reportLostItem(request, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Lost item reported successfully", created));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<LostItem>>> searchLostItems(
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
        Page<LostItem> items = lostItemService.searchLostItems(keyword, categoryId, location, status, fromDate, toDate, pageRequest);

        return ResponseEntity.ok(ApiResponse.success(items));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LostItem>> getLostItemById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(lostItemService.getLostItemById(id)));
    }

    @GetMapping("/my-items")
    public ResponseEntity<ApiResponse<Page<LostItem>>> getMyLostItems(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(ApiResponse.success(lostItemService.getMyLostItems(currentUser, pageRequest)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<LostItem>> updateLostItem(
            @PathVariable Long id,
            @Valid @RequestBody LostItemRequest request) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        LostItem updated = lostItemService.updateLostItem(id, request, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Lost item report updated", updated));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<LostItem>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        LostItem updated = lostItemService.updateLostItemStatus(id, request, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Report status updated", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteLostItem(@PathVariable Long id) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        lostItemService.deleteLostItem(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Report deleted successfully", null));
    }

    @GetMapping("/recent")
    public ResponseEntity<ApiResponse<List<LostItem>>> getRecentLostItems() {
        return ResponseEntity.ok(ApiResponse.success(lostItemService.getRecentLostItems()));
    }
}

