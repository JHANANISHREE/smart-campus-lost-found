package com.campus.lostfound.repository;

import com.campus.lostfound.entity.ItemHistory;
import com.campus.lostfound.entity.ItemType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemHistoryRepository extends JpaRepository<ItemHistory, Long> {
    List<ItemHistory> findByItemTypeAndItemIdOrderByCreatedAtDesc(ItemType itemType, Long itemId);
    List<ItemHistory> findTop15ByOrderByCreatedAtDesc();
}

