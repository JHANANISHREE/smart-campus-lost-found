import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Public Pages
import { HomePage } from './pages/HomePage';
import { BrowsePage } from './pages/BrowsePage';
import { ItemDetailPage } from './pages/ItemDetailPage';
import { AboutPage } from './pages/AboutPage';

// Auth Pages
import { StudentLoginPage } from './pages/auth/StudentLoginPage';
import { StudentRegisterPage } from './pages/auth/StudentRegisterPage';
import { AdminLoginPage } from './pages/auth/AdminLoginPage';

// Layouts
import { StudentLayout } from './layouts/StudentLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Student Pages
import { StudentDashboardPage } from './pages/student/StudentDashboardPage';
import { ReportLostPage } from './pages/student/ReportLostPage';
import { ReportFoundPage } from './pages/student/ReportFoundPage';
import { MyLostItemsPage } from './pages/student/MyLostItemsPage';
import { MyFoundItemsPage } from './pages/student/MyFoundItemsPage';
import { MyClaimsPage } from './pages/student/MyClaimsPage';
import { NotificationsPage } from './pages/student/NotificationsPage';
import { ProfilePage } from './pages/student/ProfilePage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { ManageClaimsPage } from './pages/admin/ManageClaimsPage';
import { ManageLostItemsPage } from './pages/admin/ManageLostItemsPage';
import { ManageFoundItemsPage } from './pages/admin/ManageFoundItemsPage';
import { ManageStudentsPage } from './pages/admin/ManageStudentsPage';
import { ItemCategoriesPage } from './pages/admin/ItemCategoriesPage';
import { AnalyticsPage } from './pages/admin/AnalyticsPage';
import { AuditLogsPage } from './pages/admin/AuditLogsPage';

// Public Layout Wrapper for landing/about/browse
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Pages */}
          <Route
            path="/"
            element={
              <PublicLayout>
                <HomePage />
              </PublicLayout>
            }
          />
          <Route
            path="/browse"
            element={
              <PublicLayout>
                <BrowsePage />
              </PublicLayout>
            }
          />
          <Route
            path="/items/:id"
            element={
              <PublicLayout>
                <ItemDetailPage />
              </PublicLayout>
            }
          />
          <Route
            path="/about"
            element={
              <PublicLayout>
                <AboutPage />
              </PublicLayout>
            }
          />

          {/* Authentication Pages */}
          <Route
            path="/user/login"
            element={
              <PublicLayout>
                <StudentLoginPage />
              </PublicLayout>
            }
          />
          <Route
            path="/user/register"
            element={
              <PublicLayout>
                <StudentRegisterPage />
              </PublicLayout>
            }
          />
          <Route
            path="/admin/login"
            element={
              <div className="min-h-screen bg-slate-900">
                <Navbar />
                <AdminLoginPage />
              </div>
            }
          />

          {/* Authenticated Student Portal */}
          <Route path="/user" element={<StudentLayout />}>
            <Route index element={<Navigate to="/user/dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboardPage />} />
            <Route path="report-lost" element={<ReportLostPage />} />
            <Route path="report-found" element={<ReportFoundPage />} />
            <Route path="my-lost" element={<MyLostItemsPage />} />
            <Route path="my-found" element={<MyFoundItemsPage />} />
            <Route path="my-claims" element={<MyClaimsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* Authenticated Admin Control Panel */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="claims" element={<ManageClaimsPage />} />
            <Route path="lost-items" element={<ManageLostItemsPage />} />
            <Route path="found-items" element={<ManageFoundItemsPage />} />
            <Route path="students" element={<ManageStudentsPage />} />
            <Route path="categories" element={<ItemCategoriesPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="audit-logs" element={<AuditLogsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;

