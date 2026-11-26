package com.campus.lostfound.dto.response;

import com.campus.lostfound.entity.AccountStatus;
import com.campus.lostfound.entity.Role;
import java.time.LocalDateTime;

public class UserProfileResponse {
    private Long id;
    private String fullName;
    private String email;
    private String registrationNumber;
    private String department;
    private Integer yearOfStudy;
    private String phoneNumber;
    private Role role;
    private AccountStatus accountStatus;
    private LocalDateTime createdAt;
    private long totalLostReported;
    private long totalFoundReported;
    private long totalClaimsMade;

    public UserProfileResponse() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRegistrationNumber() {
        return registrationNumber;
    }

    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public Integer getYearOfStudy() {
        return yearOfStudy;
    }

    public void setYearOfStudy(Integer yearOfStudy) {
        this.yearOfStudy = yearOfStudy;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public AccountStatus getAccountStatus() {
        return accountStatus;
    }

    public void setAccountStatus(AccountStatus accountStatus) {
        this.accountStatus = accountStatus;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public long getTotalLostReported() {
        return totalLostReported;
    }

    public void setTotalLostReported(long totalLostReported) {
        this.totalLostReported = totalLostReported;
    }

    public long getTotalFoundReported() {
        return totalFoundReported;
    }

    public void setTotalFoundReported(long totalFoundReported) {
        this.totalFoundReported = totalFoundReported;
    }

    public long getTotalClaimsMade() {
        return totalClaimsMade;
    }

    public void setTotalClaimsMade(long totalClaimsMade) {
        this.totalClaimsMade = totalClaimsMade;
    }
}

