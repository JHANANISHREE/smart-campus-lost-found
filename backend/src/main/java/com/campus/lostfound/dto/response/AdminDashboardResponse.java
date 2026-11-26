package com.campus.lostfound.dto.response;

import java.util.List;
import java.util.Map;

public class AdminDashboardResponse {
    private long totalStudents;
    private long totalLostItems;
    private long totalFoundItems;
    private long pendingVerification;
    private long pendingClaims;
    private long approvedClaims;
    private long recoveredItems;
    private long activeReports;

    private List<Map<String, Object>> categoryDistribution;
    private List<Map<String, Object>> monthlyTrends;
    private List<Map<String, Object>> claimStatusDistribution;

    public AdminDashboardResponse() {}

    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public long getTotalLostItems() {
        return totalLostItems;
    }

    public void setTotalLostItems(long totalLostItems) {
        this.totalLostItems = totalLostItems;
    }

    public long getTotalFoundItems() {
        return totalFoundItems;
    }

    public void setTotalFoundItems(long totalFoundItems) {
        this.totalFoundItems = totalFoundItems;
    }

    public long getPendingVerification() {
        return pendingVerification;
    }

    public void setPendingVerification(long pendingVerification) {
        this.pendingVerification = pendingVerification;
    }

    public long getPendingClaims() {
        return pendingClaims;
    }

    public void setPendingClaims(long pendingClaims) {
        this.pendingClaims = pendingClaims;
    }

    public long getApprovedClaims() {
        return approvedClaims;
    }

    public void setApprovedClaims(long approvedClaims) {
        this.approvedClaims = approvedClaims;
    }

    public long getRecoveredItems() {
        return recoveredItems;
    }

    public void setRecoveredItems(long recoveredItems) {
        this.recoveredItems = recoveredItems;
    }

    public long getActiveReports() {
        return activeReports;
    }

    public void setActiveReports(long activeReports) {
        this.activeReports = activeReports;
    }

    public List<Map<String, Object>> getCategoryDistribution() {
        return categoryDistribution;
    }

    public void setCategoryDistribution(List<Map<String, Object>> categoryDistribution) {
        this.categoryDistribution = categoryDistribution;
    }

    public List<Map<String, Object>> getMonthlyTrends() {
        return monthlyTrends;
    }

    public void setMonthlyTrends(List<Map<String, Object>> monthlyTrends) {
        this.monthlyTrends = monthlyTrends;
    }

    public List<Map<String, Object>> getClaimStatusDistribution() {
        return claimStatusDistribution;
    }

    public void setClaimStatusDistribution(List<Map<String, Object>> claimStatusDistribution) {
        this.claimStatusDistribution = claimStatusDistribution;
    }
}

