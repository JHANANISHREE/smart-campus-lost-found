package com.campus.lostfound.repository;

import com.campus.lostfound.entity.ItemStatus;
import com.campus.lostfound.entity.LostItem;
import com.campus.lostfound.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface LostItemRepository extends JpaRepository<LostItem, Long> {

    Optional<LostItem> findByItemCode(String itemCode);

    Page<LostItem> findByReportedBy(User reportedBy, Pageable pageable);

    List<LostItem> findTop5ByOrderByCreatedAtDesc();

    long countByStatus(ItemStatus status);

    long countByReportedBy(User user);

    long countByReportedByAndStatus(User user, ItemStatus status);

    @Query("SELECT l FROM LostItem l WHERE " +
           "(:keyword IS NULL OR LOWER(l.itemName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(l.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(l.itemCode) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:categoryId IS NULL OR l.category.id = :categoryId) AND " +
           "(:location IS NULL OR LOWER(l.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:status IS NULL OR l.status = :status) AND " +
           "(:fromDate IS NULL OR l.dateLost >= :fromDate) AND " +
           "(:toDate IS NULL OR l.dateLost <= :toDate)")
    Page<LostItem> searchLostItems(
            @Param("keyword") String keyword,
            @Param("categoryId") Long categoryId,
            @Param("location") String location,
            @Param("status") ItemStatus status,
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate,
            Pageable pageable);
}

