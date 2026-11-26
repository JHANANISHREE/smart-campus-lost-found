package com.campus.lostfound.dto.response;

import com.campus.lostfound.entity.Role;

public class AuthResponse {
    private String token;
    private String tokenType = "Bearer";
    private Long id;
    private String fullName;
    private String email;
    private Role role;
    private String registrationNumber;
    private String department;
    private Integer yearOfStudy;

    public AuthResponse() {}

    public AuthResponse(String token, Long id, String fullName, String email, Role role,
                        String registrationNumber, String department, Integer yearOfStudy) {
        this.token = token;
        this.tokenType = "Bearer";
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.registrationNumber = registrationNumber;
        this.department = department;
        this.yearOfStudy = yearOfStudy;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

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

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
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
}

