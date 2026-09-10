import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ProtectedRoute, RoleGuard } from './components/layout/RoleGuard';
import { AppLayout } from './components/layout/AppLayout';

import { LoginPage } from './pages/LoginPage';
import { LandingPage } from './pages/LandingPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ProjectLeadDashboardPage } from './pages/ProjectLeadDashboardPage';
import { MemberDashboardPage } from './pages/MemberDashboardPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { TasksPage } from './pages/TasksPage';
import { MembersPage } from './pages/MembersPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { UnauthorizedPage, NotFoundPage } from './pages/ErrorPages';

// Dynamic role redirector
const RootRedirect: React.FC = () => {
  const { role, isLoading } = useAuth();

  if (isLoading) return null;

  if (role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
  if (role === 'PROJECT_LEAD') return <Navigate to="/lead/dashboard" replace />;
  if (role === 'MEMBER') return <Navigate to="/member/dashboard" replace />;

  return <Navigate to="/login" replace />;
};

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes Container */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/app" element={<RootRedirect />} />

          {/* Admin Dashboard */}
          <Route
            path="/admin/dashboard"
            element={
              <RoleGuard allowedRoles={['ADMIN']}>
                <AdminDashboardPage />
              </RoleGuard>
            }
          />

          {/* Project Lead Dashboard */}
          <Route
            path="/lead/dashboard"
            element={
              <RoleGuard allowedRoles={['ADMIN', 'PROJECT_LEAD']}>
                <ProjectLeadDashboardPage />
              </RoleGuard>
            }
          />

          {/* Member Dashboard */}
          <Route
            path="/member/dashboard"
            element={
              <RoleGuard allowedRoles={['ADMIN', 'PROJECT_LEAD', 'MEMBER']}>
                <MemberDashboardPage />
              </RoleGuard>
            }
          />

          {/* Core Modules */}
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/members" element={<MembersPage />} />
          
          {/* Analytics (Admin & Lead) */}
          <Route
            path="/analytics"
            element={
              <RoleGuard allowedRoles={['ADMIN', 'PROJECT_LEAD']}>
                <AnalyticsPage />
              </RoleGuard>
            }
          />

          {/* Settings */}
          <Route path="/settings" element={<SettingsPage />} />

          {/* Fallback & Authorization Status */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  );
};
export default App;
