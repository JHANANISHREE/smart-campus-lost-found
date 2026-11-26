package com.campus.lostfound.service;

import com.campus.lostfound.dto.request.LoginRequest;
import com.campus.lostfound.dto.request.RegisterRequest;
import com.campus.lostfound.dto.response.AuthResponse;
import com.campus.lostfound.dto.response.UserProfileResponse;
import com.campus.lostfound.entity.User;

public interface AuthService {
    AuthResponse loginStudent(LoginRequest loginRequest);
    AuthResponse loginAdmin(LoginRequest loginRequest);
    AuthResponse registerStudent(RegisterRequest registerRequest);
    User getCurrentAuthenticatedUser();
    UserProfileResponse getCurrentUserProfile();
}

