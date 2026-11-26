package com.campus.lostfound.service.impl;

import com.campus.lostfound.dto.request.ClaimRequest;
import com.campus.lostfound.dto.request.ClaimReviewRequest;
import com.campus.lostfound.entity.*;
import com.campus.lostfound.exception.BadRequestException;
import com.campus.lostfound.exception.ResourceNotFoundException;
import com.campus.lostfound.exception.UnauthorizedException;
import com.campus.lostfound.repository.ClaimRepository;
import com.campus.lostfound.repository.FoundItemRepository;
import com.campus.lostfound.repository.ItemHistoryRepository;
import com.campus.lostfound.service.ClaimService;
import com.campus.lostfound.service.NotificationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class ClaimServiceImpl implements ClaimService {

    private final ClaimRepository claimRepository;
    private final FoundItemRepository foundItemRepository;
    private final ItemHistoryRepository itemHistoryRepository;
    private final NotificationService notificationService;

    public ClaimServiceImpl(ClaimRepository claimRepository,
                            FoundItemRepository foundItemRepository,
                            ItemHistoryRepository itemHistoryRepository,
                            NotificationService notificationService) {
        this.claimRepository = claimRepository;
        this.foundItemRepository = foundItemRepository;
        this.itemHistoryRepository = itemHistoryRepository;
        this.notificationService = notificationService;
    }

    @Override
    @Transactional
    public Claim submitClaim(ClaimRequest request, User claimant) {
        FoundItem foundItem = foundItemRepository.findById(request.getFoundItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Found item not found with ID: " + request.getFoundItemId()));

        if (foundItem.getStatus() == ItemStatus.HANDED_OVER) {
            throw new BadRequestException("This item has already been recovered and handed over to its verified owner.");
        }

        // Prevent reporting student from claiming their own found item
        if (foundItem.getReportedBy().getId().equals(claimant.getId())) {
            throw new BadRequestException("You cannot submit an ownership claim on an item that you reported finding.");
        }

        // Prevent multiple pending or approved claims by the same claimant on the same item
        boolean hasExistingClaim = claimRepository.existsByFoundItemAndClaimedByAndClaimStatusIn(
                foundItem, claimant, Arrays.asList(ClaimStatus.PENDING, ClaimStatus.UNDER_REVIEW, ClaimStatus.APPROVED)
        );

        if (hasExistingClaim) {
            throw new BadRequestException("You already have an active claim submitted for this item.");
        }

        String claimCode = "CLM-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Claim claim = new Claim(
                claimCode,
                foundItem,
                claimant,
                request.getClaimDescription().trim(),
                request.getIdentifyingDetails().trim()
        );

        Claim savedClaim = claimRepository.save(claim);

        // Audit Trail
        itemHistoryRepository.save(new ItemHistory(
                ItemType.CLAIM,
                savedClaim.getId(),
                "CLAIM_SUBMITTED",
                claimant,
                "Ownership claim " + savedClaim.getClaimCode() + " submitted for item: " + foundItem.getItemName()
        ));

        // Notify claimant
        notificationService.sendNotification(
                claimant,
                "Ownership Claim Submitted",
                "Your ownership claim (" + savedClaim.getClaimCode() + ") for " + foundItem.getItemName() + " has been received and is pending verification.",
                "CLAIM",
                savedClaim.getClaimCode()
        );

        // Notify found item reporter that a claim has been made
        notificationService.sendNotification(
                foundItem.getReportedBy(),
                "Claim Received on Found Item",
                "A student has submitted an ownership claim for found item (" + foundItem.getItemCode() + " - " + foundItem.getItemName() + ").",
                "ITEM",
                foundItem.getItemCode()
        );

        return savedClaim;
    }

    @Override
    public Page<Claim> getMyClaims(User user, Pageable pageable) {
        return claimRepository.findByClaimedBy(user, pageable);
    }

    @Override
    public Claim getClaimById(Long id, User currentUser) {
        Claim claim = claimRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Claim record not found with ID: " + id));

        if (!claim.getClaimedBy().getId().equals(currentUser.getId()) && !currentUser.isAdmin()) {
            throw new UnauthorizedException("You are not authorized to view this claim.");
        }

        return claim;
    }

    @Override
    public Page<Claim> getAllClaimsForAdmin(ClaimStatus status, String search, Pageable pageable) {
        return claimRepository.searchClaims(status, search, pageable);
    }

    @Override
    @Transactional
    public Claim reviewClaim(Long id, ClaimReviewRequest request, User admin) {
        if (!admin.isAdmin()) {
            throw new UnauthorizedException("Only campus administrators can review claims.");
        }

        if (request.getStatus() == ClaimStatus.APPROVED) {
            return approveClaim(id, request.getAdminRemarks(), admin);
        } else if (request.getStatus() == ClaimStatus.REJECTED) {
            return rejectClaim(id, request.getAdminRemarks(), admin);
        } else if (request.getStatus() == ClaimStatus.COMPLETED) {
            return completeClaim(id, request.getAdminRemarks(), admin);
        }

        Claim claim = claimRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found with ID: " + id));

        claim.setClaimStatus(request.getStatus());
        claim.setReviewedBy(admin);
        claim.setReviewedAt(LocalDateTime.now());
        claim.setAdminRemarks(request.getAdminRemarks());

        return claimRepository.save(claim);
    }

    @Override
    @Transactional
    public Claim approveClaim(Long id, String adminRemarks, User admin) {
        if (!admin.isAdmin()) {
            throw new UnauthorizedException("Only campus administrators can approve claims.");
        }

        Claim claim = claimRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found with ID: " + id));

        claim.setClaimStatus(ClaimStatus.APPROVED);
        claim.setReviewedBy(admin);
        claim.setReviewedAt(LocalDateTime.now());
        claim.setAdminRemarks(adminRemarks != null ? adminRemarks : "Verified ownership details with campus records.");

        // Update Found Item status to CLAIMED
        FoundItem foundItem = claim.getFoundItem();
        foundItem.setStatus(ItemStatus.CLAIMED);
        foundItemRepository.save(foundItem);

        Claim saved = claimRepository.save(claim);

        // Audit Trail
        itemHistoryRepository.save(new ItemHistory(
                ItemType.CLAIM,
                saved.getId(),
                "CLAIM_APPROVED",
                admin,
                "Claim " + saved.getClaimCode() + " approved. Remarks: " + saved.getAdminRemarks()
        ));

        // Notify Claimant
        notificationService.sendNotification(
                claim.getClaimedBy(),
                "Claim Approved! Collect Your Item",
                "Your ownership claim " + claim.getClaimCode() + " for " + foundItem.getItemName() + " has been approved! Please visit the Security Office to collect your item.",
                "CLAIM",
                claim.getClaimCode()
        );

        return saved;
    }

    @Override
    @Transactional
    public Claim rejectClaim(Long id, String adminRemarks, User admin) {
        if (!admin.isAdmin()) {
            throw new UnauthorizedException("Only campus administrators can reject claims.");
        }

        Claim claim = claimRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found with ID: " + id));

        claim.setClaimStatus(ClaimStatus.REJECTED);
        claim.setReviewedBy(admin);
        claim.setReviewedAt(LocalDateTime.now());
        claim.setAdminRemarks(adminRemarks != null ? adminRemarks : "Provided details did not match item characteristics.");

        Claim saved = claimRepository.save(claim);

        // Audit Trail
        itemHistoryRepository.save(new ItemHistory(
                ItemType.CLAIM,
                saved.getId(),
                "CLAIM_REJECTED",
                admin,
                "Claim " + saved.getClaimCode() + " rejected. Remarks: " + saved.getAdminRemarks()
        ));

        // Notify Claimant
        notificationService.sendNotification(
                claim.getClaimedBy(),
                "Claim Status Update",
                "Your ownership claim " + claim.getClaimCode() + " for " + claim.getFoundItem().getItemName() + " was not approved. Remarks: " + saved.getAdminRemarks(),
                "CLAIM",
                claim.getClaimCode()
        );

        return saved;
    }

    @Override
    @Transactional
    public Claim completeClaim(Long id, String adminRemarks, User admin) {
        if (!admin.isAdmin()) {
            throw new UnauthorizedException("Only campus administrators can complete claims.");
        }

        Claim claim = claimRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found with ID: " + id));

        claim.setClaimStatus(ClaimStatus.COMPLETED);
        claim.setCompletedAt(LocalDateTime.now());
        if (adminRemarks != null) {
            claim.setAdminRemarks(adminRemarks);
        }

        FoundItem item = claim.getFoundItem();
        item.setStatus(ItemStatus.HANDED_OVER);
        foundItemRepository.save(item);

        Claim saved = claimRepository.save(claim);

        // Audit Trail
        itemHistoryRepository.save(new ItemHistory(
                ItemType.CLAIM,
                saved.getId(),
                "ITEM_RECOVERED_HANDOVER",
                admin,
                "Item " + item.getItemCode() + " handed over to student " + claim.getClaimedBy().getFullName()
        ));

        // Notify Claimant
        notificationService.sendNotification(
                claim.getClaimedBy(),
                "Item Recovery Complete",
                "Your item recovery for " + item.getItemName() + " is complete. Thank you for using Smart Campus Lost & Found!",
                "CLAIM",
                claim.getClaimCode()
        );

        return saved;
    }

    @Override
    @Transactional
    public void cancelClaim(Long id, User claimant) {
        Claim claim = claimRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found with ID: " + id));

        if (!claim.getClaimedBy().getId().equals(claimant.getId()) && !claimant.isAdmin()) {
            throw new UnauthorizedException("You are not authorized to cancel this claim.");
        }

        if (claim.getClaimStatus() != ClaimStatus.PENDING) {
            throw new BadRequestException("Only pending claims can be cancelled.");
        }

        claimRepository.delete(claim);
    }

    @Override
    public List<Claim> getClaimsForFoundItem(Long foundItemId, User currentUser) {
        FoundItem item = foundItemRepository.findById(foundItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Found item not found with ID: " + foundItemId));

        if (!item.getReportedBy().getId().equals(currentUser.getId()) && !currentUser.isAdmin()) {
            throw new UnauthorizedException("You are not authorized to view claims for this item.");
        }

        return claimRepository.findByFoundItem(item);
    }
}

