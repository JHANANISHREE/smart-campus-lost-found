package com.campus.lostfound.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ClaimRequest {

    @NotNull(message = "Found item ID is required")
    private Long foundItemId;

    @NotBlank(message = "Please explain why this item belongs to you")
    private String claimDescription;

    @NotBlank(message = "Please provide unique identifying details to prove ownership")
    private String identifyingDetails;

    public ClaimRequest() {}

    public Long getFoundItemId() {
        return foundItemId;
    }

    public void setFoundItemId(Long foundItemId) {
        this.foundItemId = foundItemId;
    }

    public String getClaimDescription() {
        return claimDescription;
    }

    public void setClaimDescription(String claimDescription) {
        this.claimDescription = claimDescription;
    }

    public String getIdentifyingDetails() {
        return identifyingDetails;
    }

    public void setIdentifyingDetails(String identifyingDetails) {
        this.identifyingDetails = identifyingDetails;
    }
}

