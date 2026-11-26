# Smart Campus Lost & Found Management System

> **A Full-Stack College Project Demonstration Web Application**  
> *Developed for Java Object-Oriented Programming (OOP) and Database Management Systems (DBMS) Evaluation*

---

## 1. Project Overview & Problem Statement

College campuses accommodate thousands of students and faculty members across diverse academic halls, laboratories, auditoriums, cafeterias, and sporting complexes. Misplacing valuables such as laptops, smartphones, identity cards, scientific calculators, keys, and textbooks is a daily occurrence.

Traditional lost-and-found mechanisms suffer from major deficiencies:
* Reliance on unindexed, handwritten registers at security desks.
* Unstructured messaging across informal WhatsApp and social media groups.
* Complete absence of confidentiality, exposing student belongings to fraudulent ownership claims.
* Zero transparency and lack of real-time auditability.

**The Smart Campus Lost & Found Management System** resolves these challenges through a centralized, role-based, production-ready web platform. Students can catalog missing belongings, report found items, search listings with granular filters, and submit secure ownership claims. Campus administrators and security personnel inspect physical traits, approve claims, and safely supervise item handover.

---

## 2. Technology Stack

### Frontend Tier
* **Framework:** React 18 with Vite
* **Language:** TypeScript
* **Styling:** Tailwind CSS (Modern SaaS dashboard theme)
* **Icons:** Lucide React
* **Data Visualization:** Recharts
* **HTTP Client:** Axios (configured with JWT authorization interceptors)
* **Routing:** React Router v6

### Backend Tier
* **Language & Runtime:** Java (OpenJDK 17 / 21 / 25 compatible)
* **Framework:** Spring Boot 3.3.5
* **Security:** Spring Security 6, BCrypt Password Hashing, Stateless JSON Web Tokens (JJWT)
* **Persistence & ORM:** Spring Data JPA, Hibernate ORM
* **Build Tool:** Apache Maven 3.9.9 (Portable Maven Wrapper included)

### Database Tier
* **Primary Database:** MySQL 8.0+
* **Fallback / Zero-Install Profile:** H2 In-Memory Database (MySQL compatibility mode)
* **Relational Features:** 3NF Normalization, Foreign Key Cascades, B-Tree Indexes, ACID Transactions, Audit Trail (`item_history`)

---

## 3. Project Directory Structure

```
dbms and java project/
│
├── backend/                                # Spring Boot Java Application
│   ├── src/main/java/com/campus/lostfound/
│   │   ├── config/                        # SecurityConfig, WebConfig, DataInitializer
│   │   ├── controller/                    # REST API Controllers
│   │   ├── dto/                           # Request & Response DTOs
│   │   ├── entity/                        # JPA Entities (BaseItem, LostItem, FoundItem, User, etc.)
│   │   ├── exception/                     # Global Exception Handlers
│   │   ├── repository/                    # Spring Data JPA Repositories
│   │   ├── security/                      # JWT Provider, CustomUserDetailsService, JWT Filter
│   │   ├── service/                       # Service Interfaces & Implementations
│   │   └── LostFoundApplication.java      # Spring Boot Main Class
│   ├── src/main/resources/
│   │   ├── application.properties         # MySQL 8 Configuration
│   │   └── application-h2.properties      # Zero-install H2 In-Memory Profile
│   ├── mvnw.cmd                           # Maven wrapper script
│   └── pom.xml                            # Maven Dependencies & Build Configuration
│
├── frontend/                               # React + Vite + TypeScript Application
│   ├── src/
│   │   ├── components/                    # Navbar, Footer, Sidebars
│   │   ├── context/                       # AuthContext (JWT session state)
│   │   ├── layouts/                       # StudentLayout, AdminLayout
│   │   ├── pages/                         # Public, Auth, Student, and Admin Pages
│   │   ├── services/                      # Axios API Client Modules
│   │   ├── types/                         # TypeScript Domain Interfaces
│   │   ├── App.tsx                        # Router Configuration
│   │   ├── index.css                      # Tailwind Directives & Custom Styles
│   │   └── main.tsx                       # React DOM Entrypoint
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── database/
│   ├── schema.sql                         # Complete MySQL 8 DDL Schema
│   └── seed.sql                           # Initial Preloaded Sample Data
│
├── run-backend.bat                        # Interactive Windows Launch Script for Backend
├── run-frontend.bat                       # Interactive Windows Launch Script for Frontend
├── mvnw.cmd                               # Root Maven CLI Wrapper
├── .gitignore
└── README.md
```

---

## 4. Academic Demonstration: Java OOP Concepts

The codebase is engineered to showcase core Java Object-Oriented Programming (OOP) principles:

1. **Encapsulation:**
   * All domain entities (`User`, `BaseItem`, `LostItem`, `FoundItem`, `Claim`, `Notification`, `ItemHistory`) enforce private fields accessible exclusively through validated getters, setters, and business methods.
   * Passwords are never stored in plain text and are excluded from JSON serialization via `@JsonIgnore`.

2. **Inheritance:**
   * Abstract mapped superclass `BaseItem` encapsulates shared attributes (`itemCode`, `itemName`, `category`, `description`, `location`, `imageUrl`, `identifyingDetails`, `reportedBy`, `status`, `createdAt`).
   * `LostItem extends BaseItem` adds attributes specific to misplaced belongings (`dateLost`, `timeLost`, `contactPreference`).
   * `FoundItem extends BaseItem` adds attributes specific to recovered items (`dateFound`, `timeFound`).

3. **Polymorphism:**
   * Abstract methods `getItemType()` and `isPendingAction()` in `BaseItem` are polymorphically implemented by `LostItem` and `FoundItem`.
   * Interface implementations dynamically resolve services through Spring Dependency Injection.

4. **Abstraction:**
   * Separation of business contracts via Java Interfaces (`AuthService`, `LostItemService`, `FoundItemService`, `ClaimService`, `AdminService`, `NotificationService`) and their respective Spring implementations in `service.impl`.

5. **Enums & Collections:**
   * Strongly typed domain states (`Role`, `AccountStatus`, `ItemStatus`, `ClaimStatus`, `ItemType`).
   * Stream API filters, mappings, and collection transformations across repository query results.

---

## 5. Academic Demonstration: DBMS Concepts

1. **Relational Normalization (3NF):**
   * Tables are organized to eliminate data anomalies and update redundancies.
   * `users` 1:N `lost_items`, `users` 1:N `found_items`, `found_items` 1:N `claims`, `categories` 1:N `items`.

2. **Referential Integrity & Foreign Keys:**
   * Explicit foreign key constraints with cascading rules (`ON DELETE CASCADE` on claims when an item is removed; `ON DELETE SET NULL` on audit records).

3. **Database Indexing:**
   * B-tree indexes defined on high-frequency search fields (`email`, `registration_number`, `role`, `category_id`, `status`, `date_lost`, `date_found`).

4. **ACID Transactions:**
   * Service methods such as `approveClaim()`, `rejectClaim()`, and `completeClaim()` are annotated with `@Transactional`, guaranteeing atomic state transitions across `claims`, `found_items`, and `item_history`.

5. **Audit Trail Logging:**
   * The `item_history` table stores an immutable log of state changes, recording the action, timestamp, administrator ID, and remarks.

---

## 6. Preloaded Accounts for College Demonstration

The system includes pre-configured credentials:

| Account Type | Email Address | Password | Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Administrator** | `admin@campus.edu` | `Admin@123` | `ROLE_ADMIN` | Campus Security Control Desk with full claim verification, student management, and audit log privileges. |
| **Demo Student 1** | `student@campus.edu` | `Student@123` | `ROLE_STUDENT` | Aarav Sharma (Reg: `21CS1045`), Computer Science & Engineering. |
| **Demo Student 2** | `ananya.patel@campus.edu` | `Student@123` | `ROLE_STUDENT` | Ananya Patel (Reg: `22EC2012`), Electronics & Communication. |

> **Evaluator Convenience:** Both the Student Login (`/user/login`) and Admin Login (`/admin/login`) pages include an **"Auto Fill"** button for fast demonstration during faculty evaluation.

---

## 7. How to Run the Application Locally

### Prerequisites
* Java JDK 17, 21, or 25 installed
* Node.js (v18+) and npm installed
* MySQL 8.0 (Optional — the app can run on MySQL OR on the bundled instant in-memory H2 mode)

---

### Step 1: Database Setup (MySQL 8.0)

If using MySQL Workbench or the MySQL command line:

```sql
-- 1. Create database and tables
SOURCE database/schema.sql;

-- 2. Populate initial sample categories, users, items, and claims
SOURCE database/seed.sql;
```

*Note: Default database credentials in `application.properties` are `root` with no password on `localhost:3306`. You can customize them via environment variables or directly in `application.properties`.*

---

### Step 2: Start the Java Spring Boot Backend

#### Option A: Using the Windows Batch Script
Double-click `run-backend.bat` in the root folder, or run:
```cmd
run-backend.bat
```
Select **[1]** for MySQL, or **[2]** for Zero-Install In-Memory mode.

#### Option B: Using Maven CLI
```cmd
# Run with MySQL database
mvnw.cmd spring-boot:run

# OR run with zero-install H2 in-memory database
mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=h2"
```

#### Option C: Running the Pre-built Standalone JAR
```cmd
java -jar backend/target/smart-lost-found-1.0.0.jar

# Or with in-memory profile:
java "-Dspring.profiles.active=h2" -jar backend/target/smart-lost-found-1.0.0.jar
```
The Spring Boot backend will start on **`http://localhost:8080`**.

---

### Step 3: Start the React Frontend

Open a new terminal window:
```cmd
cd frontend
npm install
npm run dev
```
The modern React frontend will launch on **`http://localhost:5173`**.

---

## 8. College Project Live Demonstration Workflow

To demonstrate the full application to evaluators, execute the following workflow:

1. **Public Exploration:**
   * Open `http://localhost:5173`.
   * Explore the Landing Page hero, how it works, campus stats, and recent items.
   * Click **"Browse Items"** (`/browse`) and filter by Category (e.g. *Electronics*) and Location.

2. **Student Authentication & Reporting:**
   * Click **"Student Sign In"** (`/user/login`) and click the **"Auto Fill"** demo button to sign in as *Aarav Sharma*.
   * Navigate to **"Report Lost Item"** (`/user/report-lost`). Submit a missing item with location and secret identifying details.
   * Navigate to **"Report Found Item"** (`/user/report-found`). Register an item found on campus.
   * View the student dashboard metrics and recent submissions under **"My Lost Items"** and **"My Found Items"**.

3. **Ownership Claim Submission:**
   * Go to **"Browse Found Items"** (`/browse`).
   * Select a found item (e.g. *Apple AirPods Pro*).
   * Click **"This is My Item - Submit Ownership Claim"**.
   * Fill in the claim description and private identifying traits (e.g. serial ending or markings) and submit.
   * Check **"My Claim Requests"** (`/user/my-claims`) to see the newly submitted claim in `PENDING` status.

4. **Administrative Verification & Handover:**
   * Sign out and open the **"Campus Admin Portal"** at `/admin/login`.
   * Click **"Auto Fill"** and sign in as `admin@campus.edu`.
   * Observe the administrative telemetry and Recharts analytical graphs on `/admin/dashboard`.
   * Open **"Manage Claims"** (`/admin/claims`).
   * Click **"Inspect Proof"** on the pending claim. Compare the student's testimony with the confidential security notes.
   * Click **"Approve & Authorize Handover"** and enter collection remarks.
   * When the student collects the item, click **"Mark Handed Over"**.

5. **Student Notification Verification:**
   * Log back in as `student@campus.edu`.
   * Open the Notification Bell in the navbar to see the real-time alert: *"Claim Approved! Collect Your Item"*.
   * Verify the claim status has updated to `APPROVED` / `COMPLETED`.

6. **Academic Architecture Overview:**
   * Click **"About Project"** (`/about`) to present the OOP class diagram, DBMS normalization, and system objectives directly on screen.

---

## 9. Key REST API Endpoints Reference

| HTTP Method | Route | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Student account registration |
| `POST` | `/api/auth/login` | Public | Student sign in (issues JWT) |
| `POST` | `/api/auth/admin/login` | Public | Admin sign in (strictly checks `ROLE_ADMIN`) |
| `GET` | `/api/auth/me` | Authenticated | Fetch current user profile & counts |
| `GET` | `/api/categories` | Public | Retrieve all item categories |
| `GET` | `/api/found-items` | Public | Search found items with filters & pagination |
| `POST` | `/api/found-items` | Authenticated | Register a found item |
| `GET` | `/api/lost-items` | Public | Search lost item reports |
| `POST` | `/api/lost-items` | Authenticated | Report a lost item |
| `POST` | `/api/claims` | Authenticated | Submit an ownership claim for a found item |
| `GET` | `/api/claims/my-claims` | Authenticated | Retrieve current student's claims |
| `GET` | `/api/admin/dashboard` | Admin Only | Administrative telemetry & analytics |
| `GET` | `/api/admin/claims` | Admin Only | Filter all submitted claims |
| `PUT` | `/api/admin/claims/{id}/approve` | Admin Only | Approve claim with security remarks |
| `PUT` | `/api/admin/claims/{id}/reject` | Admin Only | Reject fraudulent or unverified claim |
| `PUT` | `/api/admin/claims/{id}/complete`| Admin Only | Finalize physical handover |
| `GET` | `/api/admin/students` | Admin Only | Directory of registered student accounts |
| `PATCH` | `/api/admin/students/{id}/status`| Admin Only | Suspend or reactivate student account |
| `GET` | `/api/notifications` | Authenticated | Current user's notifications |
| `POST` | `/api/upload` | Authenticated | Image upload handler (PNG, JPG, WEBP) |

---

## 10. Security & Verification Measures

* **Backend-Enforced Authorization:** Modifying frontend local storage or URLs cannot grant administrative privileges. All administrative endpoints require `@PreAuthorize("hasRole('ADMIN')")`.
* **Private Field Concealment:** Sensitive identifying details that could enable dishonest individuals to claim someone else's property are kept private from public catalog endpoints.
* **Double Claim Prevention:** The system prevents duplicate active claims on the same found item by the same claimant.
* **Account Status Guard:** Suspended student accounts are barred from reporting items or filing claims.

