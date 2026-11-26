package com.campus.lostfound.config;

import com.campus.lostfound.entity.*;
import com.campus.lostfound.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final LostItemRepository lostItemRepository;
    private final FoundItemRepository foundItemRepository;
    private final ClaimRepository claimRepository;
    private final NotificationRepository notificationRepository;
    private final ItemHistoryRepository itemHistoryRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.bootstrap.admin.email:admin@campus.edu}")
    private String adminEmail;

    @Value("${app.bootstrap.admin.password:Admin@123}")
    private String adminPassword;

    @Value("${app.bootstrap.admin.name:Campus Security Administrator}")
    private String adminName;

    @Value("${app.bootstrap.student.email:student@campus.edu}")
    private String studentEmail;

    @Value("${app.bootstrap.student.password:Student@123}")
    private String studentPassword;

    @Value("${app.bootstrap.student.name:Aarav Sharma}")
    private String studentName;

    public DataInitializer(UserRepository userRepository,
                           CategoryRepository categoryRepository,
                           LostItemRepository lostItemRepository,
                           FoundItemRepository foundItemRepository,
                           ClaimRepository claimRepository,
                           NotificationRepository notificationRepository,
                           ItemHistoryRepository itemHistoryRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.lostItemRepository = lostItemRepository;
        this.foundItemRepository = foundItemRepository;
        this.claimRepository = claimRepository;
        this.notificationRepository = notificationRepository;
        this.itemHistoryRepository = itemHistoryRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        logger.info("Initializing Smart Campus Lost & Found System Data...");

        // 1. Seed Categories
        seedCategories();

        // 2. Seed Admin & Student Users
        User admin = seedAdminUser();
        User student = seedDemoStudent();

        // 3. Seed Sample Lost & Found Items if database is clean
        seedSampleDataIfEmpty(admin, student);

        logger.info("Database bootstrap initialization completed successfully.");
    }

    private void seedCategories() {
        if (categoryRepository.count() == 0) {
            categoryRepository.save(new Category("Electronics", "Laptops, phones, chargers, audio gear, calculators", "Laptop"));
            categoryRepository.save(new Category("ID Cards", "Student identity cards, college passes, library tags", "CreditCard"));
            categoryRepository.save(new Category("Books and Stationery", "Textbooks, notebooks, calculators, files", "BookOpen"));
            categoryRepository.save(new Category("Accessories", "Watches, glasses, sunglasses, jewelry, wallets", "Watch"));
            categoryRepository.save(new Category("Clothing", "Jackets, lab coats, hoodies, scarves, college blazers", "Shirt"));
            categoryRepository.save(new Category("Water Bottles", "Flasks, insulated bottles, tumblers", "Coffee"));
            categoryRepository.save(new Category("Keys", "Dorm keys, bike keys, locker keys, keychains", "Key"));
            categoryRepository.save(new Category("Other", "Sports equipment, umbrellas, bags, miscellaneous", "HelpCircle"));
            logger.info("Created standard campus item categories.");
        }
    }

    private User seedAdminUser() {
        return userRepository.findByEmail(adminEmail).orElseGet(() -> {
            User newAdmin = new User();
            newAdmin.setFullName(adminName);
            newAdmin.setEmail(adminEmail);
            newAdmin.setPasswordHash(passwordEncoder.encode(adminPassword));
            newAdmin.setRegistrationNumber("ADM-2024-001");
            newAdmin.setDepartment("Campus Security Operations");
            newAdmin.setYearOfStudy(0);
            newAdmin.setPhoneNumber("+91-9876543210");
            newAdmin.setRole(Role.ADMIN);
            newAdmin.setAccountStatus(AccountStatus.ACTIVE);
            User saved = userRepository.save(newAdmin);
            logger.info("Bootstrapped default Administrator account: {}", adminEmail);
            return saved;
        });
    }

    private User seedDemoStudent() {
        return userRepository.findByEmail(studentEmail).orElseGet(() -> {
            User demoStudent = new User();
            demoStudent.setFullName(studentName);
            demoStudent.setEmail(studentEmail);
            demoStudent.setPasswordHash(passwordEncoder.encode(studentPassword));
            demoStudent.setRegistrationNumber("21CS1045");
            demoStudent.setDepartment("Computer Science & Engineering");
            demoStudent.setYearOfStudy(3);
            demoStudent.setPhoneNumber("+91-9123456780");
            demoStudent.setRole(Role.STUDENT);
            demoStudent.setAccountStatus(AccountStatus.ACTIVE);
            User saved = userRepository.save(demoStudent);
            logger.info("Bootstrapped demo Student account: {}", studentEmail);
            return saved;
        });
    }

    private void seedSampleDataIfEmpty(User admin, User student) {
        if (foundItemRepository.count() == 0 && lostItemRepository.count() == 0) {
            Category electronics = categoryRepository.findByCategoryName("Electronics").orElse(null);
            Category idCards = categoryRepository.findByCategoryName("ID Cards").orElse(null);
            Category bottles = categoryRepository.findByCategoryName("Water Bottles").orElse(null);
            Category clothing = categoryRepository.findByCategoryName("Clothing").orElse(null);

            // Create another student
            User secondStudent = new User();
            secondStudent.setFullName("Ananya Patel");
            secondStudent.setEmail("ananya.patel@campus.edu");
            secondStudent.setPasswordHash(passwordEncoder.encode("Student@123"));
            secondStudent.setRegistrationNumber("22EC2012");
            secondStudent.setDepartment("Electronics & Communication");
            secondStudent.setYearOfStudy(2);
            secondStudent.setPhoneNumber("+91-9123456781");
            secondStudent.setRole(Role.STUDENT);
            secondStudent.setAccountStatus(AccountStatus.ACTIVE);
            secondStudent = userRepository.save(secondStudent);

            // Found Items
            FoundItem f1 = new FoundItem(
                    "FND-2001",
                    "Apple AirPods Pro (2nd Gen)",
                    electronics,
                    "White AirPods Pro with a matte black silicone protective case found on study desk.",
                    "Central Library - 2nd Floor Reading Hall",
                    "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop",
                    "Serial number ends in 9X2, tiny scratch on left pod stem.",
                    secondStudent,
                    LocalDate.now().minusDays(2),
                    "14:30"
            );
            foundItemRepository.save(f1);

            FoundItem f2 = new FoundItem(
                    "FND-2002",
                    "College ID Card - CSE Dept",
                    idCards,
                    "Student identity card of 3rd Year CSE student with blue college lanyard.",
                    "Main Cafeteria Counter 3",
                    "https://images.unsplash.com/photo-1578357078586-491adf1aa5ba?w=600&auto=format&fit=crop",
                    "Student photo clearly visible, registration ending in 1045.",
                    secondStudent,
                    LocalDate.now().minusDays(1),
                    "11:15"
            );
            f2.setStatus(ItemStatus.CLAIMED);
            f2 = foundItemRepository.save(f2);

            FoundItem f3 = new FoundItem(
                    "FND-2003",
                    "Hydro Flask 32oz Insulated Bottle",
                    bottles,
                    "Stainless steel vacuum insulated wide mouth bottle, cobalt blue color with anime stickers.",
                    "Indoor Badminton Court 2",
                    "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop",
                    "Small dent on bottom rim, Luffy pirate sticker on side.",
                    student,
                    LocalDate.now().minusDays(3),
                    "16:45"
            );
            foundItemRepository.save(f3);

            FoundItem f4 = new FoundItem(
                    "FND-2004",
                    "Navy Blue Levi’s Denim Jacket",
                    clothing,
                    "Medium size washed navy trucker jacket with fleece inner collar.",
                    "Student Activity Center (SAC) Seminar Hall",
                    "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop",
                    "Guitar pick inside the right breast pocket.",
                    secondStudent,
                    LocalDate.now().minusDays(4),
                    "18:00"
            );
            f4.setStatus(ItemStatus.HANDED_OVER);
            foundItemRepository.save(f4);

            // Lost Items
            LostItem l1 = new LostItem(
                    "LOST-1001",
                    "Apple MacBook Air M2 Space Grey",
                    electronics,
                    "13-inch MacBook Air inside a dark grey felt sleeve. Contains semester project code and notes.",
                    "Computer Lab 3 (Turing Hall)",
                    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop",
                    "GitHub Octocat sticker on the front top-right lid.",
                    student,
                    LocalDate.now().minusDays(1),
                    "15:30",
                    "PHONE"
            );
            lostItemRepository.save(l1);

            // Sample Claim
            Claim claim = new Claim(
                    "CLM-3001",
                    f2,
                    student,
                    "I lost my college ID card during lunch hour at Cafeteria Counter 3 while paying for snacks.",
                    "Name on ID is Aarav Sharma, registration number 21CS1045, barcode ending in 45."
            );
            claim.setClaimStatus(ClaimStatus.APPROVED);
            claim.setReviewedBy(admin);
            claim.setReviewedAt(LocalDateTime.now().minusHours(4));
            claim.setAdminRemarks("Verified student identity against college records. Ready for collection at Security Desk Room 102.");
            claimRepository.save(claim);

            // Sample Notifications
            notificationRepository.save(new Notification(
                    student,
                    "Claim Approved!",
                    "Your ownership claim CLM-3001 for College ID Card has been approved by Campus Security. Please collect it from Admin Office Room 102.",
                    "CLAIM",
                    "CLM-3001"
            ));

            notificationRepository.save(new Notification(
                    student,
                    "Item Report Registered",
                    "Your lost item report LOST-1001 (Apple MacBook Air) has been published to campus bulletin.",
                    "ITEM",
                    "LOST-1001"
            ));

            logger.info("Sample items and claims seeded.");
        }
    }
}

