package com.campus.lostfound.repository;

import com.campus.lostfound.entity.FoundItem;
import com.campus.lostfound.entity.ItemStatus;
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
public interface FoundItemRepository extends JpaRepository<FoundItem, Long> {

    Optional<FoundItem> findByItemCode(String itemCode);

    Page<FoundItem> findByReportedBy(User reportedBy, Pageable pageable);

    List<FoundItem> findTop6ByStatusOrderByCreatedAtDesc(ItemStatus status);

    long countByStatus(ItemStatus status);

    long countByReportedBy(User user);

    long countByReportedByAndStatus(User user, ItemStatus status);

    @Query("SELECT f FROM FoundItem f WHERE " +
           "(:keyword IS NULL OR LOWER(f.itemName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(f.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(f.itemCode) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:categoryId IS NULL OR f.category.id = :categoryId) AND " +
           "(:location IS NULL OR LOWER(f.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:status IS NULL OR f.status = :status) AND " +
           "(:fromDate IS NULL OR f.dateFound >= :fromDate) AND " +
           "(:toDate IS NULL OR f.dateFound <= :toDate)")
    Page<FoundItem> searchFoundItems(
            @Param("keyword") String keyword,
            @Param("categoryId") Long categoryId,
            @Param("location") String location,
            @Param("status") ItemStatus status,
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate,
            Pageable pageable);
}

