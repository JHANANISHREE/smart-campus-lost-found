package com.campus.lostfound.entity;

public enum ItemStatus {
    LOST,           // Initial status for reported lost items
    AVAILABLE,      // Initial status for reported found items
    FOUND_MATCH,    // Potential match found for a lost item
    CLAIMED,        // Found item has an active claim
    HANDED_OVER,    // Found item successfully returned to owner
    RECOVERED,      // Lost item recovered by owner
    CANCELLED,      // Lost report cancelled by student
    REJECTED        // Found report rejected by admin
}

