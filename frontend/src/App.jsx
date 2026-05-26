import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PortalStateProvider } from './context/PortalStateContext';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { PortalLayout } from './components/PortalLayout';
import { StudentPortal } from './components/StudentPortal';
import { RecruiterPortal } from './components/RecruiterPortal';
import { AdminPortal } from './components/AdminPortal';
import { RegisterPage } from './components/RegisterPage';

import { LayoutGrid, Briefcase, FileText, Calendar, User, Bell, GraduationCap, Building, Users, FileCheck, BarChart3 } from 'lucide-react';

const StudentMenuItems = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'jobs', label: 'Jobs & Internships', icon: Briefcase },
  { id: 'applications', label: 'My Applications', icon: FileText },
  { id: 'interviews', label: 'Interviews', icon: Calendar },
  { id: 'profile', label: 'Profile & Resume', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

const RecruiterMenuItems = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'jobs', label: 'Job Postings', icon: Briefcase },
  { id: 'applicants', label: 'Applicants', icon: Users },
  { id: 'interviews', label: 'Interviews', icon: Calendar },
  { id: 'profile', label: 'Company Profile', icon: Building },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

const AdminMenuItems = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'students', label: 'Students', icon: GraduationCap },
  { id: 'recruiters', label: 'Recruiters', icon: Building },
  { id: 'drives-jobs', label: 'Drives & Jobs', icon: Briefcase },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'approvals', label: 'Approvals', icon: FileCheck },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

function InnerApp() {
  const { user, loading } = useAuth();
  const [view, setView] = useState('landing');
  const [studentTab, setStudentTab] = useState('overview');
  const [recruiterTab, setRecruiterTab] = useState('overview');
  const [adminTab, setAdminTab] = useState('overview');
  const [adminSearch, setAdminSearch] = useState('');

  // Handle reloads and check active local storage session
  useEffect(() => {
    if (user) {
      setView(`${user.role}-dashboard`);
    } else {
      setView('landing');
    }
  }, [user]);

  const handleNavigate = (targetView) => {
    setView(targetView);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#022c22] flex flex-col items-center justify-center text-brand-cream font-sans">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-brand-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-[9px] uppercase tracking-[0.2em] font-extrabold text-brand-gold">Verifying Session...</p>
        </div>
      </div>
    );
  }

  switch (view) {
    case 'landing':
      return <LandingPage onNavigate={handleNavigate} />;
    
    case 'login':
      return <LoginPage onNavigate={handleNavigate} />;
    
    case 'register':
      return <RegisterPage onNavigate={handleNavigate} />;
    
    case 'student-dashboard':
      return (
        <PortalLayout activeTab={studentTab} onTabChange={setStudentTab} menuItems={StudentMenuItems}>
          <StudentPortal activeSubTab={studentTab} onTabChange={setStudentTab} />
        </PortalLayout>
      );
    
    case 'recruiter-dashboard':
      return (
        <PortalLayout activeTab={recruiterTab} onTabChange={setRecruiterTab} menuItems={RecruiterMenuItems}>
          <RecruiterPortal activeSubTab={recruiterTab} onTabChange={setRecruiterTab} />
        </PortalLayout>
      );
    
    case 'admin-dashboard':
      return (
        <PortalLayout 
          activeTab={adminTab} 
          onTabChange={setAdminTab} 
          menuItems={AdminMenuItems}
          searchValue={adminSearch}
          onSearchChange={setAdminSearch}
        >
          <AdminPortal activeSubTab={adminTab} onTabChange={setAdminTab} adminSearch={adminSearch} />
        </PortalLayout>
      );
    
    default:
      return <LandingPage onNavigate={handleNavigate} />;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <PortalStateProvider>
        <InnerApp />
      </PortalStateProvider>
    </AuthProvider>
  );
}
