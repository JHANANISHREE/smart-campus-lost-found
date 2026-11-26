package com.campus.lostfound.repository;

import com.campus.lostfound.entity.AccountStatus;
import com.campus.lostfound.entity.Role;
import com.campus.lostfound.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByRegistrationNumber(String registrationNumber);

    long countByRole(Role role);

    long countByAccountStatus(AccountStatus status);

    @Query("SELECT u FROM User u WHERE u.role = :role AND " +
           "(:search IS NULL OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.registrationNumber) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<User> searchStudents(@Param("role") Role role, @Param("search") String search, Pageable pageable);
}

