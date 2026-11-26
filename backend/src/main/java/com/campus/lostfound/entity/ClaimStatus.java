package com.campus.lostfound.entity;

public enum ClaimStatus {
    PENDING,        // Newly submitted claim
    UNDER_REVIEW,   // Admin is inspecting claim details
    APPROVED,       // Claim approved by admin, ready for handover
    REJECTED,       // Claim rejected by admin (details did not match)
    COMPLETED       // Item physically handed over to verified student
}

