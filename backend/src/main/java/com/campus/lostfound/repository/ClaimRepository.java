package com.campus.lostfound.repository;

import com.campus.lostfound.entity.Claim;
import com.campus.lostfound.entity.ClaimStatus;
import com.campus.lostfound.entity.FoundItem;
import com.campus.lostfound.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClaimRepository extends JpaRepository<Claim, Long> {

    Optional<Claim> findByClaimCode(String claimCode);

    Page<Claim> findByClaimedBy(User claimedBy, Pageable pageable);

    List<Claim> findByFoundItem(FoundItem foundItem);

    boolean existsByFoundItemAndClaimedByAndClaimStatusIn(
            FoundItem foundItem, User claimedBy, List<ClaimStatus> statuses);

    long countByClaimStatus(ClaimStatus status);

    long countByClaimedBy(User user);

    long countByClaimedByAndClaimStatus(User user, ClaimStatus status);

    @Query("SELECT c FROM Claim c WHERE " +
           "(:status IS NULL OR c.claimStatus = :status) AND " +
           "(:search IS NULL OR LOWER(c.claimCode) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.foundItem.itemName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.claimedBy.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.claimedBy.registrationNumber) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Claim> searchClaims(
            @Param("status") ClaimStatus status,
            @Param("search") String search,
            Pageable pageable);
}

