package com.campus.lostfound.controller;

import com.campus.lostfound.dto.request.ClaimRequest;
import com.campus.lostfound.dto.response.ApiResponse;
import com.campus.lostfound.entity.Claim;
import com.campus.lostfound.entity.User;
import com.campus.lostfound.service.AuthService;
import com.campus.lostfound.service.ClaimService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/claims")
public class ClaimController {

    private final ClaimService claimService;
    private final AuthService authService;

    public ClaimController(ClaimService claimService, AuthService authService) {
        this.claimService = claimService;
        this.authService = authService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Claim>> submitClaim(@Valid @RequestBody ClaimRequest request) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        Claim claim = claimService.submitClaim(request, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Ownership claim submitted for administrative review", claim));
    }

    @GetMapping("/my-claims")
    public ResponseEntity<ApiResponse<Page<Claim>>> getMyClaims(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "submittedAt"));
        return ResponseEntity.ok(ApiResponse.success(claimService.getMyClaims(currentUser, pageRequest)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Claim>> getClaimById(@PathVariable Long id) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(ApiResponse.success(claimService.getClaimById(id, currentUser)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> cancelClaim(@PathVariable Long id) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        claimService.cancelClaim(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Pending claim cancelled", null));
    }

    @GetMapping("/item/{foundItemId}")
    public ResponseEntity<ApiResponse<List<Claim>>> getClaimsForItem(@PathVariable Long foundItemId) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(ApiResponse.success(claimService.getClaimsForFoundItem(foundItemId, currentUser)));
    }
}

