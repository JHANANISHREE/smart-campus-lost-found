package com.campus.lostfound.dto.response;

public class DashboardStatsResponse {
    private long totalReported;
    private long lostItemsCount;
    private long foundItemsCount;
    private long pendingClaimsCount;
    private long recoveredItemsCount;

    public DashboardStatsResponse() {}

    public DashboardStatsResponse(long totalReported, long lostItemsCount, long foundItemsCount,
                                  long pendingClaimsCount, long recoveredItemsCount) {
        this.totalReported = totalReported;
        this.lostItemsCount = lostItemsCount;
        this.foundItemsCount = foundItemsCount;
        this.pendingClaimsCount = pendingClaimsCount;
        this.recoveredItemsCount = recoveredItemsCount;
    }

    public long getTotalReported() {
        return totalReported;
    }

    public void setTotalReported(long totalReported) {
        this.totalReported = totalReported;
    }

    public long getLostItemsCount() {
        return lostItemsCount;
    }

    public void setLostItemsCount(long lostItemsCount) {
        this.lostItemsCount = lostItemsCount;
    }

    public long getFoundItemsCount() {
        return foundItemsCount;
    }

    public void setFoundItemsCount(long foundItemsCount) {
        this.foundItemsCount = foundItemsCount;
    }

    public long getPendingClaimsCount() {
        return pendingClaimsCount;
    }

    public void setPendingClaimsCount(long pendingClaimsCount) {
        this.pendingClaimsCount = pendingClaimsCount;
    }

    public long getRecoveredItemsCount() {
        return recoveredItemsCount;
    }

    public void setRecoveredItemsCount(long recoveredItemsCount) {
        this.recoveredItemsCount = recoveredItemsCount;
    }
}

