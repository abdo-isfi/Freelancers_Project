import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import MainLayout from '../components/Layout/MainLayout';

// Auth pages
import AuthPage from '../pages/AuthPage';
import HeroDemo from '../pages/HeroDemo';
import SidebarDemo from '../pages/SidebarDemo';

// Protected pages
import DashboardPage from '../pages/DashboardPage';
import ClientsPage from '../pages/ClientsPage';
import ClientDetailPage from '../pages/ClientDetailPage';
import ProjectsPage from '../pages/ProjectsPage';
import ProjectDetailPage from '../pages/ProjectDetailPage';
import TasksPage from '../pages/TasksPage';
import TimeTrackingPage from '../pages/TimeTrackingPage';
import InvoicesPage from '../pages/InvoicesPage';
import InvoiceDetailPage from '../pages/InvoiceDetailPage';
import NotesPage from '../pages/NotesPage';
import SettingsPage from '../pages/SettingsPage';

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
        <Route path="/" element={<HeroDemo />} />

        {/* Protected routes with layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>

            <Route path="/dashboard" element={<DashboardPage />} />
            
            {/* Clients */}
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/clients/:id" element={<ClientDetailPage />} />
            
            {/* Projects */}
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
            
            {/* Tasks */}
            <Route path="/tasks" element={<TasksPage />} />
            
            {/* Time Tracking */}
            <Route path="/time-tracking" element={<TimeTrackingPage />} />
            
            {/* Invoices */}
            <Route path="/invoices" element={<InvoicesPage />} />
            <Route path="/invoices/:id" element={<InvoiceDetailPage />} />
            
            {/* Notes */}
            <Route path="/notes" element={<NotesPage />} />
            
            {/* Settings */}
            <Route path="/settings" element={<SettingsPage />} />

          </Route>
        </Route>

        <Route path="/sidebar-demo" element={<SidebarDemo />} />

        {/* 404 - Catch all */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
