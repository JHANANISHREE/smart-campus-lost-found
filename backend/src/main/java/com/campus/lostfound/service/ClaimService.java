package com.campus.lostfound.service;

import com.campus.lostfound.dto.request.ClaimRequest;
import com.campus.lostfound.dto.request.ClaimReviewRequest;
import com.campus.lostfound.entity.Claim;
import com.campus.lostfound.entity.ClaimStatus;
import com.campus.lostfound.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ClaimService {
    Claim submitClaim(ClaimRequest request, User claimant);
    Page<Claim> getMyClaims(User user, Pageable pageable);
    Claim getClaimById(Long id, User currentUser);
    Page<Claim> getAllClaimsForAdmin(ClaimStatus status, String search, Pageable pageable);
    Claim reviewClaim(Long id, ClaimReviewRequest request, User admin);
    Claim approveClaim(Long id, String adminRemarks, User admin);
    Claim rejectClaim(Long id, String adminRemarks, User admin);
    Claim completeClaim(Long id, String adminRemarks, User admin);
    void cancelClaim(Long id, User claimant);
    List<Claim> getClaimsForFoundItem(Long foundItemId, User currentUser);
}

