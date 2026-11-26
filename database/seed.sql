-- =====================================================================
-- SMART CAMPUS LOST & FOUND MANAGEMENT SYSTEM
-- Seed Data Script
-- =====================================================================

USE smart_lost_found;

-- Disable foreign key checks for clean seeding
SET FOREIGN_KEY_CHECKS = 0;

DELETE FROM item_history;
DELETE FROM notifications;
DELETE FROM claims;
DELETE FROM found_items;
DELETE FROM lost_items;
DELETE FROM categories;
DELETE FROM users;

-- 1. INSERT CATEGORIES
INSERT INTO categories (id, category_name, description, icon) VALUES
(1, 'Electronics', 'Laptops, smartphones, chargers, headphones, calculators, USB drives', 'Laptop'),
(2, 'ID Cards', 'Student IDs, college passes, library cards, national IDs, driver licenses', 'CreditCard'),
(3, 'Books and Stationery', 'Notebooks, textbooks, binders, pen sets, scientific calculators', 'BookOpen'),
(4, 'Accessories', 'Watches, glasses, sunglasses, jewelry, wallets, wristbands', 'Watch'),
(5, 'Clothing', 'Jackets, lab coats, hoodies, scarves, caps, college blazers', 'Shirt'),
(6, 'Water Bottles', 'Metal flasks, hydro flasks, plastic water bottles, coffee tumblers', 'Coffee'),
(7, 'Keys', 'Dorm keys, bike keys, car keys, locker keys, keychains', 'Key'),
(8, 'Other', 'Sports equipment, umbrellas, bags, musical instruments, miscellaneous', 'HelpCircle');

-- 2. INSERT USERS (BCrypt hashes for password 'Admin@123' and 'Student@123')
-- Note: $2a$10$7EqJtq98hPqEX7fNZaFWoOhiM58Vq00.8b6q1e1vj27Z4g9HnI1uC = Admin@123 / Student@123
INSERT INTO users (id, full_name, email, password_hash, registration_number, department, year_of_study, phone_number, role, account_status) VALUES
(1, 'Campus Security Administrator', 'admin@campus.edu', '$2a$10$w85oJj7WzI2.Pq8vYx8KNuRjH7h7iV4WkZ7JmZ1X.l8fW3rV4.B6O', 'ADM-2024-001', 'Campus Security Operations', 0, '+91-9876543210', 'ADMIN', 'ACTIVE'),
(2, 'Aarav Sharma', 'student@campus.edu', '$2a$10$w85oJj7WzI2.Pq8vYx8KNuRjH7h7iV4WkZ7JmZ1X.l8fW3rV4.B6O', '21CS1045', 'Computer Science & Engineering', 3, '+91-9123456780', 'STUDENT', 'ACTIVE'),
(3, 'Ananya Patel', 'ananya.patel@campus.edu', '$2a$10$w85oJj7WzI2.Pq8vYx8KNuRjH7h7iV4WkZ7JmZ1X.l8fW3rV4.B6O', '22EC2012', 'Electronics & Communication', 2, '+91-9123456781', 'STUDENT', 'ACTIVE'),
(4, 'Rohan Verma', 'rohan.verma@campus.edu', '$2a$10$w85oJj7WzI2.Pq8vYx8KNuRjH7h7iV4WkZ7JmZ1X.l8fW3rV4.B6O', '20ME3054', 'Mechanical Engineering', 4, '+91-9123456782', 'STUDENT', 'ACTIVE');

-- 3. INSERT FOUND ITEMS
INSERT INTO found_items (id, item_code, item_name, category_id, description, date_found, time_found, location, image_url, identifying_details, reported_by, status) VALUES
(1, 'FND-2001', 'Apple AirPods Pro (2nd Gen)', 1, 'White AirPods Pro with a matte black silicone protective case found near table 14.', '2026-11-01', '14:30', 'Central Library - 2nd Floor Reading Hall', 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop', 'Serial ends in 9X2, tiny red scratch on left pod.', 3, 'AVAILABLE'),
(2, 'FND-2002', 'College ID Card - CSE Dept', 2, 'Student identity card of 3rd Year CSE student with blue college lanyard.', '2026-11-02', '11:15', 'Main Cafeteria Counter 3', 'https://images.unsplash.com/photo-1578357078586-491adf1aa5ba?w=600&auto=format&fit=crop', 'Student photo clearly visible, registration ending in 1045.', 4, 'CLAIMED'),
(3, 'FND-2003', 'Hydro Flask 32oz Insulated Bottle', 6, 'Stainless steel vacuum insulated wide mouth bottle, cobalt blue color with anime stickers.', '2026-11-03', '16:45', 'Indoor Badminton Court 2', 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop', 'Small dent on bottom rim, Luffy pirate sticker on side.', 2, 'AVAILABLE'),
(4, 'FND-2004', 'Casio FX-991EX Scientific Calculator', 1, 'Black ClassWiz non-programmable scientific calculator with sliding protective hard case.', '2026-11-02', '09:30', 'Auditorium A - Row G', 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=600&auto=format&fit=crop', 'Name initials "R.V." carved lightly on back panel.', 3, 'AVAILABLE'),
(5, 'FND-2005', 'Navy Blue Levi’s Denim Jacket', 5, 'Medium size washed navy trucker jacket with fleece inner collar, left on chair.', '2026-10-30', '18:00', 'Student Activity Center (SAC) Seminar Hall', 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop', 'Guitar pick found inside the right breast pocket.', 4, 'HANDED_OVER'),
(6, 'FND-2006', 'Set of 3 Keys with Marvel Keychain', 7, 'Two brass Godrej door keys and one bike key on a metallic Captain America shield keychain.', '2026-11-04', '08:20', 'South Parking Lot - Near Bicycle Stand 4', 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&auto=format&fit=crop', 'Honda embossed on black rubber key cover.', 2, 'AVAILABLE');

-- 4. INSERT LOST ITEMS
INSERT INTO lost_items (id, item_code, item_name, category_id, description, date_lost, time_lost, location, image_url, identifying_details, contact_preference, reported_by, status) VALUES
(1, 'LOST-1001', 'Apple MacBook Air M2 Space Grey', 1, '13-inch MacBook Air inside a dark grey felt sleeve. Contains semester project code and notes.', '2026-11-02', '15:30', 'Computer Lab 3 (Turing Hall)', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop', 'GitHub Octocat sticker on the front top-right lid.', 'PHONE', 2, 'LOST'),
(2, 'LOST-1002', 'Titan Neo Analog Watch with Brown Leather Strap', 4, 'Silver dial with roman numerals, brown genuine leather strap with stainless steel buckle.', '2026-11-01', '17:15', 'Campus Gymnasium / Changing Room', 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&auto=format&fit=crop', 'Model 1733SL01 engraved on the case back.', 'EMAIL', 4, 'LOST'),
(3, 'LOST-1003', 'Database System Concepts (Korth) 7th Edition', 3, 'Hardcover DBMS textbook with sticky tabs on Chapter 6 (Relational Algebra and SQL).', '2026-11-03', '13:00', 'Library Ground Floor Discussion Area', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop', 'Registration number 22EC2012 written on page 3 in pencil.', 'EMAIL', 3, 'FOUND_MATCH');

-- 5. INSERT CLAIMS
INSERT INTO claims (id, claim_code, found_item_id, claimed_by, claim_description, identifying_details, claim_status, reviewed_by, admin_remarks, submitted_at, reviewed_at, completed_at) VALUES
(1, 'CLM-3001', 2, 2, 'I lost my college ID card during lunch hour at Cafeteria Counter 3 while paying for snacks.', 'Name on ID is Aarav Sharma, registration number 21CS1045, barcode ending in 45.', 'APPROVED', 1, 'Verified student identity against college records and photo match. Ready for collection at Security Desk.', '2026-11-02 12:00:00', '2026-11-02 14:00:00', NULL),
(2, 'CLM-3002', 1, 4, 'I lost my AirPods Pro while studying in the library 2nd floor yesterday afternoon.', 'Connected bluetooth name is Rohan’s AirPods Pro. Firmware version matches.', 'PENDING', NULL, NULL, '2026-11-03 10:30:00', NULL, NULL);

-- 6. INSERT NOTIFICATIONS
INSERT INTO notifications (id, user_id, title, message, notification_type, reference_id, is_read) VALUES
(1, 2, 'Claim Approved!', 'Your ownership claim CLM-3001 for College ID Card has been approved by Campus Security. Please collect it from Admin Office Room 102.', 'CLAIM', 'CLM-3001', FALSE),
(2, 4, 'Claim Under Review', 'Your ownership claim CLM-3002 for Apple AirPods Pro is currently pending administrative review.', 'CLAIM', 'CLM-3002', TRUE),
(3, 3, 'New Claim on Your Found Item', 'A student has submitted an ownership claim for the ID Card you registered.', 'ITEM', 'FND-2002', TRUE),
(4, 2, 'Item Report Registered', 'Your lost item report LOST-1001 (Apple MacBook Air) has been published to campus bulletin.', 'ITEM', 'LOST-1001', TRUE);

-- 7. INSERT ITEM HISTORY
INSERT INTO item_history (id, item_type, item_id, action, performed_by, remarks) VALUES
(1, 'FOUND', 1, 'REPORT_CREATED', 3, 'Found AirPods Pro at Central Library 2nd Floor and registered report.'),
(2, 'FOUND', 2, 'REPORT_CREATED', 4, 'Found College ID Card at Cafeteria and registered report.'),
(3, 'CLAIM', 1, 'CLAIM_SUBMITTED', 2, 'Student Aarav Sharma submitted ownership claim CLM-3001.'),
(4, 'CLAIM', 1, 'CLAIM_APPROVED', 1, 'Administrator approved claim CLM-3001 after physical ID verification.'),
(5, 'LOST', 1, 'REPORT_CREATED', 2, 'Student Aarav Sharma reported lost MacBook Air.');

SET FOREIGN_KEY_CHECKS = 1;

