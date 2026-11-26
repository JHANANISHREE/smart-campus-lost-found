package com.campus.lostfound.dto.request;

import com.campus.lostfound.entity.ClaimStatus;
import jakarta.validation.constraints.NotNull;

public class ClaimReviewRequest {

    @NotNull(message = "Review status is required")
    private ClaimStatus status;

    private String adminRemarks;

    public ClaimReviewRequest() {}

    public ClaimStatus getStatus() {
        return status;
    }

    public void setStatus(ClaimStatus status) {
        this.status = status;
    }

    public String getAdminRemarks() {
        return adminRemarks;
    }

    public void setAdminRemarks(String adminRemarks) {
        this.adminRemarks = adminRemarks;
    }
}

