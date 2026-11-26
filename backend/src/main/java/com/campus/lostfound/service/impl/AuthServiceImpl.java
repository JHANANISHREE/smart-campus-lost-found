package com.campus.lostfound.service.impl;

import com.campus.lostfound.dto.request.LoginRequest;
import com.campus.lostfound.dto.request.RegisterRequest;
import com.campus.lostfound.dto.response.AuthResponse;
import com.campus.lostfound.dto.response.UserProfileResponse;
import com.campus.lostfound.entity.AccountStatus;
import com.campus.lostfound.entity.Role;
import com.campus.lostfound.entity.User;
import com.campus.lostfound.exception.BadRequestException;
import com.campus.lostfound.exception.ResourceNotFoundException;
import com.campus.lostfound.exception.UnauthorizedException;
import com.campus.lostfound.repository.ClaimRepository;
import com.campus.lostfound.repository.FoundItemRepository;
import com.campus.lostfound.repository.LostItemRepository;
import com.campus.lostfound.repository.UserRepository;
import com.campus.lostfound.security.JwtTokenProvider;
import com.campus.lostfound.service.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final LostItemRepository lostItemRepository;
    private final FoundItemRepository foundItemRepository;
    private final ClaimRepository claimRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthServiceImpl(UserRepository userRepository,
                           LostItemRepository lostItemRepository,
                           FoundItemRepository foundItemRepository,
                           ClaimRepository claimRepository,
                           PasswordEncoder passwordEncoder,
                           AuthenticationManager authenticationManager,
                           JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.lostItemRepository = lostItemRepository;
        this.foundItemRepository = foundItemRepository;
        this.claimRepository = claimRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @Override
    public AuthResponse loginStudent(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (user.getAccountStatus() == AccountStatus.SUSPENDED) {
            throw new UnauthorizedException("Your student account has been suspended by campus administration.");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail().trim().toLowerCase(), loginRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication, user.getRole().name());

        return new AuthResponse(
                jwt,
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.getRegistrationNumber(),
                user.getDepartment(),
                user.getYearOfStudy()
        );
    }

    @Override
    public AuthResponse loginAdmin(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new BadCredentialsException("Invalid administrator credentials"));

        if (user.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Access Denied: This account does not possess Administrative privileges.");
        }

        if (user.getAccountStatus() == AccountStatus.SUSPENDED) {
            throw new UnauthorizedException("This administrative account is currently suspended.");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail().trim().toLowerCase(), loginRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication, user.getRole().name());

        return new AuthResponse(
                jwt,
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.getRegistrationNumber(),
                user.getDepartment(),
                user.getYearOfStudy()
        );
    }

    @Override
    @Transactional
    public AuthResponse registerStudent(RegisterRequest registerRequest) {
        String email = registerRequest.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("An account with email " + email + " already exists.");
        }

        if (userRepository.existsByRegistrationNumber(registerRequest.getRegistrationNumber().trim())) {
            throw new BadRequestException("Student registration number " + registerRequest.getRegistrationNumber() + " is already registered.");
        }

        User newUser = new User();
        newUser.setFullName(registerRequest.getFullName().trim());
        newUser.setEmail(email);
        newUser.setPasswordHash(passwordEncoder.encode(registerRequest.getPassword()));
        newUser.setRegistrationNumber(registerRequest.getRegistrationNumber().trim().toUpperCase());
        newUser.setDepartment(registerRequest.getDepartment().trim());
        newUser.setYearOfStudy(registerRequest.getYearOfStudy());
        newUser.setPhoneNumber(registerRequest.getPhoneNumber());
        newUser.setRole(Role.STUDENT);
        newUser.setAccountStatus(AccountStatus.ACTIVE);

        User savedUser = userRepository.save(newUser);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, registerRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication, savedUser.getRole().name());

        return new AuthResponse(
                jwt,
                savedUser.getId(),
                savedUser.getFullName(),
                savedUser.getEmail(),
                savedUser.getRole(),
                savedUser.getRegistrationNumber(),
                savedUser.getDepartment(),
                savedUser.getYearOfStudy()
        );
    }

    @Override
    public User getCurrentAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new UnauthorizedException("User session is not authenticated.");
        }

        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found in database."));
    }

    @Override
    public UserProfileResponse getCurrentUserProfile() {
        User user = getCurrentAuthenticatedUser();

        UserProfileResponse response = new UserProfileResponse();
        response.setId(user.getId());
        response.setFullName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setRegistrationNumber(user.getRegistrationNumber());
        response.setDepartment(user.getDepartment());
        response.setYearOfStudy(user.getYearOfStudy());
        response.setPhoneNumber(user.getPhoneNumber());
        response.setRole(user.getRole());
        response.setAccountStatus(user.getAccountStatus());
        response.setCreatedAt(user.getCreatedAt());

        response.setTotalLostReported(lostItemRepository.countByReportedBy(user));
        response.setTotalFoundReported(foundItemRepository.countByReportedBy(user));
        response.setTotalClaimsMade(claimRepository.countByClaimedBy(user));

        return response;
    }
}

