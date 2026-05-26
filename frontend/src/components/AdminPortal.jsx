import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePortalState } from '../context/PortalStateContext';
import { 
  LayoutGrid, 
  GraduationCap, 
  Building, 
  Briefcase, 
  BarChart3, 
  FileCheck, 
  Bell, 
  ArrowUpRight, 
  Search, 
  Download, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  ChevronRight, 
  ShieldCheck, 
  Clock, 
  TrendingUp, 
  PlusCircle, 
  FileText, 
  Users,
  Settings,
  AlertCircle,
  Check,
  Edit2,
  Bookmark,
  Globe
} from 'lucide-react';

export const AdminPortal = ({ activeSubTab, onTabChange, adminSearch = '' }) => {
  const { user } = useAuth();
  const { 
    jobs, 
    applications, 
    interviews,
    approveJob, 
    rejectJob, 
    addJob,
    students, 
    recruiters, 
    addStudent, 
    addRecruiter, 
    verifyRecruiter, 
    notifications,
    addNotification,
    markNotificationAsRead,
    eligibilityList,
    addEligibility,
    updateEligibility,
    deleteEligibility,
    updateJob,
    deleteJob,
    clearNotifications,
    refreshPortalData
  } = usePortalState();

  const formatNotificationTime = (createdAt) => {
    if (!createdAt) return 'Just now';
    const now = new Date();
    const created = new Date(createdAt);
    const diffMs = now - created;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    const diffDays = Math.floor(diffHrs / 24);
    return `${diffDays}d ago`;
  };

  // Filter pending jobs
  const pendingJobsFromContext = jobs.filter(job => job.status === 'Pending');

  // Dynamic mapping of students roster from Mongo database
  const studentsList = students.map(s => ({
    id: s._id,
    roll: s.studentDetails?.roll || 'N/A',
    name: s.name,
    program: s.studentDetails?.department || 'B.Tech CSE',
    batch: s.studentDetails?.batch || '2026',
    cgpa: s.studentDetails?.cgpa || '9.0',
    applications: applications.filter(app => app.studentEmail === s.email).length,
    status: (() => {
      if (s.studentDetails?.status) return s.studentDetails.status;
      const studentApps = applications.filter(app => app.studentEmail === s.email);
      if (studentApps.some(app => app.status === 'Selected')) return 'Selected';
      if (studentApps.some(app => app.status === 'Offer')) return 'Offer';
      if (studentApps.some(app => app.status === 'Interview')) return 'Interview';
      if (studentApps.some(app => app.status === 'Shortlisted')) return 'Shortlisted';
      if (studentApps.some(app => app.status === 'Rejected')) return 'Rejected';
      return 'Applied';
    })(),
    email: s.email
  }));

  // Dynamic mapping of recruiters directory from Mongo database
  const recruitersList = recruiters.map(r => {
    const companyName = r.recruiterDetails?.company || r.name;
    const companyJobs = jobs.filter(j => j.company.toLowerCase() === companyName.toLowerCase());
    const openJobs = companyJobs.filter(j => j.status === 'Approved');
    const companyJobIds = companyJobs.map(j => j.id);
    const companyApps = applications.filter(app => companyJobIds.includes(app.jobId));
    const companyOffersCount = companyApps.filter(app => ['Offer', 'Selected'].includes(app.status)).length;

    return {
      id: r._id,
      company: companyName,
      industry: r.recruiterDetails?.industry || 'Technology',
      tier: r.recruiterDetails?.tier || 'Tier 1',
      roles: openJobs.length,
      applicants: companyApps.length,
      hires: companyOffersCount,
      status: r.recruiterDetails?.status || 'Pending',
      email: r.email
    };
  });

  // Dynamic approvals queue derived from jobs and recruiters Collections
  const approvalsQueue = [
    ...jobs.filter(j => j.status === 'Pending').map(j => ({
      id: j.id,
      type: 'Job',
      entityName: `${j.company} — ${j.title}`,
      details: `Posting review · ${j.salary || 'Stipend'} · ${j.location || 'Remote'}`,
      time: 'New'
    })),
    ...recruiters.filter(r => r.recruiterDetails?.status === 'Pending').map(r => ({
      id: r._id,
      type: 'Company',
      entityName: r.recruiterDetails?.company || r.name,
      details: `Verification request · pending GST + LinkedIn proof`,
      time: 'New'
    }))
  ];

  // Parse numeric LPA or monthly stipend from job salary
  const parseCtcLPA = (salaryStr) => {
    if (!salaryStr) return 0;
    const matchLpa = salaryStr.match(/(\d+(?:\.\d+)?)\s*LPA/i);
    if (matchLpa) return parseFloat(matchLpa[1]);
    const matchMonthly = salaryStr.match(/(\d+(?:\.\d+)?)\s*k\s*\/\s*mo/i);
    if (matchMonthly) return (parseFloat(matchMonthly[1]) * 12) / 100; // convert to LPA
    return 0;
  };

  // 3 broad sectors defined by student department/program
  // Each sector owns specific departments that students can select during registration
  const SECTOR_DEPARTMENTS = {
    'Technology & Engineering': [
      'Computer Science & Engineering',
      'Electronics & Communication',
      'Information Technology',
      'Electrical & Electronics',
      'B.Tech CSE',
      'B.Tech ECE',
      'Mechanical Engineering'
    ],
    'Management & Business': [
      'MBA',
      'Business Administration',
      'Commerce',
      'Finance'
    ],
    'Applied Sciences & Design': [
      'M.Sc Data Science',
      'B.Des',
      'Design',
      'Mathematics',
      'Physics',
      'Chemistry',
      'Data Science'
    ]
  };

  // Map a department/program string to one of the 3 sectors
  const getDeptSector = (dept) => {
    if (!dept) return 'Technology & Engineering';
    const d = dept.toLowerCase();
    for (const [sector, depts] of Object.entries(SECTOR_DEPARTMENTS)) {
      if (depts.some(sd => d.includes(sd.toLowerCase()) || sd.toLowerCase().includes(d))) {
        return sector;
      }
    }
    // Fallback heuristics
    if (d.includes('computer') || d.includes('software') || d.includes('it') || d.includes('tech') || d.includes('electronic') || d.includes('electrical') || d.includes('mechanical')) return 'Technology & Engineering';
    if (d.includes('mba') || d.includes('management') || d.includes('business') || d.includes('commerce') || d.includes('finance')) return 'Management & Business';
    return 'Applied Sciences & Design';
  };

  // Dynamic sector distribution based on placed students' departments (real-time)
  const getSectorDistribution = () => {
    const sectorKeys = Object.keys(SECTOR_DEPARTMENTS);
    const sectorCounts = {};
    sectorKeys.forEach(s => { sectorCounts[s] = 0; });

    // Count placed students per sector based on their department
    const placedApps = applications.filter(app => ['Offer', 'Selected'].includes(app.status));
    let totalPlaced = 0;

    placedApps.forEach(app => {
      // Find the student's department
      const student = students.find(s => s.email === app.studentEmail);
      const dept = student?.studentDetails?.department || '';
      const sector = getDeptSector(dept);
      sectorCounts[sector] = (sectorCounts[sector] || 0) + 1;
      totalPlaced++;
    });

    const sectorOffers = sectorKeys.map(sector => {
      const count = sectorCounts[sector];
      // If no placements yet, show seeded defaults; otherwise show real percentages
      const percentage = totalPlaced > 0
        ? Math.round((count / totalPlaced) * 100)
        : (sector === 'Technology & Engineering' ? 60 : sector === 'Management & Business' ? 25 : 15);
      return { sector, count, percentage };
    }).sort((a, b) => b.percentage - a.percentage);

    return { sectorOffers, totalPlaced };
  };

  const placedStudentsCount = studentsList.filter(s => s.status === 'Placed' || s.status === 'Selected' || s.status === 'Offer').length;
  const placementRate = studentsList.length > 0 ? Math.round((placedStudentsCount / studentsList.length) * 100) : 0;

  // 1. Placement by Program dynamic data
  const defaultDepartments = ['B.Tech CSE', 'B.Tech ECE', 'MBA', 'B.Des', 'M.Sc Data Science'];
  const departmentsList = Array.from(new Set([...defaultDepartments, ...studentsList.map(s => s.program)]));
  const placementByProgram = departmentsList.map(dept => {
    const deptStudents = studentsList.filter(s => s.program === dept);
    const placed = deptStudents.filter(s => s.status === 'Placed' || s.status === 'Selected' || s.status === 'Offer').length;
    const rate = deptStudents.length > 0 ? Math.round((placed / deptStudents.length) * 100) : 0;
    return { name: dept, rate };
  }).sort((a, b) => b.rate - a.rate);

  // 2. Dynamic monthly offers aggregation for the last 8 months
  const getMonthlyOffersData = () => {
    const months = [];
    const counts = [];
    const date = new Date();
    for (let i = 7; i >= 0; i--) {
      const d = new Date(date.getFullYear(), date.getMonth() - i, 1);
      const label = d.toLocaleString('default', { month: 'short' });
      months.push(label);
      
      const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
      const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
      
      const offerCount = applications.filter(app => {
        if (!['Offer', 'Selected'].includes(app.status)) return false;
        const appDate = app.createdAt ? new Date(app.createdAt) : new Date();
        return appDate >= monthStart && appDate <= monthEnd;
      }).length;
      
      counts.push(offerCount);
    }
    return { months, counts };
  };

  const { months: chartMonths, counts: chartCounts } = getMonthlyOffersData();
  const maxOffers = Math.max(...chartCounts, 5);
  const xCoords = [60, 150, 240, 340, 440, 540, 640, 740];
  const yCoords = chartCounts.map(count => 170 - (count / maxOffers) * 140);
  
  let pathD = `M ${xCoords[0]} ${yCoords[0]}`;
  for (let i = 1; i < xCoords.length; i++) {
    pathD += ` L ${xCoords[i]} ${yCoords[i]}`;
  }
  const areaD = `${pathD} L ${xCoords[xCoords.length - 1]} 170 L ${xCoords[0]} 170 Z`;

  // 3. Approvals stats
  const approvedJobsCount = jobs.filter(j => j.status === 'Approved').length;
  const approvedRecruitersCount = recruiters.filter(r => r.recruiterDetails?.status === 'Verified').length;
  const totalApproved = approvedJobsCount + approvedRecruitersCount;

  const rejectedJobsCount = jobs.filter(j => j.status === 'Rejected').length;
  const rejectedRecruitersCount = recruiters.filter(r => r.recruiterDetails?.status === 'Rejected').length;
  const totalRejected = rejectedJobsCount + rejectedRecruitersCount;

  const totalProcessed = totalApproved + totalRejected;
  const avgResponseTime = totalProcessed > 0 ? Math.max(1.1, parseFloat((12 / (totalProcessed + 3)).toFixed(1))).toFixed(1) + 'h' : '1.5h';

  const approvedJobs = jobs.filter(j => j.status === 'Approved');

  // Prefer actual CTC entered by recruiters during placement; fallback to job salary
  const placedApplications = applications.filter(app => (app.status === 'Selected' || app.status === 'Offer') && app.ctc && app.ctc.trim());
  const actualCtcValues = placedApplications.map(app => parseCtcLPA(app.ctc)).filter(v => v > 0);

  const totalInternationalOffers = applications.filter(app => (app.status === 'Selected' || app.status === 'Offer') && app.isInternational).length;
  const totalPpos = applications.filter(app => (app.status === 'Selected' || app.status === 'Offer') && app.isPpo).length;
  const totalMultipleOffersCount = applications.filter(app => (app.status === 'Selected' || app.status === 'Offer') && app.hasMultipleOffers).length;

  // Fallback: use job listing salaries if no actual placement CTCs exist yet
  const salaries = actualCtcValues.length > 0
    ? actualCtcValues
    : approvedJobs.map(j => parseCtcLPA(j.salary)).filter(val => val > 0);
  
  const avgCtc = salaries.length > 0 ? (salaries.reduce((a, b) => a + b, 0) / salaries.length).toFixed(1) : '0';
  const highestCtc = salaries.length > 0 ? Math.max(...salaries).toFixed(1) : '0';
  const medianCtc = salaries.length > 0 ? (() => {
    const sorted = [...salaries].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid].toFixed(1) : ((sorted[mid - 1] + sorted[mid]) / 2).toFixed(1);
  })() : '0';

  // Recently processed approvals log
  const [recentlyProcessed, setRecentlyProcessed] = useState([]);

  // Dynamic notifications derived from Mongo database
  const notificationsQueue = notifications.map(n => ({
    id: n.id,
    title: n.title,
    message: n.message,
    time: formatNotificationTime(n.createdAt) || n.time || 'Just now',
    unread: !n.read,
    type: n.type,
    createdAt: n.createdAt
  }));

  // States for filters
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('All programs');
  const [selectedBatch, setSelectedBatch] = useState('Batch 2026');
  const [selectedStatus, setSelectedStatus] = useState('All statuses');

  const [recruiterSearch, setRecruiterSearch] = useState('');
  const [activeTierFilter, setActiveTierFilter] = useState('All');

  const [approvalFilter, setApprovalFilter] = useState('All');
  const [notificationFilter, setNotificationFilter] = useState('All');
  const [settingsToggles, setSettingsToggles] = useState({
    approvals: true,
    drives: true,
    weekly: true
  });

  // Message alert toast
  const [successMessage, setSuccessMessage] = useState('');

  const triggerToast = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  // Dialog configurations
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudent, setNewStudent] = useState({ roll: '', name: '', program: 'B.Tech CSE', batch: '2026', cgpa: '', email: '' });
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteCompany, setInviteCompany] = useState('');

  // Eligibility Criteria Modals & States
  const [showEligibilityModal, setShowEligibilityModal] = useState(false);
  const [eligibilityForm, setEligibilityForm] = useState({ id: '', title: '', detail: '' });

  // Custom states added for portal enhancements
  const [showStudentProfileModal, setShowStudentProfileModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  const [showManageJobsModal, setShowManageJobsModal] = useState(false);
  const [selectedRecruiterForManage, setSelectedRecruiterForManage] = useState(null);
  const [showEditJobModal, setShowEditJobModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  
  const [showInterviewDetailsModal, setShowInterviewDetailsModal] = useState(false);
  const [selectedInterviewForDetails, setSelectedInterviewForDetails] = useState(null);

  const [highlightedEntityId, setHighlightedEntityId] = useState(null);

  const [showTierModal, setShowTierModal] = useState(false);
  const [pendingJobToApprove, setPendingJobToApprove] = useState(null);
  const [selectedReportType, setSelectedReportType] = useState('Annual placement summary');
  const [selectedReportBatch, setSelectedReportBatch] = useState('Batch 2026');

  // Cascade delete student account
  const handleDeleteStudentAccount = async (studentId, name) => {
    if (!window.confirm(`WARNING: Deleting student account for "${name}" will permanently erase their profile, all job applications, interviews, notifications, and all historical metrics from the system. This action is absolute and cannot be undone.\n\nAre you sure you want to proceed?`)) {
      return;
    }
    
    try {
      const response = await fetch(`/api/auth/users/${studentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('placera_token')}`
        }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        triggerToast(`Successfully deleted ${name}'s account and erased all related metrics.`);
        await refreshPortalData();
      } else {
        alert(`Failed to delete student account: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error deleting student:', err);
      alert('Failed to connect to the backend server.');
    }
  };

  // Real-time placement telemetry overview CSV Export
  const handleExportOverviewCSV = () => {
    let csvRows = [];
    csvRows.push('--- REAL-TIME PLACEMENT CELL TELEMETRY ---');
    csvRows.push('Metric,Value');
    csvRows.push(`Registered Students,${studentsList.length}`);
    csvRows.push(`Hiring Partners Connected,${recruitersList.length}`);
    csvRows.push(`Active Placement Drives,${jobs.filter(j => j.status === 'Approved').length}`);
    const placedCount = applications.filter(app => ['Offer', 'Selected'].includes(app.status)).length;
    csvRows.push(`Placed Candidates,${placedCount}`);
    csvRows.push(`Overall Placement Rate,${placementRate}%`);
    csvRows.push(`Average CTC Package,₹${avgCtc} LPA`);
    csvRows.push(`Highest CTC Package,₹${highestCtc} LPA`);
    csvRows.push(`Median CTC Package,₹${medianCtc} LPA`);
    csvRows.push(`International Offers,${totalInternationalOffers}`);
    csvRows.push(`PPO Conversions,${totalPpos}`);
    csvRows.push(`Multiple Offers Count,${totalMultipleOffersCount}`);
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `placera_overview_telemetry_${new Date().getFullYear()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast('Real-time placement telemetry exported successfully.');
  };

  // Student directory CSV Export
  const handleExportStudentsCSV = () => {
    if (studentsList.length === 0) {
      triggerToast('No student records to export.');
      return;
    }
    const headers = ['Roll Number', 'Name', 'Email', 'Program', 'Batch', 'CGPA', 'Applications Count', 'Status'];
    const rows = studentsList.map(s => [
      `"${s.roll.replace(/"/g, '""')}"`,
      `"${s.name.replace(/"/g, '""')}"`,
      `"${s.email.replace(/"/g, '""')}"`,
      `"${s.program.replace(/"/g, '""')}"`,
      `"${s.batch.replace(/"/g, '""')}"`,
      `"${s.cgpa}"`,
      `"${s.applications}"`,
      `"${s.status}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `placera_students_roster_${new Date().getFullYear()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast('Student directory roster exported successfully.');
  };

  // Reports CSV Export
  const handleExportReportsCSV = () => {
    let csvRows = [];
    csvRows.push('--- EXECUTIVE PLACEMENT TELEMETRY ---');
    csvRows.push('Metric,Value');
    csvRows.push(`Overall Placement Rate,${placementRate}%`);
    csvRows.push(`Average CTC Package,₹${avgCtc} LPA`);
    csvRows.push(`Highest CTC Package,₹${highestCtc} LPA`);
    csvRows.push(`Median CTC Package,₹${medianCtc} LPA`);
    csvRows.push(`Total International Offers,${totalInternationalOffers}`);
    csvRows.push(`Pre-Placement Offers (PPO),${totalPpos}`);
    csvRows.push(`Hiring Partners Connected,${recruitersList.length}`);
    csvRows.push('');
    
    csvRows.push('--- PROGRAM-WISE OUTCOMES ---');
    csvRows.push('Program,Eligible,Placed,Placement Rate,Average CTC,Top CTC');
    const departments = Array.from(new Set([...['B.Tech CSE', 'B.Tech ECE', 'MBA', 'B.Des', 'M.Sc Data Science'], ...studentsList.map(s => s.program)]));
    departments.forEach(dept => {
      const deptStudents = studentsList.filter(s => s.program === dept);
      const eligible = deptStudents.length;
      const placed = deptStudents.filter(s => s.status === 'Placed' || s.status === 'Selected' || s.status === 'Offer').length;
      const rate = eligible > 0 ? `${Math.round((placed / eligible) * 100)}%` : '0%';
      const deptStudentEmails = deptStudents.map(s => s.email);
      const deptPlacedApps = applications.filter(app =>
        (app.status === 'Selected' || app.status === 'Offer') &&
        deptStudentEmails.includes(app.studentEmail)
      );
      const deptActualCtcs = deptPlacedApps.filter(a => a.ctc && a.ctc.trim()).map(a => parseCtcLPA(a.ctc)).filter(v => v > 0);
      const deptJobIds = deptPlacedApps.map(o => o.jobId);
      const deptJobs = jobs.filter(j => deptJobIds.includes(j.id));
      const deptSalaries = deptActualCtcs.length > 0 ? deptActualCtcs : deptJobs.map(j => parseCtcLPA(j.salary)).filter(v => v > 0);
      const deptAvg = deptSalaries.length > 0 ? `₹${(deptSalaries.reduce((a, b) => a + b, 0) / deptSalaries.length).toFixed(1)} LPA` : '—';
      const deptTop = deptSalaries.length > 0 ? `₹${Math.max(...deptSalaries).toFixed(1)} LPA` : '—';
      csvRows.push(`"${dept}",${eligible},${placed},${rate},"${deptAvg}","${deptTop}"`);
    });
    
    csvRows.push('');
    csvRows.push('--- SECTOR MIX ---');
    csvRows.push('Sector,Percentage of Offers');
    const { sectorOffers } = getSectorDistribution();
    sectorOffers.forEach(item => {
      csvRows.push(`"${item.sector}",${item.percentage}%`);
    });
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `placera_analytics_report_${new Date().getFullYear()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast('Placement Analytics Report exported successfully.');
  };

  // Reports Executive Summary Print Flow
  const handleGenerateReportsPDF = () => {
    const printWindow = window.open('', '_blank', 'width=900,height=800');
    if (!printWindow) {
      alert('Pop-up blocked. Please allow pop-ups to view and print reports.');
      return;
    }
    
    const departments = Array.from(new Set([...['B.Tech CSE', 'B.Tech ECE', 'MBA', 'B.Des', 'M.Sc Data Science'], ...studentsList.map(s => s.program)]));
    const programPerformanceHtml = departments.map(dept => {
      const deptStudents = studentsList.filter(s => s.program === dept);
      const eligible = deptStudents.length;
      const placed = deptStudents.filter(s => s.status === 'Placed' || s.status === 'Selected' || s.status === 'Offer').length;
      const rate = eligible > 0 ? `${Math.round((placed / eligible) * 100)}%` : '0%';
      const deptStudentEmails = deptStudents.map(s => s.email);
      const deptPlacedApps = applications.filter(app =>
        (app.status === 'Selected' || app.status === 'Offer') &&
        deptStudentEmails.includes(app.studentEmail)
      );
      const deptActualCtcs = deptPlacedApps.filter(a => a.ctc && a.ctc.trim()).map(a => parseCtcLPA(a.ctc)).filter(v => v > 0);
      const deptJobIds = deptPlacedApps.map(o => o.jobId);
      const deptJobs = jobs.filter(j => deptJobIds.includes(j.id));
      const deptSalaries = deptActualCtcs.length > 0 ? deptActualCtcs : deptJobs.map(j => parseCtcLPA(j.salary)).filter(v => v > 0);
      const deptAvg = deptSalaries.length > 0 ? `₹${(deptSalaries.reduce((a, b) => a + b, 0) / deptSalaries.length).toFixed(1)} LPA` : '—';
      const deptTop = deptSalaries.length > 0 ? `₹${Math.max(...deptSalaries).toFixed(1)} LPA` : '—';
      return `
        <tr>
          <td>${dept}</td>
          <td style="text-align: center;">${eligible}</td>
          <td style="text-align: center;">${placed}</td>
          <td style="text-align: center; font-weight: bold; color: #137333;">${rate}</td>
          <td style="text-align: center;">${deptAvg}</td>
          <td style="text-align: right; font-weight: bold;">${deptTop}</td>
        </tr>
      `;
    }).join('');

    const { sectorOffers } = getSectorDistribution();
    const sectorsHtml = sectorOffers.map(item => {
      return `
        <div style="margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px; font-weight: 500;">
            <span>${item.sector}</span>
            <span style="font-weight: bold;">${item.percentage}%</span>
          </div>
          <div style="width: 100%; background: #FAF7EE; border: 1px solid rgba(2, 44, 34, 0.05); height: 8px; border-radius: 4px; overflow: hidden;">
            <div style="background: #022c22; height: 100%; width: ${item.percentage}%;"></div>
          </div>
        </div>
      `;
    }).join('');

    const docHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>PLACERA - Executive Placement Report</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Inter', sans-serif;
            color: #022c22;
            background-color: #ffffff;
            margin: 40px;
            line-height: 1.5;
          }
          .header {
            border-bottom: 2px solid #022c22;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .title {
            font-family: 'Playfair Display', serif;
            font-size: 32px;
            font-weight: 400;
            margin: 0;
          }
          .subtitle {
            font-size: 12px;
            color: #b38b3f;
            text-transform: uppercase;
            letter-spacing: 2px;
            font-weight: 700;
            margin-top: 5px;
          }
          .meta-info {
            display: flex;
            justify-content: space-between;
            font-size: 11px;
            color: #666;
            margin-top: 15px;
          }
          .metrics-grid {
            display: grid;
            grid-template-cols: repeat(4, 1fr);
            gap: 15px;
            margin-bottom: 35px;
          }
          .metric-card {
            background-color: #FAF7EE;
            border: 1px solid rgba(2, 44, 34, 0.08);
            border-radius: 12px;
            padding: 15px;
            text-align: center;
          }
          .metric-label {
            font-size: 9px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #666;
            margin-bottom: 6px;
          }
          .metric-val {
            font-family: 'Playfair Display', serif;
            font-size: 24px;
            font-weight: 700;
          }
          .section-title {
            font-family: 'Playfair Display', serif;
            font-size: 18px;
            font-weight: 700;
            border-bottom: 1px solid rgba(2, 44, 34, 0.1);
            padding-bottom: 8px;
            margin-bottom: 15px;
            margin-top: 30px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11px;
            margin-bottom: 25px;
          }
          th {
            background-color: #FAF7EE;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-size: 9px;
            padding: 10px;
            border-bottom: 1px solid rgba(2, 44, 34, 0.15);
            text-align: left;
          }
          td {
            padding: 10px;
            border-bottom: 1px solid rgba(2, 44, 34, 0.05);
          }
          .footer {
            margin-top: 60px;
            border-top: 1px solid rgba(2, 44, 34, 0.1);
            padding-top: 15px;
            text-align: center;
            font-size: 10px;
            color: #888;
          }
          @media print {
            body { margin: 20px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="title">PLACERA</h1>
          <div class="subtitle">Placement Cell Executive Telemetry Report</div>
          <div class="meta-info">
            <span>Corporate Relations & Placements Directorate</span>
            <span>Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-label">Placement Rate</div>
            <div class="metric-val" style="color: #022c22;">${placementRate}%</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Average Package</div>
            <div class="metric-val" style="color: #b38b3f;">₹${avgCtc} LPA</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Highest Package</div>
            <div class="metric-val" style="color: #022c22;">₹${highestCtc} LPA</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Hiring Partners</div>
            <div class="metric-val">${recruitersList.length}</div>
          </div>
        </div>

        <div class="section-title">Program Performance</div>
        <table>
          <thead>
            <tr>
              <th>Program / Specialization</th>
              <th style="text-align: center;">Eligible</th>
              <th style="text-align: center;">Placed</th>
              <th style="text-align: center;">Placement Rate</th>
              <th style="text-align: center;">Avg Package</th>
              <th style="text-align: right;">Top Package</th>
            </tr>
          </thead>
          <tbody>
            ${programPerformanceHtml}
          </tbody>
        </table>

        <div style="display: grid; grid-template-cols: 1fr 1fr; gap: 40px; margin-top: 30px;">
          <div>
            <div class="section-title">Industry/Sector Mix</div>
            ${sectorsHtml}
          </div>
          <div>
            <div class="section-title">Placement Insights Summary</div>
            <div style="font-size: 11px; line-height: 1.6; color: #555; background-color: #FAF7EE; padding: 15px; border-radius: 12px; border: 1px solid rgba(2, 44, 34, 0.05);">
              <p style="margin-top: 0;"><strong>Active Corporate Engagement:</strong> Campus relations remain strong with <strong>${recruitersList.length} verified hiring partners</strong> connecting over the current cycle.</p>
              <p><strong>Pre-Placement Offers (PPOs):</strong> Pre-placement conversions account for a significant portion of early roles, highlighting strong internship conversion quality.</p>
              <p style="margin-bottom: 0;"><strong>Package Distribution:</strong> Average salary packages sit at <strong>₹${avgCtc} LPA</strong>, with tier-1 recruiters anchoring high-package CTCs up to <strong>₹${highestCtc} LPA</strong>.</p>
            </div>
          </div>
        </div>

        <div class="footer">
          PLACERA Placement Portal • Confidential Academic Telemetry • Internal Directorate Review Only
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 500);
          }
        </script>
      </body>
      </html>
    `;
    printWindow.document.write(docHtml);
    printWindow.document.close();
  };

  // Generate specialized reports
  const handleGenerateCustomReport = () => {
    let csvRows = [];
    const reportType = selectedReportType;
    const batch = selectedReportBatch;
    
    if (reportType === 'Annual placement summary') {
      csvRows.push(`--- PLACERA ANNUAL PLACEMENT SUMMARY (${batch.toUpperCase()}) ---`);
      csvRows.push('');
      csvRows.push('--- EXECUTIVE SUMMARY ---');
      csvRows.push('Metric,Value');
      csvRows.push(`Overall Placement Rate,${placementRate}%`);
      csvRows.push(`Average CTC Package,₹${avgCtc} LPA`);
      csvRows.push(`Highest CTC Package,₹${highestCtc} LPA`);
      csvRows.push(`Total Placed Candidates,${placedStudentsCount}`);
      csvRows.push(`Total Registered Candidates,${studentsList.length}`);
      csvRows.push(`International Placement Offers,${totalInternationalOffers}`);
      csvRows.push(`Pre-Placement Offers (PPOs),${totalPpos}`);
      csvRows.push(`Multiple Placement Offers,${totalMultipleOffersCount}`);
      csvRows.push('');
      
      csvRows.push('--- STUDENT PLACEMENT DIRECTORY ---');
      csvRows.push('Roll Number,Name,Email,Program,CGPA,Placement Status,Company,CTC');
      studentsList.forEach(s => {
        const studentPlacedApp = applications.find(app => app.studentEmail === s.email && ['Offer', 'Selected'].includes(app.status));
        const job = studentPlacedApp ? jobs.find(j => j.id === studentPlacedApp.jobId) : null;
        const companyName = job ? job.company : '—';
        const ctc = studentPlacedApp ? studentPlacedApp.ctc : '—';
        csvRows.push(`"${s.roll.replace(/"/g, '""')}","${s.name.replace(/"/g, '""')}","${s.email.replace(/"/g, '""')}","${s.program.replace(/"/g, '""')}",${s.cgpa},"${s.status}","${companyName.replace(/"/g, '""')}","${ctc}"`);
      });
    } else if (reportType === 'Sector distribution matrix') {
      csvRows.push(`--- PLACERA SECTOR DISTRIBUTION MATRIX (${batch.toUpperCase()}) ---`);
      csvRows.push('');
      csvRows.push('--- SECTOR MARKET SHARE ---');
      csvRows.push('Sector / Industry,Offers Secured,Offer Percentage Share,Hiring Partners Count,Average Package');
      
      const defaultSectors = ['Technology', 'Finance & Banking', 'Consulting', 'Analytics', 'Core Engineering', 'EdTech'];
      const sectorCounts = {};
      const sectorSalaries = {};
      defaultSectors.forEach(s => {
        sectorCounts[s] = 0;
        sectorSalaries[s] = [];
      });

      const offerApps = applications.filter(app => ['Offer', 'Selected'].includes(app.status));
      let totalOffers = 0;
      
      offerApps.forEach(app => {
        const job = jobs.find(j => j.id === app.jobId);
        if (job) {
          const sector = classifySector(job);
          sectorCounts[sector] = (sectorCounts[sector] || 0) + 1;
          
          if (!sectorSalaries[sector]) sectorSalaries[sector] = [];
          const ctcVal = app.ctc ? parseCtcLPA(app.ctc) : parseCtcLPA(job.salary);
          if (ctcVal > 0) sectorSalaries[sector].push(ctcVal);
          
          totalOffers++;
        }
      });
      
      const sectorRecCounts = {};
      defaultSectors.forEach(s => { sectorRecCounts[s] = 0; });
      recruitersList.forEach(r => {
        const mockJobForRec = { company: r.company, title: '', skills: [] };
        const sector = classifySector(mockJobForRec);
        sectorRecCounts[sector] = (sectorRecCounts[sector] || 0) + 1;
      });
      
      defaultSectors.forEach(sector => {
        const count = sectorCounts[sector] || 0;
        const pct = totalOffers > 0 ? `${Math.round((count / totalOffers) * 100)}%` : 
          (sector === 'Technology' ? '45%' : sector === 'Finance & Banking' ? '20%' : sector === 'Consulting' ? '15%' : sector === 'Analytics' ? '10%' : sector === 'Core Engineering' ? '8%' : '2%');
        const partners = sectorRecCounts[sector] || 0;
        const salariesList = sectorSalaries[sector] || [];
        const avgPkg = salariesList.length > 0 ? `₹${(salariesList.reduce((a, b) => a + b, 0) / salariesList.length).toFixed(1)} LPA` : '—';
        csvRows.push(`"${sector}",${count},${pct},${partners},"${avgPkg}"`);
      });
      
      csvRows.push('');
      csvRows.push('--- INDIVIDUAL PLACEMENTS BY SECTOR ---');
      csvRows.push('Sector / Industry,Student Name,Program,Hiring Company,Job Title,Package CTC');
      offerApps.forEach(app => {
        const job = jobs.find(j => j.id === app.jobId);
        if (job) {
          const sector = classifySector(job);
          csvRows.push(`"${sector}","${app.studentName.replace(/"/g, '""')}","${app.department}","${job.company.replace(/"/g, '""')}","${job.title.replace(/"/g, '""')}","${app.ctc || job.salary}"`);
        }
      });
    } else {
      csvRows.push(`--- PLACERA DETAILED RECRUITER MIX (${batch.toUpperCase()}) ---`);
      csvRows.push('');
      csvRows.push('--- HIRING PARTNER ENGAGEMENT ---');
      csvRows.push('Company,Industry,Tier,Recruiter Email,Open Placement Drives,Total Student Applications,Successful Placements');
      recruitersList.forEach(r => {
        csvRows.push(`"${r.company.replace(/"/g, '""')}","${r.industry}","${r.tier}","${r.email}",${r.roles},${r.applicants},${r.hires}`);
      });
      
      csvRows.push('');
      csvRows.push('--- RECRUITER ACTIVE JOB DRIVES ---');
      csvRows.push('Company,Job Title,Salary Package,Duration,Eligibility Criteria,Status');
      jobs.forEach(j => {
        csvRows.push(`"${j.company.replace(/"/g, '""')}","${j.title.replace(/"/g, '""')}","${j.salary.replace(/"/g, '""')}","${j.duration || '—'}","${j.eligibility || '—'}","${j.status}"`);
      });
    }
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const filename = `${reportType.toLowerCase().replace(/ /g, '_')}_${batch.toLowerCase().replace(/ /g, '_')}.csv`;
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast(`Generated ${reportType} for ${batch}.`);
  };



  const [showScheduleDriveModal, setShowScheduleDriveModal] = useState(false);
  const [pendingOpenDriveModal, setPendingOpenDriveModal] = useState(false);
  const [driveForm, setDriveForm] = useState({
    companyName: '',
    roleTitle: '',
    salaryPackage: '8 LPA',
    roleType: 'Full-time',
    eligibility: 'CGPA >= 8.0, no active backlogs',
    skills: 'React, Node.js, JavaScript',
    capacity: 10,
    driveDate: '',
    description: ''
  });

  // Auto-open Schedule Drive modal once the drives-jobs tab is active
  useEffect(() => {
    if (activeSubTab === 'drives-jobs' && pendingOpenDriveModal) {
      setShowScheduleDriveModal(true);
      setPendingOpenDriveModal(false);
    }
  }, [activeSubTab, pendingOpenDriveModal]);

  const handleNotificationView = async (notif) => {
    try {
      if (!notif.read) {
        await markNotificationAsRead(notif.id);
      }
    } catch (err) {
      console.error('Error marking notification read:', err);
    }

    const title = notif.title.toLowerCase();
    const msg = notif.message.toLowerCase();

    if (title.includes('job') || title.includes('posting') || msg.includes('posted a new role') || msg.includes('job posting')) {
      const pendingJobs = jobs.filter(j => j.status === 'Pending');
      const foundJob = pendingJobs.find(j => 
        msg.includes(j.company.toLowerCase()) || 
        msg.includes(j.title.toLowerCase())
      );
      
      onTabChange('approvals');
      if (foundJob) {
        setHighlightedEntityId(foundJob.id);
        triggerToast(`Highlighted pending job: ${foundJob.company} - ${foundJob.title}`);
        setTimeout(() => setHighlightedEntityId(null), 3500);
      }
    } else if (title.includes('recruiter') || title.includes('company') || msg.includes('verification request') || msg.includes('registered')) {
      const pendingRecruiters = recruiters.filter(r => r.recruiterDetails?.status === 'Pending');
      const foundRecruiter = pendingRecruiters.find(r => 
        msg.includes((r.recruiterDetails?.company || r.name).toLowerCase())
      );

      onTabChange('approvals');
      if (foundRecruiter) {
        setHighlightedEntityId(foundRecruiter._id);
        triggerToast(`Highlighted verification request for: ${foundRecruiter.recruiterDetails?.company || foundRecruiter.name}`);
        setTimeout(() => setHighlightedEntityId(null), 3500);
      }
    } else {
      triggerToast(`Showing details: ${notif.title}`);
    }
  };

  // Handle Approvals actions with live server mutations
  const handleProcessApproval = async (id, entityName, actionType, tier = '') => {
    const item = approvalsQueue.find(a => a.id === id);
    if (!item) return;

    try {
      if (item.type === 'Job') {
        if (actionType === 'Approved') {
          await approveJob(id, tier);
        } else {
          await rejectJob(id);
        }
      } else if (item.type === 'Company') {
        if (actionType === 'Approved') {
          await verifyRecruiter(id);
        } else {
          // Reject/Decline recruiter status via API
          await fetch(`/api/auth/users/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('placera_token')}`
            },
            body: JSON.stringify({
              recruiterDetails: { status: 'Rejected' }
            })
          });
        }
      }

      // Append to recently processed list
      const newProcess = {
        action: actionType,
        target: `${entityName} · ${item.details.split(' · ')[0]}`,
        time: 'Just now'
      };
      setRecentlyProcessed(prev => [newProcess, ...prev]);
      triggerToast(`${actionType}: ${entityName} request has been processed successfully.`);
    } catch (err) {
      console.error('Error processing approval:', err);
      triggerToast('Error processing request.');
    }
  };

  // Handle adding student to live MongoDB Atlas
  const handleAddStudentSubmit = async (e) => {
    e.preventDefault();
    if (!newStudent.roll || !newStudent.name || !newStudent.cgpa) {
      alert('Please fill out all mandatory fields.');
      return;
    }
    
    try {
      const studentEmail = newStudent.email || `${newStudent.roll.toLowerCase()}@placera.edu`;
      const res = await addStudent({
        name: newStudent.name,
        email: studentEmail.toLowerCase(),
        roll: newStudent.roll,
        cgpa: newStudent.cgpa,
        department: newStudent.program,
        batch: newStudent.batch || '2026',
        skills: ['React', 'Node.js', 'Python', 'Tailwind CSS']
      });

      if (res.success) {
        setShowAddStudentModal(false);
        triggerToast(`Added student: ${newStudent.name} successfully registered.`);
        setNewStudent({ roll: '', name: '', program: 'B.Tech CSE', batch: '2026', cgpa: '', email: '' });
      } else {
        alert(`Failed to add student: ${res.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error adding student:', err);
      alert('Failed to connect to backend.');
    }
  };

  // Handle inviting recruiter to live MongoDB Atlas
  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    if (!inviteCompany || !inviteEmail) {
      alert('Please fill out all fields.');
      return;
    }

    try {
      const res = await addRecruiter({
        name: inviteCompany,
        email: inviteEmail.toLowerCase(),
        company: inviteCompany,
        industry: 'Technology',
        tier: 'Tier 1',
        status: 'Pending'
      });

      if (res.success) {
        setShowInviteModal(false);
        triggerToast(`Invited ${inviteCompany} (${inviteEmail}). Verification request logged in queue.`);
        setInviteEmail('');
        setInviteCompany('');
      } else {
        alert(`Failed to invite: ${res.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error inviting recruiter:', err);
      alert('Failed to connect to backend.');
    }
  };

  const handleEligibilitySubmit = async (e) => {
    e.preventDefault();
    if (!eligibilityForm.title || !eligibilityForm.detail) {
      alert('Please fill out all fields.');
      return;
    }

    try {
      if (eligibilityForm.id) {
        // Update operation
        const res = await updateEligibility(eligibilityForm.id, eligibilityForm.title, eligibilityForm.detail);
        if (res.success) {
          setShowEligibilityModal(false);
          triggerToast(`Updated eligibility criteria: ${eligibilityForm.title}`);
          setEligibilityForm({ id: '', title: '', detail: '' });
        } else {
          alert(`Failed to update criteria: ${res.error || 'Unknown error'}`);
        }
      } else {
        // Create operation
        const res = await addEligibility(eligibilityForm.title, eligibilityForm.detail);
        if (res.success) {
          setShowEligibilityModal(false);
          triggerToast(`Created eligibility criteria: ${eligibilityForm.title}`);
          setEligibilityForm({ id: '', title: '', detail: '' });
        } else {
          alert(`Failed to create criteria: ${res.error || 'Unknown error'}`);
        }
      }
    } catch (err) {
      console.error('Error saving eligibility criteria:', err);
      alert('Failed to connect to backend.');
    }
  };

  const handleDeleteEligibility = async (id) => {
    if (!window.confirm('Are you sure you want to delete this eligibility criteria?')) {
      return;
    }
    try {
      const res = await deleteEligibility(id);
      if (res.success) {
        setShowEligibilityModal(false);
        triggerToast('Eligibility criteria deleted.');
        setEligibilityForm({ id: '', title: '', detail: '' });
      } else {
        alert(`Failed to delete criteria: ${res.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error deleting eligibility criteria:', err);
      alert('Failed to connect to backend.');
    }
  };

  // Mark all notifications as read in backend
  const handleMarkAllNotifications = async () => {
    try {
      await Promise.all(notifications.map(n => !n.read && markNotificationAsRead(n.id)));
      triggerToast('All updates marked as read.');
    } catch (err) {
      console.error('Error marking all notifications read:', err);
    }
  };

  // 1. Placement Cell Overview Panel
  const renderOverview = () => {
    return (
      <div className="space-y-8 animate-fade-in-up">
        {/* Banner with controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#022c22]/10 pb-6">
          <div>
            <h1 className="editorial-heading font-serif text-4xl text-[#022c22] font-light">Placement cell overview</h1>
            <p className="text-text-secondary text-sm font-medium mt-1">Real-time view across students, recruiters and active drives.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={handleExportOverviewCSV}
              className="bg-[#FAF7EE] border border-[#022c22]/15 text-[#022c22] px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-white transition-all cursor-pointer shadow-sm flex items-center gap-2"
            >
              Export
            </button>
            <button 
              onClick={() => onTabChange('drives-jobs')}
              className="bg-[#022c22] hover:bg-[#124237] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
            >
              New drive
            </button>
          </div>
        </div>

        {/* Stats metrics row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white border border-[#022c22]/5 p-6 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-sm transition-all duration-300">
            <div className="space-y-1">
              <span className="text-[10px] text-text-secondary font-bold uppercase tracking-widest block">Registered Students</span>
              <div className="text-3xl font-serif font-bold text-[#022c22]">{studentsList.length}</div>
              <p className="text-xs text-text-secondary font-semibold mt-1">Active student profiles</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#f4f3ea] flex items-center justify-center text-[#022c22]">
              <Users className="w-5.5 h-5.5" />
            </div>
          </div>

          <div className="bg-white border border-[#022c22]/5 p-6 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-sm transition-all duration-300">
            <div className="space-y-1">
              <span className="text-[10px] text-text-secondary font-bold uppercase tracking-widest block">Hiring Partners</span>
              <div className="text-3xl font-serif font-bold text-[#022c22]">{recruitersList.length}</div>
              <p className="text-xs text-text-secondary font-semibold mt-1">Verified accounts</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-brand-gold/10 flex items-center justify-center text-brand-gold">
              <Building className="w-5.5 h-5.5" />
            </div>
          </div>

          <div className="bg-white border border-[#022c22]/5 p-6 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-sm transition-all duration-300">
            <div className="space-y-1">
              <span className="text-[10px] text-text-secondary font-bold uppercase tracking-widest block">Active Drives</span>
              <div className="text-3xl font-serif font-bold text-[#022c22]">{approvedJobs.length}</div>
              <p className="text-xs text-text-secondary font-semibold mt-1">Approved listings</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700">
              <Briefcase className="w-5.5 h-5.5" />
            </div>
          </div>

          <div className="bg-white border border-[#022c22]/5 p-6 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-sm transition-all duration-300">
            <div className="space-y-1">
              <span className="text-[10px] text-text-secondary font-bold uppercase tracking-widest block">Placement Rate</span>
              <div className="text-3xl font-serif font-bold text-[#022c22]">{placementRate}%</div>
              <p className="text-xs text-[#022c22] font-semibold mt-1">Placed candidates</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#f4f3ea] flex items-center justify-center text-[#022c22]">
              <ArrowUpRight className="w-5.5 h-5.5" />
            </div>
          </div>
        </div>

        {/* Dashboard visual split columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column widgets: Offers Line Chart & Top Hiring Partners Table */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* SVG line chart card */}
            <div className="bg-white border border-[#022c22]/5 p-6 rounded-2xl shadow-xs">
              <div className="flex justify-between items-center border-b border-[#022c22]/5 pb-4 mb-6">
                <div>
                  <h3 className="editorial-heading font-serif text-lg text-[#022c22] font-semibold">Offers extended — last 8 months</h3>
                </div>
                <span className="text-[11px] text-text-secondary font-serif italic">Updated daily</span>
              </div>

              {/* Chart simulated with SVG */}
              <div className="relative pt-2">
                <svg viewBox="0 0 800 220" className="w-full h-auto">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#c29837" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#c29837" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  <line x1="40" y1="20" x2="760" y2="20" stroke="#f4f3ea" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="40" y1="70" x2="760" y2="70" stroke="#f4f3ea" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="40" y1="120" x2="760" y2="120" stroke="#f4f3ea" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="40" y1="170" x2="760" y2="170" stroke="#f4f3ea" strokeWidth="1" strokeDasharray="4 4" />

                  {/* Gradient Area under curve */}
                  <path 
                    d={areaD} 
                    fill="url(#chartGradient)" 
                  />
                  
                  {/* Curve Path Line */}
                  <path 
                    d={pathD} 
                    fill="none" 
                    stroke="#c29837" 
                    strokeWidth="3.5" 
                    strokeLinecap="round"
                  />

                  {/* Interactive Nodes */}
                  {xCoords.map((x, idx) => (
                    <circle 
                      key={idx} 
                      cx={x} 
                      cy={yCoords[idx]} 
                      r="4.5" 
                      fill={idx === xCoords.length - 1 ? "#022c22" : "#FAF7EE"} 
                      stroke="#c29837" 
                      strokeWidth="2.5" 
                    />
                  ))}

                  {/* Labels X Axis */}
                  {chartMonths.map((month, idx) => (
                    <text 
                      key={idx} 
                      x={xCoords[idx]} 
                      y="195" 
                      textAnchor="middle" 
                      fontSize="11" 
                      fill="#888" 
                      fontFamily="sans-serif"
                    >
                      {month}
                    </text>
                  ))}
                </svg>
              </div>
            </div>

            {/* Top hiring partners directory */}
            <div className="bg-white border border-[#022c22]/5 p-6 rounded-2xl shadow-xs">
              <h3 className="editorial-heading font-serif text-lg text-[#022c22] font-semibold border-b border-[#022c22]/5 pb-4 mb-4">
                Top hiring partners
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-[#022c22]/5 text-[10px] uppercase text-text-secondary font-bold tracking-widest">
                      <th className="pb-3 text-left">Company</th>
                      <th className="pb-3 text-center">Open Roles</th>
                      <th className="pb-3 text-center">Applicants</th>
                      <th className="pb-3 text-center">Offers</th>
                      <th className="pb-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#022c22]/5">
                    {recruitersList.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="py-8 text-center text-text-secondary font-medium italic">
                          No hiring partners registered yet.
                        </td>
                      </tr>
                    ) : (
                      recruitersList.slice(0, 5).map((partner, index) => {
                        const initials = partner.company.split(' ').map(w => w[0]).join('');
                        const bgColors = ['bg-[#f4f3ea] text-[#022c22]', 'bg-brand-gold/10 text-brand-gold', 'bg-[#124237]/15 text-[#124237]', 'bg-amber-100 text-amber-800', 'bg-rose-50 text-rose-800'];
                        const avColor = bgColors[index % bgColors.length];
                        const isSearched = adminSearch && partner.company.toLowerCase().includes(adminSearch.toLowerCase());

                        return (
                          <tr 
                            key={partner.company} 
                            className={`transition-all duration-300 ${
                              isSearched 
                                ? 'bg-brand-gold/15 border-l-4 border-brand-gold font-bold scale-[1.005] shadow-sm' 
                                : 'hover:bg-brand-cream/10 transition-colors'
                            }`}
                          >
                            <td className="py-3.5 flex items-center gap-3">
                              <div className={`w-8.5 h-8.5 rounded-full ${avColor} font-bold text-xs flex items-center justify-center border border-current/10 shrink-0`}>
                                {initials}
                              </div>
                              <span className="font-semibold text-[#022c22] text-sm">{partner.company}</span>
                            </td>
                            <td className="py-3.5 text-center font-medium text-text-secondary">{partner.roles}</td>
                            <td className="py-3.5 text-center font-medium text-text-secondary">{partner.applicants}</td>
                            <td className="py-3.5 text-center font-bold text-[#022c22]">{partner.hires}</td>
                            <td className="py-3.5 text-right">
                              <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider border ${
                                index === 4 
                                  ? 'bg-red-50 text-red-600 border-red-200' 
                                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              }`}>
                                {index === 4 ? 'Closing' : 'Active'}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column widgets: Placement by program & Pending Approvals */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Placement by Program gold bars */}
            <div className="bg-white border border-[#022c22]/5 p-6 rounded-2xl shadow-xs">
              <h3 className="editorial-heading font-serif text-lg text-[#022c22] font-semibold border-b border-[#022c22]/5 pb-4 mb-5">
                Placement by program
              </h3>
              
              <div className="space-y-5">
                {placementByProgram.slice(0, 10).map(prog => (
                  <div key={prog.name} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-medium text-[#022c22]">{prog.name}</span>
                      <span className="font-bold text-[#022c22]">{prog.rate}%</span>
                    </div>
                    <div className="w-full bg-[#f4f3ea] h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-brand-gold h-full rounded-full transition-all duration-500" 
                        style={{ width: `${prog.rate}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending approvals side widget */}
            <div className="bg-white border border-[#022c22]/5 p-6 rounded-2xl shadow-xs">
              <h3 className="editorial-heading font-serif text-lg text-[#022c22] font-semibold border-b border-[#022c22]/5 pb-4 mb-4">
                Pending approvals
              </h3>
              
              <div className="space-y-4">
                {approvalsQueue.length === 0 ? (
                  <div className="text-center py-6">
                    <CheckCircle2 className="w-8 h-8 text-brand-gold mx-auto mb-2" />
                    <p className="text-xs font-semibold text-[#022c22]">All caught up!</p>
                    <p className="text-[10px] text-text-secondary mt-0.5">No reviews pending verification.</p>
                  </div>
                ) : (
                  approvalsQueue.slice(0, 3).map(req => (
                    <div key={req.id} className="bg-[#FAF7EE]/50 border border-[#022c22]/5 p-4 rounded-xl flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <span className="font-bold text-[#022c22] text-sm block truncate">{req.entityName}</span>
                        <span className="text-[10px] text-text-secondary block mt-0.5">{req.details.split(' · ')[0]}</span>
                      </div>
                      <button 
                        onClick={() => onTabChange('approvals')}
                        className="bg-[#022c22] hover:bg-[#124237] text-white font-serif px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all shrink-0 cursor-pointer"
                      >
                        Review
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  };

  // 2. Student Directory Tab panel view
  const renderStudents = () => {
    const activeSearch = adminSearch || studentSearch;
    const filteredStudents = studentsList.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(activeSearch.toLowerCase()) || 
                          s.roll.toLowerCase().includes(activeSearch.toLowerCase()) ||
                          s.program.toLowerCase().includes(activeSearch.toLowerCase());
      
      const matchProg = selectedProgram === 'All programs' || s.program === selectedProgram;
      const matchBatch = selectedBatch === 'Batch 2026' || s.batch === '2026';
      const matchStatus = selectedStatus === 'All statuses' || s.status === selectedStatus;

      return matchSearch && matchProg && matchBatch && matchStatus;
    });

    return (
      <div className="space-y-8 animate-fade-in-up">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#022c22]/10 pb-6">
          <div>
            <h1 className="editorial-heading font-serif text-4xl text-[#022c22] font-light">Students</h1>
            <p className="text-text-secondary text-sm font-medium mt-1">Roster, placement status and performance across batches.</p>
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={handleExportStudentsCSV}
              className="bg-[#FAF7EE] border border-[#022c22]/15 text-[#022c22] px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-white transition-all cursor-pointer shadow-sm flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white border border-[#022c22]/5 p-5 rounded-2xl shadow-xs">
            <span className="text-[10px] text-text-secondary font-bold uppercase tracking-widest block">Total Students</span>
            <div className="text-3xl font-serif font-bold text-[#022c22] mt-1">{studentsList.length}</div>
          </div>
          
          <div className="bg-white border border-[#022c22]/5 p-5 rounded-2xl shadow-xs">
            <span className="text-[10px] text-text-secondary font-bold uppercase tracking-widest block">Eligible Candidates</span>
            <div className="text-3xl font-serif font-bold text-[#022c22] mt-1">{studentsList.length}</div>
          </div>

          <div className="bg-white border border-[#022c22]/5 p-5 rounded-2xl shadow-xs">
            <span className="text-[10px] text-text-secondary font-bold uppercase tracking-widest block">Placed</span>
            <div className="text-3xl font-serif font-bold text-[#022c22] mt-1">{placedStudentsCount}</div>
          </div>

          <div className="bg-white border border-[#022c22]/5 p-5 rounded-2xl shadow-xs">
            <span className="text-[10px] text-text-secondary font-bold uppercase tracking-widest block">Avg Package</span>
            <div className="text-3xl font-serif font-bold text-[#022c22] mt-1">₹{avgCtc} LPA</div>
          </div>
        </div>

        {/* Filtering inputs toolbar */}
        <div className="bg-white border border-[#022c22]/5 p-4 rounded-2xl shadow-xs flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:flex-1">
            <Search className="w-4 h-4 text-text-secondary/40 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search by name, roll, program..." 
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              className="w-full bg-[#f4f3ea]/50 border border-brand-green/5 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:border-[#022c22] focus:bg-white transition-all text-[#022c22]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto shrink-0">
            <select 
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              className="bg-[#FAF7EE] border border-[#022c22]/10 text-xs px-4 py-2.5 rounded-xl font-medium focus:outline-none cursor-pointer"
            >
              <option value="All programs">All programs</option>
              <option value="Computer Science & Engineering">Computer Science & Engineering</option>
              <option value="Electronics & Communication">Electronics & Communication</option>
              <option value="Electrical & Electronics">Electrical & Electronics</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
            </select>

            <select 
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="bg-[#FAF7EE] border border-[#022c22]/10 text-xs px-4 py-2.5 rounded-xl font-medium focus:outline-none cursor-pointer"
            >
              <option>Batch 2026</option>
              <option>Batch 2025</option>
            </select>

            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-[#FAF7EE] border border-[#022c22]/10 text-xs px-4 py-2.5 rounded-xl font-medium focus:outline-none cursor-pointer"
            >
              <option value="All statuses">All statuses</option>
              <option value="Applied">Applied</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Main listing panel table */}
        <div className="bg-white border border-[#022c22]/5 p-6 rounded-2xl shadow-xs">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-serif text-xl font-semibold text-[#022c22]">{filteredStudents.length} students</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#022c22]/5 text-[10px] uppercase text-text-secondary font-bold tracking-widest">
                  <th className="pb-3">Student</th>
                  <th className="pb-3">Program</th>
                  <th className="pb-3">Batch</th>
                  <th className="pb-3 text-center">CGPA</th>
                  <th className="pb-3 text-center">Applications</th>
                  <th className="pb-3 text-center">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#022c22]/5">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-text-secondary text-xs">No matching student records found.</td>
                  </tr>
                ) : (
                  filteredStudents.map((student, idx) => {
                    const initials = student.name.split(' ').map(w => w[0]).join('');
                    const bgColors = ['bg-[#f4f3ea] text-[#022c22]', 'bg-brand-gold/10 text-brand-gold', 'bg-[#124237]/15 text-[#124237]'];
                    const avColor = bgColors[student.name.charCodeAt(0) % bgColors.length];

                    const isSearched = adminSearch && (
                      student.name.toLowerCase().includes(adminSearch.toLowerCase()) ||
                      student.roll.toLowerCase().includes(adminSearch.toLowerCase()) ||
                      student.program.toLowerCase().includes(adminSearch.toLowerCase())
                    );

                    return (
                      <tr 
                        key={student.id || student._id || student.roll || `student-row-${idx}`} 
                        className={`transition-all duration-300 ${
                          isSearched 
                            ? 'bg-brand-gold/15 border-l-4 border-brand-gold font-bold scale-[1.005] shadow-sm' 
                            : 'hover:bg-brand-cream/10 transition-colors'
                        }`}
                      >
                        <td className="py-4 flex items-center gap-3">
                          <div className={`w-8.5 h-8.5 rounded-full ${avColor} font-bold text-xs flex items-center justify-center shrink-0 border border-current/10`}>
                            {initials}
                          </div>
                          <div>
                            <span className="font-semibold text-[#022c22] text-sm block">{student.name}</span>
                            <span className="text-[10px] text-text-secondary font-medium">{student.roll}</span>
                          </div>
                        </td>
                        <td className="py-4 font-semibold text-[#022c22]">{student.program}</td>
                        <td className="py-4 font-medium text-text-secondary">{student.batch}</td>
                        <td className="py-4 text-center font-bold text-[#022c22]">{student.cgpa}</td>
                        <td className="py-4 text-center font-medium text-text-secondary">{student.applications}</td>
                        <td className="py-4 text-center">
                          <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider border ${
                            (student.status === 'Placed' || student.status === 'Selected' || student.status === 'Offer')
                              ? 'bg-brand-gold/5 text-brand-gold border-brand-gold/20' 
                              : student.status === 'Interview'
                              ? 'bg-[#124237]/5 text-[#124237] border-[#124237]/20'
                              : 'bg-slate-50 text-slate-600 border-slate-200'
                          }`}>
                            {student.status}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex items-center gap-3.5 justify-end">
                            <button 
                              onClick={() => {
                                const foundStudent = students.find(s => s._id === student.id || s.email === student.email);
                                if (foundStudent) {
                                  setSelectedStudent(foundStudent);
                                  setShowStudentProfileModal(true);
                                } else {
                                  alert('Could not find student profile details.');
                                }
                              }}
                              className="text-[#022c22] font-serif font-bold text-[11px] hover:underline cursor-pointer"
                            >
                              View
                            </button>
                            <button 
                              onClick={() => handleDeleteStudentAccount(student.id, student.name)}
                              className="text-red-600 hover:text-red-800 font-serif font-bold text-[11px] hover:underline cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Simulating Add Student Modal */}
        {showAddStudentModal && (
          <div className="fixed inset-0 bg-[#022c22]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-white border border-[#022c22]/10 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-6 max-h-[90vh] overflow-y-auto scrollbar-hide">
              <div className="flex justify-between items-center border-b border-[#022c22]/5 pb-3">
                <h3 className="editorial-heading font-serif text-xl font-bold text-[#022c22]">Register new student</h3>
                <button 
                  onClick={() => setShowAddStudentModal(false)}
                  className="text-text-secondary hover:text-[#022c22] font-semibold text-lg"
                >
                  &times;
                </button>
              </div>
              <form onSubmit={handleAddStudentSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-[#022c22] block uppercase tracking-wider">Candidate Name *</label>
                  <input 
                    type="text" 
                    required
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                    placeholder="e.g. Priyesh Shah"
                    className="w-full bg-[#f4f3ea]/40 border border-[#022c22]/10 rounded-xl p-3 focus:outline-none focus:border-[#022c22] text-sm text-[#022c22]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#022c22] block uppercase tracking-wider">Roll Number *</label>
                  <input 
                    type="text" 
                    required
                    value={newStudent.roll}
                    onChange={(e) => setNewStudent({...newStudent, roll: e.target.value})}
                    placeholder="e.g. 2022CSE098"
                    className="w-full bg-[#f4f3ea]/40 border border-[#022c22]/10 rounded-xl p-3 focus:outline-none focus:border-[#022c22] text-sm text-[#022c22]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-[#022c22] block uppercase tracking-wider">Program</label>
                    <select
                      value={newStudent.program}
                      onChange={(e) => setNewStudent({...newStudent, program: e.target.value})}
                      className="w-full bg-[#f4f3ea]/40 border border-[#022c22]/10 rounded-xl p-3 focus:outline-none focus:border-[#022c22]"
                    >
                      <option>B.Tech CSE</option>
                      <option>B.Tech ECE</option>
                      <option>B.Tech IT</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-[#022c22] block uppercase tracking-wider">CGPA Rating *</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      max="10.0"
                      min="0.0"
                      required
                      value={newStudent.cgpa}
                      onChange={(e) => setNewStudent({...newStudent, cgpa: e.target.value})}
                      placeholder="e.g. 8.9"
                      className="w-full bg-[#f4f3ea]/40 border border-[#022c22]/10 rounded-xl p-3 focus:outline-none focus:border-[#022c22] text-sm text-[#022c22]"
                    />
                  </div>
                </div>
                <div className="flex gap-3 justify-end pt-4 border-t border-[#022c22]/5">
                  <button 
                    type="button"
                    onClick={() => setShowAddStudentModal(false)}
                    className="border border-[#022c22]/10 px-4 py-2 rounded-xl font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="bg-[#022c22] hover:bg-[#124237] text-white px-5 py-2.5 rounded-xl font-bold cursor-pointer"
                  >
                    Register Student
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

  // 3. Recruiters / Partners list view panel
  const renderRecruiters = () => {
    const activeSearch = adminSearch || recruiterSearch;
    const filteredRecruiters = recruitersList.filter(rec => {
      const matchSearch = rec.company.toLowerCase().includes(activeSearch.toLowerCase()) || 
                          rec.industry.toLowerCase().includes(activeSearch.toLowerCase());
      
      const matchTier = activeTierFilter === 'All' || rec.tier === activeTierFilter;

      return matchSearch && matchTier;
    });

    return (
      <div className="space-y-8 animate-fade-in-up">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#022c22]/10 pb-6">
          <div>
            <h1 className="editorial-heading font-serif text-4xl text-[#022c22] font-light">Recruiters</h1>
            <p className="text-text-secondary text-sm font-medium mt-1">All hiring partners, verification and tier classification.</p>
          </div>
          
          <button 
            onClick={() => {
              setDriveForm({
                companyName: recruitersList.length > 0 ? recruitersList[0].company : 'Helix Analytics',
                roleTitle: '',
                salaryPackage: '8 LPA',
                roleType: 'Full-time',
                eligibility: 'CGPA >= 8.0, no active backlogs',
                skills: 'React, Node.js, JavaScript',
                capacity: 10,
                driveDate: new Date().toISOString().split('T')[0],
                description: 'Active campus recruitment drive.'
              });
              setPendingOpenDriveModal(true);
              onTabChange('drives-jobs');
            }}
            className="bg-[#022c22] hover:bg-[#124237] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm flex items-center gap-2 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" /> Invite recruiter
          </button>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white border border-[#022c22]/5 p-5 rounded-2xl shadow-xs">
            <span className="text-[10px] text-text-secondary font-bold uppercase tracking-widest block">Hiring Partners</span>
            <div className="text-3xl font-serif font-bold text-[#022c22] mt-1">{recruitersList.length}</div>
          </div>
          
          <div className="bg-white border border-[#022c22]/5 p-5 rounded-2xl shadow-xs">
            <span className="text-[10px] text-text-secondary font-bold uppercase tracking-widest block">Verified</span>
            <div className="text-3xl font-serif font-bold text-[#022c22] mt-1">{recruitersList.filter(r => r.status === 'Verified').length}</div>
          </div>

          <div className="bg-white border border-[#022c22]/5 p-5 rounded-2xl shadow-xs">
            <span className="text-[10px] text-text-secondary font-bold uppercase tracking-widest block">Active Drives</span>
            <div className="text-3xl font-serif font-bold text-[#022c22] mt-1">{approvedJobs.length}</div>
          </div>

          <div className="bg-white border border-[#022c22]/5 p-5 rounded-2xl shadow-xs">
            <span className="text-[10px] text-text-secondary font-bold uppercase tracking-widest block">Total Hires YTD</span>
            <div className="text-3xl font-serif font-bold text-[#022c22] mt-1">{placedStudentsCount}</div>
          </div>
        </div>

        {/* Filters control toolbar */}
        <div className="bg-white border border-[#022c22]/5 p-4 rounded-2xl shadow-xs flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:flex-1">
            <Search className="w-4 h-4 text-text-secondary/40 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search recruiters..." 
              value={recruiterSearch}
              onChange={(e) => setRecruiterSearch(e.target.value)}
              className="w-full bg-[#f4f3ea]/50 border border-brand-green/5 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:border-[#022c22] focus:bg-white transition-all text-[#022c22]"
            />
          </div>

          <div className="flex items-center gap-1.5 self-start md:self-auto shrink-0 overflow-x-auto w-full md:w-auto">
            {['All', 'Tier 1', 'Tier 2'].map(tier => {
              const isActive = activeTierFilter === tier;
              return (
                <button
                  key={tier}
                  onClick={() => setActiveTierFilter(tier)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isActive 
                      ? 'bg-[#022c22] text-white' 
                      : 'bg-[#FAF7EE] border border-[#022c22]/10 text-[#022c22] hover:bg-white'
                  }`}
                >
                  {tier}
                </button>
              );
            })}
          </div>
        </div>

        {/* Directory table listing */}
        <div className="bg-white border border-[#022c22]/5 p-6 rounded-2xl shadow-xs">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-serif text-xl font-semibold text-[#022c22]">{filteredRecruiters.length} hiring partners</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#022c22]/5 text-[10px] uppercase text-text-secondary font-bold tracking-widest">
                  <th className="pb-3">Company</th>
                  <th className="pb-3">Industry</th>
                  <th className="pb-3">Tier</th>
                  <th className="pb-3 text-center">Open Roles</th>
                  <th className="pb-3 text-center">Total Hires</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#022c22]/5">
                {filteredRecruiters.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-text-secondary text-xs">No matching partner records found.</td>
                  </tr>
                ) : (
                  filteredRecruiters.map(partner => {
                    const companyName = partner.company || 'Unknown Company';
                    const initials = companyName.split(' ').map(w => w ? w[0] : '').join('');
                    const bgColors = ['bg-[#f4f3ea] text-[#022c22]', 'bg-brand-gold/10 text-brand-gold', 'bg-[#124237]/15 text-[#124237]'];
                    const avColor = bgColors[companyName.charCodeAt(0) % bgColors.length] || bgColors[0];

                    const isSearched = adminSearch && (
                      partner.company.toLowerCase().includes(adminSearch.toLowerCase()) ||
                      partner.industry.toLowerCase().includes(adminSearch.toLowerCase())
                    );

                    return (
                      <tr 
                        key={partner.company} 
                        className={`transition-all duration-300 ${
                          isSearched 
                            ? 'bg-brand-gold/15 border-l-4 border-brand-gold font-bold scale-[1.005] shadow-sm' 
                            : 'hover:bg-brand-cream/10 transition-colors'
                        }`}
                      >
                        <td className="py-4 flex items-center gap-3">
                          <div className={`w-8.5 h-8.5 rounded-full ${avColor} font-bold text-xs flex items-center justify-center shrink-0 border border-current/10`}>
                            {initials}
                          </div>
                          <span className="font-semibold text-[#022c22] text-sm">{partner.company}</span>
                        </td>
                        <td className="py-4 font-semibold text-text-secondary">{partner.industry}</td>
                        <td className="py-4">
                          <span className={`px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-wider border ${
                            partner.tier === 'Tier 1' 
                              ? 'bg-brand-gold/5 text-brand-gold border-brand-gold/20' 
                              : 'bg-slate-50 text-slate-600 border-slate-200'
                          }`}>
                            {partner.tier}
                          </span>
                        </td>
                        <td className="py-4 text-center font-bold text-[#022c22]">{partner.roles}</td>
                        <td className="py-4 text-center font-medium text-text-secondary">{partner.hires}</td>

                        <td className="py-4 text-right">
                          <button 
                            onClick={() => {
                              setSelectedRecruiterForManage(partner);
                              setShowManageJobsModal(true);
                            }}
                            className="text-[#022c22] font-serif font-bold text-[11px] hover:underline flex items-center gap-1 ml-auto cursor-pointer"
                          >
                            Manage &rarr;
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Invite Recruiter Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-[#022c22]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-white border border-[#022c22]/10 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-6 max-h-[90vh] overflow-y-auto scrollbar-hide">
              <div className="flex justify-between items-center border-b border-[#022c22]/5 pb-3">
                <h3 className="editorial-heading font-serif text-xl font-bold text-[#022c22]">Invite recruiting partner</h3>
                <button 
                  onClick={() => setShowInviteModal(false)}
                  className="text-text-secondary hover:text-[#022c22] font-semibold text-lg"
                >
                  &times;
                </button>
              </div>
              <form onSubmit={handleInviteSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-[#022c22] block uppercase tracking-wider">Company Name *</label>
                  <input 
                    type="text" 
                    required
                    value={inviteCompany}
                    onChange={(e) => setInviteCompany(e.target.value)}
                    placeholder="e.g. Northpeak Labs"
                    className="w-full bg-[#f4f3ea]/40 border border-[#022c22]/10 rounded-xl p-3 focus:outline-none focus:border-[#022c22] text-sm text-[#022c22]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#022c22] block uppercase tracking-wider">Corporate Email Address *</label>
                  <input 
                    type="email" 
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="recruiter@company.com"
                    className="w-full bg-[#f4f3ea]/40 border border-[#022c22]/10 rounded-xl p-3 focus:outline-none focus:border-[#022c22] text-sm text-[#022c22]"
                  />
                </div>
                <p className="text-[10px] text-text-secondary leading-normal">
                  Invited corporate partners will receive a secure portal signup invitation. Their workspace will remain flagged as pending audit until verified.
                </p>
                <div className="flex gap-3 justify-end pt-4 border-t border-[#022c22]/5">
                  <button 
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="border border-[#022c22]/10 px-4 py-2 rounded-xl font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="bg-[#022c22] hover:bg-[#124237] text-white px-5 py-2.5 rounded-xl font-bold cursor-pointer"
                  >
                    Send Invitation
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

  // 4. Drives & Jobs Tab View (Fleshed out from https://placementproject-design.lovable.app/admin/jobs)
  const renderDrivesJobs = () => {
    const activeJobs = jobs.filter(j => j.status === 'Approved' || (j.driveStatus && j.driveStatus !== ''));
    const matchedJobs = activeJobs.filter(j => {
      const query = adminSearch.toLowerCase();
      return !adminSearch || 
             (j.company || '').toLowerCase().includes(query) || 
             (j.title || '').toLowerCase().includes(query) ||
             (j.skills && j.skills.some(s => s.toLowerCase().includes(query)));
    });

    const drivesData = matchedJobs.map(j => {
      const apps = applications.filter(app => app.jobId === j.id);
      return {
        id: j.id,
        company: j.company || 'Unknown Company',
        role: j.title || 'Unknown Role',
        date: j.deadline ? j.deadline.split(',')[0] : 'No deadline',
        eligibility: j.eligibility || 'CGPA > 8.0',
        applications: apps.length,
        status: j.driveStatus === 'Pending' 
          ? 'Pending Recruiter' 
          : j.driveStatus === 'Rejected' 
            ? 'Rejected' 
            : 'Live',
        initials: j.company ? j.company[0] : 'C',
        avBg: 'bg-[#f4f3ea] text-[#022c22]'
      };
    });

    const matchedInterviews = interviews.filter(int => {
      const query = adminSearch.toLowerCase();
      return !adminSearch || 
             (int.company || '').toLowerCase().includes(query) || 
             (int.round || '').toLowerCase().includes(query) ||
             (int.studentName && int.studentName.toLowerCase().includes(query));
    });

    const weeklyCalendar = matchedInterviews.map(int => ({
      id: int.id,
      day: int.dateTime || 'Scheduled',
      company: int.company,
      event: int.round,
      interview: int
    }));

    const allRules = eligibilityList && eligibilityList.length > 0 ? eligibilityList.map(item => ({
      _id: item._id,
      title: item.title,
      detail: item.detail
    })) : [
      { title: 'Standard Tech', detail: 'CGPA ≥ 8.0, no active backlogs' },
      { title: 'Premium Tech', detail: 'CGPA ≥ 8.5, top quartile' },
      { title: 'Research', detail: 'CGPA ≥ 9.0, 1 publication' },
      { title: 'Design', detail: 'Portfolio required' },
      { title: 'MBA', detail: 'CGPA ≥ 7.5, 1 internship' },
    ];

    const rulesPack = allRules.filter(pack => {
      const query = adminSearch.toLowerCase();
      return !adminSearch || 
             (pack.title || '').toLowerCase().includes(query) || 
             (pack.detail || '').toLowerCase().includes(query);
    });

    return (
      <div className="space-y-8 animate-fade-in-up">
        {/* Banner with subtitle */}
        <div className="border-b border-[#022c22]/10 pb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h1 className="editorial-heading font-serif text-4xl text-[#022c22] font-light">Drives & Jobs</h1>
            <p className="text-text-secondary text-sm font-medium mt-1">All campus drives, walk-ins and online listings.</p>
          </div>
          <button 
            onClick={() => {
              setDriveForm({
                companyName: recruitersList.length > 0 ? recruitersList[0].company : 'Helix Analytics',
                roleTitle: '',
                salaryPackage: '8 LPA',
                roleType: 'Full-time',
                eligibility: rulesPack.length > 0 ? rulesPack[0].detail : 'CGPA >= 8.0, no active backlogs',
                skills: 'React, Node.js',
                capacity: 10,
                driveDate: new Date().toISOString().split('T')[0],
                description: 'Active campus recruitment drive.'
              });
              setShowScheduleDriveModal(true);
            }}
            className="bg-[#022c22] hover:bg-[#124237] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Schedule drive
          </button>
        </div>

        {/* Stats metrics row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white border border-[#022c22]/5 p-6 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-sm transition-all duration-300">
            <div className="space-y-1">
              <span className="text-[10px] text-text-secondary font-bold uppercase tracking-widest block">ACTIVE DRIVES</span>
              <div className="text-3xl font-serif font-bold text-[#022c22]">{activeJobs.length}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#f4f3ea] flex items-center justify-center text-[#022c22]">
              <Briefcase className="w-5.5 h-5.5" />
            </div>
          </div>

          <div className="bg-white border border-[#022c22]/5 p-6 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-sm transition-all duration-300">
            <div className="space-y-1">
              <span className="text-[10px] text-text-secondary font-bold uppercase tracking-widest block">EVENTS SCHED</span>
              <div className="text-3xl font-serif font-bold text-[#022c22]">{interviews.length}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#f4f3ea] flex items-center justify-center text-[#022c22]">
              <Calendar className="w-5.5 h-5.5" />
            </div>
          </div>

          <div className="bg-white border border-[#022c22]/5 p-6 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-sm transition-all duration-300">
            <div className="space-y-1">
              <span className="text-[10px] text-text-secondary font-bold uppercase tracking-widest block">TOTAL APPLICANTS</span>
              <div className="text-3xl font-serif font-bold text-[#022c22]">{applications.length}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#f4f3ea] flex items-center justify-center text-[#022c22]">
              <Users className="w-5.5 h-5.5" />
            </div>
          </div>

          <div className="bg-white border border-[#022c22]/5 p-6 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-sm transition-all duration-300">
            <div className="space-y-1">
              <span className="text-[10px] text-text-secondary font-bold uppercase tracking-widest block">CONVERSION</span>
              <div className="text-3xl font-serif font-bold text-[#022c22]">{placementRate}%</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#f4f3ea] flex items-center justify-center text-[#022c22]">
              <TrendingUp className="w-5.5 h-5.5" />
            </div>
          </div>
        </div>

        {/* Main Drives Table */}
        <div className="bg-white border border-[#022c22]/5 p-6 rounded-2xl shadow-xs">
          <h3 className="editorial-heading font-serif text-2xl text-[#022c22] font-light mb-6">
            Upcoming & active drives
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#022c22]/5 text-[10px] uppercase text-text-secondary font-bold tracking-widest">
                  <th className="pb-3">COMPANY</th>
                  <th className="pb-3">ROLE</th>
                  <th className="pb-3">DRIVE DATE</th>
                  <th className="pb-3">ELIGIBILITY</th>
                  <th className="pb-3 text-center">APPLICATIONS</th>
                  <th className="pb-3 text-center">STATUS</th>
                  <th className="pb-3 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#022c22]/5">
                {drivesData.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-text-secondary font-medium italic">
                      No active or scheduled drives yet.
                    </td>
                  </tr>
                ) : (
                  drivesData.map((drive, idx) => {
                    const isSearched = adminSearch && (
                      drive.company.toLowerCase().includes(adminSearch.toLowerCase()) ||
                      drive.role.toLowerCase().includes(adminSearch.toLowerCase()) ||
                      drive.eligibility.toLowerCase().includes(adminSearch.toLowerCase())
                    );

                    return (
                      <tr 
                        key={idx} 
                        className={`transition-all duration-300 ${
                          isSearched 
                            ? 'bg-brand-gold/15 border-l-4 border-brand-gold font-bold scale-[1.005] shadow-sm' 
                            : 'hover:bg-brand-cream/10 transition-colors'
                        }`}
                      >
                        <td className="py-4 flex items-center gap-3">
                        <div className={`w-8.5 h-8.5 rounded-full ${drive.avBg} font-bold text-xs flex items-center justify-center shrink-0 border border-current/10`}>
                          {drive.initials}
                        </div>
                        <span className="font-semibold text-[#022c22] text-sm">{drive.company}</span>
                      </td>
                      <td className="py-4 font-semibold text-[#022c22]">{drive.role}</td>
                      <td className="py-4 font-medium text-text-secondary">{drive.date}</td>
                      <td className="py-4 font-medium text-text-secondary">{drive.eligibility}</td>
                      <td className="py-4 text-center font-semibold text-[#022c22]">{drive.applications}</td>
                      <td className="py-4 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border capitalize ${
                          drive.status === 'Live'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            : drive.status === 'Pending Recruiter'
                            ? 'bg-amber-50 text-[#b38b3f] border-amber-100'
                            : 'bg-red-50 text-red-700 border-red-100'
                        }`}>
                          {drive.status}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <button 
                          onClick={() => {
                            const foundJob = jobs.find(j => j.company.toLowerCase() === drive.company.toLowerCase() && j.title.toLowerCase() === drive.role.toLowerCase());
                            if (foundJob) {
                              setEditingJob(foundJob);
                              setShowEditJobModal(true);
                            } else {
                              alert('Could not find complete job parameters.');
                            }
                          }}
                          className="text-[#022c22] font-serif font-bold text-[11px] hover:underline flex items-center gap-1 ml-auto cursor-pointer"
                        >
                          Manage &rarr;
                        </button>
                      </td>
                    </tr>
                  );
                })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Calendar and Rules split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Drive calendar */}
          <div className="bg-white border border-[#022c22]/5 p-6 rounded-2xl shadow-xs">
            <h3 className="editorial-heading font-serif text-xl font-semibold text-[#022c22] border-b border-[#022c22]/5 pb-4 mb-4">
              Drive calendar — this week
            </h3>
            
            <div className="space-y-3">
              {weeklyCalendar.length === 0 ? (
                <p className="text-text-secondary text-xs italic font-medium py-4">No interviews or events scheduled for this week.</p>
              ) : (
                weeklyCalendar.map((item, idx) => (
                  <div key={idx} className="bg-[#FAF7EE]/60 border border-[#022c22]/5 p-4 rounded-xl flex items-center justify-between gap-4 transition-all hover:translate-x-0.5 hover:shadow-xs">
                    <div className="space-y-1 text-xs">
                      <span className="font-bold text-[#022c22] block">{item.day}</span>
                      <span className="text-text-secondary font-medium block">{item.company} · {item.event}</span>
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedInterviewForDetails(item.interview);
                        setShowInterviewDetailsModal(true);
                      }}
                      className="text-[#022c22] hover:text-[#124237] text-xs font-bold shrink-0 cursor-pointer"
                    >
                      Details &rarr;
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Eligibility rule packs */}
          <div className="bg-white border border-[#022c22]/5 p-6 rounded-2xl shadow-xs">
            <div className="flex justify-between items-center border-b border-[#022c22]/5 pb-4 mb-4">
              <h3 className="editorial-heading font-serif text-xl font-semibold text-[#022c22]">
                Eligibility rule packs
              </h3>
              <button
                onClick={() => {
                  setEligibilityForm({ id: '', title: '', detail: '' });
                  setShowEligibilityModal(true);
                }}
                className="bg-[#022c22] hover:bg-[#124237] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>

            <div className="space-y-3">
              {rulesPack.map((pack, idx) => (
                <div key={pack._id || idx} className="bg-[#FAF7EE]/60 border border-[#022c22]/5 p-4 rounded-xl flex items-center justify-between gap-4 transition-all hover:translate-x-0.5 hover:shadow-xs">
                  <div className="space-y-1 text-xs">
                    <span className="font-bold text-[#022c22] block">{pack.title}</span>
                    <span className="text-[10px] text-text-secondary font-medium block">{pack.detail}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <button 
                      onClick={() => {
                        setEligibilityForm({ id: pack._id || '', title: pack.title, detail: pack.detail });
                        setShowEligibilityModal(true);
                      }}
                      className="text-[#022c22] hover:text-[#124237] text-xs font-bold cursor-pointer"
                    >
                      Edit
                    </button>
                    {pack._id && (
                      <button 
                        onClick={() => handleDeleteEligibility(pack._id)}
                        className="text-red-600 hover:text-red-800 text-xs font-bold cursor-pointer"
                        title="Delete criteria"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };


  // 5. Reports & Analytics View (Fleshed out from https://placementproject-design.lovable.app/admin/reports)
  const renderReports = () => {
    const totalOffersCount = applications.filter(app => ['Offer', 'Selected'].includes(app.status)).length;
    
    // Unique companies visited (companies that have at least one approved job posting or are verified recruiters)
    const companiesVisited = Array.from(new Set(
      recruiters
        .filter(r => r.recruiterDetails?.status === 'Verified')
        .map(r => (r.recruiterDetails?.company || r.name).trim().toLowerCase())
    )).length;
    const finalCompaniesVisited = companiesVisited > 0 ? companiesVisited : recruitersList.length;

    const quickStats = [
      { label: 'Total offers', val: totalOffersCount.toString() },
      { label: 'International offers', val: totalInternationalOffers.toString() },
      { label: 'PPO conversions', val: totalPpos.toString() },
      { label: 'Multiple offers', val: totalMultipleOffersCount.toString() },
      { label: 'Companies visited', val: finalCompaniesVisited.toString() }
    ];

    const { sectorOffers } = getSectorDistribution();

    // Group students by program/department
    const departments = Array.from(new Set([...['B.Tech CSE', 'B.Tech ECE', 'MBA', 'B.Des', 'M.Sc Data Science'], ...studentsList.map(s => s.program)]));
    const programPerformance = departments.map(dept => {
      const deptStudents = studentsList.filter(s => s.program === dept);
      const eligible = deptStudents.length;
      const placed = deptStudents.filter(s => s.status === 'Placed' || s.status === 'Selected' || s.status === 'Offer').length;
      const rate = eligible > 0 ? `${Math.round((placed / eligible) * 100)}%` : '0%';
      
      const deptStudentEmails = deptStudents.map(s => s.email);
      // Use actual CTC from placement records first
      const deptPlacedApps = applications.filter(app =>
        (app.status === 'Selected' || app.status === 'Offer') &&
        deptStudentEmails.includes(app.studentEmail)
      );
      const deptActualCtcs = deptPlacedApps.filter(a => a.ctc && a.ctc.trim()).map(a => parseCtcLPA(a.ctc)).filter(v => v > 0);
      // Fallback to job salaries if no actual CTC data
      const deptJobIds = deptPlacedApps.map(o => o.jobId);
      const deptJobs = jobs.filter(j => deptJobIds.includes(j.id));
      const deptSalaries = deptActualCtcs.length > 0
        ? deptActualCtcs
        : deptJobs.map(j => parseCtcLPA(j.salary)).filter(val => val > 0);

      const deptAvg = deptSalaries.length > 0 ? `₹${(deptSalaries.reduce((a, b) => a + b, 0) / deptSalaries.length).toFixed(1)}L` : '—';
      const deptTop = deptSalaries.length > 0 ? `₹${Math.max(...deptSalaries).toFixed(1)}L` : '—';

      return {
        program: dept,
        eligible: eligible.toString(),
        placed: placed.toString(),
        rate,
        avgCtc: deptAvg,
        topCtc: deptTop
      };
    });

    return (
      <div className="space-y-8 animate-fade-in-up">
        {/* Banner with subtitle & two action buttons */}
        <div className="border-b border-[#022c22]/10 pb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h1 className="editorial-heading font-serif text-4xl text-[#022c22] font-light">Reports & Analytics</h1>
            <p className="text-text-secondary text-sm font-medium mt-1">Placement trends, sector mix and program-wise outcomes.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
            <button 
              onClick={handleExportReportsCSV}
              className="bg-[#FAF7EE] border border-[#022c22]/15 text-[#022c22] px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-white transition-all cursor-pointer shadow-sm flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> CSV
            </button>
            <button 
              onClick={handleGenerateReportsPDF}
              className="bg-[#022c22] hover:bg-[#124237] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm flex items-center gap-2"
            >
              <FileText className="w-4 h-4" /> Generate PDF
            </button>
          </div>
        </div>

        {/* 5 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {/* PLACEMENT RATE */}
          <div className="bg-white border border-[#022c22]/5 p-5 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-sm transition-all duration-300">
            <div className="space-y-1">
              <span className="text-[10px] text-text-secondary font-extrabold uppercase tracking-widest block">PLACEMENT RATE</span>
              <div className="text-2xl font-serif font-bold text-[#022c22] mt-1">{placementRate}%</div>
              <p className="text-[10px] text-brand-gold font-bold mt-1 uppercase tracking-wider">{placedApplications.length} candidates placed</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#f4f3ea] flex items-center justify-center text-[#022c22] shrink-0">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>

          {/* AVG CTC */}
          <div className="bg-white border border-[#022c22]/5 p-5 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-sm transition-all duration-300">
            <div className="space-y-1">
              <span className="text-[10px] text-text-secondary font-extrabold uppercase tracking-widest block">AVG CTC (PLACED)</span>
              <div className="text-2xl font-serif font-bold text-[#022c22] mt-1">₹{avgCtc} LPA</div>
              <p className="text-[10px] text-brand-gold font-bold mt-1 uppercase tracking-wider">Peak: ₹{highestCtc} LPA</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-brand-gold/10 flex items-center justify-center text-brand-gold shrink-0">
              <Bookmark className="w-5 h-5" />
            </div>
          </div>

          {/* INTERNATIONAL */}
          <div className="bg-white border border-[#022c22]/5 p-5 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-sm transition-all duration-300">
            <div className="space-y-1">
              <span className="text-[10px] text-text-secondary font-extrabold uppercase tracking-widest block">INTERNATIONAL</span>
              <div className="text-2xl font-serif font-bold text-[#022c22] mt-1">{totalInternationalOffers}</div>
              <p className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-md mt-1 w-max font-bold">Global Hires</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-brand-gold/10 flex items-center justify-center text-brand-gold shrink-0">
              <Globe className="w-5 h-5" />
            </div>
          </div>

          {/* PPO CONVERTED */}
          <div className="bg-white border border-[#022c22]/5 p-5 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-sm transition-all duration-300">
            <div className="space-y-1">
              <span className="text-[10px] text-text-secondary font-extrabold uppercase tracking-widest block">PPO CONVERTED</span>
              <div className="text-2xl font-serif font-bold text-[#022c22] mt-1">{totalPpos}</div>
              <p className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-md mt-1 w-max font-bold">Pre-Placement</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#f4f3ea] flex items-center justify-center text-[#022c22] shrink-0">
              <Check className="w-5 h-5" />
            </div>
          </div>

          {/* MULTIPLE OFFERS */}
          <div className="bg-white border border-[#022c22]/5 p-5 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-sm transition-all duration-300">
            <div className="space-y-1">
              <span className="text-[10px] text-text-secondary font-extrabold uppercase tracking-widest block">MULTIPLE OFFERS</span>
              <div className="text-2xl font-serif font-bold text-[#022c22] mt-1">{totalMultipleOffersCount}</div>
              <p className="text-[10px] text-[#b38b3f] bg-brand-gold/10 border border-brand-gold/20 px-1.5 py-0.5 rounded-md mt-1 w-max font-bold">Multi-Selections</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#f4f3ea] flex items-center justify-center text-[#022c22] shrink-0">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Dashboard split columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column (8 columns) */}
          <div className="lg:col-span-8 space-y-8">
            {/* 5-Year Trend Graph */}
            <div className="bg-white border border-[#022c22]/5 p-6 rounded-2xl shadow-xs">
              <h3 className="editorial-heading font-serif text-xl font-semibold text-[#022c22] border-b border-[#022c22]/5 pb-4 mb-6">
                Placement rate — 5 year trend
              </h3>

              <div className="relative pt-2">
                <svg viewBox="0 0 600 200" className="w-full h-auto">
                  <defs>
                    <linearGradient id="reportsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#022c22" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#022c22" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal dash grid */}
                  <line x1="40" y1="20" x2="560" y2="20" stroke="#f4f3ea" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="40" y1="60" x2="560" y2="60" stroke="#f4f3ea" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="40" y1="100" x2="560" y2="100" stroke="#f4f3ea" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="40" y1="140" x2="560" y2="140" stroke="#f4f3ea" strokeWidth="1" strokeDasharray="3 3" />

                  {/* Area fill */}
                  <path 
                    d={`M 60 140 Q 170 120 290 100 T 410 80 T 530 ${170 - (placementRate / 100) * 130} L 530 160 L 60 160 Z`}
                    fill="url(#reportsGradient)"
                  />

                  {/* Curving lines */}
                  <path 
                    d={`M 60 140 Q 170 120 290 100 T 410 80 T 530 ${170 - (placementRate / 100) * 130}`} 
                    fill="none" 
                    stroke="#022c22" 
                    strokeWidth="3.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />

                  {/* Dots */}
                  <circle cx="60" cy="140" r="4.5" fill="#FAF7EE" stroke="#022c22" strokeWidth="2.5" />
                  <circle cx="170" cy="120" r="4.5" fill="#FAF7EE" stroke="#022c22" strokeWidth="2.5" />
                  <circle cx="290" cy="100" r="4.5" fill="#FAF7EE" stroke="#022c22" strokeWidth="2.5" />
                  <circle cx="410" cy="80" r="4.5" fill="#FAF7EE" stroke="#022c22" strokeWidth="2.5" />
                  <circle cx="530" cy={170 - (placementRate / 100) * 130} r="4.5" fill="#c29837" stroke="#022c22" strokeWidth="3" />

                  {/* Rate tags */}
                  <text x="60" y="125" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#022c22">82%</text>
                  <text x="170" y="105" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#022c22">86%</text>
                  <text x="290" y="85" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#022c22">89%</text>
                  <text x="410" y="65" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#022c22">91%</text>
                  <text x="530" y={170 - (placementRate / 100) * 130 - 12} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#c29837">{placementRate}%</text>

                  {/* X Axis labels */}
                  <text x="60" y="180" textAnchor="middle" fontSize="11" fill="#888" fontFamily="sans-serif">2021</text>
                  <text x="170" y="180" textAnchor="middle" fontSize="11" fill="#888" fontFamily="sans-serif">2022</text>
                  <text x="290" y="180" textAnchor="middle" fontSize="11" fill="#888" fontFamily="sans-serif">2023</text>
                  <text x="410" y="180" textAnchor="middle" fontSize="11" fill="#888" fontFamily="sans-serif">2024</text>
                  <text x="530" y="180" textAnchor="middle" fontSize="11" fill="#c29837" fontWeight="bold" fontFamily="sans-serif">2025</text>
                </svg>
              </div>
            </div>

            {/* Sector-wise Offers — real-time based on placed students' departments */}
            <div className="bg-white border border-[#022c22]/5 p-6 rounded-2xl shadow-xs">
              <div className="flex justify-between items-center border-b border-[#022c22]/5 pb-4 mb-5">
                <h3 className="editorial-heading font-serif text-lg text-[#022c22] font-semibold">
                  Sector-wise offers
                </h3>
                {(() => { const { totalPlaced } = getSectorDistribution(); return totalPlaced > 0 ? (
                  <span className="text-[10px] text-brand-gold uppercase tracking-wider font-extrabold">{totalPlaced} placed</span>
                ) : (
                  <span className="text-[10px] text-text-secondary uppercase tracking-wider font-bold">Seeded estimates</span>
                ); })()}
              </div>

              <div className="space-y-5 pt-1">
                {getSectorDistribution().sectorOffers.map((item, idx) => (
                  <div key={idx} className="space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-semibold text-[#022c22]">{item.sector}</span>
                        {item.count > 0 && (
                          <span className="ml-2 text-[10px] text-brand-gold font-bold">{item.count} offer{item.count !== 1 ? 's' : ''}</span>
                        )}
                      </div>
                      <span className="font-bold text-[#022c22]">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-[#f4f3ea] h-2.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${item.percentage}%`,
                          background: idx === 0 ? '#022c22' : idx === 1 ? '#b38b3f' : '#6b8c6b'
                        }}
                      ></div>
                    </div>
                    <p className="text-[10px] text-text-secondary leading-relaxed">
                      {item.sector === 'Technology & Engineering' && 'CSE, ECE, IT, EE, Mechanical'}
                      {item.sector === 'Management & Business' && 'MBA, Business Administration, Finance'}
                      {item.sector === 'Applied Sciences & Design' && 'Data Science, B.Des, Mathematics'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Program Performance Table */}
            <div className="bg-white border border-[#022c22]/5 p-6 rounded-2xl shadow-xs">
              <h3 className="editorial-heading font-serif text-xl font-semibold text-[#022c22] border-b border-[#022c22]/5 pb-4 mb-4">
                Program performance
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-[#022c22]/5 text-[10px] uppercase text-text-secondary font-bold tracking-widest">
                      <th className="pb-3">PROGRAM</th>
                      <th className="pb-3 text-center">ELIGIBLE</th>
                      <th className="pb-3 text-center">PLACED</th>
                      <th className="pb-3 text-center">RATE</th>
                      <th className="pb-3 text-center">AVG CTC</th>
                      <th className="pb-3 text-right">TOP CTC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#022c22]/5">
                    {programPerformance.map((row, idx) => (
                      <tr key={idx} className="hover:bg-brand-cream/10 transition-colors">
                        <td className="py-3.5 font-bold text-[#022c22]">{row.program}</td>
                        <td className="py-3.5 text-center font-medium text-text-secondary">{row.eligible}</td>
                        <td className="py-3.5 text-center font-medium text-text-secondary">{row.placed}</td>
                        <td className="py-3.5 text-center font-bold text-emerald-700">{row.rate}</td>
                        <td className="py-3.5 text-center font-semibold text-[#022c22]">{row.avgCtc}</td>
                        <td className="py-3.5 text-right font-bold text-[#022c22]">{row.topCtc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column (4 columns) */}
          <div className="lg:col-span-4 space-y-8">
            {/* Quick Stats list */}
            <div className="bg-white border border-[#022c22]/5 p-6 rounded-2xl shadow-xs">
              <h3 className="editorial-heading font-serif text-lg text-[#022c22] font-semibold border-b border-[#022c22]/5 pb-4 mb-4">
                Quick stats
              </h3>
              
              <div className="space-y-4">
                {quickStats.map((stat, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs border-b border-gray-100 pb-2.5 last:border-0 last:pb-0">
                    <span className="font-medium text-text-secondary">{stat.label}</span>
                    <span className="font-serif font-bold text-md text-[#022c22]">{stat.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Generate Report Widget */}
            <div className="bg-white border border-[#022c22]/5 p-6 rounded-2xl shadow-xs">
              <h3 className="editorial-heading font-serif text-lg text-[#022c22] font-semibold border-b border-[#022c22]/5 pb-4 mb-4">
                Generate report
              </h3>
              
              <div className="space-y-4 text-xs">
                <div className="space-y-1">
                  <select 
                    value={selectedReportType}
                    onChange={(e) => setSelectedReportType(e.target.value)}
                    className="w-full bg-[#FAF7EE] border border-[#022c22]/10 text-xs px-4 py-2.5 rounded-xl font-medium focus:outline-none cursor-pointer"
                  >
                    <option>Annual placement summary</option>
                    <option>Sector distribution matrix</option>
                    <option>Detailed recruiter mix</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <select 
                    value={selectedReportBatch}
                    onChange={(e) => setSelectedReportBatch(e.target.value)}
                    className="w-full bg-[#FAF7EE] border border-[#022c22]/10 text-xs px-4 py-2.5 rounded-xl font-medium focus:outline-none cursor-pointer"
                  >
                    <option>Batch 2025</option>
                    <option>Batch 2026</option>
                  </select>
                </div>
                <button 
                  onClick={handleGenerateCustomReport}
                  className="w-full bg-[#022c22] hover:bg-[#124237] text-white py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4 text-brand-gold" /> Generate
                </button>
              </div>
            </div>

            {/* Insights and notes */}
            <div className="bg-white border border-[#022c22]/5 p-6 rounded-2xl shadow-xs">
              <h3 className="editorial-heading font-serif text-lg text-[#022c22] font-semibold border-b border-[#022c22]/5 pb-4 mb-4">
                Insights
              </h3>

              <div className="space-y-4">
                {studentsList.length === 0 ? (
                  <p className="text-text-secondary text-xs italic font-medium">No placement insights available yet. Register students and log hiring drives to generate telemetry.</p>
                ) : (
                  <>
                    <div className="flex items-start gap-3 text-xs leading-normal">
                      <div className="w-5 h-5 rounded-full bg-[#FAF7EE] border border-[#022c22]/10 flex items-center justify-center shrink-0 mt-0.5 text-[#022c22]">
                        <Users className="w-3.5 h-3.5" />
                      </div>
                      <p className="text-text-secondary font-medium">Placement drive is active with {studentsList.length} registered candidates.</p>
                    </div>
                    <div className="flex items-start gap-3 text-xs leading-normal">
                      <div className="w-5 h-5 rounded-full bg-[#FAF7EE] border border-[#022c22]/10 flex items-center justify-center shrink-0 mt-0.5 text-[#022c22]">
                        <Building className="w-3.5 h-3.5" />
                      </div>
                      <p className="text-text-secondary font-medium">{recruitersList.length} verified hiring partners connected.</p>
                    </div>
                    <div className="flex items-start gap-3 text-xs leading-normal">
                      <div className="w-5 h-5 rounded-full bg-[#FAF7EE] border border-[#022c22]/10 flex items-center justify-center shrink-0 mt-0.5 text-[#022c22]">
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </div>
                      <p className="text-text-secondary font-medium">Overall campus placement rate currently stands at {placementRate}%.</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };


  // 6. Approval Queue panel (Fleshed out from https://placementproject-design.lovable.app/admin/approvals)
  const renderApprovals = () => {
    // Dynamic filtered approvals queue based on selected category pill
    const filteredApprovals = approvalsQueue.filter(item => {
      const query = adminSearch.toLowerCase();
      const matchSearch = !adminSearch || 
                          (item.entityName || '').toLowerCase().includes(query) || 
                          (item.details || '').toLowerCase().includes(query) || 
                          (item.type || '').toLowerCase().includes(query);
      
      if (!matchSearch) return false;
      if (approvalFilter === 'All') return true;
      if (approvalFilter === 'Companies') return item.type === 'Company';
      if (approvalFilter === 'Jobs') return item.type === 'Job';
      if (approvalFilter === 'Drives') return item.type === 'Drive';
      if (approvalFilter === 'Students') return item.type === 'Student';
      return true;
    });

    return (
      <div className="space-y-8 animate-fade-in-up">
        {/* Banner with subtitle */}
        <div className="border-b border-[#022c22]/10 pb-6 flex justify-between items-center">
          <div>
            <h1 className="editorial-heading font-serif text-4xl text-[#022c22] font-light">Approvals</h1>
            <p className="text-text-secondary text-sm font-medium mt-1">Review and approve company, job and student requests.</p>
          </div>
        </div>

        {/* 3 Stats metric cards row (removed AVG RESPONSE) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* PENDING Card */}
          <div className="bg-white border border-[#022c22]/5 p-6 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-sm transition-all duration-300">
            <div className="space-y-1">
              <span className="text-[10px] text-text-secondary font-bold uppercase tracking-widest block">PENDING</span>
              <div className="text-3xl font-serif font-bold text-[#022c22] mt-1">{approvalsQueue.length}</div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-[#FAF7EE] flex items-center justify-center text-[#78350F] border border-[#78350F]/10 shrink-0">
              <Clock className="w-5.5 h-5.5" />
            </div>
          </div>

          {/* APPROVED (WEEK) Card */}
          <div className="bg-white border border-[#022c22]/5 p-6 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-sm transition-all duration-300">
            <div className="space-y-1">
              <span className="text-[10px] text-text-secondary font-bold uppercase tracking-widest block">APPROVED (WEEK)</span>
              <div className="text-3xl font-serif font-bold text-[#022c22] mt-1">{totalApproved}</div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-[#E6F4EA] flex items-center justify-center text-[#137333] border border-[#137333]/10 shrink-0">
              <CheckCircle2 className="w-5.5 h-5.5" />
            </div>
          </div>

          {/* REJECTED (WEEK) Card */}
          <div className="bg-white border border-[#022c22]/5 p-6 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-sm transition-all duration-300">
            <div className="space-y-1">
              <span className="text-[10px] text-text-secondary font-bold uppercase tracking-widest block">REJECTED (WEEK)</span>
              <div className="text-3xl font-serif font-bold text-[#022c22] mt-1">{totalRejected}</div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-[#FAF7EE] flex items-center justify-center text-[#78350F] border border-[#78350F]/10 shrink-0">
              <XCircle className="w-5.5 h-5.5" />
            </div>
          </div>
        </div>

        {/* Filter Pills row */}
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {['All', 'Companies', 'Jobs', 'Drives', 'Students'].map(category => {
            const isActive = approvalFilter === category;
            return (
              <button
                key={category}
                onClick={() => setApprovalFilter(category)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive 
                    ? 'bg-[#022c22] text-white shadow-xs' 
                    : 'bg-[#FAF7EE] border border-[#022c22]/10 text-[#022c22] hover:bg-white'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Approval Queue container (Full Width) */}
        <div className="bg-white border border-[#022c22]/5 p-6 rounded-2xl shadow-xs">
          <h3 className="font-serif text-2xl font-light text-[#022c22] mb-6">
            Approval queue
          </h3>

          <div className="divide-y divide-[#022c22]/5">
            {filteredApprovals.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-sm font-medium text-text-secondary">No pending items for this category.</p>
              </div>
            ) : (
              filteredApprovals.map(item => {
                // Determine appropriate icon for type
                const getIcon = () => {
                  if (item.type === 'Company') return <Building className="w-5 h-5 text-[#022c22]" />;
                  if (item.type === 'Job') return <Briefcase className="w-5 h-5 text-[#022c22]" />;
                  if (item.type === 'Drive') return <Calendar className="w-5 h-5 text-[#022c22]" />;
                  return <GraduationCap className="w-5 h-5 text-[#022c22]" />;
                };

                return (
                  <div 
                    key={item.id} 
                    className={`py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-0 last:pb-0 px-4 rounded-xl transition-all duration-500 ${
                      item.id === highlightedEntityId || (adminSearch && item.entityName.toLowerCase().includes(adminSearch.toLowerCase()))
                        ? 'bg-brand-gold/10 border border-brand-gold scale-[1.01] shadow-md animate-pulse' 
                        : 'hover:bg-brand-cream/5 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Left Icon box */}
                      <div className="w-10 h-10 rounded-lg bg-[#FAF7EE] flex items-center justify-center text-[#022c22] border border-[#022c22]/5 shrink-0">
                        {getIcon()}
                      </div>
                      
                      <div className="space-y-1">
                        {/* First line: Badge and Entity Name */}
                        <div className="flex items-center flex-wrap gap-2">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#F5efe4] text-[#78350F] border border-[#78350F]/10 shrink-0">
                            {item.type}
                          </span>
                          <span className="font-serif text-[#022c22] text-md font-semibold">
                            {item.entityName}
                          </span>
                        </div>
                        {/* Second line: Details */}
                        <p className="text-text-secondary text-xs leading-normal font-medium">
                          {item.details.replace(' · ', ' - ')}
                        </p>
                        {/* Third line: Timestamp */}
                        <p className="text-[10px] text-text-secondary/60 font-medium">
                          {item.time}
                        </p>
                      </div>
                    </div>

                    {/* Right side Actions */}
                    <div className="flex gap-2.5 shrink-0 justify-end">
                      <button 
                        onClick={() => handleProcessApproval(item.id, item.entityName, 'Rejected')}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 border border-[#022c22]/15 text-[#022c22] hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-xs font-bold rounded-lg transition-all shadow-xs cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                      <button 
                        onClick={() => {
                          if (item.type === 'Job') {
                            setPendingJobToApprove(item);
                            setShowTierModal(true);
                          } else {
                            handleProcessApproval(item.id, item.entityName, 'Approved');
                          }
                        }}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#022c22] hover:bg-[#124237] text-white text-xs font-bold rounded-lg transition-all shadow-xs cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" /> Approve
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recently processed (Full Width) */}
        <div className="bg-white border border-[#022c22]/5 p-6 rounded-2xl shadow-xs">
          <h3 className="font-serif text-2xl font-light text-[#022c22] mb-6">
            Recently processed
          </h3>

          <div className="flex flex-col gap-3">
            {recentlyProcessed.map((item, idx) => (
              <div key={idx} className="bg-[#FAF7EE]/50 border border-[#022c22]/5 p-4 rounded-xl flex items-center justify-between gap-4 hover:shadow-xs transition-shadow">
                <div className="flex items-center">
                  <span className={`px-3 py-0.5 rounded-full text-[11px] font-bold ${
                    item.action === 'Approved' 
                      ? 'bg-[#E6F4EA] text-[#137333] border border-[#137333]/15' 
                      : 'bg-[#FCE8E6] text-[#C5221F] border border-[#C5221F]/15'
                  }`}>
                    {item.action}
                  </span>
                  <span className="font-semibold text-[#022c22] text-sm ml-3">
                    {item.target.replace(' · ', ' · ')}
                  </span>
                </div>
                <span className="text-[11px] text-text-secondary/70 shrink-0 font-medium">
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // 7. Notifications Log Panel (Fleshed out from https://placementproject-design.lovable.app/admin/notifications)
  const renderNotifications = () => {
    // Unread count computation
    const unreadCount = notificationsQueue.filter(n => n.unread).length;

    const getCategory = (notif) => {
      const title = notif.title.toLowerCase();
      const message = notif.message.toLowerCase();
      if (title.includes('approval') || title.includes('verify') || title.includes('request')) return 'Approvals';
      if (title.includes('drive') || title.includes('job') || title.includes('posting')) return 'Drives';
      if (title.includes('compliance') || title.includes('policy')) return 'Compliance';
      if (title.includes('milestone') || title.includes('offer') || title.includes('placed')) return 'Milestones';
      return 'Approvals';
    };

    // Filtered notifications queue based on selected category pill
    const filteredNotifications = notificationsQueue.filter(item => {
      const query = adminSearch.toLowerCase();
      const matchSearch = !adminSearch || 
                          (item.title || '').toLowerCase().includes(query) || 
                          (item.message || '').toLowerCase().includes(query);
      
      if (!matchSearch) return false;
      if (notificationFilter === 'All') return true;
      const category = getCategory(item);
      return category === notificationFilter;
    });

    return (
      <div className="space-y-8 animate-fade-in-up">
        {/* Banner with subtitle and Mark all as read button */}
        <div className="border-b border-[#022c22]/10 pb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h1 className="editorial-heading font-serif text-4xl text-[#022c22] font-light">Notifications</h1>
            <p className="text-text-secondary text-sm font-medium mt-1">
              {unreadCount === 0 ? 'No unread updates' : `${unreadCount} unread updates`}
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleMarkAllNotifications}
              className="bg-[#FAF7EE] border border-[#022c22]/15 text-[#022c22] px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-white transition-all cursor-pointer shadow-sm flex items-center gap-2 self-start sm:self-auto"
            >
              Mark all as read
            </button>
            <button 
              onClick={async () => {
                if (window.confirm('Are you sure you want to permanently clear all notifications? This cannot be undone.')) {
                  const res = await clearNotifications();
                  if (res && res.success) {
                    triggerToast('All notifications cleared successfully.');
                  } else {
                    alert(`Failed to clear notifications: ${res?.error || 'Unknown error'}`);
                  }
                }
              }}
              className="bg-red-50 border border-red-100 hover:bg-red-100 text-red-700 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm flex items-center gap-2 self-start sm:self-auto"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Filter pills toolbar */}
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {['All', 'Approvals', 'Drives', 'Compliance', 'Milestones'].map(category => {
            const isActive = notificationFilter === category;
            return (
              <button
                key={category}
                onClick={() => setNotificationFilter(category)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive 
                    ? 'bg-[#022c22] text-white shadow-xs' 
                    : 'bg-[#FAF7EE] border border-[#022c22]/10 text-[#022c22] hover:bg-white'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Notifications log queue ("Recent" container) */}
        <div className="bg-white border border-[#022c22]/5 p-6 rounded-2xl shadow-xs">
          <h3 className="font-serif text-2xl font-light text-[#022c22] mb-6">
            Recent
          </h3>

          <div className="divide-y divide-[#022c22]/5">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-sm font-medium text-text-secondary">No notifications for this category.</p>
              </div>
            ) : (
              filteredNotifications.map(item => {
                // Determine appropriate circular icon style and icon
                const getCircularStyle = () => {
                  const category = getCategory(item);
                  if (item.type === 'success') {
                    return {
                      container: 'bg-[#E6F4EA] text-[#137333] border-[#137333]/10',
                      icon: <ShieldCheck className="w-5.5 h-5.5" />
                    };
                  }
                  if (item.type === 'warning') {
                    return {
                      container: 'bg-[#FCE8E6] text-[#C5221F] border-[#C5221F]/10',
                      icon: <AlertCircle className="w-5.5 h-5.5" />
                    };
                  }
                  if (category === 'Drives') {
                    return {
                      container: 'bg-[#E4F7F6] text-[#0D9488] border-[#0D9488]/10',
                      icon: <Briefcase className="w-5.5 h-5.5" />
                    };
                  }
                  if (category === 'Compliance') {
                    return {
                      container: 'bg-[#FAF7EE] text-[#78350F] border-[#78350F]/10',
                      icon: <Building className="w-5.5 h-5.5" />
                    };
                  }
                  if (category === 'Milestones') {
                    return {
                      container: 'bg-[#E8F0FE] text-[#1A73E8] border-[#1A73E8]/10',
                      icon: <TrendingUp className="w-5.5 h-5.5" />
                    };
                  }
                  return {
                    container: 'bg-[#FAF7EE] text-[#78350F] border-[#78350F]/10',
                    icon: <GraduationCap className="w-5.5 h-5.5" />
                  };
                };

                const badge = getCircularStyle();

                const isSearched = adminSearch && (
                  item.title.toLowerCase().includes(adminSearch.toLowerCase()) ||
                  item.message.toLowerCase().includes(adminSearch.toLowerCase())
                );

                return (
                  <div 
                    key={item.id} 
                    className={`py-5 flex items-start gap-4 first:pt-0 last:pb-0 px-4 rounded-xl transition-all duration-300 ${
                      isSearched 
                        ? 'bg-brand-gold/15 border border-brand-gold scale-[1.005] shadow-sm' 
                        : 'hover:bg-brand-cream/5'
                    }`}
                  >
                    {/* Circle Indicator Icon */}
                    <div className={`w-9.5 h-9.5 rounded-full flex items-center justify-center shrink-0 mt-0.5 border ${badge.container}`}>
                      {badge.icon}
                    </div>

                    {/* Notification info stack */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex justify-between items-center gap-4">
                        <span className="font-serif text-[#022c22] text-sm font-semibold flex items-center">
                          {item.title}
                          {item.unread && (
                            <span className="text-[#c29837] text-xl ml-1.5 align-middle leading-none">•</span>
                          )}
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary leading-normal font-medium">
                        {item.message}
                      </p>
                      <p className="text-[10px] text-text-secondary/60 font-medium">
                        {item.time}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative">
      {/* Toast Alert Pop-Up */}
      {successMessage && (
        <div className="fixed top-24 right-6 bg-[#022c22] text-white border border-[#c29837]/35 py-3 px-5 rounded-2xl shadow-xl z-50 flex items-center gap-3 animate-fade-in-up">
          <div className="w-5 h-5 rounded-full bg-brand-gold flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#022c22]" />
          </div>
          <span className="text-xs font-bold font-serif tracking-wide">{successMessage}</span>
        </div>
      )}

      {/* Dynamic Sub-tab Switcher Rendering */}
      {(() => {
        switch (activeSubTab) {
          case 'overview':
            return renderOverview();
          case 'students':
            return renderStudents();
          case 'recruiters':
            return renderRecruiters();
          case 'drives-jobs':
            return renderDrivesJobs();
          case 'reports':
            return renderReports();
          case 'approvals':
            return renderApprovals();
          case 'notifications':
            return renderNotifications();
          default:
            return renderOverview();
        }
      })()}

      {/* --- STUDENT PROFILE VIEW MODAL --- */}
      {showStudentProfileModal && selectedStudent && (
        <div className="fixed inset-0 bg-[#022c22]/30 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-brand-cream border border-[#f2efdf] max-w-3xl w-full rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl animate-fade-in-up max-h-[90vh] overflow-y-auto scrollbar-hide">
            {/* Header section */}
            <div className="flex justify-between items-start border-b border-[#022c22]/10 pb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full font-serif font-bold bg-brand-gold text-[#022c22] text-2xl flex items-center justify-center shadow-md">
                  {selectedStudent.name ? selectedStudent.name.split(' ').map(n => n[0]).join('') : 'S'}
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#022c22]">{selectedStudent.name}</h3>
                  <p className="text-xs text-[#022c22]/70 font-semibold mt-1">
                    {selectedStudent.studentDetails?.department || 'Student'} · Class of {selectedStudent.studentDetails?.batch || '2026'}
                  </p>
                  <p className="text-[10px] text-brand-gold uppercase tracking-wider font-extrabold mt-1">
                    Roll No: {selectedStudent.studentDetails?.roll || 'N/A'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => { setShowStudentProfileModal(false); setSelectedStudent(null); }} 
                className="text-[#022c22]/40 hover:text-[#022c22] p-1.5 hover:bg-[#022c22]/5 rounded-full transition-colors cursor-pointer"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Content body layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#022c22] font-medium">
              
              {/* Left Column - Details, Skills & Contacts */}
              <div className="space-y-6 md:border-r md:border-[#022c22]/10 md:pr-6">
                
                {/* Stats / Academic Info */}
                <div className="bg-white border border-[#022c22]/5 p-4.5 rounded-2xl shadow-2xs space-y-3">
                  <span className="text-[10px] text-brand-gold uppercase tracking-wider font-extrabold block">Academic Rating</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-serif font-bold">{selectedStudent.studentDetails?.cgpa || 'N/A'}</span>
                    <span className="text-[10px] text-[#022c22]/50">CGPA</span>
                  </div>
                  <div className="pt-2 border-t border-[#022c22]/5 flex items-center gap-1.5 text-[10px] text-[#022c22]/70">
                    <svg className="w-3.5 h-3.5 text-[#022c22]/35 fill-none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
                    <span>{selectedStudent.studentDetails?.location || 'Bengaluru, India'}</span>
                  </div>
                </div>

                {/* Contact list */}
                <div className="space-y-3">
                  <h4 className="text-[10px] text-brand-gold uppercase tracking-wider font-extrabold">Contact details</h4>
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#022c22]/35" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
                      <span className="truncate">{selectedStudent.email}</span>
                    </div>
                    {selectedStudent.studentDetails?.phone && (
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-[#022c22]/35" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.387a12.035 12.035 0 0 1-7.108-7.108c-.115-.44.05-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>
                        <span>{selectedStudent.studentDetails.phone}</span>
                      </div>
                    )}
                    {selectedStudent.studentDetails?.linkedin && (
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-[#022c22]/35 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                        <span className="truncate">{selectedStudent.studentDetails.linkedin}</span>
                      </div>
                    )}
                    {selectedStudent.studentDetails?.github && (
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-[#022c22]/35 fill-current" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                        <span className="truncate">{selectedStudent.studentDetails.github}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Skill Assets */}
                <div className="space-y-3.5">
                  <h4 className="text-[10px] text-brand-gold uppercase tracking-wider font-extrabold">Technical skills</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedStudent.studentDetails?.skills && selectedStudent.studentDetails.skills.length > 0 ? (
                      selectedStudent.studentDetails.skills.map((skill) => (
                        <span 
                          key={skill} 
                          className="bg-white border border-[#022c22]/10 text-[#022c22] font-bold text-[10px] px-2.5 py-1 rounded-full shadow-2xs"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="italic text-[#022c22]/40">No skills added yet</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Center & Right Column - Bio & Detailed Timeline lists */}
              <div className="md:col-span-2 space-y-6">
                
                {/* About Candidate */}
                <div className="space-y-2">
                  <h4 className="text-[10px] text-brand-gold uppercase tracking-wider font-extrabold">Professional Bio</h4>
                  <p className="text-xs text-[#022c22]/75 leading-relaxed font-semibold bg-white border border-[#022c22]/10 p-4 rounded-2xl shadow-2xs">
                    {selectedStudent.studentDetails?.about || "This candidate has not provided an extended bio yet."}
                  </p>
                </div>

                {/* Projects timeline */}
                <div className="space-y-3">
                  <h4 className="text-[10px] text-brand-gold uppercase tracking-wider font-extrabold">Projects & Achievements</h4>
                  <div className="space-y-3">
                    {selectedStudent.studentDetails?.projects && selectedStudent.studentDetails.projects.length > 0 ? (
                      selectedStudent.studentDetails.projects.map((proj, idx) => (
                        <div key={idx} className="bg-white border border-[#022c22]/10 p-4.5 rounded-2xl shadow-2xs relative">
                          <span className="absolute right-4.5 top-4.5 text-[10px] text-brand-gold font-extrabold uppercase tracking-wider">
                            {proj.date}
                          </span>
                          <h5 className="font-serif text-sm font-bold text-[#022c22] pr-20">{proj.title}</h5>
                          <p className="text-xs text-[#022c22]/60 mt-1.5 leading-relaxed font-semibold">{proj.description}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 bg-white border border-[#022c22]/10 rounded-2xl text-[#022c22]/40 font-medium">
                        No projects listed yet.
                      </div>
                    )}
                  </div>
                </div>

                {/* Education timeline */}
                <div className="space-y-3">
                  <h4 className="text-[10px] text-brand-gold uppercase tracking-wider font-extrabold">Education</h4>
                  <div className="space-y-3">
                    {selectedStudent.studentDetails?.education && selectedStudent.studentDetails.education.length > 0 ? (
                      selectedStudent.studentDetails.education.map((edu, idx) => (
                        <div key={idx} className="bg-white border border-[#022c22]/10 p-4.5 rounded-2xl shadow-2xs flex justify-between items-start gap-4">
                          <div>
                            <h5 className="font-serif text-sm font-bold text-[#022c22]">{edu.school}</h5>
                            <p className="text-xs text-[#022c22]/60 mt-1 font-semibold">{edu.degree}</p>
                            <span className="text-[10px] text-[#022c22]/45 mt-1 block font-bold">{edu.duration}</span>
                          </div>
                          <span className="bg-emerald-50 border border-emerald-100 text-emerald-800 font-extrabold px-3 py-1 rounded-full text-[10px] tracking-wider uppercase shrink-0 shadow-2xs">
                            {edu.grade}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 bg-white border border-[#022c22]/10 rounded-2xl text-[#022c22]/40 font-medium">
                        No education history listed yet.
                      </div>
                    )}
                  </div>
                </div>

                {/* Certifications timeline */}
                <div className="space-y-3">
                  <h4 className="text-[10px] text-brand-gold uppercase tracking-wider font-extrabold">Certifications</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedStudent.studentDetails?.certifications && selectedStudent.studentDetails.certifications.length > 0 ? (
                      selectedStudent.studentDetails.certifications.map((cert, idx) => (
                        <div key={idx} className="bg-white border border-[#022c22]/10 p-4 rounded-2xl shadow-2xs">
                          <h5 className="font-serif text-sm font-bold text-[#022c22]">{cert.title}</h5>
                          <p className="text-[11px] text-[#022c22]/65 mt-1 font-semibold">Issuer: {cert.issuer}</p>
                          <span className="text-[10px] text-brand-gold mt-1 block font-bold">{cert.date}</span>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 text-center py-4 bg-white border border-[#022c22]/10 rounded-2xl text-[#022c22]/40 font-medium">
                        No certifications listed yet.
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
            
            {/* Footer buttons */}
            <div className="flex justify-end pt-4 border-t border-[#022c22]/5">
              <button 
                onClick={() => { setShowStudentProfileModal(false); setSelectedStudent(null); }}
                className="bg-[#022c22] hover:bg-[#124237] text-white font-semibold text-xs py-2.5 px-6 rounded-xl transition-all cursor-pointer shadow-sm uppercase tracking-wider"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MANAGE RECRUITER JOBS MODAL --- */}
      {showManageJobsModal && selectedRecruiterForManage && (
        <div className="fixed inset-0 bg-[#022c22]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white border border-[#022c22]/10 max-w-2xl w-full rounded-2xl p-6 shadow-xl space-y-5 animate-fade-in-up max-h-[90vh] overflow-y-auto scrollbar-hide">
            <div className="flex justify-between items-center border-b border-[#022c22]/5 pb-3">
              <div>
                <h3 className="editorial-heading font-serif text-xl font-bold text-[#022c22]">Manage Job Postings</h3>
                <span className="text-[11px] text-brand-gold uppercase tracking-wider block font-bold mt-1">
                  Company: {selectedRecruiterForManage.company}
                </span>
              </div>
              <button 
                onClick={() => { setShowManageJobsModal(false); setSelectedRecruiterForManage(null); }}
                className="text-text-secondary hover:text-[#022c22] font-semibold text-lg"
              >
                &times;
              </button>
            </div>

            <div className="max-h-[300px] overflow-y-auto pr-1 space-y-3">
              {jobs.filter(j => j.company.toLowerCase() === selectedRecruiterForManage.company.toLowerCase()).length === 0 ? (
                <p className="text-center py-6 text-text-secondary italic text-xs font-semibold">No job postings found for this company.</p>
              ) : (
                jobs.filter(j => j.company.toLowerCase() === selectedRecruiterForManage.company.toLowerCase()).map(job => (
                  <div key={job.id} className="bg-[#FAF7EE]/60 border border-[#022c22]/5 p-4 rounded-xl flex items-center justify-between gap-4">
                    <div>
                      <span className="font-bold text-[#022c22] text-sm block">{job.title}</span>
                      <span className="text-[10px] text-text-secondary block mt-0.5">{job.type} · {job.location} · Status: <strong className="uppercase">{job.status}</strong></span>
                    </div>
                    <div className="flex gap-2.5">
                      <button
                        onClick={() => {
                          setEditingJob(job);
                          setShowEditJobModal(true);
                        }}
                        className="bg-brand-cream border border-[#022c22]/10 hover:bg-white text-[#022c22] text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider transition-all cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={async () => {
                          if (window.confirm(`Are you sure you want to permanently delete the job posting for "${job.title}"?`)) {
                            const res = await deleteJob(job.id);
                            if (res.success) {
                              triggerToast(`Successfully removed job posting: ${job.title}`);
                            } else {
                              alert(`Failed to delete job: ${res.error}`);
                            }
                          }
                        }}
                        className="bg-red-50 border border-red-100 hover:bg-red-100 text-red-700 text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider transition-all cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end pt-4 border-t border-[#022c22]/5">
              <button
                type="button"
                onClick={() => { setShowManageJobsModal(false); setSelectedRecruiterForManage(null); }}
                className="bg-[#022c22] hover:bg-[#124237] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Close Manager
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- EDIT JOB POSTING MODAL --- */}
      {showEditJobModal && editingJob && (
        <div className="fixed inset-0 bg-[#022c22]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white border border-[#022c22]/10 max-w-xl w-full rounded-2xl p-6.5 space-y-6 shadow-2xl animate-fade-in-up max-h-[90vh] overflow-y-auto scrollbar-hide">
            <div className="flex justify-between items-center border-b border-[#022c22]/5 pb-4">
              <div>
                <h3 className="editorial-heading font-serif text-xl font-bold text-[#022c22]">Edit Job Parameters</h3>
                <span className="text-[10px] text-brand-gold uppercase tracking-wider block font-extrabold mt-1">Company: {editingJob.company}</span>
              </div>
              <button onClick={() => { setShowEditJobModal(false); setEditingJob(null); }} className="text-text-secondary hover:text-[#022c22] font-semibold text-lg">
                &times;
              </button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              const res = await updateJob(editingJob.id, {
                title: editingJob.title,
                location: editingJob.location,
                salary: editingJob.salary,
                type: editingJob.type,
                duration: editingJob.duration,
                eligibility: editingJob.eligibility,
                description: editingJob.description,
                skills: typeof editingJob.skills === 'string' ? editingJob.skills.split(',').map(s => s.trim()).filter(Boolean) : editingJob.skills
              });
              if (res.success) {
                setShowEditJobModal(false);
                setEditingJob(null);
                triggerToast('Successfully updated job details.');
              } else {
                alert(`Failed to save changes: ${res.error}`);
              }
            }} className="space-y-4 text-xs text-[#022c22] font-semibold">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-bold">Job Title</label>
                  <input
                    type="text"
                    required
                    value={editingJob.title}
                    onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })}
                    className="w-full p-2.5 bg-[#f4f3ea]/40 border border-[#022c22]/10 rounded-xl focus:outline-none focus:border-[#022c22] text-[#022c22]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-bold">Office Location</label>
                  <input
                    type="text"
                    required
                    value={editingJob.location}
                    onChange={(e) => setEditingJob({ ...editingJob, location: e.target.value })}
                    className="w-full p-2.5 bg-[#f4f3ea]/40 border border-[#022c22]/10 rounded-xl focus:outline-none text-[#022c22]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-bold">Stipend Package</label>
                  <input
                    type="text"
                    required
                    value={editingJob.salary}
                    onChange={(e) => setEditingJob({ ...editingJob, salary: e.target.value })}
                    className="w-full p-2.5 bg-[#f4f3ea]/40 border border-[#022c22]/10 rounded-xl text-[#022c22]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-bold">Duration</label>
                  <input
                    type="text"
                    required
                    value={editingJob.duration}
                    onChange={(e) => setEditingJob({ ...editingJob, duration: e.target.value })}
                    className="w-full p-2.5 bg-[#f4f3ea]/40 border border-[#022c22]/10 rounded-xl text-[#022c22]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-bold">Type</label>
                  <select
                    value={editingJob.type}
                    onChange={(e) => setEditingJob({ ...editingJob, type: e.target.value })}
                    className="w-full p-2.5 bg-[#f4f3ea]/40 border border-[#022c22]/10 rounded-xl text-[#022c22]"
                  >
                    <option value="Internship">Internship</option>
                    <option value="Full-time">Full-time</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-bold">Eligibility Criteria</label>
                  <input
                    type="text"
                    required
                    value={editingJob.eligibility}
                    onChange={(e) => setEditingJob({ ...editingJob, eligibility: e.target.value })}
                    className="w-full p-2.5 bg-[#f4f3ea]/40 border border-[#022c22]/10 rounded-xl text-[#022c22]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-bold">Required Skills (Comma separated)</label>
                  <input
                    type="text"
                    value={Array.isArray(editingJob.skills) ? editingJob.skills.join(', ') : editingJob.skills}
                    onChange={(e) => setEditingJob({ ...editingJob, skills: e.target.value })}
                    className="w-full p-2.5 bg-[#f4f3ea]/40 border border-[#022c22]/10 rounded-xl text-[#022c22]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-bold">Role Description</label>
                <textarea
                  rows="3"
                  required
                  value={editingJob.description}
                  onChange={(e) => setEditingJob({ ...editingJob, description: e.target.value })}
                  className="w-full p-2.5 bg-[#f4f3ea]/40 border border-[#022c22]/10 rounded-xl focus:outline-none text-[#022c22]"
                ></textarea>
              </div>

              <div className="flex gap-4 pt-4 border-t border-[#022c22]/5 justify-between">
                <button
                  type="button"
                  onClick={async () => {
                    if (window.confirm(`Are you sure you want to permanently delete the job posting for "${editingJob.title}"?`)) {
                      const res = await deleteJob(editingJob.id);
                      if (res.success) {
                        setShowEditJobModal(false);
                        setEditingJob(null);
                        triggerToast(`Successfully removed job posting: ${editingJob.title}`);
                      } else {
                        alert(`Failed to delete job: ${res.error}`);
                      }
                    }
                  }}
                  className="bg-red-50 border border-red-100 hover:bg-red-100 text-red-700 px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Delete Posting
                </button>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => { setShowEditJobModal(false); setEditingJob(null); }}
                    className="border border-[#022c22]/10 px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#022c22] hover:bg-[#124237] text-white px-6 py-2.5 rounded-xl font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- INTERVIEW DETAILS MODAL --- */}
      {showInterviewDetailsModal && selectedInterviewForDetails && (
        <div className="fixed inset-0 bg-[#022c22]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-[#FAF7EE] border border-[#022c22]/10 max-w-xl w-full rounded-2xl p-6.5 space-y-6 shadow-2xl animate-fade-in-up max-h-[90vh] overflow-y-auto scrollbar-hide">
            <div className="flex justify-between items-center border-b border-[#022c22]/5 pb-4">
              <div>
                <h3 className="editorial-heading font-serif text-xl font-bold text-[#022c22]">Interview Process Parameters</h3>
                <span className="text-[10px] text-brand-gold uppercase tracking-wider block font-bold mt-1">Company: {selectedInterviewForDetails.company}</span>
              </div>
              <button onClick={() => { setShowInterviewDetailsModal(false); setSelectedInterviewForDetails(null); }} className="text-text-secondary hover:text-[#022c22] font-semibold text-lg">
                &times;
              </button>
            </div>

            <div className="space-y-4 text-xs text-[#022c22] font-semibold">
              <div className="bg-white border border-[#022c22]/5 p-4 rounded-xl space-y-2">
                <span className="text-[9px] text-brand-gold uppercase tracking-wider font-extrabold block">Interview Step</span>
                <p className="text-sm font-bold">{selectedInterviewForDetails.round}</p>
                <div className="flex flex-wrap gap-4 text-text-secondary mt-1 font-medium text-[11px]">
                  <span>Date & Time: {selectedInterviewForDetails.dateTime}</span>
                  <span>Mode: {selectedInterviewForDetails.mode}</span>
                  {selectedInterviewForDetails.link && (
                    <span>Link: <a href={selectedInterviewForDetails.link} target="_blank" rel="noreferrer" className="text-brand-gold hover:underline">{selectedInterviewForDetails.link}</a></span>
                  )}
                </div>
              </div>

              {/* Student info box */}
              {(() => {
                const s = students.find(stud => stud.email.toLowerCase() === selectedInterviewForDetails.studentEmail.toLowerCase());
                return (
                  <div className="bg-white border border-[#022c22]/5 p-4 rounded-xl space-y-2.5">
                    <span className="text-[9px] text-brand-gold uppercase tracking-wider font-extrabold block">Candidate Details</span>
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <p className="text-sm font-bold">{selectedInterviewForDetails.studentName}</p>
                        <p className="text-[11px] text-text-secondary font-medium mt-0.5">{selectedInterviewForDetails.studentEmail}</p>
                        <p className="text-[11px] text-text-secondary font-semibold mt-1">
                          {s?.studentDetails?.department || 'B.Tech CSE'} · CGPA {s?.studentDetails?.cgpa || 'N/A'}
                        </p>
                      </div>
                      {s?.studentDetails?.skills && (
                        <div className="flex flex-wrap gap-1 max-w-[200px] justify-end">
                          {s.studentDetails.skills.slice(0, 4).map(skill => (
                            <span key={skill} className="bg-[#FAF7EE] border border-[#022c22]/5 text-brand-green font-bold text-[9px] px-2 py-0.5 rounded-full">{skill}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Recruiter info box */}
              {(() => {
                const r = recruiters.find(rec => (rec.recruiterDetails?.company || rec.name).toLowerCase() === selectedInterviewForDetails.company.toLowerCase());
                return (
                  <div className="bg-white border border-[#022c22]/5 p-4 rounded-xl space-y-2.5">
                    <span className="text-[9px] text-brand-gold uppercase tracking-wider font-extrabold block">Company Details</span>
                    <div>
                      <p className="text-sm font-bold">{selectedInterviewForDetails.company}</p>
                      <p className="text-[11px] text-text-secondary font-medium mt-0.5">{r?.email || 'careers@company.com'}</p>
                      <p className="text-[11px] text-text-secondary font-semibold mt-1">
                        Industry: {r?.recruiterDetails?.industry || 'Technology'} · Location: {r?.recruiterDetails?.location || 'Bengaluru'}
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="flex justify-end pt-4 border-t border-[#022c22]/5">
              <button
                type="button"
                onClick={() => { setShowInterviewDetailsModal(false); setSelectedInterviewForDetails(null); }}
                className="bg-[#022c22] hover:bg-[#124237] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- SCHEDULE CAMPUS DRIVE MODAL --- */}
      {showScheduleDriveModal && (
        <div className="fixed inset-0 bg-[#022c22]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-brand-cream border border-[#f2efdf] max-w-2xl w-full rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl animate-fade-in-up max-h-[90vh] overflow-y-auto scrollbar-hide">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-[#022c22]/10 pb-4">
              <div>
                <h3 className="editorial-heading font-serif text-2xl font-bold text-[#022c22]">Schedule Campus Placement Drive</h3>
                <p className="text-[10px] text-brand-gold uppercase tracking-wider font-extrabold mt-1">Configure drive, capacities, dates and target eligibility packs</p>
              </div>
              <button 
                onClick={() => setShowScheduleDriveModal(false)}
                className="text-[#022c22]/40 hover:text-[#022c22] p-1.5 hover:bg-[#022c22]/5 rounded-full transition-colors cursor-pointer"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!driveForm.companyName || !driveForm.roleTitle || !driveForm.driveDate) {
                alert('Please fill out all mandatory fields.');
                return;
              }

              try {
                // Call addJob context action. Starts as Pending recruiter acceptance.
                const newJob = {
                  company: driveForm.companyName,
                  title: driveForm.roleTitle,
                  location: 'On-Campus',
                  salary: driveForm.salaryPackage,
                  type: driveForm.roleType,
                  duration: 'Full-time',
                  eligibility: driveForm.eligibility,
                  description: `${driveForm.description} [Target intake: ${driveForm.capacity} candidates | Drive Schedule: ${driveForm.driveDate}]`,
                  skills: driveForm.skills.split(',').map(s => s.trim()).filter(Boolean),
                  deadline: driveForm.driveDate,
                  status: 'Pending',
                  driveStatus: 'Pending'
                };

                const res = await addJob(newJob);
                if (!res || !res.success) {
                  throw new Error(res?.error || 'Server validation or posting error');
                }
                
                // Resolve recruiter email dynamically by company name
                const recruiter = recruiters.find(r => r.recruiterDetails?.company?.toLowerCase() === driveForm.companyName.toLowerCase());
                const recruiterEmail = recruiter ? recruiter.email : 'talent@helixanalytics.com';

                // Add notifications for recruiter and students
                await addNotification(
                  recruiterEmail, 
                  'Campus Drive Scheduled 📅', 
                  `Admin has scheduled a campus drive for your company on ${driveForm.driveDate} for "${driveForm.roleTitle}". Intake capacity: ${driveForm.capacity} students.`, 
                  'success'
                );

                // Notify all registered students
                if (students && students.length > 0) {
                  await Promise.all(students.map(s => 
                    addNotification(
                      s.email,
                      'New Campus Drive Scheduled 📅',
                      `${driveForm.companyName} has scheduled a campus placement drive for "${driveForm.roleTitle}" on ${driveForm.driveDate}.`,
                      'info'
                    )
                  ));
                }

                setShowScheduleDriveModal(false);
                triggerToast(`Successfully scheduled campus drive for ${driveForm.companyName}!`);
              } catch (err) {
                console.error('Error scheduling drive:', err);
                alert(`Failed to schedule drive. Network or server error: ${err.message}`);
              }
            }} className="space-y-4 text-xs text-[#022c22] font-semibold">
              
              <div className="grid grid-cols-2 gap-4">
                {/* Hiring Partner */}
                <div className="space-y-1">
                  <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-bold">Hiring Partner (Company)</label>
                  <select
                    value={driveForm.companyName}
                    onChange={(e) => setDriveForm({ ...driveForm, companyName: e.target.value })}
                    className="w-full p-2.5 bg-white border border-[#022c22]/10 rounded-xl text-[#022c22] focus:outline-none"
                  >
                    {recruitersList.length > 0 ? (
                      recruitersList.map(r => (
                        <option key={r.id} value={r.company}>{r.company}</option>
                      ))
                    ) : (
                      <>
                        <option value="Helix Analytics">Helix Analytics</option>
                        <option value="Zephyr Tech">Zephyr Tech</option>
                        <option value="Nexa Finance">Nexa Finance</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Role Title */}
                <div className="space-y-1">
                  <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-bold">Role Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Software Engineer, Product Manager"
                    value={driveForm.roleTitle}
                    onChange={(e) => setDriveForm({ ...driveForm, roleTitle: e.target.value })}
                    className="w-full p-2.5 bg-white border border-[#022c22]/10 rounded-xl focus:outline-none focus:border-[#022c22] text-[#022c22]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {/* Drive Date (Invite on diff days) */}
                <div className="space-y-1">
                  <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-bold">Drive Day/Date</label>
                  <input
                    type="date"
                    required
                    value={driveForm.driveDate}
                    onChange={(e) => setDriveForm({ ...driveForm, driveDate: e.target.value })}
                    className="w-full p-2.5 bg-white border border-[#022c22]/10 rounded-xl focus:outline-none text-[#022c22]"
                  />
                </div>

                {/* Intake Capacity */}
                <div className="space-y-1">
                  <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-bold">Intake Capacity (Students)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={driveForm.capacity}
                    onChange={(e) => setDriveForm({ ...driveForm, capacity: parseInt(e.target.value) })}
                    className="w-full p-2.5 bg-white border border-[#022c22]/10 rounded-xl focus:outline-none text-[#022c22]"
                  />
                </div>

                {/* Job Type */}
                <div className="space-y-1">
                  <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-bold">Role Type</label>
                  <select
                    value={driveForm.roleType}
                    onChange={(e) => setDriveForm({ ...driveForm, roleType: e.target.value })}
                    className="w-full p-2.5 bg-white border border-[#022c22]/10 rounded-xl focus:outline-none text-[#022c22]"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Salary Package */}
                <div className="space-y-1">
                  <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-bold">Salary / Stipend Package</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 12 LPA, 50k/mo"
                    value={driveForm.salaryPackage}
                    onChange={(e) => setDriveForm({ ...driveForm, salaryPackage: e.target.value })}
                    className="w-full p-2.5 bg-white border border-[#022c22]/10 rounded-xl focus:outline-none text-[#022c22]"
                  />
                </div>

                {/* Eligibility Rule Packs */}
                <div className="space-y-1">
                  <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-bold">Eligibility Rule Pack</label>
                  <select
                    value={driveForm.eligibility}
                    onChange={(e) => setDriveForm({ ...driveForm, eligibility: e.target.value })}
                    className="w-full p-2.5 bg-white border border-[#022c22]/10 rounded-xl focus:outline-none text-[#022c22]"
                  >
                    {eligibilityList && eligibilityList.length > 0 ? (
                      eligibilityList.map(pack => (
                        <option key={pack._id} value={pack.detail}>{pack.title} ({pack.detail})</option>
                      ))
                    ) : (
                      <>
                        <option value="CGPA >= 8.0, no active backlogs">Standard Tech (CGPA &gt;= 8.0)</option>
                        <option value="CGPA >= 8.5, top quartile">Premium Tech (CGPA &gt;= 8.5)</option>
                        <option value="Portfolio required">Design (Portfolio required)</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-1">
                <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-bold">Required Skills (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. React, Node.js, Python"
                  value={driveForm.skills}
                  onChange={(e) => setDriveForm({ ...driveForm, skills: e.target.value })}
                  className="w-full p-2.5 bg-white border border-[#022c22]/10 rounded-xl focus:outline-none text-[#022c22]"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-bold">Drive Mapped Description & Rules</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Provide parameters, selection rounds structure, work locations or target profiles..."
                  value={driveForm.description}
                  onChange={(e) => setDriveForm({ ...driveForm, description: e.target.value })}
                  className="w-full p-2.5 bg-white border border-[#022c22]/10 rounded-xl focus:outline-none text-[#022c22]"
                ></textarea>
              </div>

              {/* Footer Actions */}
              <div className="flex gap-3 pt-4 border-t border-[#022c22]/5 justify-end">
                <button
                  type="button"
                  onClick={() => setShowScheduleDriveModal(false)}
                  className="border border-[#022c22]/10 px-6 py-2.5 rounded-xl font-bold uppercase tracking-wider transition-colors cursor-pointer text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#022c22] hover:bg-[#124237] text-white px-7 py-2.5 rounded-xl font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-sm text-xs"
                >
                  Schedule Drive Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Eligibility Modal */}
      {showEligibilityModal && (
        <div className="fixed inset-0 bg-[#022c22]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white border border-[#022c22]/10 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-6 animate-fade-in-up max-h-[90vh] overflow-y-auto scrollbar-hide">
            <div className="flex justify-between items-center border-b border-[#022c22]/5 pb-3">
              <h3 className="editorial-heading font-serif text-xl font-bold text-[#022c22]">
                {eligibilityForm.id ? 'Edit Eligibility Criteria' : 'New Eligibility Criteria'}
              </h3>
              <button 
                onClick={() => setShowEligibilityModal(false)}
                className="text-text-secondary hover:text-[#022c22] font-semibold text-lg text-brand-green"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleEligibilitySubmit} className="space-y-4 text-xs text-brand-green font-semibold">
              <div className="space-y-1">
                <label className="font-bold text-[#022c22] block uppercase tracking-wider mb-1">Criteria Title *</label>
                <input 
                  type="text" 
                  required
                  value={eligibilityForm.title}
                  onChange={(e) => setEligibilityForm({...eligibilityForm, title: e.target.value})}
                  placeholder="e.g. Premium Tech"
                  className="w-full bg-[#f4f3ea]/40 border border-[#022c22]/10 rounded-xl p-3 focus:outline-none focus:border-[#022c22] text-sm text-[#022c22]"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-[#022c22] block uppercase tracking-wider mb-1">Criteria Detail / Description *</label>
                <textarea 
                  rows="3"
                  required
                  value={eligibilityForm.detail}
                  onChange={(e) => setEligibilityForm({...eligibilityForm, detail: e.target.value})}
                  placeholder="e.g. CGPA ≥ 8.5, no active backlogs, top quartile"
                  className="w-full bg-[#f4f3ea]/40 border border-[#022c22]/10 rounded-xl p-3 focus:outline-none focus:border-[#022c22] text-sm text-[#022c22]"
                ></textarea>
              </div>
              <div className="flex gap-3 justify-between pt-4 border-t border-[#022c22]/5">
                {eligibilityForm.id ? (
                  <button 
                    type="button"
                    onClick={() => handleDeleteEligibility(eligibilityForm.id)}
                    className="border border-red-200 hover:bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold cursor-pointer"
                  >
                    Delete Pack
                  </button>
                ) : (
                  <div></div>
                )}
                <div className="flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setShowEligibilityModal(false)}
                    className="border border-[#022c22]/10 px-4 py-2 rounded-xl font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="bg-[#022c22] hover:bg-[#124237] text-white px-5 py-2.5 rounded-xl font-bold cursor-pointer"
                  >
                    Save Criteria
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- APPROVE JOB & ASSIGN TIER MODAL --- */}
      {showTierModal && pendingJobToApprove && (
        <div className="fixed inset-0 bg-[#022c22]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-brand-cream border border-[#f2efdf] max-w-md w-full rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl animate-fade-in-up">
            <div className="flex justify-between items-start border-b border-[#022c22]/10 pb-4">
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#022c22]">Approve & Assign Tier</h3>
                <p className="text-xs text-[#022c22]/70 font-semibold mt-1">
                  Assign a classification tier to authorize the job posting on the student portal.
                </p>
              </div>
              <button 
                onClick={() => { setShowTierModal(false); setPendingJobToApprove(null); }} 
                className="text-[#022c22]/40 hover:text-[#022c22] p-1.5 hover:bg-[#022c22]/5 rounded-full transition-colors cursor-pointer"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="bg-white border border-[#022c22]/5 p-4.5 rounded-2xl shadow-2xs space-y-2">
              <span className="text-[9px] text-brand-gold uppercase tracking-wider font-extrabold block">Job Details</span>
              <h4 className="font-serif text-md font-bold text-[#022c22]">{pendingJobToApprove.entityName}</h4>
              <p className="text-xs text-text-secondary font-medium">{pendingJobToApprove.details}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={async () => {
                  const job = pendingJobToApprove;
                  setShowTierModal(false);
                  setPendingJobToApprove(null);
                  await handleProcessApproval(job.id, job.entityName, 'Approved', 'Tier 1');
                }}
                className="bg-white hover:bg-brand-cream border-2 border-brand-gold text-[#022c22] p-5 rounded-2xl shadow-xs hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center gap-2 cursor-pointer group"
              >
                <span className="font-serif text-lg font-bold text-brand-gold group-hover:scale-105 transition-transform">Tier 1</span>
                <span className="text-[10px] text-text-secondary text-center leading-normal">Premium high-package roles (typically &ge; 10 LPA)</span>
              </button>

              <button
                onClick={async () => {
                  const job = pendingJobToApprove;
                  setShowTierModal(false);
                  setPendingJobToApprove(null);
                  await handleProcessApproval(job.id, job.entityName, 'Approved', 'Tier 2');
                }}
                className="bg-white hover:bg-brand-cream border border-[#022c22]/15 text-[#022c22] p-5 rounded-2xl shadow-xs hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center gap-2 cursor-pointer group"
              >
                <span className="font-serif text-lg font-bold text-[#022c22] group-hover:scale-105 transition-transform">Tier 2</span>
                <span className="text-[10px] text-text-secondary text-center leading-normal">Standard professional roles (typically &lt; 10 LPA)</span>
              </button>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#022c22]/5">
              <button 
                onClick={() => { setShowTierModal(false); setPendingJobToApprove(null); }}
                className="border border-[#022c22]/10 px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-white text-[#022c22] cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
