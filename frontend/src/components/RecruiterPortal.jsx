import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePortalState } from '../context/PortalStateContext';
import { 
  Briefcase, Users, Calendar, Clock, Plus, CheckCircle2, FileText, 
  ChevronRight, X, AlertCircle, Eye, Copy, Pencil, Mail, Search, 
  ChevronDown, Download, Star, ExternalLink, TrendingUp, Info, Building, Bell,
  MapPin, Globe, Bookmark, MessageSquare, Phone, Trash2
} from 'lucide-react';

const LinkedinIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export const RecruiterPortal = ({ activeSubTab, onTabChange }) => {
  const { user, updateUserProfile, deleteUserAccount } = useAuth();
  const { jobs, applications, interviews, addJob, updateApplicationStatus, updateApplicationCtc, scheduleInterview, notifications, markNotificationAsRead, eligibilityList, students, updateInterviewStatus, addNotification, deleteJob, takeDownJob, updateJob, recruiters } = usePortalState();

  // Dialog & scheduler states
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  // Custom modal states for details and evaluations
  const [showStudentProfileModal, setShowStudentProfileModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [showInterviewActionModal, setShowInterviewActionModal] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [nextStageRound, setNextStageRound] = useState('Technical Interview 2');
  const [nextStageDateTime, setNextStageDateTime] = useState('');
  const [nextStageMode, setNextStageMode] = useState('Online');
  const [nextStageLink, setNextStageLink] = useState('https://meet.google.com/abc-defg-hij');
  const [isLastStage, setIsLastStage] = useState(false);

  // CTC confirmation modal states
  const [showCtcModal, setShowCtcModal] = useState(false);
  const [ctcValue, setCtcValue] = useState('');
  const [ctcType, setCtcType] = useState('LPA'); // 'LPA' or 'Monthly'
  const [ctcPendingInterview, setCtcPendingInterview] = useState(null);
  const [ctcSubmitting, setCtcSubmitting] = useState(false);
  const [isInternational, setIsInternational] = useState(false);
  const [isPpo, setIsPpo] = useState(false);
  const [hasMultipleOffers, setHasMultipleOffers] = useState(false);

  // Job edit and details modal states
  const [showEditJobModal, setShowEditJobModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [showJobDetailsModal, setShowJobDetailsModal] = useState(false);
  const [selectedJobForDetails, setSelectedJobForDetails] = useState(null);
  const [showApplicationDetailsModal, setShowApplicationDetailsModal] = useState(false);
  const [selectedApplicationDetails, setSelectedApplicationDetails] = useState(null);
  const [jobType, setJobType] = useState('Internship');
  const [jobDeadline, setJobDeadline] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Filters and searches
  const [jobsFilter, setJobsFilter] = useState('All');
  const [applicantsSearch, setApplicantsSearch] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('All roles');
  const [selectedStageFilter, setSelectedStageFilter] = useState('All stages');
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [minCgpaFilter, setMinCgpaFilter] = useState('');
  const [skillsFilter, setSkillsFilter] = useState('');
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deletingProgress, setDeletingProgress] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // New job form state
  const [jobTitle, setJobTitle] = useState('');
  const [jobLocation, setJobLocation] = useState('Bengaluru · Hybrid');
  const [jobSalary, setJobSalary] = useState('₹75,000 / month');
  const [jobDuration, setJobDuration] = useState('6 Months');
  const [jobEligibility, setJobEligibility] = useState('CGPA > 8.0, CSE/ECE/EEE');
  const [jobDescription, setJobDescription] = useState('');
  const [jobSkills, setJobSkills] = useState('');

  // Scheduler form state
  const [intRound, setIntRound] = useState('Technical Interview 1');
  const [intDateTime, setIntDateTime] = useState('');
  const [intMode, setIntMode] = useState('Online');
  const [intLink, setIntLink] = useState('https://meet.google.com/abc-defg-hij');

  // Notifications states & dynamic notifications list state
  const [notifFilter, setNotifFilter] = useState('All');
  const [newApplicantsToggle, setNewApplicantsToggle] = useState(true);
  const [interviewRemindersToggle, setInterviewRemindersToggle] = useState(true);
  const [dailyDigestToggle, setDailyDigestToggle] = useState(false);

  const [notifList, setNotifList] = useState([]);

  // Panel availability states
  const [panels, setPanels] = useState(() => {
    const saved = localStorage.getItem('placera_panels');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing panels from localStorage:', e);
      }
    }
    return [
      { name: 'S. Bose', slots: ['Monday-1', 'Monday-2', 'Tuesday-1', 'Tuesday-3', 'Wednesday-2', 'Thursday-1', 'Friday-2', 'Friday-3'] },
      { name: 'A. Mehta', slots: ['Monday-1', 'Monday-2', 'Monday-3', 'Tuesday-1', 'Tuesday-2', 'Wednesday-1', 'Wednesday-3', 'Thursday-2', 'Thursday-3', 'Friday-1', 'Friday-2', 'Friday-3'] },
      { name: 'R. Khan', slots: ['Tuesday-1', 'Tuesday-2', 'Wednesday-2', 'Wednesday-3', 'Thursday-1', 'Friday-1'] }
    ];
  });

  React.useEffect(() => {
    localStorage.setItem('placera_panels', JSON.stringify(panels));
  }, [panels]);

  const [showAddPanelModal, setShowAddPanelModal] = useState(false);
  const [newPanelName, setNewPanelName] = useState('');
  const [newPanelSlots, setNewPanelSlots] = useState([]);
  const [panelError, setPanelError] = useState('');

  // Scheduler slot states
  const [intDate, setIntDate] = useState('');
  const [intSlot, setIntSlot] = useState('1'); // '1' = Morning, '2' = Afternoon, '3' = Evening

  // Action / next stage slot states
  const [nextStageDate, setNextStageDate] = useState('');
  const [nextStageSlot, setNextStageSlot] = useState('1');

  // Helper: calculate day of the week from date YYYY-MM-DD
  const getDayOfWeek = (dateStr) => {
    if (!dateStr) return '';
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const d = new Date(dateStr);
    return days[d.getDay()];
  };

  // Helper: get slot label from slot index string
  const getSlotLabel = (slotIdx) => {
    if (slotIdx === '1') return 'Morning (09:00 AM - 12:00 PM)';
    if (slotIdx === '2') return 'Afternoon (02:00 PM - 05:00 PM)';
    return 'Evening (06:00 PM - 09:00 PM)';
  };

  // Helper: get available panels for a given date and slot
  const getAvailablePanels = (dateStr, slotIdx) => {
    const day = getDayOfWeek(dateStr);
    if (!day || day === 'Saturday' || day === 'Sunday') return [];
    const querySlot = `${day}-${slotIdx}`;
    return panels.filter(p => p.slots.includes(querySlot));
  };

  // Company Profile states
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({
    company: '',
    tagline: '',
    about: '',
    location: '',
    website: '',
    linkedin: '',
    techStack: '',
    contactEmail: '',
    industry: '',
    companySize: '',
    contactPhone: '',
    contactAddress: ''
  });

  const [showEditHiringModal, setShowEditHiringModal] = useState(false);
  const [hiringFormList, setHiringFormList] = useState([]);

  const hiringRolesList = user?.recruiterDetails?.whatWeHireFor || [
    { title: 'Data Science', desc: 'Applied ML, forecasting, experimentation' },
    { title: 'Software Engineering', desc: 'Backend, infra, data platform' },
    { title: 'Research', desc: 'NLP, causal inference, RL' },
    { title: 'Design & Product', desc: 'UX research, product analytics' },
  ];

  // Sync profile edits with database values
  React.useEffect(() => {
    if (user) {
      setProfileForm({
        company: user.recruiterDetails?.company || user.name || 'Helix Analytics',
        tagline: user.recruiterDetails?.tagline || 'Applied AI for global enterprise analytics · 450+ employees',
        about: user.recruiterDetails?.about || 'Helix Analytics builds enterprise-grade ML platforms for finance, healthcare and retail. Founded in 2017, we power decisioning systems at 40+ Fortune 500 firms.',
        location: user.recruiterDetails?.location || 'Bengaluru · Singapore · NYC',
        website: user.recruiterDetails?.website || 'helix-analytics.com',
        linkedin: user.recruiterDetails?.linkedin || '/helix-analytics',
        techStack: user.recruiterDetails?.techStack?.join(', ') || 'Python, PyTorch, Go, TypeScript, AWS, Kubernetes, Airflow, Snowflake, dbt',
        contactEmail: user.recruiterDetails?.contactEmail || 'careers@helix-analytics.com',
        industry: user.recruiterDetails?.industry || 'Technology',
        companySize: user.recruiterDetails?.companySize || '450+ employees',
        contactPhone: user.recruiterDetails?.contactPhone || '',
        contactAddress: user.recruiterDetails?.contactAddress || ''
      });
      setHiringFormList(user.recruiterDetails?.whatWeHireFor || [
        { title: 'Data Science', desc: 'Applied ML, forecasting, experimentation' },
        { title: 'Software Engineering', desc: 'Backend, infra, data platform' },
        { title: 'Research', desc: 'NLP, causal inference, RL' },
        { title: 'Design & Product', desc: 'UX research, product analytics' },
      ]);
    }
  }, [user]);

  // Set the default job title and eligibility criteria when the modal opens
  React.useEffect(() => {
    if (showAddJobModal) {
      if (hiringRolesList.length > 0) {
        setJobTitle(hiringRolesList[0].title);
      }
      const availableEl = eligibilityList && eligibilityList.length > 0 ? eligibilityList : [
        { title: 'Standard Tech', detail: 'CGPA > 8.0, CSE/ECE/EEE' },
        { title: 'Premium Tech', detail: 'CGPA > 8.5, top quartile' },
        { title: 'Research', detail: 'CGPA > 9.0, 1 publication' },
        { title: 'Design', detail: 'Portfolio required' },
        { title: 'MBA', detail: 'CGPA > 7.5, 1 internship' }
      ];
      setJobEligibility(availableEl[0].detail);
    }
  }, [showAddJobModal, eligibilityList]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      const techStackArray = profileForm.techStack
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const res = await updateUserProfile({
        recruiterDetails: {
          tagline: profileForm.tagline,
          about: profileForm.about,
          location: profileForm.location,
          website: profileForm.website,
          linkedin: profileForm.linkedin,
          techStack: techStackArray,
          contactEmail: profileForm.contactEmail,
          companySize: profileForm.companySize,
          industry: profileForm.industry,
          company: profileForm.company,
          contactPhone: profileForm.contactPhone,
          contactAddress: profileForm.contactAddress
        }
      });
      if (res.success) {
        setShowEditProfileModal(false);
      } else {
        alert(res.error || 'Failed to save changes.');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating company profile.');
    }
  };

  const companyConfirmationTarget = user?.recruiterDetails?.company || 'DELETE';

  const handleDeleteAccountConfirm = async () => {
    if (deleteConfirmText !== companyConfirmationTarget) {
      setDeleteError('Company name does not match.');
      return;
    }
    setDeletingProgress(true);
    setDeleteError('');
    try {
      const res = await deleteUserAccount();
      if (res.success) {
        setShowDeleteConfirmModal(false);
      } else {
        setDeleteError(res.error || 'Failed to delete account.');
        setDeletingProgress(false);
      }
    } catch (err) {
      setDeleteError('An unexpected error occurred.');
      setDeletingProgress(false);
    }
  };

  const handleHiringSave = async (e) => {
    e.preventDefault();
    try {
      const cleaned = hiringFormList.filter(item => item.title.trim());
      const res = await updateUserProfile({
        recruiterDetails: {
          whatWeHireFor: cleaned
        }
      });
      if (res.success) {
        setShowEditHiringModal(false);
      } else {
        alert(res.error || 'Failed to save roles.');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating roles.');
    }
  };

  const companyName = user?.recruiterDetails?.company || 'Helix Analytics';
  const todayStr = new Date().toISOString().split('T')[0];
  const myRecruiter = user?.email && recruiters ? recruiters.find(r => r.email.toLowerCase() === user.email.toLowerCase()) : null;
  const companyViewsVal = myRecruiter?.recruiterDetails?.companyViews || 0;

  // Dynamic jobs belonging to this company from MongoDB
  const allJobs = jobs
    .filter(job => job.company.toLowerCase() === companyName.toLowerCase())
    .map(job => {
      const apps = applications.filter(app => app.jobId === job.id);
      const shortlistedApps = apps.filter(a => ['Shortlisted', 'Interview', 'Offer', 'Selected'].includes(a.status));
      const isClosed = job.deadline && job.deadline < todayStr;
      return {
        id: job.id,
        title: job.title,
        type: job.type || 'Internship',
        company: job.company,
        location: job.location,
        salary: job.salary,
        duration: job.duration,
        eligibility: job.eligibility,
        description: job.description,
        skills: job.skills,
        applicants: apps.length,
        shortlisted: shortlistedApps.length,
        views: job.views || 0,
        deadline: job.deadline || '2026-06-30',
        status: isClosed ? 'Closed' : (job.status === 'Approved' ? 'Open' : 'Draft'),
      };
    });

  // Dynamic applicants for this company's jobs from MongoDB
  const allApplicants = applications
    .filter(app => {
      const job = jobs.find(j => j.id === app.jobId);
      return job && job.company.toLowerCase() === companyName.toLowerCase();
    })
    .map(app => {
      const job = jobs.find(j => j.id === app.jobId);
      return {
        ...app,
        id: app.id,
        studentName: app.studentName,
        studentEmail: app.studentEmail,
        cgpa: app.cgpa || '9.0',
        institute: 'University',
        jobTitle: job ? job.title : 'Role',
        skills: app.skills || ['React', 'Node.js'],
        matchScore: '90%',
        status: app.status,
        avatarBg: 'bg-teal-50 border border-teal-100 text-teal-800',
        initials: app.studentName.split(' ').map(n => n[0]).join(''),
      };
    });

  const allInterviews = interviews
    .filter(int => int.company && companyName && int.company.toLowerCase() === companyName.toLowerCase() && int.status !== 'Completed' && int.status !== 'Cancelled')
    .map(int => {
      const dateTimeStr = int.dateTime || 'Jun 15 at 10:00 AM';
      let displayDateTime = 'Jun 15';
      let displayTimeStr = '10:00 AM';
      let derivedPanel = 'Placement Cell';

      if (dateTimeStr.includes(' · ')) {
        const slotParts = dateTimeStr.split(' · ');
        const dateRaw = slotParts[0];
        displayTimeStr = slotParts[1];
        
        if (dateRaw && dateRaw.includes('-')) {
          const dateObj = new Date(dateRaw);
          const dayNum = dateObj.getDate();
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const monthName = months[dateObj.getMonth()];
          displayDateTime = `${dayNum} ${monthName}`;
        } else {
          displayDateTime = dateRaw;
        }

        let slotIdx = '1';
        if (slotParts[1].includes('Afternoon')) slotIdx = '2';
        else if (slotParts[1].includes('Evening')) slotIdx = '3';

        const matchingPanels = getAvailablePanels(dateRaw, slotIdx);
        if (matchingPanels.length > 0) {
          derivedPanel = matchingPanels.map(p => p.name).join(', ');
        }
      } else {
        const parts = dateTimeStr.split(' at ');
        displayDateTime = parts[0] || 'Jun 15';
        displayTimeStr = parts[1] || '10:00 AM';
      }

      return {
        id: int.id,
        studentName: int.studentName || 'Student',
        studentEmail: int.studentEmail,
        jobId: int.jobId,
        round: int.round || 'Technical Interview 1',
        jobTitle: int.round || 'Technical Interview',
        dateTime: displayDateTime.trim().toUpperCase(),
        timeStr: displayTimeStr,
        mode: int.mode ? (int.mode.includes('Online') ? 'Online' : 'Onsite') : 'Online',
        link: int.link || '',
        panel: derivedPanel,
      };
    });

  // Real-time metrics calculations
  const activeRolesCount = allJobs.filter(j => j.status === 'Open').length;
  const draftJobsCount = allJobs.filter(j => j.status === 'Draft').length;
  const totalApplicantsCount = allApplicants.length;
  const newApplicantsCount = allApplicants.filter(a => a.status === 'Applied').length;
  const totalInterviewsCount = allInterviews.length;
  const offersExtendedCount = allApplicants.filter(a => ['Offer', 'Selected'].includes(a.status)).length;
  const offersAcceptedCount = allApplicants.filter(a => a.status === 'Selected').length;
  const totalJobViews = allJobs.reduce((acc, curr) => acc + (curr.views || 0), 0);

  // Funnel calculations
  const funnelApplied = allApplicants.length;
  const funnelShortlisted = allApplicants.filter(a => ['Shortlisted', 'Interview', 'Offer', 'Selected'].includes(a.status)).length;
  const funnelInterview = allApplicants.filter(a => ['Interview', 'Offer', 'Selected'].includes(a.status)).length;
  const funnelOffer = allApplicants.filter(a => a.status === 'Selected').length;

  const pctApplied = students && students.length > 0 ? Math.min(100, Math.round((funnelApplied / students.length) * 100)) : 0;
  const pctShortlisted = funnelApplied > 0 ? Math.round((funnelShortlisted / funnelApplied) * 100) : 0;
  const pctInterview = funnelApplied > 0 ? Math.round((funnelInterview / funnelApplied) * 100) : 0;
  const pctOffer = funnelApplied > 0 ? Math.round((funnelOffer / funnelApplied) * 100) : 0;

  // Actions
  const handlePostJob = async (e) => {
    e.preventDefault();
    if (!jobTitle.trim() || !jobDescription.trim()) return;

    try {
      const res = await addJob({
        company: companyName,
        title: jobTitle,
        location: jobLocation,
        salary: jobSalary,
        type: jobType,
        duration: jobDuration,
        eligibility: jobEligibility,
        description: jobDescription,
        skills: jobSkills.split(',').map(s => s.trim()).filter(Boolean),
        deadline: jobDeadline
      });

      if (res && res.success) {
        setSuccessMsg('Job posting created successfully!');
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      console.error('Error posting job:', err);
    }

    // Reset form states
    setJobTitle('');
    setJobDescription('');
    setJobSkills('');
    setJobType('Internship');
    setJobDeadline('');
    setShowAddJobModal(false);
  };

  const handleOpenEditJob = (job) => {
    setEditingJob(job);
    setJobTitle(job.title);
    setJobLocation(job.location);
    setJobSalary(job.salary);
    setJobDuration(job.duration);
    setJobEligibility(job.eligibility);
    setJobDescription(job.description || '');
    setJobSkills(job.skills ? job.skills.join(', ') : '');
    setJobType(job.type || 'Internship');
    setJobDeadline(job.deadline || '');
    setShowEditJobModal(true);
  };

  const handleEditJobSubmit = async (e) => {
    e.preventDefault();
    if (!editingJob) return;

    const updatedFields = {
      title: jobTitle,
      location: jobLocation,
      salary: jobSalary,
      type: jobType,
      duration: jobDuration,
      eligibility: jobEligibility,
      description: jobDescription,
      skills: jobSkills.split(',').map(s => s.trim()).filter(Boolean),
      deadline: jobDeadline
    };

    try {
      const res = await updateJob(editingJob.id, updatedFields);
      if (res.success) {
        setSuccessMsg('Job posting updated successfully!');
        setTimeout(() => setSuccessMsg(''), 3000);
        setShowEditJobModal(false);
        setEditingJob(null);
      } else {
        alert(res.error || 'Failed to update job posting');
      }
    } catch (err) {
      console.error('Error updating job:', err);
      alert('An error occurred while updating the job.');
    }
  };

  const handleDeleteJob = async (jobId, jobTitle) => {
    if (window.confirm(`Are you sure you want to take down the job posting for "${jobTitle}"? The job will be removed from the student portal but application history will be preserved.`)) {
      try {
        const res = await takeDownJob(jobId);
        if (res.success) {
          setSuccessMsg('Job posting taken down successfully! Students can no longer apply.');
          setTimeout(() => setSuccessMsg(''), 3000);
        } else {
          alert(res.error || 'Failed to take down job posting');
        }
      } catch (err) {
        console.error('Error taking down job:', err);
        alert('An error occurred while taking down the job.');
      }
    }
  };

  const handleOpenJobDetails = (job) => {
    setSelectedJobForDetails(job);
    setShowJobDetailsModal(true);
  };

  const handleOpenScheduler = (app) => {
    setSelectedApp(app);
    setShowScheduleModal(true);
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedApp) {
      alert('Please select a valid candidate.');
      return;
    }
    if (!intDate) {
      alert('Please select a valid date.');
      return;
    }

    const day = getDayOfWeek(intDate);
    if (day === 'Saturday' || day === 'Sunday') {
      alert('Interviews can only be scheduled on weekdays (Monday to Friday) matching panel slot availabilities.');
      return;
    }

    const availablePanelsForSlot = getAvailablePanels(intDate, intSlot);
    if (availablePanelsForSlot.length < 2) {
      alert(`⚠️ Insufficient Panel Availability: Each interview requires at least 2 panel members available in the chosen slot. Currently available panel members in this slot: ${availablePanelsForSlot.length > 0 ? availablePanelsForSlot.map(p => p.name).join(', ') : 'None'}`);
      return;
    }

    const slotLabel = getSlotLabel(intSlot);
    const finalTimeStr = `${intDate} · ${slotLabel}`;
    const panelNames = availablePanelsForSlot.map(p => p.name).join(', ');

    await scheduleInterview(selectedApp.id, intRound, finalTimeStr, intMode, intLink);
    
    setSuccessMsg(`Successfully scheduled ${intRound} with panel members: ${panelNames}`);
    setTimeout(() => setSuccessMsg(''), 5000);
    
    setShowScheduleModal(false);
    setSelectedApp(null);
    setIntDate('');
    setIntSlot('1');
  };

  const handleViewStudentProfile = (studentEmail) => {
    const foundStudent = students.find(s => s.email.toLowerCase() === studentEmail.toLowerCase());
    if (foundStudent) {
      setSelectedStudent(foundStudent);
      setShowStudentProfileModal(true);
    } else {
      // Fallback in case student record is not loaded yet or fully mapped
      const app = applications.find(a => a.studentEmail.toLowerCase() === studentEmail.toLowerCase());
      if (app) {
        setSelectedStudent({
          name: app.studentName,
          email: app.studentEmail,
          studentDetails: {
            cgpa: app.cgpa || '9.0',
            department: app.department || 'Computer Science & Engineering',
            skills: app.skills || [],
            about: 'Student has not filled their extended bio yet.',
            education: [
              { school: 'IIT Delhi', degree: 'B.Tech, Computer Science & Engineering', duration: '2022 - 2026', grade: `CGPA ${app.cgpa || '9.0'}` }
            ],
            projects: [],
            certifications: []
          }
        });
        setShowStudentProfileModal(true);
      } else {
        alert('Could not find candidate profile.');
      }
    }
  };

  const handleOpenInterviewAction = (interviewItem) => {
    const app = applications.find(
      a => a.studentEmail.toLowerCase() === interviewItem.studentEmail.toLowerCase() &&
           a.jobId === interviewItem.jobId
    );
    if (!app) {
      alert('Could not find application associated with this interview.');
      return;
    }
    setSelectedInterview({ ...interviewItem, appId: app.id });
    setNextStageRound('Technical Interview 2');
    setNextStageDateTime('');
    setNextStageMode(interviewItem.mode || 'Online');
    setNextStageLink(interviewItem.link || 'https://meet.google.com/abc-defg-hij');
    setIsLastStage(false);
    setShowInterviewActionModal(true);
  };

  const handleAdvanceCandidate = async (e) => {
    if (e) e.preventDefault();
    if (!selectedInterview) return;

    try {
      if (isLastStage) {
        // Show CTC popup before finalizing placement
        setCtcPendingInterview(selectedInterview);
        setCtcValue('');
        setCtcType('LPA');
        setShowInterviewActionModal(false);
        setShowCtcModal(true);
        return;
      } else {
        if (!nextStageDate) {
          alert('Please select a valid date for the next interview round.');
          return;
        }

        const day = getDayOfWeek(nextStageDate);
        if (day === 'Saturday' || day === 'Sunday') {
          alert('Interviews can only be scheduled on weekdays (Monday to Friday) matching panel slot availabilities.');
          return;
        }

        const availablePanelsForSlot = getAvailablePanels(nextStageDate, nextStageSlot);
        if (availablePanelsForSlot.length < 2) {
          alert(`⚠️ Insufficient Panel Availability: Each interview requires at least 2 panel members available in the chosen slot. Currently available panel members in this slot: ${availablePanelsForSlot.length > 0 ? availablePanelsForSlot.map(p => p.name).join(', ') : 'None'}`);
          return;
        }

        const slotLabel = getSlotLabel(nextStageSlot);
        const finalTimeStr = `${nextStageDate} · ${slotLabel}`;
        const panelNames = availablePanelsForSlot.map(p => p.name).join(', ');

        await updateInterviewStatus(selectedInterview.id, 'Completed', 'Next Round');

        await scheduleInterview(
          selectedInterview.appId,
          nextStageRound,
          finalTimeStr,
          nextStageMode,
          nextStageLink
        );

        await updateApplicationStatus(selectedInterview.appId, 'Interview');

        setSuccessMsg(`Successfully advanced loop. Scheduled ${nextStageRound} with panels: ${panelNames}`);
        setTimeout(() => setSuccessMsg(''), 5000);
      }

      setShowInterviewActionModal(false);
      setSelectedInterview(null);
    } catch (err) {
      console.error('Error advancing candidate:', err);
    }
  };

  // Called after recruiter enters CTC and confirms placement
  const handleCtcConfirm = async (e) => {
    e.preventDefault();
    if (!ctcPendingInterview || !ctcValue.trim()) return;
    setCtcSubmitting(true);

    try {
      const formattedCtc = ctcType === 'LPA'
        ? `₹${ctcValue} LPA`
        : `₹${ctcValue}k/month`;

      // 1. Save CTC and dynamic parameters on application record
      await updateApplicationCtc(ctcPendingInterview.appId, formattedCtc, {
        isInternational,
        isPpo,
        hasMultipleOffers
      });

      // 2. Mark application as Selected (placed)
      await updateApplicationStatus(ctcPendingInterview.appId, 'Selected');

      // 3. Mark interview as Completed with result 'Placed'
      await updateInterviewStatus(ctcPendingInterview.id, 'Completed', 'Placed');

      // 4. Notify student
      await addNotification(
        ctcPendingInterview.studentEmail,
        'Offer Extended! 🌟',
        `Congratulations! You have been placed at ${companyName} with a CTC of ${formattedCtc}. Welcome to the team!`,
        'success'
      );

      setShowCtcModal(false);
      setCtcPendingInterview(null);
      setCtcValue('');
      setIsInternational(false);
      setIsPpo(false);
      setHasMultipleOffers(false);
    } catch (err) {
      console.error('Error confirming placement with CTC:', err);
    } finally {
      setCtcSubmitting(false);
    }
  };

  const handleEliminateCandidate = async () => {
    if (!selectedInterview) return;

    if (!window.confirm(`Are you sure you want to eliminate ${selectedInterview.studentName} from this placement drive?`)) {
      return;
    }

    try {
      // 1. Mark application as Rejected
      await updateApplicationStatus(selectedInterview.appId, 'Rejected');

      // 2. Mark active interview as Completed with result 'Eliminated'
      await updateInterviewStatus(selectedInterview.id, 'Completed', 'Eliminated');

      // 3. Send notification
      await addNotification(
        selectedInterview.studentEmail,
        'Interview Process Completed',
        `Thank you for your time. Your interview process for ${companyName} has been concluded.`,
        'error'
      );

      setShowInterviewActionModal(false);
      setSelectedInterview(null);
    } catch (err) {
      console.error('Error eliminating candidate:', err);
    }
  };

  // --- A. Redesign: Hiring Overview Screen ---
  const renderOverview = () => {
    const pendingDrives = jobs.filter(
      j => j.driveStatus === 'Pending' && j.company?.toLowerCase() === companyName?.toLowerCase()
    );

    return (
      <div className="space-y-8 animate-fade-in-up">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-brand-green/5 pb-6">
          <div>
            <h1 className="editorial-heading font-serif text-3xl font-bold text-brand-green">Hiring overview</h1>
            <p className="text-brand-green/60 text-xs mt-1">A live view of your open roles, pipelines and interviews.</p>
          </div>
          <button
            onClick={() => setShowAddJobModal(true)}
            className="mt-4 md:mt-0 bg-[#022c22] hover:bg-brand-gold text-brand-cream hover:text-[#022c22] font-semibold text-xs py-2.5 px-5 rounded-lg flex items-center gap-2 transition-all cursor-pointer shadow-sm uppercase tracking-wider"
          >
            <Plus className="w-4.5 h-4.5" /> Post a job
          </button>
        </div>

        {/* Campus Placement Drive Invites */}
        {pendingDrives.length > 0 && (
          <div className="bg-brand-cream border-2 border-brand-gold/30 rounded-3xl p-6 space-y-4 shadow-md animate-fade-in-up">
            <div className="flex items-center gap-2 border-b border-brand-gold/20 pb-3">
              <span className="text-xl">📅</span>
              <div>
                <h3 className="font-serif text-lg font-bold text-brand-green">Campus Placement Drive Invitations</h3>
                <p className="text-[10px] text-brand-gold uppercase tracking-wider font-extrabold">
                  Admin has scheduled a new campus placement drive for your company. Please accept or decline.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingDrives.map((drive) => (
                <div key={drive.id} className="bg-white border border-[#f2efdf] rounded-2xl p-5 flex flex-col justify-between gap-4 shadow-sm hover:border-brand-gold/35 transition-all">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-serif text-base font-bold text-brand-green">{drive.title}</h4>
                      <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#b38b3f] bg-brand-gold/10 px-2 py-0.5 rounded-full border border-brand-gold/20">
                        Pending Acceptance
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed font-medium">
                      {drive.description}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-[10px] text-brand-green/80 pt-1 font-bold">
                      <div className="bg-[#f4f3ea]/50 p-2 rounded-lg">
                        <span className="text-text-secondary/60 uppercase tracking-wider block text-[8px]">Offered Salary</span>
                        {drive.salary || 'Competitive'}
                      </div>
                      <div className="bg-[#f4f3ea]/50 p-2 rounded-lg">
                        <span className="text-text-secondary/60 uppercase tracking-wider block text-[8px]">Scheduled Date</span>
                        {drive.deadline}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={async () => {
                        if (window.confirm(`Are you sure you want to decline the invitation for "${drive.title}"?`)) {
                          const res = await updateJob(drive.id, { driveStatus: 'Rejected', status: 'Rejected' });
                          if (res.success) {
                            alert('Invitation declined successfully.');
                          } else {
                            alert(`Error declining: ${res.error}`);
                          }
                        }
                      }}
                      className="flex-1 py-2 rounded-xl text-[10px] font-extrabold uppercase tracking-wider text-red-700 border border-red-200 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      Decline Invite
                    </button>
                    <button
                      onClick={async () => {
                        const res = await updateJob(drive.id, { driveStatus: 'Accepted', status: 'Approved' });
                        if (res.success) {
                          alert(`Success! Campus drive for "${drive.title}" is now Live.`);
                        } else {
                          alert(`Error accepting: ${res.error}`);
                        }
                      }}
                      className="flex-1 bg-brand-green hover:bg-brand-gold hover:text-brand-green text-white py-2 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
                    >
                      Accept & Go Live
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4 Stat Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Active Roles */}
          <div className="bg-white border border-[#f2efdf] p-6 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-sm transition-all">
            <div>
              <span className="text-[10px] text-brand-gold uppercase tracking-wider font-extrabold block">Active Roles</span>
              <span className="text-4xl font-serif font-bold text-brand-green mt-2 block leading-none">{activeRolesCount}</span>
              <span className="text-[11px] text-emerald-700 font-semibold mt-1.5 block">{allJobs.length} total roles</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-100 flex items-center justify-center shadow-inner">
              <Briefcase className="w-5.5 h-5.5" />
            </div>
          </div>

          {/* New Applicants */}
          <div className="bg-white border border-[#f2efdf] p-6 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-sm transition-all">
            <div>
              <span className="text-[10px] text-brand-gold uppercase tracking-wider font-extrabold block">New Applicants</span>
              <span className="text-4xl font-serif font-bold text-brand-green mt-2 block leading-none">{newApplicantsCount}</span>
              <span className="text-[11px] text-amber-700 font-semibold mt-1.5 block">{totalApplicantsCount} total candidates</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 border border-amber-100 flex items-center justify-center shadow-inner">
              <Users className="w-5.5 h-5.5" />
            </div>
          </div>

          {/* Interviews */}
          <div className="bg-white border border-[#f2efdf] p-6 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-sm transition-all">
            <div>
              <span className="text-[10px] text-brand-gold uppercase tracking-wider font-extrabold block">Interviews</span>
              <span className="text-4xl font-serif font-bold text-brand-green mt-2 block leading-none">{totalInterviewsCount}</span>
              <span className="text-[11px] text-brand-green/60 font-semibold mt-1.5 block">Scheduled rounds</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-yellow-50/70 text-yellow-800 border border-yellow-100 flex items-center justify-center shadow-inner">
              <Calendar className="w-5.5 h-5.5" />
            </div>
          </div>

          {/* Offers Extended */}
          <div className="bg-white border border-[#f2efdf] p-6 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-sm transition-all">
            <div>
              <span className="text-[10px] text-brand-gold uppercase tracking-wider font-extrabold block">Offers Extended</span>
              <span className="text-4xl font-serif font-bold text-brand-green mt-2 block leading-none">{offersExtendedCount}</span>
              <span className="text-[11px] text-teal-700 font-semibold mt-1.5 block">{offersAcceptedCount} accepted</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-800 border border-teal-100 flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-5.5 h-5.5" />
            </div>
          </div>
        </div>

        {/* Columns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Area (w-8/12 / col-span-2) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Active Job Postings */}
            <div className="bg-white border border-[#f2efdf] rounded-2xl p-6 shadow-xs hover:shadow-sm transition-all">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-serif text-brand-green font-bold">Active job postings</h2>
                <button
                  onClick={() => onTabChange('jobs')}
                  className="text-xs text-brand-gold font-bold tracking-wider hover:underline flex items-center gap-1 cursor-pointer transition-colors"
                >
                  Manage <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-brand-green/5 text-[10px] uppercase text-brand-gold font-extrabold tracking-wider">
                      <th className="pb-3 text-left">Role</th>
                      <th className="pb-3 text-center">Applicants</th>
                      <th className="pb-3 text-center">Shortlisted</th>
                      <th className="pb-3 text-left">Deadline</th>
                      <th className="pb-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-green/5 text-brand-green font-medium">
                    {allJobs.slice(0, 4).map((job) => (
                      <tr key={job.id} className="hover:bg-brand-cream/10 transition-all group">
                        <td className="py-4 font-bold text-brand-green text-sm group-hover:text-brand-gold transition-colors">{job.title}</td>
                        <td className="py-4 text-center font-semibold text-brand-green">{job.applicants}</td>
                        <td className="py-4 text-center font-semibold text-brand-green">{job.shortlisted}</td>
                        <td className="py-4 text-brand-green/70">{job.deadline}</td>
                        <td className="py-4 text-right">
                          <span className={`inline-block px-3 py-1 rounded-full font-bold uppercase text-[9px] tracking-wider border ${
                            job.status === 'Open'
                              ? 'bg-emerald-50/70 border-emerald-100 text-emerald-800'
                              : 'bg-amber-50/70 border-amber-100 text-amber-800'
                          }`}>
                            {job.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Applicants */}
            <div className="bg-white border border-[#f2efdf] rounded-2xl p-6 shadow-xs hover:shadow-sm transition-all">
              <h2 className="text-lg font-serif text-brand-green font-bold mb-6">Recent applicants</h2>
              <div className="divide-y divide-brand-green/5">
                {allApplicants.slice(0, 4).map((app) => (
                  <div key={app.id} className="flex flex-col md:flex-row items-start md:items-center justify-between py-5 first:pt-0 last:pb-0 gap-4 group">
                    <div className="flex items-center gap-4">
                      {/* Avatar initials with dynamic backgrounds */}
                      <div className={`w-11 h-11 rounded-full font-bold flex items-center justify-center text-sm shadow-inner shrink-0 ${app.avatarBg}`}>
                        {app.initials}
                      </div>
                      <div>
                        <h3 className="font-serif text-base text-brand-green font-bold group-hover:text-brand-gold transition-colors flex items-center gap-2 flex-wrap">
                          {app.studentName}
                          {(() => {
                            let stageText = app.status;
                            let badgeStyles = 'bg-brand-cream text-brand-green/70 border-brand-green/5';

                            if (app.status === 'Interview') {
                              const activeInt = interviews.find(i => 
                                i.studentEmail.toLowerCase() === app.studentEmail.toLowerCase() && 
                                i.jobId === app.jobId && 
                                i.status === 'Scheduled'
                              );
                              stageText = activeInt ? activeInt.round : 'Interview';
                              badgeStyles = 'bg-yellow-50 text-yellow-800 border-yellow-100';
                            } else if (app.status === 'Shortlisted') {
                              stageText = 'Shortlisted';
                              badgeStyles = 'bg-emerald-50 text-emerald-800 border-emerald-100';
                            } else if (app.status === 'Offer' || app.status === 'Selected') {
                              stageText = 'Placed';
                              badgeStyles = 'bg-teal-50 text-teal-800 border-teal-100 font-extrabold';
                            } else if (app.status === 'Rejected') {
                              stageText = 'Eliminated';
                              badgeStyles = 'bg-red-50 text-red-800 border-red-100';
                            }

                            return (
                              <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold uppercase text-[9px] tracking-wider border ${badgeStyles}`}>
                                {stageText}
                              </span>
                            );
                          })()}
                        </h3>
                        <p className="text-xs text-brand-green/60 mt-0.5 font-medium">{app.jobTitle} · CGPA {app.cgpa}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {app.skills.map((skill) => (
                            <span
                              key={skill}
                              className="bg-brand-cream border border-brand-green/5 text-brand-green font-bold text-[10px] px-2.5 py-0.5 rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2.5 shrink-0 self-end md:self-auto">
                      <button 
                        onClick={() => handleViewStudentProfile(app.studentEmail)}
                        className="border border-brand-green/20 hover:border-brand-green hover:bg-brand-green/5 text-[#022c22] font-bold text-[10px] px-4 py-2 rounded-lg uppercase tracking-wider transition-all cursor-pointer"
                      >
                        View
                      </button>
                      {['Offer', 'Selected'].includes(app.status) ? (
                        <span className="bg-brand-gold/10 text-brand-gold font-bold text-[10px] px-4 py-2 rounded-lg uppercase tracking-wider border border-brand-gold/25 text-center min-w-[80px]">
                          Placed
                        </span>
                      ) : (
                        <button 
                          onClick={() => handleOpenScheduler(app)}
                          className="bg-[#022c22] hover:bg-brand-gold text-brand-cream hover:text-[#022c22] font-bold text-[10px] px-4 py-2 rounded-lg uppercase tracking-wider transition-all"
                        >
                          Shortlist
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Area (w-4/12) */}
          <div className="space-y-8">
            {/* Hiring Funnel */}
            <div className="bg-white border border-[#f2efdf] rounded-2xl p-6 shadow-xs hover:shadow-sm transition-all">
              <h2 className="text-lg font-serif text-brand-green font-bold mb-6">Hiring funnel</h2>
              <div className="space-y-5">
                {/* Applied */}
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold text-brand-green">
                    <span className="flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-brand-green/40" /> Applied</span>
                    <span className="font-bold">{funnelApplied} · {pctApplied}%</span>
                  </div>
                  <div className="w-full bg-brand-cream/80 border border-brand-green/5 h-2.5 rounded-full mt-2 overflow-hidden shadow-inner">
                    <div className="bg-[#022c22] rounded-full h-full" style={{ width: `${pctApplied}%` }}></div>
                  </div>
                </div>

                {/* Shortlisted */}
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold text-brand-green">
                    <span className="flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-brand-green/40" /> Shortlisted</span>
                    <span className="font-bold">{funnelShortlisted} · {pctShortlisted}%</span>
                  </div>
                  <div className="w-full bg-brand-cream/80 border border-brand-green/5 h-2.5 rounded-full mt-2 overflow-hidden shadow-inner">
                    <div className="bg-[#022c22] rounded-full h-full" style={{ width: `${pctShortlisted}%` }}></div>
                  </div>
                </div>

                {/* Interview */}
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold text-brand-green">
                    <span className="flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-brand-green/40" /> Interview</span>
                    <span className="font-bold">{funnelInterview} · {pctInterview}%</span>
                  </div>
                  <div className="w-full bg-brand-cream/80 border border-brand-green/5 h-2.5 rounded-full mt-2 overflow-hidden shadow-inner">
                    <div className="bg-[#022c22] rounded-full h-full" style={{ width: `${pctInterview}%` }}></div>
                  </div>
                </div>

                {/* Offer */}
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold text-brand-green">
                    <span className="flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-brand-green/40" /> Offer / Placed</span>
                    <span className="font-bold">{funnelOffer} · {pctOffer}%</span>
                  </div>
                  <div className="w-full bg-brand-cream/80 border border-brand-green/5 h-2.5 rounded-full mt-2 overflow-hidden shadow-inner">
                    <div className="bg-[#022c22] rounded-full h-full" style={{ width: `${pctOffer}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Interviews */}
            <div className="bg-white border border-[#f2efdf] rounded-2xl p-6 shadow-xs hover:shadow-sm transition-all">
              <h2 className="text-lg font-serif text-brand-green font-bold mb-6">Upcoming interviews</h2>
              <div className="divide-y divide-brand-green/5">
                {allInterviews.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-4.5 first:pt-0 last:pb-0 group">
                    <div>
                      <h3 className="font-bold text-brand-green text-sm group-hover:text-brand-gold transition-colors">{item.studentName}</h3>
                      <p className="text-[11px] text-brand-green/40 mt-0.5">{item.jobTitle.split('·')[0]}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-brand-green font-bold">{item.dateTime} · {item.timeStr}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // --- B. Redesign: Job Postings Screen ---
  const renderJobs = () => {
    // Filter listings based on jobsFilter pill selected
    const filteredJobs = allJobs.filter(job => {
      if (jobsFilter === 'All') return true;
      return job.status.toLowerCase() === jobsFilter.toLowerCase();
    });

    return (
      <div className="space-y-8 animate-fade-in-up">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-brand-green/5 pb-6">
          <div>
            <h1 className="editorial-heading font-serif text-3xl font-bold text-brand-green">Job Postings</h1>
            <p className="text-brand-green/60 text-xs mt-1">Manage your active roles, drafts and closed listings.</p>
          </div>
          <button
            onClick={() => setShowAddJobModal(true)}
            className="mt-4 md:mt-0 bg-[#022c22] hover:bg-brand-gold text-brand-cream hover:text-[#022c22] font-semibold text-xs py-2.5 px-5 rounded-lg flex items-center gap-2 transition-all cursor-pointer shadow-sm uppercase tracking-wider"
          >
            <Plus className="w-4.5 h-4.5" /> New job posting
          </button>
        </div>

        {/* 4 Stat Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white border border-[#f2efdf] p-6 rounded-2xl flex items-center justify-between shadow-xs">
            <div>
              <span className="text-[10px] text-brand-gold uppercase tracking-wider font-extrabold block">Open</span>
              <span className="text-4xl font-serif font-bold text-brand-green mt-2 block leading-none">{activeRolesCount}</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-100 flex items-center justify-center shadow-inner">
              <Briefcase className="w-5.5 h-5.5" />
            </div>
          </div>

          <div className="bg-white border border-[#f2efdf] p-6 rounded-2xl flex items-center justify-between shadow-xs">
            <div>
              <span className="text-[10px] text-brand-gold uppercase tracking-wider font-extrabold block">Drafts</span>
              <span className="text-4xl font-serif font-bold text-brand-green mt-2 block leading-none">{draftJobsCount}</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 border border-amber-100 flex items-center justify-center shadow-inner">
              <Pencil className="w-5.5 h-5.5" />
            </div>
          </div>

          <div className="bg-white border border-[#f2efdf] p-6 rounded-2xl flex items-center justify-between shadow-xs">
            <div>
              <span className="text-[10px] text-brand-gold uppercase tracking-wider font-extrabold block">Total Views</span>
              <span className="text-4xl font-serif font-bold text-brand-green mt-2 block leading-none">{totalJobViews.toLocaleString()}</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-yellow-50/70 text-yellow-800 border border-yellow-100 flex items-center justify-center shadow-inner">
              <Eye className="w-5.5 h-5.5" />
            </div>
          </div>

          <div className="bg-white border border-[#f2efdf] p-6 rounded-2xl flex items-center justify-between shadow-xs">
            <div>
              <span className="text-[10px] text-brand-gold uppercase tracking-wider font-extrabold block">Applicants</span>
              <span className="text-4xl font-serif font-bold text-brand-green mt-2 block leading-none">{totalApplicantsCount}</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-800 border border-teal-100 flex items-center justify-center shadow-inner">
              <Users className="w-5.5 h-5.5" />
            </div>
          </div>
        </div>

        {/* Filter Pills Row */}
        <div className="flex gap-2">
          {['All', 'Open', 'Draft', 'Closed'].map((pill) => {
            const isActive = jobsFilter === pill;
            return (
              <button
                key={pill}
                onClick={() => setJobsFilter(pill)}
                className={`text-xs px-4.5 py-1.5 rounded-full font-bold transition-all shadow-xs ${
                  isActive 
                    ? 'bg-[#022c22] text-white' 
                    : 'bg-brand-cream border border-brand-green/5 text-brand-green/70 hover:bg-[#ebeae0]'
                }`}
              >
                {pill}
              </button>
            );
          })}
        </div>

        {/* Job Postings Listing Table Card */}
        <div className="bg-white border border-[#f2efdf] rounded-2xl p-6 shadow-xs">
          <h2 className="text-lg font-serif text-brand-green font-bold mb-6">{filteredJobs.length} job postings</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-brand-green/5 text-[10px] uppercase text-brand-gold font-extrabold tracking-wider">
                  <th className="pb-3 text-left">Role</th>
                  <th className="pb-3 text-left">Type</th>
                  <th className="pb-3 text-center">Applicants</th>
                  <th className="pb-3 text-center">Shortlisted</th>
                  <th className="pb-3 text-center">Views</th>
                  <th className="pb-3 text-left">Deadline</th>
                  <th className="pb-3 text-left">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-green/5 text-brand-green font-medium">
                {filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-brand-cream/10 transition-colors group">
                    <td className="py-4">
                      <span className="font-bold text-brand-green text-sm block group-hover:text-brand-gold transition-colors">{job.title}</span>
                      <span className="text-[11px] text-brand-green/40 font-medium block mt-0.5">{job.location}</span>
                    </td>
                    <td className="py-4">
                      <span className="bg-brand-cream border border-brand-green/5 text-brand-green text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                        {job.type}
                      </span>
                    </td>
                    <td className="py-4 text-center font-bold text-brand-green">{job.applicants}</td>
                    <td className="py-4 text-center font-bold text-brand-green">{job.shortlisted}</td>
                    <td className="py-4 text-center font-bold text-brand-green">{job.views.toLocaleString()}</td>
                    <td className="py-4 text-brand-green/70">{job.deadline}</td>
                    <td className="py-4">
                      <span className={`inline-block px-3 py-1 rounded-full font-bold uppercase text-[9px] tracking-wider border ${
                        job.status === 'Open'
                          ? 'bg-emerald-50/70 border-emerald-100 text-emerald-800'
                          : job.status === 'Closed'
                            ? 'bg-red-50 border border-red-100 text-red-800'
                            : 'bg-amber-50/70 border-amber-100 text-amber-800'
                      }`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex justify-end gap-2.5 text-brand-green/40">
                        <button onClick={() => handleOpenEditJob(job)} className="hover:text-brand-green transition-colors cursor-pointer" title="Edit posting"><Pencil className="w-4.5 h-4.5" /></button>
                        <button onClick={() => handleDeleteJob(job.id, job.title)} className="hover:text-red-600 transition-colors cursor-pointer text-red-500/60" title="Delete posting"><Trash2 className="w-4.5 h-4.5" /></button>
                        <button onClick={() => handleOpenJobDetails(job)} className="hover:text-brand-green transition-colors cursor-pointer" title="View details"><Eye className="w-4.5 h-4.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // --- C. Redesign: Applicants Screen ---
  const renderApplicants = () => {
    const uniqueRoles = Array.from(new Set(allJobs.map(j => j.title)));

    // Filter applicants based on search inputs & dropdown parameters
    const filteredApps = allApplicants.filter((app) => {
      const matchSearch = app.studentName.toLowerCase().includes(applicantsSearch.toLowerCase()) || 
                          app.jobTitle.toLowerCase().includes(applicantsSearch.toLowerCase()) ||
                          app.institute.toLowerCase().includes(applicantsSearch.toLowerCase()) ||
                          app.skills.some(s => s.toLowerCase().includes(applicantsSearch.toLowerCase()));
      
      const matchRole = selectedRoleFilter === 'All roles' || app.jobTitle === selectedRoleFilter;
      
      let matchStage = true;
      if (selectedStageFilter !== 'All stages') {
        if (selectedStageFilter === 'Selected') {
          matchStage = app.status === 'Selected' || app.status === 'Offer';
        } else {
          matchStage = app.status === selectedStageFilter;
        }
      }

      let matchCgpa = true;
      if (minCgpaFilter.trim() !== '') {
        const minVal = parseFloat(minCgpaFilter);
        const appVal = parseFloat(app.cgpa);
        if (!isNaN(minVal) && !isNaN(appVal)) {
          matchCgpa = appVal >= minVal;
        }
      }

      let matchSkills = true;
      if (skillsFilter.trim() !== '') {
        const querySkills = skillsFilter.toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
        if (querySkills.length > 0) {
          const appSkillsLower = (app.skills || []).map(s => s.toLowerCase().trim());
          matchSkills = querySkills.every(qs => appSkillsLower.some(as => as.includes(qs)));
        }
      }

      return matchSearch && matchRole && matchStage && matchCgpa && matchSkills;
    });

    const handleExportApplicantsCSV = () => {
      if (filteredApps.length === 0) {
        alert('No applicant records to export.');
        return;
      }
      const headers = ['Candidate Name', 'Candidate Email', 'Job Title', 'CGPA', 'Status', 'Skills'];
      const rows = filteredApps.map(app => [
        `"${app.studentName.replace(/"/g, '""')}"`,
        `"${app.studentEmail.replace(/"/g, '""')}"`,
        `"${app.jobTitle.replace(/"/g, '""')}"`,
        `"${app.cgpa}"`,
        `"${app.status}"`,
        `"${(app.skills || []).join(', ').replace(/"/g, '""')}"`
      ]);
      const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `placera_applicants_${companyName.toLowerCase().replace(/ /g, '_')}_${new Date().getFullYear()}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setSuccessMsg('Applicants list exported successfully.');
      setTimeout(() => setSuccessMsg(''), 4000);
    };

    return (
      <div className="space-y-8 animate-fade-in-up">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-brand-green/5 pb-6">
          <div>
            <h1 className="editorial-heading font-serif text-3xl font-bold text-brand-green">Applicants</h1>
            <p className="text-brand-green/60 text-xs mt-1">Pipeline across all active job postings.</p>
          </div>
          <button
            onClick={handleExportApplicantsCSV}
            className="mt-4 md:mt-0 border border-brand-green/20 hover:bg-[#022c22]/5 text-[#022c22] font-semibold text-xs py-2.5 px-5 rounded-lg flex items-center gap-2 transition-all cursor-pointer shadow-xs uppercase tracking-wider"
          >
            <Download className="w-4.5 h-4.5" /> Export CSV
          </button>
        </div>

        {/* 5 Stat Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div className="bg-white border border-[#f2efdf] p-5 rounded-2xl flex items-center justify-between shadow-xs">
            <div>
              <span className="text-[10px] text-brand-gold uppercase tracking-wider font-extrabold block">Total</span>
              <span className="text-3xl font-serif font-bold text-brand-green mt-1 block">{allApplicants.length}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 border border-teal-100 flex items-center justify-center shadow-inner">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white border border-[#f2efdf] p-5 rounded-2xl flex items-center justify-between shadow-xs">
            <div>
              <span className="text-[10px] text-brand-gold uppercase tracking-wider font-extrabold block">Applied</span>
              <span className="text-3xl font-serif font-bold text-brand-green mt-1 block">{allApplicants.filter(a => a.status === 'Applied').length}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-800 border border-gray-200 flex items-center justify-center shadow-inner">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white border border-[#f2efdf] p-5 rounded-2xl flex items-center justify-between shadow-xs">
            <div>
              <span className="text-[10px] text-brand-gold uppercase tracking-wider font-extrabold block">Shortlisted</span>
              <span className="text-3xl font-serif font-bold text-brand-green mt-1 block">{allApplicants.filter(a => a.status === 'Shortlisted').length}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-100 flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white border border-[#f2efdf] p-5 rounded-2xl flex items-center justify-between shadow-xs">
            <div>
              <span className="text-[10px] text-brand-gold uppercase tracking-wider font-extrabold block">Interview</span>
              <span className="text-3xl font-serif font-bold text-brand-green mt-1 block">{allApplicants.filter(a => a.status === 'Interview').length}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-yellow-50/70 text-yellow-800 border border-yellow-100 flex items-center justify-center shadow-inner">
              <Calendar className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white border border-[#f2efdf] p-5 rounded-2xl flex items-center justify-between shadow-xs col-span-2 md:col-span-1">
            <div>
              <span className="text-[10px] text-brand-gold uppercase tracking-wider font-extrabold block">Offers</span>
              <span className="text-3xl font-serif font-bold text-brand-green mt-1 block">{allApplicants.filter(a => ['Offer', 'Selected'].includes(a.status)).length}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 border border-teal-100 flex items-center justify-center shadow-inner">
              <Star className="w-5 h-5 fill-current" />
            </div>
          </div>
        </div>

        {/* Filter Bar Card */}
        <div className="bg-white border border-[#f2efdf] rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search trigger */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-brand-green/30 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search applicants..."
              value={applicantsSearch}
              onChange={(e) => setApplicantsSearch(e.target.value)}
              className="w-full bg-[#f4f3ea]/50 border border-brand-green/5 rounded-xl py-2.5 pl-11 pr-4 text-xs focus:outline-none focus:border-brand-gold focus:bg-white transition-all text-brand-green placeholder:text-brand-green/40 shadow-inner"
            />
          </div>

          {/* Selector Dropdowns */}
          <div className="flex flex-wrap gap-3">
            {/* Roles selector */}
            <div className="relative">
              <select
                value={selectedRoleFilter}
                onChange={(e) => setSelectedRoleFilter(e.target.value)}
                className="appearance-none bg-brand-cream border border-brand-green/5 text-brand-green font-bold text-xs py-2.5 pl-4 pr-10 rounded-xl focus:outline-none focus:border-brand-gold shadow-xs cursor-pointer"
              >
                <option value="All roles">All roles</option>
                {uniqueRoles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-brand-green/40 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Stages selector */}
            <div className="relative">
              <select
                value={selectedStageFilter}
                onChange={(e) => setSelectedStageFilter(e.target.value)}
                className="appearance-none bg-brand-cream border border-brand-green/5 text-brand-green font-bold text-xs py-2.5 pl-4 pr-10 rounded-xl focus:outline-none focus:border-brand-gold shadow-xs cursor-pointer"
              >
                <option value="All stages">All stages</option>
                <option value="Applied">Applied</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Interview">Interview</option>
                <option value="Selected">Placed</option>
                <option value="Rejected">Eliminated</option>
              </select>
              <ChevronDown className="w-4 h-4 text-brand-green/40 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Filters toggle */}
            <button
              onClick={() => setShowMoreFilters(!showMoreFilters)}
              className={`border font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                showMoreFilters || minCgpaFilter || skillsFilter
                  ? 'bg-[#022c22] text-white border-[#022c22]'
                  : 'border-brand-green/10 bg-brand-cream hover:bg-[#ebeae0] text-[#022c22]'
              }`}
            >
              <Info className={`w-4 h-4 ${showMoreFilters || minCgpaFilter || skillsFilter ? 'text-brand-gold' : 'text-brand-green/40'}`} />
              <span>More filters{(minCgpaFilter || skillsFilter) ? ' (Active)' : ''}</span>
            </button>
          </div>
        </div>

        {/* Elegant Collapsible Filters Panel */}
        {showMoreFilters && (
          <div className="bg-white border border-[#f2efdf] rounded-2xl p-6 shadow-xs animate-fade-in-down space-y-4">
            <div className="flex justify-between items-center border-b border-brand-green/5 pb-3">
              <h3 className="font-serif text-sm font-bold text-[#022c22]">Advanced Candidate Filters</h3>
              {(minCgpaFilter || skillsFilter) && (
                <button
                  onClick={() => {
                    setMinCgpaFilter('');
                    setSkillsFilter('');
                  }}
                  className="text-[10px] uppercase font-bold tracking-wider text-red-600 hover:text-red-700 transition-colors cursor-pointer"
                >
                  Clear filters
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* CGPA Filter Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-extrabold tracking-wider text-brand-gold block">
                  Minimum CGPA
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    placeholder="e.g. 8.5"
                    value={minCgpaFilter}
                    onChange={(e) => setMinCgpaFilter(e.target.value)}
                    className="w-full bg-[#f4f3ea]/50 border border-brand-green/5 rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:border-brand-gold focus:bg-white transition-all text-brand-green placeholder:text-brand-green/40 shadow-inner"
                  />
                  {minCgpaFilter && (
                    <button 
                      onClick={() => setMinCgpaFilter('')} 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-green/30 hover:text-brand-green transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-brand-green/50">Show students with CGPA greater than or equal to this value.</p>
              </div>

              {/* Skills Filter Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-extrabold tracking-wider text-brand-gold block">
                  Filter by Skills
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. React, Node.js, Python"
                    value={skillsFilter}
                    onChange={(e) => setSkillsFilter(e.target.value)}
                    className="w-full bg-[#f4f3ea]/50 border border-brand-green/5 rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:border-brand-gold focus:bg-white transition-all text-brand-green placeholder:text-brand-green/40 shadow-inner"
                  />
                  {skillsFilter && (
                    <button 
                      onClick={() => setSkillsFilter('')} 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-green/30 hover:text-brand-green transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-brand-green/50">Enter comma-separated skills. Matches candidates possessing all specified skills.</p>
              </div>
            </div>
          </div>
        )}

        {/* Applicants List Card */}
        <div className="bg-white border border-[#f2efdf] rounded-2xl p-6 shadow-xs">
          <h2 className="text-lg font-serif text-brand-green font-bold mb-6">All applicants</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-brand-green/5 text-[10px] uppercase text-brand-gold font-extrabold tracking-wider">
                  <th className="pb-3 text-center w-8"><input type="checkbox" className="rounded border-[#f2efdf] focus:ring-0" /></th>
                  <th className="pb-3 text-left pl-2">Candidate</th>
                  <th className="pb-3 text-left">Academic Info</th>
                  <th className="pb-3 text-left">Skill Assets</th>
                  <th className="pb-3 text-center">Stage</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-green/5 text-brand-green font-medium">
                {filteredApps.map((app) => {
                  const isSearched = applicantsSearch.trim() !== '' && (
                    app.studentName.toLowerCase().includes(applicantsSearch.toLowerCase()) || 
                    app.jobTitle.toLowerCase().includes(applicantsSearch.toLowerCase()) ||
                    app.skills.some(s => s.toLowerCase().includes(applicantsSearch.toLowerCase()))
                  );
                  return (
                    <tr 
                      key={app.id} 
                      className={`transition-all group ${
                        isSearched 
                          ? 'bg-brand-gold/15 border-l-4 border-brand-gold font-bold scale-[1.002] shadow-xs' 
                          : 'hover:bg-brand-cream/10 transition-colors'
                      }`}
                    >
                      <td className="py-5 text-center"><input type="checkbox" className="rounded border-[#f2efdf] focus:ring-0" /></td>
                      <td className="py-5 pl-2">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full font-bold flex items-center justify-center text-sm shadow-inner shrink-0 ${app.avatarBg}`}>
                            {app.initials}
                          </div>
                          <div>
                            <div className="flex items-center">
                              <span className="font-bold text-brand-green text-base block group-hover:text-brand-gold transition-colors">{app.studentName}</span>
                              <span className="flex items-center gap-0.5 text-xs text-amber-500 font-extrabold ml-2">
                                <Star className="w-3.5 h-3.5 fill-current" /> {app.matchScore}
                              </span>
                            </div>
                            <span className="text-[11px] text-brand-green/50 block font-medium mt-0.5">{app.studentEmail}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-5">
                        <span className="font-bold block text-brand-green">{app.jobTitle}</span>
                        <span className="text-[11px] text-brand-green/50 block font-semibold mt-0.5">{app.institute} · CGPA {app.cgpa}</span>
                      </td>
                      <td className="py-5">
                        <div className="flex flex-wrap gap-1.5 max-w-xs">
                          {app.skills.map((skill) => (
                            <span
                              key={skill}
                              className="bg-brand-cream border border-brand-green/5 text-brand-green text-[10px] font-bold px-2 py-0.5 rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-5 text-center">
                        {(() => {
                          let stageText = app.status;
                          let badgeStyles = 'bg-brand-cream border border-brand-green/5 text-brand-green/70';

                          if (app.status === 'Interview') {
                            // Try to find the active scheduled interview round
                            const activeInt = interviews.find(i => 
                              i.studentEmail.toLowerCase() === app.studentEmail.toLowerCase() && 
                              i.jobId === app.jobId && 
                              i.status === 'Scheduled'
                            );
                            stageText = activeInt ? activeInt.round : 'Interview';
                            badgeStyles = 'bg-yellow-50/70 border-yellow-100 text-yellow-800';
                          } else if (app.status === 'Shortlisted') {
                            stageText = 'Shortlisted';
                            badgeStyles = 'bg-emerald-50/70 border-emerald-100 text-emerald-800';
                          } else if (app.status === 'Offer' || app.status === 'Selected') {
                            stageText = 'Placed';
                            badgeStyles = 'bg-teal-50 border border-teal-100 text-teal-800 font-extrabold';
                          } else if (app.status === 'Rejected') {
                            stageText = 'Eliminated';
                            badgeStyles = 'bg-red-50 border border-red-100 text-red-800';
                          }

                          return (
                            <span className={`inline-block px-3 py-1 rounded-full font-bold uppercase text-[9px] tracking-wider border ${badgeStyles}`}>
                              {stageText}
                            </span>
                          );
                        })()}
                      </td>
                      <td className="py-5 text-right">
                        <div className="flex justify-end items-center gap-2">
                          <button className="border border-brand-green/10 text-brand-green/60 hover:text-brand-green hover:bg-brand-green/5 p-2 rounded-lg transition-colors cursor-pointer" title="Email candidate">
                            <Mail className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleViewStudentProfile(app.studentEmail)}
                            className="border border-brand-green/20 text-[#022c22] hover:bg-brand-green/5 font-bold text-[10px] px-3.5 py-1.5 rounded-lg uppercase tracking-wider transition-colors cursor-pointer"
                          >
                            View
                          </button>
                          <button 
                            onClick={() => { setSelectedApplicationDetails(app); setShowApplicationDetailsModal(true); }}
                            className="border border-brand-green/20 text-[#022c22] hover:bg-brand-green/5 font-bold text-[10px] px-3.5 py-1.5 rounded-lg uppercase tracking-wider transition-colors cursor-pointer"
                          >
                            Detail
                          </button>
                          {['Offer', 'Selected'].includes(app.status) ? (
                            <span className="bg-brand-gold/10 text-brand-gold font-bold text-[10px] px-4 py-1.5 rounded-lg uppercase tracking-wider border border-brand-gold/25 text-center min-w-[80px]">
                              Placed
                            </span>
                          ) : (
                            <button 
                              onClick={() => handleOpenScheduler(app)}
                              className="bg-[#022c22] hover:bg-brand-gold text-brand-cream hover:text-[#022c22] font-bold text-[10px] px-4 py-1.5 rounded-lg uppercase tracking-wider transition-colors cursor-pointer"
                            >
                              Advance
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // --- D. Redesign: Interviews Screen ---
  const renderInterviews = () => {
    return (
      <div className="space-y-8 animate-fade-in-up">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-brand-green/5 pb-6">
          <div>
            <h1 className="editorial-heading font-serif text-3xl font-bold text-brand-green">Interviews</h1>
            <p className="text-brand-green/60 text-xs mt-1">Coordinate panels, slots and outcomes.</p>
          </div>
          <button
            onClick={() => setShowScheduleModal(true)}
            className="mt-4 md:mt-0 bg-[#022c22] hover:bg-brand-gold text-brand-cream hover:text-[#022c22] font-semibold text-xs py-2.5 px-5 rounded-lg flex items-center gap-2 transition-all cursor-pointer shadow-sm uppercase tracking-wider"
          >
            <Plus className="w-4.5 h-4.5" /> Schedule interview
          </button>
        </div>

        {/* 4 Stat Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white border border-[#f2efdf] p-6 rounded-2xl flex items-center justify-between shadow-xs">
            <div>
              <span className="text-[10px] text-brand-gold uppercase tracking-wider font-extrabold block">This Week</span>
              <span className="text-4xl font-serif font-bold text-brand-green mt-2 block leading-none">{allInterviews.length}</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-100 flex items-center justify-center shadow-inner">
              <Calendar className="w-5.5 h-5.5" />
            </div>
          </div>

          <div className="bg-white border border-[#f2efdf] p-6 rounded-2xl flex items-center justify-between shadow-xs">
            <div>
              <span className="text-[10px] text-brand-gold uppercase tracking-wider font-extrabold block">Online</span>
              <span className="text-4xl font-serif font-bold text-brand-green mt-2 block leading-none">{allInterviews.filter(i => i.mode === 'Online').length}</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-800 border border-teal-100 flex items-center justify-center shadow-inner">
              <ExternalLink className="w-5.5 h-5.5" />
            </div>
          </div>

          <div className="bg-white border border-[#f2efdf] p-6 rounded-2xl flex items-center justify-between shadow-xs">
            <div>
              <span className="text-[10px] text-brand-gold uppercase tracking-wider font-extrabold block">Onsite</span>
              <span className="text-4xl font-serif font-bold text-brand-green mt-2 block leading-none">{allInterviews.filter(i => i.mode === 'Onsite' || i.mode === 'Offline').length}</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gray-100 text-gray-800 border border-gray-200 flex items-center justify-center shadow-inner">
              <Building className="w-5.5 h-5.5" />
            </div>
          </div>

          <div className="bg-white border border-[#f2efdf] p-6 rounded-2xl flex items-center justify-between shadow-xs">
            <div>
              <span className="text-[10px] text-brand-gold uppercase tracking-wider font-extrabold block">Pending Feedback</span>
              <span className="text-4xl font-serif font-bold text-brand-green mt-2 block leading-none">{allApplicants.filter(a => a.status === 'Interview').length}</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 border border-amber-100 flex items-center justify-center shadow-inner">
              <Clock className="w-5.5 h-5.5" />
            </div>
          </div>
        </div>

        {/* Columns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (Scheduled interviews) */}
          <div className="lg:col-span-2 bg-white border border-[#f2efdf] rounded-2xl p-6 shadow-xs">
            <h2 className="text-lg font-serif text-brand-green font-bold mb-6">Scheduled interviews</h2>
            <div className="space-y-6">
              {allInterviews.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-brand-cream/30 border border-[#f2efdf]/60 rounded-xl gap-4 hover:shadow-inner transition-all group">
                  <div className="flex items-center gap-4">
                    {/* Date Badge */}
                    <div className="w-16 bg-[#022c22] rounded-xl py-2.5 flex flex-col items-center justify-center shrink-0 border border-brand-green/10 shadow-sm">
                      <span className="text-2xl font-serif text-brand-cream font-bold leading-none">{item.dateTime.split(' ')[0]}</span>
                      <span className="text-[9px] text-brand-gold font-extrabold uppercase tracking-widest mt-1 block">{item.dateTime.split(' ')[1]}</span>
                    </div>

                    {/* Content Details */}
                    <div>
                      <div className="flex items-center flex-wrap gap-2">
                        <h3 className="font-serif text-base text-brand-green font-bold group-hover:text-brand-gold transition-colors">{item.studentName}</h3>
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[8px] uppercase tracking-wider border ${
                          item.mode === 'Online' 
                            ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
                            : 'bg-gray-100 border-gray-200 text-gray-800'
                        }`}>
                          {item.mode}
                        </span>
                      </div>
                      <p className="text-xs text-brand-green/60 mt-1 font-medium">{item.jobTitle}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-brand-green/50">
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-brand-green/30" /> {item.timeStr}</span>
                        <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-brand-green/30" /> Panel: {item.panel}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex gap-2.5 shrink-0 self-end sm:self-auto">
                    <button 
                      onClick={() => handleOpenInterviewAction(item)}
                      className="bg-[#022c22] hover:bg-brand-gold text-brand-cream hover:text-[#022c22] font-bold text-[10px] px-4 py-2 rounded-lg uppercase tracking-wider transition-all cursor-pointer"
                    >
                      Join
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column (Panel availability) */}
          <div className="space-y-8">
            {/* Panel availability */}
            <div className="bg-white border border-[#f2efdf] rounded-2xl p-6 shadow-xs">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-serif text-brand-green font-bold">Panel availability</h2>
                <button
                  onClick={() => {
                    setNewPanelName('');
                    setNewPanelSlots([]);
                    setPanelError('');
                    setShowAddPanelModal(true);
                  }}
                  className="bg-[#022c22] hover:bg-brand-gold text-brand-cream hover:text-[#022c22] w-7 h-7 rounded-full flex items-center justify-center font-bold transition-all shadow-sm cursor-pointer"
                  title="Add panel member availability"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {panels.length === 0 ? (
                  <p className="text-xs text-brand-green/50 italic font-medium py-2">No registered panel members.</p>
                ) : (
                  panels.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs font-semibold text-brand-green py-1 border-b border-brand-green/5 last:border-0 last:pb-0">
                      <span className="flex items-center gap-2"><Users className="w-4 h-4 text-brand-green/30" /> {item.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-brand-gold font-bold">{item.slots.length} slots / wk</span>
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to remove panel member "${item.name}"?`)) {
                              setPanels(prev => prev.filter((_, i) => i !== idx));
                              setSuccessMsg(`Removed panel member: ${item.name}`);
                              setTimeout(() => setSuccessMsg(''), 4000);
                            }
                          }}
                          className="text-red-500 hover:text-red-700 p-1 cursor-pointer transition-colors"
                          title="Remove panel member"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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

  // --- E. Redesign: Company Profile Screen ---
  const renderCompanyProfile = () => {
    return (
      <div className="space-y-8 animate-fade-in-up">
        {/* Header Block with Edit profile button */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-brand-green/5 pb-6">
          <div>
            <h1 className="editorial-heading font-serif text-3xl font-bold text-brand-green">Company Profile</h1>
            <p className="text-brand-green/60 text-xs mt-1">How students see your brand on Placera.</p>
          </div>
          <button
            onClick={() => setShowEditProfileModal(true)}
            className="mt-4 md:mt-0 bg-[#022c22] hover:bg-brand-gold text-brand-cream hover:text-[#022c22] font-semibold text-xs py-2.5 px-5 rounded-lg flex items-center gap-2 transition-all cursor-pointer shadow-sm uppercase tracking-wider"
          >
            <Pencil className="w-4 h-4" /> Edit profile
          </button>
        </div>

        {/* Brand Hero Card */}
        <div className="bg-[#022c22] rounded-3xl p-8 text-brand-cream relative overflow-hidden shadow-md border border-brand-green/10">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-brand-gold flex items-center justify-center shadow-lg text-[#022c22] text-4xl font-bold font-serif shrink-0">
                {profileForm.company ? profileForm.company[0].toUpperCase() : 'C'}
              </div>
              <div>
                <div className="flex items-center flex-wrap gap-3">
                  <h2 className="font-serif text-3xl font-bold text-white leading-none">{profileForm.company}</h2>
                  <span className="bg-brand-cream/10 border border-brand-cream/20 text-brand-cream text-[10px] uppercase font-extrabold px-3 py-1 rounded-full shadow-inner tracking-widest leading-none">
                    {user?.recruiterDetails?.status || 'Verified'}
                  </span>
                </div>
                <p className="text-brand-cream/70 text-sm font-semibold mt-2.5">
                  {profileForm.tagline}
                </p>
                <div className="flex items-center flex-wrap gap-4 mt-4 text-xs text-brand-cream/60">
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-brand-gold/80" /> {profileForm.location}</span>
                  <span className="flex items-center gap-1.5"><Globe className="w-4 h-4 text-brand-gold/80" /> {profileForm.website}</span>
                  <span className="flex items-center gap-1.5"><LinkedinIcon className="w-4 h-4 text-brand-gold/80" /> {profileForm.linkedin}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Stat Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white border border-[#f2efdf] p-6 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-sm transition-all">
            <div>
              <span className="text-[10px] text-brand-gold uppercase tracking-wider font-extrabold block">Active Roles</span>
              <span className="text-4xl font-serif font-bold text-brand-green mt-2 block leading-none">{activeRolesCount}</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-teal-50/70 text-teal-800 border border-teal-100 flex items-center justify-center shadow-inner">
              <Building className="w-5.5 h-5.5" />
            </div>
          </div>

          <div className="bg-white border border-[#f2efdf] p-6 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-sm transition-all">
            <div>
              <span className="text-[10px] text-brand-gold uppercase tracking-wider font-extrabold block">Total Hires</span>
              <span className="text-4xl font-serif font-bold text-brand-green mt-2 block leading-none">{allApplicants.filter(a => a.status === 'Selected').length}</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50/70 text-amber-800 border border-amber-100 flex items-center justify-center shadow-inner">
              <Users className="w-5.5 h-5.5" />
            </div>
          </div>

          <div className="bg-white border border-[#f2efdf] p-6 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-sm transition-all">
            <div>
              <span className="text-[10px] text-brand-gold uppercase tracking-wider font-extrabold block">Profile Views</span>
              <span className="text-4xl font-serif font-bold text-brand-green mt-2 block leading-none">{companyViewsVal}</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-yellow-50/70 text-yellow-800 border border-yellow-100 flex items-center justify-center shadow-inner">
              <Globe className="w-5.5 h-5.5" />
            </div>
          </div>

          <div className="bg-white border border-[#f2efdf] p-6 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-sm transition-all">
            <div>
              <span className="text-[10px] text-brand-gold uppercase tracking-wider font-extrabold block">Avg Rating</span>
              <span className="text-4xl font-serif font-bold text-brand-green mt-2 block leading-none">4.8 / 5</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-teal-50/70 text-teal-800 border border-teal-100 flex items-center justify-center shadow-inner">
              <Bookmark className="w-5.5 h-5.5" />
            </div>
          </div>
        </div>

        {/* Columns split grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Columns (col-span-2) */}
          <div className="lg:col-span-2 space-y-8">
            {/* About company */}
            <div className="bg-white border border-[#f2efdf] rounded-2xl p-6 shadow-xs">
              <h3 className="text-lg font-serif text-brand-green font-bold mb-4">About {profileForm.company}</h3>
              <p className="text-xs text-brand-green/75 leading-relaxed font-medium">
                {profileForm.about}
              </p>
              <div className="flex flex-wrap gap-2.5 mt-5">
                {['Verified Recruiter', profileForm.industry || 'Technology', profileForm.companySize || '450+ employees'].map((pill) => (
                  <span
                    key={pill}
                    className="bg-[#fcfbf9] border border-brand-green/5 text-brand-gold text-[10px] font-extrabold tracking-wider uppercase px-3.5 py-1 rounded-full shadow-xs"
                  >
                    {pill}
                  </span>
                ))}
              </div>
            </div>

            {/* What we hire for */}
            <div className="bg-white border border-[#f2efdf] rounded-2xl p-6 shadow-xs">
              <div className="flex justify-between items-center mb-5 border-b border-brand-green/5 pb-3">
                <h3 className="text-lg font-serif text-brand-green font-bold">What we hire for</h3>
                <button 
                  onClick={() => {
                    setHiringFormList(hiringRolesList);
                    setShowEditHiringModal(true);
                  }}
                  className="bg-brand-cream border border-brand-green/10 text-brand-green hover:bg-[#ebeae0] font-bold text-[10px] px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit categories
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hiringRolesList.map((item, idx) => (
                  <div key={idx} className="bg-brand-cream/35 border border-[#f2efdf]/60 rounded-xl p-4.5 shadow-2xs hover:shadow-xs transition-all">
                    <h4 className="font-serif text-base text-brand-green font-bold">{item.title}</h4>
                    <p className="text-xs text-brand-green/60 mt-1 font-medium">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hiring team */}
            <div className="bg-white border border-[#f2efdf] rounded-2xl p-6 shadow-xs">
              <h3 className="text-lg font-serif text-brand-green font-bold mb-5">Hiring team</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'Sara Bose', title: 'Head of Talent', initial: 'SB' },
                  { name: 'Arjun Mehta', title: 'Engineering Manager', initial: 'AM' },
                  { name: 'Riya Khan', title: 'Senior DS Lead', initial: 'RK' },
                  { name: 'Tanvi Rao', title: 'Campus Lead', initial: 'TR' },
                ].map((member, idx) => (
                  <div key={idx} className="bg-brand-cream/35 border border-[#f2efdf]/60 rounded-xl p-4 flex items-center justify-between group animate-fade-in">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#f4f3ea] text-brand-green font-serif font-bold text-xs flex items-center justify-center shadow-inner border border-brand-green/5 shrink-0">
                        {member.initial}
                      </div>
                      <div>
                        <h4 className="font-bold text-brand-green text-sm group-hover:text-brand-gold transition-colors">{member.name}</h4>
                        <p className="text-[11px] text-brand-green/50 font-medium mt-0.5">{member.title}</p>
                      </div>
                    </div>
                    <button className="text-brand-green/45 hover:text-brand-green p-1.5 hover:bg-[#022c22]/5 rounded-lg transition-all cursor-pointer" title="Email panelist">
                      <Mail className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Columns Perks, stack and contacts */}
          <div className="space-y-8">
            {/* Perks & culture */}
            <div className="bg-white border border-[#f2efdf] rounded-2xl p-6 shadow-xs">
              <h3 className="text-lg font-serif text-brand-green font-bold mb-4">Perks & culture</h3>
              <ul className="space-y-3.5 text-xs text-brand-green font-semibold leading-relaxed">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-green shrink-0"></span> Health & wellness coverage</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-green shrink-0"></span> Learning stipend ₹1.2L / yr</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-green shrink-0"></span> Remote-first option</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-green shrink-0"></span> Parental leave 26 weeks</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-green shrink-0"></span> Sabbatical after 4 yrs</li>
              </ul>
            </div>

            {/* Tech Stack */}
            <div className="bg-white border border-[#f2efdf] rounded-2xl p-6 shadow-xs">
              <h3 className="text-lg font-serif text-brand-green font-bold mb-5">Tech stack</h3>
              <div className="flex flex-wrap gap-2">
                {profileForm.techStack.split(',').map(s => s.trim()).filter(Boolean).map((tech) => (
                  <span
                    key={tech}
                    className="bg-[#fcfbf9] border border-brand-green/5 text-brand-green text-[10px] font-bold px-3 py-1 rounded-full shadow-xs"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white border border-[#f2efdf] rounded-2xl p-6 shadow-xs text-xs font-semibold text-brand-green space-y-4.5">
              <h3 className="text-lg font-serif text-brand-green font-bold mb-1.5 block">Contact</h3>
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-brand-green/35 shrink-0 mt-0.5" />
                <span className="block truncate">{profileForm.contactEmail}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-green/35 shrink-0 mt-0.5" />
                <span className="block leading-tight">{profileForm.contactAddress || 'Prestige Tech Park, Bengaluru'}</span>
              </div>
              {profileForm.contactPhone && (
                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-brand-green/35 shrink-0 mt-0.5" />
                  <span className="block leading-tight">{profileForm.contactPhone}</span>
                </div>
              )}
              <div className="flex items-start gap-2.5">
                <Globe className="w-4 h-4 text-brand-green/35 shrink-0 mt-0.5" />
                <a href="#" className="text-brand-gold hover:underline block leading-tight">{profileForm.website || 'helix-analytics.com/careers'}</a>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50/40 border border-red-200/50 rounded-2xl p-6 shadow-xs space-y-3.5">
              <h3 className="text-lg font-serif text-red-900 font-bold flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" /> Danger Zone
              </h3>
              <p className="text-[11px] text-red-700/80 leading-relaxed font-semibold">
                Once you delete your recruiter account, all your company profile data, job postings, candidate applications, and scheduled interviews will be permanently deleted from Placera.
              </p>
              <button
                onClick={() => setShowDeleteConfirmModal(true)}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-3 px-4 rounded-xl transition-all cursor-pointer shadow-sm uppercase tracking-wider text-center"
              >
                Delete Recruiter Account
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  };

  // --- F. Redesign: Notifications Screen ---
  const renderNotifications = () => {
    const myNotifications = notifications.filter(n => n.recipientEmail === user.email);
    
    const getCategory = (notif) => {
      const title = notif.title.toLowerCase();
      if (title.includes('offer')) return 'Offers';
      if (title.includes('interview')) return 'Interviews';
      if (title.includes('message') || title.includes('chat')) return 'Messages';
      return 'Applicants';
    };

    const getIconDetails = (notif) => {
      const cat = getCategory(notif);
      if (cat === 'Offers') {
        return { icon: CheckCircle2 };
      }
      if (cat === 'Interviews') {
        return { icon: Calendar };
      }
      if (cat === 'Messages') {
        return { icon: MessageSquare };
      }
      const title = notif.title.toLowerCase();
      if (title.includes('applicant') || title.includes('apply')) {
        return { icon: Users };
      }
      if (title.includes('job') || title.includes('posting')) {
        return { icon: Briefcase };
      }
      return { icon: AlertCircle };
    };

    const recruiterNotifs = myNotifications.map(n => {
      const details = getIconDetails(n);
      return {
        id: n.id,
        title: n.title,
        desc: n.message,
        time: n.time || 'Just now',
        unread: !n.read,
        icon: details.icon,
        category: getCategory(n),
        bg: !n.read ? 'bg-[#fdfcf7] hover:bg-[#fbfaf5]' : ''
      };
    });

    const filteredNotifs = notifFilter === 'All' 
      ? recruiterNotifs 
      : recruiterNotifs.filter(n => n.category === notifFilter);
      
    const unreadCount = recruiterNotifs.filter(n => n.unread).length;

    return (
      <div className="space-y-8 animate-fade-in-up">
        {/* Header Block */}
        <div className="flex justify-between items-center border-b border-brand-green/5 pb-6">
          <div>
            <h1 className="editorial-heading font-serif text-3xl font-bold text-brand-green">Notifications</h1>
            <p className="text-brand-green/60 text-xs mt-1">
              {unreadCount} unread update{unreadCount !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={async () => {
              try {
                await Promise.all(myNotifications.map(n => !n.read && markNotificationAsRead(n.id)));
              } catch (err) {
                console.error('Error marking all read:', err);
              }
            }}
            className="border border-brand-green/20 hover:bg-brand-green/5 font-bold text-xs text-brand-green px-4 py-2 rounded-lg uppercase tracking-wider transition-all cursor-pointer"
          >
            Mark all as read
          </button>
        </div>

        {/* Filter Pills row */}
        <div className="flex gap-2">
          {['All', 'Applicants', 'Interviews', 'Offers', 'Messages'].map((pill) => {
            const isActive = pill === notifFilter;
            return (
              <button
                key={pill}
                onClick={() => setNotifFilter(pill)}
                className={`text-xs px-4 py-1.5 rounded-full font-bold transition-all shadow-xs cursor-pointer ${
                  isActive 
                    ? 'bg-[#022c22] text-white' 
                    : 'bg-brand-cream border border-brand-green/5 text-brand-green/70 hover:bg-[#ebeae0]'
                }`}
              >
                {pill}
              </button>
            );
          })}
        </div>

        {/* Notifications Feed List Card */}
        <div className="bg-white border border-[#f2efdf] rounded-2xl p-6 shadow-xs">
          <h3 className="text-lg font-serif text-brand-green font-bold mb-6">Recent</h3>
          <div className="divide-y divide-brand-green/5">
            {filteredNotifs.map((notif) => {
              const Icon = notif.icon;
              return (
                <div key={notif.id} className={`flex items-start justify-between py-4.5 px-4 first:-mt-4 last:-mb-4 -mx-4 rounded-xl gap-4 group transition-colors ${notif.bg}`}>
                  <div className="flex gap-4">
                    {/* Alert icon in beige container */}
                    <div className="w-10 h-10 rounded-full bg-[#f4f3ea]/60 text-brand-green/70 border border-brand-green/5 flex items-center justify-center shrink-0 shadow-inner">
                      <Icon className="w-5 h-5 text-brand-green/65" />
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h4 className={`text-sm ${notif.unread ? 'text-brand-green font-extrabold' : 'text-brand-green font-bold group-hover:text-brand-gold transition-colors'}`}>
                          {notif.title}
                        </h4>
                        {notif.unread && (
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shadow-sm shadow-brand-gold/60 ml-2 animate-pulse"></span>
                        )}
                      </div>
                      <p className="text-xs text-brand-green/60 mt-1 font-medium">{notif.desc}</p>
                      <span className="text-[10px] text-brand-green/40 block mt-2 font-bold">{notif.time}</span>
                    </div>
                  </div>
                  <button 
                    onClick={async () => {
                      if (notif.unread) {
                        await markNotificationAsRead(notif.id);
                      }
                    }}
                    className="text-[10px] text-brand-green/50 hover:text-brand-green font-bold tracking-wider hover:underline mt-1 shrink-0 cursor-pointer"
                  >
                    View
                  </button>
                </div>
              );
            })}
            {filteredNotifs.length === 0 && (
              <div className="text-center py-8 text-brand-green/40 font-medium text-xs">
                No notifications in this category
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative">
      
      {/* Dynamic Views switch board */}
      {activeSubTab === 'overview' && renderOverview()}
      {activeSubTab === 'jobs' && renderJobs()}
      {activeSubTab === 'applicants' && renderApplicants()}
      {activeSubTab === 'interviews' && renderInterviews()}
      {activeSubTab === 'profile' && renderCompanyProfile()}
      {activeSubTab === 'notifications' && renderNotifications()}

      {/* --- STUDENT PROFILE VIEW MODAL --- */}
      {showStudentProfileModal && selectedStudent && (
        <div className="fixed inset-0 bg-[#022c22]/30 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-brand-cream border border-[#f2efdf] max-w-3xl w-full rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl animate-fade-in-up max-h-[90vh] overflow-y-auto scrollbar-hide">
            {/* Header section */}
            <div className="flex justify-between items-start border-b border-brand-green/5 pb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full font-serif font-bold bg-brand-gold text-[#022c22] text-2xl flex items-center justify-center shadow-md">
                  {selectedStudent.name ? selectedStudent.name.split(' ').map(n => n[0]).join('') : 'S'}
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-bold text-brand-green">{selectedStudent.name}</h3>
                  <p className="text-xs text-brand-green/60 font-semibold mt-1">
                    {selectedStudent.studentDetails?.department || 'Student'} · Class of {selectedStudent.studentDetails?.batch || '2026'}
                  </p>
                  <p className="text-[10px] text-brand-gold uppercase tracking-wider font-extrabold mt-1">
                    Roll No: {selectedStudent.studentDetails?.roll || 'N/A'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => { setShowStudentProfileModal(false); setSelectedStudent(null); }} 
                className="text-brand-green/40 hover:text-brand-green p-1.5 hover:bg-[#022c22]/5 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content body layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-brand-green font-medium">
              
              {/* Left Column - Details, Skills & Contacts */}
              <div className="space-y-6 md:border-r md:border-[#f2efdf] md:pr-6">
                
                {/* Stats / Academic Info */}
                <div className="bg-white border border-[#f2efdf] p-4.5 rounded-2xl shadow-2xs space-y-3">
                  <span className="text-[10px] text-brand-gold uppercase tracking-wider font-extrabold block">Academic Rating</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-serif font-bold">{selectedStudent.studentDetails?.cgpa || 'N/A'}</span>
                    <span className="text-[10px] text-brand-green/50">CGPA</span>
                  </div>
                  <div className="pt-2 border-t border-brand-green/5 flex items-center gap-1.5 text-[10px] text-brand-green/70">
                    <MapPin className="w-3.5 h-3.5 text-brand-green/35" />
                    <span>{selectedStudent.studentDetails?.location || 'Bengaluru, India'}</span>
                  </div>
                </div>

                {/* Contact list */}
                <div className="space-y-3">
                  <h4 className="text-[10px] text-brand-gold uppercase tracking-wider font-extrabold">Contact details</h4>
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-brand-green/35" />
                      <span className="truncate">{selectedStudent.email}</span>
                    </div>
                    {selectedStudent.studentDetails?.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-brand-green/35" />
                        <span>{selectedStudent.studentDetails.phone}</span>
                      </div>
                    )}
                    {selectedStudent.studentDetails?.linkedin && (
                      <div className="flex items-center gap-2">
                        <LinkedinIcon className="w-4 h-4 text-brand-green/35" />
                        <span className="truncate">{selectedStudent.studentDetails.linkedin}</span>
                      </div>
                    )}
                    {selectedStudent.studentDetails?.github && (
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-brand-green/35 fill-current" viewBox="0 0 24 24">
                          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                        </svg>
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
                          className="bg-white border border-[#f2efdf] text-brand-green font-bold text-[10px] px-2.5 py-1 rounded-full shadow-2xs"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="italic text-brand-green/40">No skills added yet</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Center & Right Column - Bio & Detailed Timeline lists */}
              <div className="md:col-span-2 space-y-6">
                
                {/* About Candidate */}
                <div className="space-y-2">
                  <h4 className="text-[10px] text-brand-gold uppercase tracking-wider font-extrabold">Professional Bio</h4>
                  <p className="text-xs text-brand-green/75 leading-relaxed font-semibold bg-white border border-[#f2efdf] p-4 rounded-2xl shadow-2xs">
                    {selectedStudent.studentDetails?.about || "This candidate has not provided an extended bio yet."}
                  </p>
                </div>

                {/* Projects timeline */}
                <div className="space-y-3">
                  <h4 className="text-[10px] text-brand-gold uppercase tracking-wider font-extrabold">Projects & Achievements</h4>
                  <div className="space-y-3">
                    {selectedStudent.studentDetails?.projects && selectedStudent.studentDetails.projects.length > 0 ? (
                      selectedStudent.studentDetails.projects.map((proj, idx) => (
                        <div key={idx} className="bg-white border border-[#f2efdf] p-4.5 rounded-2xl shadow-2xs relative">
                          <span className="absolute right-4.5 top-4.5 text-[10px] text-brand-gold font-extrabold uppercase tracking-wider">
                            {proj.date}
                          </span>
                          <h5 className="font-serif text-sm font-bold text-brand-green pr-20">{proj.title}</h5>
                          <p className="text-xs text-brand-green/60 mt-1.5 leading-relaxed font-semibold">{proj.description}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 bg-white border border-[#f2efdf] rounded-2xl text-brand-green/40 font-medium">
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
                        <div key={idx} className="bg-white border border-[#f2efdf] p-4.5 rounded-2xl shadow-2xs flex justify-between items-start gap-4">
                          <div>
                            <h5 className="font-serif text-sm font-bold text-brand-green">{edu.school}</h5>
                            <p className="text-xs text-brand-green/60 mt-1 font-semibold">{edu.degree}</p>
                            <span className="text-[10px] text-brand-green/45 mt-1 block font-bold">{edu.duration}</span>
                          </div>
                          <span className="bg-emerald-50 border border-emerald-100 text-emerald-800 font-extrabold px-3 py-1 rounded-full text-[10px] tracking-wider uppercase shrink-0 shadow-2xs">
                            {edu.grade}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 bg-white border border-[#f2efdf] rounded-2xl text-brand-green/40 font-medium">
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
                        <div key={idx} className="bg-white border border-[#f2efdf] p-4 rounded-2xl shadow-2xs">
                          <h5 className="font-serif text-sm font-bold text-brand-green">{cert.title}</h5>
                          <p className="text-[11px] text-brand-green/65 mt-1 font-semibold">Issuer: {cert.issuer}</p>
                          <span className="text-[10px] text-brand-gold mt-1 block font-bold">{cert.date}</span>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 text-center py-4 bg-white border border-[#f2efdf] rounded-2xl text-brand-green/40 font-medium">
                        No certifications listed yet.
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
            
            {/* Footer buttons */}
            <div className="flex justify-end pt-4 border-t border-brand-green/5">
              <button 
                onClick={() => { setShowStudentProfileModal(false); setSelectedStudent(null); }}
                className="bg-[#022c22] hover:bg-brand-gold text-brand-cream hover:text-[#022c22] font-semibold text-xs py-2.5 px-6 rounded-xl transition-all cursor-pointer shadow-sm uppercase tracking-wider"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- INTERVIEW ACTION MODAL --- */}
      {showInterviewActionModal && selectedInterview && (
        <div className="fixed inset-0 bg-[#022c22]/30 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-brand-cream border border-[#f2efdf] max-w-xl w-full rounded-2xl p-6.5 space-y-6 shadow-2xl animate-fade-in-up max-h-[90vh] overflow-y-auto scrollbar-hide">
            <div className="flex justify-between items-center border-b border-brand-green/5 pb-4">
              <div>
                <h3 className="editorial-heading font-serif text-2xl font-bold text-brand-green">Manage Candidate Process</h3>
                <span className="text-[10px] text-brand-gold uppercase tracking-wider block font-extrabold mt-1">
                  Candidate: {selectedInterview.studentName} ({selectedInterview.round})
                </span>
              </div>
              <button 
                onClick={() => { setShowInterviewActionModal(false); setSelectedInterview(null); }} 
                className="text-brand-green/40 hover:text-brand-green p-1 transition-colors cursor-pointer"
              >
                <X className="w-5.5 h-5.5" />
              </button>
            </div>

            {/* Decision Pathways Choice */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => {
                  setSelectedInterview(prev => {
                    const copy = { ...prev };
                    delete copy.actionType;
                    return copy;
                  });
                  setIsLastStage(false);
                }}
                className={`flex flex-col items-center justify-center p-5 rounded-2xl border text-center transition-all cursor-pointer shadow-xs ${
                  selectedInterview.actionType !== 'eliminate'
                    ? 'bg-white border-brand-gold text-brand-green font-bold'
                    : 'bg-white/50 border-[#f2efdf] text-brand-green/60 hover:bg-white'
                }`}
              >
                <CheckCircle2 className={`w-8 h-8 mb-2.5 ${selectedInterview.actionType !== 'eliminate' ? 'text-brand-gold' : 'text-brand-green/30'}`} />
                <span className="text-sm font-serif block">Advance Candidate</span>
                <span className="text-[10px] opacity-70 mt-1 block">Move to next stage / place candidate</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedInterview(prev => ({ ...prev, actionType: 'eliminate' }));
                  setIsLastStage(false);
                }}
                className={`flex flex-col items-center justify-center p-5 rounded-2xl border text-center transition-all cursor-pointer shadow-xs ${
                  selectedInterview.actionType === 'eliminate'
                    ? 'bg-white border-red-500 text-red-700 font-bold'
                    : 'bg-white/50 border-[#f2efdf] text-brand-green/60 hover:bg-white'
                }`}
              >
                <X className={`w-8 h-8 mb-2.5 ${selectedInterview.actionType === 'eliminate' ? 'text-red-500' : 'text-brand-green/30'}`} />
                <span className="text-sm font-serif block">Eliminate Candidate</span>
                <span className="text-[10px] opacity-70 mt-1 block">Conclude loop & reject application</span>
              </button>
            </div>

            {/* Sub-form based on selection */}
            {selectedInterview.actionType === 'eliminate' ? (
              <div className="space-y-4 bg-red-50/50 border border-red-100 rounded-xl p-4.5">
                <div className="flex gap-3">
                  <AlertCircle className="w-5.5 h-5.5 text-red-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-red-800 font-semibold space-y-1">
                    <p className="font-bold">Warning: Candidate Elimination</p>
                    <p className="font-medium leading-relaxed">
                      This action will immediately mark the placement application for <strong>{selectedInterview.studentName}</strong> as <strong>Rejected</strong>. Any scheduled interview steps will be marked completed, and an email update will automatically notify the student.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 pt-4 border-t border-red-100/50 justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setShowInterviewActionModal(false);
                      setSelectedInterview(null);
                    }}
                    className="border border-brand-green/20 hover:bg-brand-green/5 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer text-brand-green"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleEliminateCandidate}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
                  >
                    Confirm Elimination
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleAdvanceCandidate} className="space-y-4 text-xs text-brand-green font-semibold">
                
                {/* Last Stage Placement Toggle */}
                <div className="bg-[#FAF7EE] border border-[#f2efdf] rounded-xl p-4 flex items-center justify-between shadow-xs">
                  <div>
                    <span className="font-bold text-brand-green text-sm block">Final Placement Round</span>
                    <span className="text-[11px] text-brand-green/55 font-medium block mt-0.5">Toggling this marks candidate as Placed immediately!</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setIsLastStage(!isLastStage)}
                    className={`px-3.5 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-wider shadow-xs transition-all border cursor-pointer ${
                      isLastStage
                        ? 'bg-[#e2efe0] border-[#bccbc4] text-[#022c22]'
                        : 'bg-[#f4f3ea] border-[#d5d4c9] text-brand-green/55'
                    }`}
                  >
                    {isLastStage ? 'Active (Placed)' : 'Inactive'}
                  </button>
                </div>

                {isLastStage ? (
                  <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 flex gap-3 text-emerald-800">
                    <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-bold text-xs">Conclude & Extend Placement Offer</p>
                      <p className="font-medium text-[11px] leading-relaxed">
                        By confirming, you certify that <strong>{selectedInterview.studentName}</strong> has passed all interview evaluation stages. The candidate will be marked as <strong>Placed</strong> at <strong>{companyName}</strong>, and an official congratulations alert will be dispatched to their dashboard.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-extrabold mb-1.5">Next Interview Round</label>
                      <select
                        value={nextStageRound}
                        onChange={(e) => setNextStageRound(e.target.value)}
                        className="w-full p-3 bg-white border border-[#f2efdf] rounded-xl focus:outline-none focus:border-brand-gold"
                      >
                        <option value="Technical Interview 2">Technical Interview 2</option>
                        <option value="System Design Round">System Design Round</option>
                        <option value="HR / Cultural Fitment">HR / Cultural Fitment</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-extrabold mb-1.5">Interview Date</label>
                      <input
                        type="date"
                        required
                        value={nextStageDate}
                        onChange={(e) => setNextStageDate(e.target.value)}
                        className="w-full p-3 bg-white border border-[#f2efdf] rounded-xl focus:outline-none focus:border-brand-gold"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-extrabold mb-1.5">Available Time Slot</label>
                      <select
                        value={nextStageSlot}
                        onChange={(e) => setNextStageSlot(e.target.value)}
                        className="w-full p-3 bg-white border border-[#f2efdf] rounded-xl focus:outline-none focus:border-brand-gold"
                      >
                        <option value="1">Slot 1: Morning (09:00 AM - 12:00 PM)</option>
                        <option value="2">Slot 2: Afternoon (02:00 PM - 05:00 PM)</option>
                        <option value="3">Slot 3: Evening (06:00 PM - 09:00 PM)</option>
                      </select>
                    </div>

                    {/* Real-time panel validation alert */}
                    {(() => {
                      if (!nextStageDate) return null;
                      const day = getDayOfWeek(nextStageDate);
                      if (day === 'Saturday' || day === 'Sunday') {
                        return (
                          <div className="flex items-center gap-2 text-amber-700 bg-amber-50 border border-amber-100 rounded-xl p-3 text-[10px] leading-relaxed">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>Weekend Selected: Interviews must be scheduled on weekdays (Monday to Friday).</span>
                          </div>
                        );
                      }
                      const available = getAvailablePanels(nextStageDate, nextStageSlot);
                      if (available.length < 2) {
                        return (
                          <div className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-100 rounded-xl p-3 text-[10px] leading-relaxed">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>
                              ⚠️ Insufficient Panels: Selected slot requires &ge; 2 available panel members. Currently available in this slot: <strong>{available.length}</strong> ({available.map(p => p.name).join(', ') || 'None'}).
                            </span>
                          </div>
                        );
                      }
                      return (
                        <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-[10px] leading-relaxed">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>
                            ✓ Double-Panel Confirmed: <strong>{available.length}</strong> panel members available ({available.map(p => p.name).join(', ')}).
                          </span>
                        </div>
                      );
                    })()}

                    <div>
                      <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-extrabold mb-1.5">Interview Mode</label>
                      <input
                        type="text"
                        value={nextStageMode}
                        onChange={(e) => setNextStageMode(e.target.value)}
                        className="w-full p-3 bg-white border border-[#f2efdf] rounded-xl focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-extrabold mb-1.5">Virtual Conference Link</label>
                      <input
                        type="text"
                        value={nextStageLink}
                        onChange={(e) => setNextStageLink(e.target.value)}
                        className="w-full p-3 bg-white border border-[#f2efdf] rounded-xl focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-4 pt-4 border-t border-brand-green/5 justify-end">
                  <button
                    type="button"
                    onClick={() => { setShowInterviewActionModal(false); setSelectedInterview(null); }}
                    className="border border-brand-green/20 hover:bg-brand-green/5 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#022c22] hover:bg-brand-gold text-brand-cream hover:text-[#022c22] px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
                  >
                    {isLastStage ? 'Confirm Placement' : 'Schedule Next Round'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* --- CTC CONFIRMATION MODAL (Placement) --- */}
      {showCtcModal && ctcPendingInterview && (
        <div className="fixed inset-0 bg-[#022c22]/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-brand-cream border border-[#f2efdf] max-w-md w-full rounded-2xl shadow-2xl animate-fade-in-up overflow-hidden">
            {/* Modal Header */}
            <div className="bg-[#022c22] px-6 py-5 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-brand-gold text-lg">🎉</span>
                  <h3 className="font-serif text-lg font-bold text-white">Confirm Placement</h3>
                </div>
                <p className="text-white/60 text-xs font-medium">
                  Enter the offered CTC for <span className="text-brand-gold font-bold">{ctcPendingInterview.studentName}</span>
                </p>
              </div>
              <button
                onClick={() => { setShowCtcModal(false); setCtcPendingInterview(null); }}
                className="text-white/40 hover:text-white p-1.5 hover:bg-white/10 rounded-full transition-colors cursor-pointer mt-0.5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCtcConfirm} className="p-6 space-y-5">
              {/* Candidate Info Summary */}
              <div className="bg-white border border-brand-green/5 rounded-xl p-4 flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-[#022c22] text-brand-gold font-serif font-bold text-lg flex items-center justify-center shrink-0 shadow-sm">
                  {ctcPendingInterview.studentName?.charAt(0) || 'S'}
                </div>
                <div>
                  <p className="font-bold text-brand-green text-sm">{ctcPendingInterview.studentName}</p>
                  <p className="text-[11px] text-text-secondary font-medium">
                    {ctcPendingInterview.round} · Final Round
                  </p>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full inline-block mt-1">
                    ✓ Cleared all rounds
                  </span>
                </div>
              </div>

              {/* CTC Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold text-brand-green/60 uppercase tracking-widest block">
                  Offered CTC Package
                </label>

                {/* Type Toggle */}
                <div className="flex gap-2 mb-3">
                  {['LPA', 'Monthly'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setCtcType(type)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        ctcType === type
                          ? 'bg-[#022c22] text-brand-gold border-[#022c22] shadow-sm'
                          : 'bg-white border-brand-green/10 text-brand-green/60 hover:border-brand-green/30'
                      }`}
                    >
                      {type === 'LPA' ? '₹ LPA (Annual)' : '₹ k/month'}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-green font-bold text-sm">₹</span>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={ctcValue}
                    onChange={(e) => setCtcValue(e.target.value)}
                    placeholder={ctcType === 'LPA' ? 'e.g. 12.5' : 'e.g. 85'}
                    required
                    className="w-full bg-white border border-brand-green/15 rounded-xl py-3 pl-9 pr-16 text-sm font-bold text-brand-green focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-extrabold text-brand-green/40 uppercase tracking-wider">
                    {ctcType === 'LPA' ? 'LPA' : 'K/MO'}
                  </span>
                </div>

                {ctcValue && (
                  <p className="text-[11px] text-brand-gold font-bold text-center pt-1">
                    Offering: ₹{ctcValue} {ctcType === 'LPA' ? 'LPA' : 'k/month'}
                    {ctcType === 'Monthly' && ctcValue ? ` (~₹${(parseFloat(ctcValue) * 12 / 100).toFixed(1)} LPA)` : ''}
                  </p>
                )}
              </div>

              {/* Extra Placement Parameters */}
              <div className="bg-white border border-brand-green/5 rounded-xl p-4.5 space-y-3">
                <span className="text-[9px] font-extrabold text-brand-green/60 uppercase tracking-widest block border-b border-brand-green/5 pb-1.5">
                  Placement Telemetry Tags
                </span>
                <div className="space-y-3.5 text-xs text-brand-green font-semibold">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isInternational}
                      onChange={(e) => setIsInternational(e.target.checked)}
                      className="w-4 h-4 accent-[#022c22] rounded cursor-pointer"
                    />
                    <div>
                      <span className="block leading-tight font-bold">International Offer</span>
                      <span className="block text-[10px] text-text-secondary/70 font-medium">Hired for a global/foreign office location</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPpo}
                      onChange={(e) => setIsPpo(e.target.checked)}
                      className="w-4 h-4 accent-[#022c22] rounded cursor-pointer"
                    />
                    <div>
                      <span className="block leading-tight font-bold">Pre-Placement Offer (PPO)</span>
                      <span className="block text-[10px] text-text-secondary/70 font-medium">Converted via internship performance</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasMultipleOffers}
                      onChange={(e) => setHasMultipleOffers(e.target.checked)}
                      className="w-4 h-4 accent-[#022c22] rounded cursor-pointer"
                    />
                    <div>
                      <span className="block leading-tight font-bold">Multiple Offers</span>
                      <span className="block text-[10px] text-text-secondary/70 font-medium">Candidate holds another offer in this cycle</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Disclaimer */}
              <p className="text-[10px] text-text-secondary leading-relaxed bg-white border border-brand-green/5 p-3 rounded-xl">
                By confirming, this CTC and telemetry tags will be recorded in the placement reports and the student will be congratulated.
              </p>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowCtcModal(false); setCtcPendingInterview(null); }}
                  className="flex-1 border border-brand-green/20 hover:bg-brand-green/5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={ctcSubmitting || !ctcValue.trim()}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm ${
                    ctcSubmitting || !ctcValue.trim()
                      ? 'bg-brand-green/40 text-white cursor-not-allowed'
                      : 'bg-[#022c22] hover:bg-brand-gold text-brand-cream hover:text-[#022c22]'
                  }`}
                >
                  {ctcSubmitting ? 'Confirming…' : '✓ Confirm & Place'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD JOB MODAL --- */}
      {showAddJobModal && (
        <div className="fixed inset-0 bg-[#022c22]/30 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-brand-cream border border-[#f2efdf] max-w-xl w-full rounded-2xl p-6.5 space-y-6 shadow-2xl animate-fade-in-up max-h-[90vh] overflow-y-auto scrollbar-hide">
            <div className="flex justify-between items-center border-b border-brand-green/5 pb-4">
              <h3 className="editorial-heading font-serif text-2xl font-bold text-brand-green">Post a New Job Role</h3>
              <button onClick={() => setShowAddJobModal(false)} className="text-brand-green/40 hover:text-brand-green p-1 transition-colors">
                <X className="w-5.5 h-5.5" />
              </button>
            </div>

            <form onSubmit={handlePostJob} className="space-y-4.5 text-xs text-brand-green font-semibold">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-extrabold mb-1.5">Role Title</label>
                  <select
                    required
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full p-3 bg-white border border-[#f2efdf] rounded-xl focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all"
                  >
                    {hiringRolesList.map(item => (
                      <option key={item.title} value={item.title}>{item.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-extrabold mb-1.5">Office Location</label>
                  <input
                    type="text"
                    value={jobLocation}
                    onChange={(e) => setJobLocation(e.target.value)}
                    className="w-full p-3 bg-white border border-[#f2efdf] rounded-xl focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-extrabold mb-1.5">Role Type</label>
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    className="w-full p-3 bg-white border border-[#f2efdf] rounded-xl focus:outline-none focus:border-brand-gold"
                  >
                    <option value="Internship">Internship</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-extrabold mb-1.5">Application Deadline</label>
                  <input
                    type="date"
                    required
                    value={jobDeadline}
                    onChange={(e) => setJobDeadline(e.target.value)}
                    className="w-full p-3 bg-white border border-[#f2efdf] rounded-xl focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-extrabold mb-1.5">Compensation Package</label>
                  <input
                    type="text"
                    value={jobSalary}
                    onChange={(e) => setJobSalary(e.target.value)}
                    className="w-full p-3 bg-white border border-[#f2efdf] rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-extrabold mb-1.5">Duration</label>
                  <input
                    type="text"
                    value={jobDuration}
                    onChange={(e) => setJobDuration(e.target.value)}
                    className="w-full p-3 bg-white border border-[#f2efdf] rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-extrabold mb-1.5">Eligibility Criteria</label>
                  <select
                    required
                    value={jobEligibility}
                    onChange={(e) => setJobEligibility(e.target.value)}
                    className="w-full p-3 bg-white border border-[#f2efdf] rounded-xl focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all"
                  >
                    {(eligibilityList && eligibilityList.length > 0 ? eligibilityList : [
                      { _id: 'std', title: 'Standard Tech', detail: 'CGPA > 8.0, CSE/ECE/EEE' },
                      { _id: 'prem', title: 'Premium Tech', detail: 'CGPA > 8.5, top quartile' },
                      { _id: 'res', title: 'Research', detail: 'CGPA > 9.0, 1 publication' },
                      { _id: 'des', title: 'Design', detail: 'Portfolio required' },
                      { _id: 'mba', title: 'MBA', detail: 'CGPA > 7.5, 1 internship' }
                    ]).map(pack => (
                      <option key={pack._id} value={pack.detail}>{pack.title} ({pack.detail})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-extrabold mb-1.5">Required Skills (Comma separated)</label>
                <input
                  type="text"
                  placeholder="React, Node.js, Algorithms"
                  value={jobSkills}
                  onChange={(e) => setJobSkills(e.target.value)}
                  className="w-full p-3 bg-white border border-[#f2efdf] rounded-xl"
                />
              </div>

              <div>
                <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-extrabold mb-1.5">Role Description</label>
                <textarea
                  rows="3.5"
                  required
                  placeholder="Detail the core software stack, key expectations, and day-to-day internship responsibilities..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full p-3 bg-white border border-[#f2efdf] rounded-xl focus:outline-none focus:border-brand-gold"
                ></textarea>
              </div>

              <div className="flex gap-4 pt-4 border-t border-brand-green/5 justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddJobModal(false)}
                  className="border border-brand-green/20 hover:bg-brand-green/5 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#022c22] hover:bg-brand-gold text-brand-cream hover:text-[#022c22] px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- SCHEDULE INTERVIEW MODAL --- */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-[#022c22]/30 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-brand-cream border border-[#f2efdf] max-w-md w-full rounded-2xl p-6.5 space-y-6 shadow-2xl animate-fade-in-up max-h-[90vh] overflow-y-auto scrollbar-hide">
            <div className="flex justify-between items-center border-b border-brand-green/5 pb-4">
              <div>
                <h3 className="editorial-heading font-serif text-2xl font-bold text-brand-green">Schedule Interview</h3>
                {selectedApp && (
                  <span className="text-[10px] text-brand-gold uppercase tracking-wider block font-extrabold mt-1">Candidate: {selectedApp.studentName}</span>
                )}
              </div>
              <button onClick={() => { setShowScheduleModal(false); setSelectedApp(null); }} className="text-brand-green/40 hover:text-brand-green p-1 transition-colors">
                <X className="w-5.5 h-5.5" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-4 text-xs text-brand-green font-semibold">
              {!selectedApp && (
                <div>
                  <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-extrabold mb-1.5">Select Candidate</label>
                  <select
                    required
                    onChange={(e) => {
                      const found = allApplicants.find(a => a.id === e.target.value);
                      setSelectedApp(found || null);
                    }}
                    value={selectedApp ? selectedApp.id : ''}
                    className="w-full p-3 bg-white border border-[#f2efdf] rounded-xl focus:outline-none focus:border-brand-gold text-xs text-brand-green font-semibold"
                  >
                    <option value="">-- Choose Candidate --</option>
                    {allApplicants
                      .filter(a => ['Applied', 'Shortlisted', 'Interview'].includes(a.status))
                      .map(a => (
                        <option key={a.id} value={a.id}>
                          {a.studentName} — {a.jobTitle} ({a.status})
                        </option>
                      ))
                    }
                  </select>
                </div>
              )}

              <div>
                <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-extrabold mb-1.5">Interview Round</label>
                <select
                  value={intRound}
                  onChange={(e) => setIntRound(e.target.value)}
                  className="w-full p-3 bg-white border border-[#f2efdf] rounded-xl focus:outline-none focus:border-brand-gold"
                >
                  <option value="Technical Interview 1">Technical Interview 1</option>
                  <option value="Technical Interview 2">Technical Interview 2</option>
                  <option value="System Design Round">System Design Round</option>
                  <option value="HR / Cultural Fitment">HR / Cultural Fitment</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-extrabold mb-1.5">Interview Date</label>
                <input
                  type="date"
                  required
                  value={intDate}
                  onChange={(e) => setIntDate(e.target.value)}
                  className="w-full p-3 bg-white border border-[#f2efdf] rounded-xl focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-extrabold mb-1.5">Available Time Slot</label>
                <select
                  value={intSlot}
                  onChange={(e) => setIntSlot(e.target.value)}
                  className="w-full p-3 bg-white border border-[#f2efdf] rounded-xl focus:outline-none focus:border-brand-gold"
                >
                  <option value="1">Slot 1: Morning (09:00 AM - 12:00 PM)</option>
                  <option value="2">Slot 2: Afternoon (02:00 PM - 05:00 PM)</option>
                  <option value="3">Slot 3: Evening (06:00 PM - 09:00 PM)</option>
                </select>
              </div>

              {/* Real-time panel validation alert */}
              {(() => {
                if (!intDate) return null;
                const day = getDayOfWeek(intDate);
                if (day === 'Saturday' || day === 'Sunday') {
                  return (
                    <div className="flex items-center gap-2 text-amber-700 bg-amber-50 border border-amber-100 rounded-xl p-3 text-[10px] leading-relaxed">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>Weekend Selected: Interviews must be scheduled on weekdays (Monday to Friday).</span>
                    </div>
                  );
                }
                const available = getAvailablePanels(intDate, intSlot);
                if (available.length < 2) {
                  return (
                    <div className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-100 rounded-xl p-3 text-[10px] leading-relaxed">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>
                        ⚠️ Insufficient Panels: Selected slot requires &ge; 2 available panel members. Currently available in this slot: <strong>{available.length}</strong> ({available.map(p => p.name).join(', ') || 'None'}).
                      </span>
                    </div>
                  );
                }
                return (
                  <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-[10px] leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>
                      ✓ Double-Panel Confirmed: <strong>{available.length}</strong> panel members available ({available.map(p => p.name).join(', ')}).
                    </span>
                  </div>
                );
              })()}

              <div>
                <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-extrabold mb-1.5">Interview Mode</label>
                <input
                  type="text"
                  value={intMode}
                  onChange={(e) => setIntMode(e.target.value)}
                  className="w-full p-3 bg-white border border-[#f2efdf] rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-extrabold mb-1.5">Virtual Conference Link</label>
                <input
                  type="text"
                  value={intLink}
                  onChange={(e) => setIntLink(e.target.value)}
                  className="w-full p-3 bg-white border border-[#f2efdf] rounded-xl focus:outline-none"
                />
              </div>

              <div className="flex gap-4 pt-4 border-t border-brand-green/5 justify-end">
                <button
                  type="button"
                  onClick={() => { setShowScheduleModal(false); setSelectedApp(null); }}
                  className="border border-brand-green/20 hover:bg-brand-green/5 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#022c22] hover:bg-brand-gold text-brand-cream hover:text-[#022c22] px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
                >
                  Set Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- EDIT PROFILE MODAL --- */}
      {showEditProfileModal && (
        <div className="fixed inset-0 bg-[#022c22]/30 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-brand-cream border border-[#f2efdf] max-w-xl w-full rounded-2xl p-6.5 space-y-6 shadow-2xl animate-fade-in-up max-h-[90vh] overflow-y-auto scrollbar-hide">
            <div className="flex justify-between items-center border-b border-brand-green/5 pb-4">
              <h3 className="editorial-heading font-serif text-2xl font-bold text-brand-green">Edit Company Profile</h3>
              <button onClick={() => setShowEditProfileModal(false)} className="text-brand-green/40 hover:text-brand-green p-1 transition-colors">
                <X className="w-5.5 h-5.5" />
              </button>
            </div>

            <form onSubmit={handleProfileSave} className="space-y-4 text-xs text-brand-green font-semibold">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-extrabold mb-1.5">Company Name</label>
                  <input
                    type="text"
                    required
                    value={profileForm.company}
                    onChange={(e) => setProfileForm({ ...profileForm, company: e.target.value })}
                    className="w-full p-3 bg-white border border-[#f2efdf] rounded-xl focus:outline-none focus:border-brand-gold"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-extrabold mb-1.5">Corporate Tagline</label>
                  <input
                    type="text"
                    value={profileForm.tagline}
                    onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
                    className="w-full p-3 bg-white border border-[#f2efdf] rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-extrabold mb-1.5">About the Company</label>
                <textarea
                  rows="3"
                  value={profileForm.about}
                  onChange={(e) => setProfileForm({ ...profileForm, about: e.target.value })}
                  className="w-full p-3 bg-white border border-[#f2efdf] rounded-xl focus:outline-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-extrabold mb-1.5">Locations</label>
                  <input
                    type="text"
                    value={profileForm.location}
                    onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                    className="w-full p-3 bg-white border border-[#f2efdf] rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-extrabold mb-1.5">Website</label>
                  <input
                    type="text"
                    value={profileForm.website}
                    onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })}
                    className="w-full p-3 bg-white border border-[#f2efdf] rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-extrabold mb-1.5">Linkedin Handle</label>
                  <input
                    type="text"
                    value={profileForm.linkedin}
                    onChange={(e) => setProfileForm({ ...profileForm, linkedin: e.target.value })}
                    className="w-full p-3 bg-white border border-[#f2efdf] rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-extrabold mb-1.5">Industry</label>
                  <input
                    type="text"
                    value={profileForm.industry}
                    onChange={(e) => setProfileForm({ ...profileForm, industry: e.target.value })}
                    className="w-full p-3 bg-white border border-[#f2efdf] rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-extrabold mb-1.5">Company Size</label>
                  <input
                    type="text"
                    value={profileForm.companySize}
                    onChange={(e) => setProfileForm({ ...profileForm, companySize: e.target.value })}
                    className="w-full p-3 bg-white border border-[#f2efdf] rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-extrabold mb-1.5">Contact Email</label>
                  <input
                    type="email"
                    value={profileForm.contactEmail}
                    onChange={(e) => setProfileForm({ ...profileForm, contactEmail: e.target.value })}
                    className="w-full p-3 bg-white border border-[#f2efdf] rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-extrabold mb-1.5">Contact Phone</label>
                  <input
                    type="text"
                    value={profileForm.contactPhone}
                    onChange={(e) => setProfileForm({ ...profileForm, contactPhone: e.target.value })}
                    className="w-full p-3 bg-white border border-[#f2efdf] rounded-xl"
                    placeholder="e.g. +91 98765 43210"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-extrabold mb-1.5">Contact Address</label>
                  <input
                    type="text"
                    value={profileForm.contactAddress}
                    onChange={(e) => setProfileForm({ ...profileForm, contactAddress: e.target.value })}
                    className="w-full p-3 bg-white border border-[#f2efdf] rounded-xl"
                    placeholder="e.g. Prestige Tech Park, Bengaluru"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-extrabold mb-1.5">Tech Stack (Comma-separated)</label>
                <input
                  type="text"
                  value={profileForm.techStack}
                  onChange={(e) => setProfileForm({ ...profileForm, techStack: e.target.value })}
                  className="w-full p-3 bg-white border border-[#f2efdf] rounded-xl"
                />
              </div>

              <div className="flex gap-4 pt-4 border-t border-brand-green/5 justify-end">
                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(false)}
                  className="border border-brand-green/20 hover:bg-brand-green/5 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#022c22] hover:bg-brand-gold text-brand-cream hover:text-[#022c22] px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- EDIT HIRING ROLES MODAL --- */}
      {showEditHiringModal && (
        <div className="fixed inset-0 bg-[#022c22]/30 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-brand-cream border border-[#f2efdf] max-w-xl w-full rounded-2xl p-6.5 space-y-6 shadow-2xl animate-fade-in-up max-h-[90vh] overflow-y-auto scrollbar-hide">
            <div className="flex justify-between items-center border-b border-brand-green/5 pb-4">
              <div>
                <h3 className="editorial-heading font-serif text-2xl font-bold text-brand-green">What We Hire For</h3>
                <p className="text-[10px] text-brand-gold uppercase tracking-wider font-extrabold mt-1">Configure your hiring roles & categories</p>
              </div>
              <button onClick={() => setShowEditHiringModal(false)} className="text-brand-green/40 hover:text-brand-green p-1 transition-colors">
                <X className="w-5.5 h-5.5" />
              </button>
            </div>

            <form onSubmit={handleHiringSave} className="space-y-4.5 text-xs text-brand-green font-semibold">
              <div className="max-h-[320px] overflow-y-auto pr-2 space-y-4 no-scrollbar">
                {hiringFormList.map((item, idx) => (
                  <div key={idx} className="bg-white border border-[#f2efdf] rounded-xl p-4 space-y-3 relative">
                    <button
                      type="button"
                      onClick={() => setHiringFormList(hiringFormList.filter((_, i) => i !== idx))}
                      className="absolute right-3 top-3 text-red-500 hover:text-red-700 font-bold p-1 cursor-pointer text-base"
                      title="Remove category"
                    >
                      &times;
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mr-6">
                      <div className="space-y-1">
                        <label className="text-[9px] text-brand-gold uppercase tracking-wider block font-extrabold">Role Title</label>
                        <input
                          type="text"
                          required
                          value={item.title}
                          onChange={(e) => {
                            const newForm = [...hiringFormList];
                            newForm[idx].title = e.target.value;
                            setHiringFormList(newForm);
                          }}
                          placeholder="e.g. Software Engineering"
                          className="w-full p-2.5 bg-brand-cream/20 border border-[#f2efdf] rounded-lg focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] text-brand-gold uppercase tracking-wider block font-extrabold">Description / Details</label>
                        <input
                          type="text"
                          required
                          value={item.desc}
                          onChange={(e) => {
                            const newForm = [...hiringFormList];
                            newForm[idx].desc = e.target.value;
                            setHiringFormList(newForm);
                          }}
                          placeholder="e.g. Backend, infra, data platform"
                          className="w-full p-2.5 bg-brand-cream/20 border border-[#f2efdf] rounded-lg focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {hiringFormList.length === 0 && (
                  <p className="text-center py-4 text-brand-green/45 italic font-medium">No categories added yet. Click Add below to configure a category.</p>
                )}
              </div>

              <div className="flex justify-between items-center border-t border-brand-green/5 pt-4">
                <button
                  type="button"
                  onClick={() => setHiringFormList([...hiringFormList, { title: '', desc: '' }])}
                  className="bg-[#FAF7EE] border border-[#022c22]/15 text-[#022c22] hover:bg-white text-xs font-bold px-4 py-2.5 rounded-xl uppercase tracking-wider transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Category
                </button>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowEditHiringModal(false)}
                    className="border border-brand-green/20 hover:bg-brand-green/5 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#022c22] hover:bg-brand-gold text-brand-cream hover:text-[#022c22] px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
                  >
                    Save Roles
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* --- EDIT JOB MODAL --- */}
      {showEditJobModal && editingJob && (
        <div className="fixed inset-0 bg-[#022c22]/30 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-brand-cream border border-[#f2efdf] max-w-xl w-full rounded-2xl p-6.5 space-y-6 shadow-2xl animate-fade-in-up max-h-[90vh] overflow-y-auto scrollbar-hide">
            <div className="flex justify-between items-center border-b border-brand-green/5 pb-4">
              <h3 className="editorial-heading font-serif text-2xl font-bold text-brand-green">Modify Job Posting</h3>
              <button onClick={() => { setShowEditJobModal(false); setEditingJob(null); }} className="text-brand-green/40 hover:text-brand-green p-1 transition-colors">
                <X className="w-5.5 h-5.5" />
              </button>
            </div>

            <form onSubmit={handleEditJobSubmit} className="space-y-4.5 text-xs text-brand-green font-semibold">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-extrabold mb-1.5">Role Title</label>
                  <select
                    required
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full p-3 bg-white border border-[#f2efdf] rounded-xl focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all"
                  >
                    {hiringRolesList.map(item => (
                      <option key={item.title} value={item.title}>{item.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-extrabold mb-1.5">Office Location</label>
                  <input
                    type="text"
                    value={jobLocation}
                    onChange={(e) => setJobLocation(e.target.value)}
                    className="w-full p-3 bg-white border border-[#f2efdf] rounded-xl focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-extrabold mb-1.5">Role Type</label>
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    className="w-full p-3 bg-white border border-[#f2efdf] rounded-xl focus:outline-none focus:border-brand-gold"
                  >
                    <option value="Internship">Internship</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-extrabold mb-1.5">Application Deadline</label>
                  <input
                    type="date"
                    required
                    value={jobDeadline}
                    onChange={(e) => setJobDeadline(e.target.value)}
                    className="w-full p-3 bg-white border border-[#f2efdf] rounded-xl focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-extrabold mb-1.5">Compensation Package</label>
                  <input
                    type="text"
                    value={jobSalary}
                    onChange={(e) => setJobSalary(e.target.value)}
                    className="w-full p-3 bg-white border border-[#f2efdf] rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-extrabold mb-1.5">Duration</label>
                  <input
                    type="text"
                    value={jobDuration}
                    onChange={(e) => setJobDuration(e.target.value)}
                    className="w-full p-3 bg-white border border-[#f2efdf] rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-extrabold mb-1.5">Eligibility Criteria</label>
                  <select
                    required
                    value={jobEligibility}
                    onChange={(e) => setJobEligibility(e.target.value)}
                    className="w-full p-3 bg-white border border-[#f2efdf] rounded-xl focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all"
                  >
                    {(eligibilityList && eligibilityList.length > 0 ? eligibilityList : [
                      { _id: 'std', title: 'Standard Tech', detail: 'CGPA > 8.0, CSE/ECE/EEE' },
                      { _id: 'prem', title: 'Premium Tech', detail: 'CGPA > 8.5, top quartile' },
                      { _id: 'res', title: 'Research', detail: 'CGPA > 9.0, 1 publication' },
                      { _id: 'des', title: 'Design', detail: 'Portfolio required' },
                      { _id: 'mba', title: 'MBA', detail: 'CGPA > 7.5, 1 internship' }
                    ]).map(pack => (
                      <option key={pack._id} value={pack.detail}>{pack.title} ({pack.detail})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-extrabold mb-1.5">Required Skills (Comma separated)</label>
                <input
                  type="text"
                  placeholder="React, Node.js, Algorithms"
                  value={jobSkills}
                  onChange={(e) => setJobSkills(e.target.value)}
                  className="w-full p-3 bg-white border border-[#f2efdf] rounded-xl"
                />
              </div>

              <div>
                <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-extrabold mb-1.5">Role Description</label>
                <textarea
                  rows="3.5"
                  required
                  placeholder="Detail the core software stack, key expectations, and responsibilities..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full p-3 bg-white border border-[#f2efdf] rounded-xl focus:outline-none focus:border-brand-gold"
                ></textarea>
              </div>

              <div className="flex gap-4 pt-4 border-t border-brand-green/5 justify-end">
                <button
                  type="button"
                  onClick={() => { setShowEditJobModal(false); setEditingJob(null); }}
                  className="border border-brand-green/20 hover:bg-brand-green/5 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#022c22] hover:bg-brand-gold text-brand-cream hover:text-[#022c22] px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- JOB DETAILS VIEW MODAL --- */}
      {showJobDetailsModal && selectedJobForDetails && (
        <div className="fixed inset-0 bg-[#022c22]/30 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-brand-cream border border-[#f2efdf] max-w-2xl w-full rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl animate-fade-in-up max-h-[90vh] overflow-y-auto scrollbar-hide">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-brand-green/5 pb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#022c22] text-brand-cream flex items-center justify-center text-2xl font-bold font-serif shadow-inner">
                  {selectedJobForDetails.company ? selectedJobForDetails.company[0].toUpperCase() : 'J'}
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-bold text-brand-green">{selectedJobForDetails.title}</h3>
                  <p className="text-xs text-brand-gold uppercase tracking-wider font-extrabold mt-1">
                    {selectedJobForDetails.company} · {selectedJobForDetails.type}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => { setShowJobDetailsModal(false); setSelectedJobForDetails(null); }} 
                className="text-brand-green/40 hover:text-brand-green p-1.5 hover:bg-[#022c22]/5 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white border border-[#f2efdf] p-4 rounded-xl shadow-2xs">
                <span className="text-[9px] text-brand-gold uppercase tracking-wider font-extrabold block">Location</span>
                <span className="text-xs font-bold text-brand-green block mt-1">{selectedJobForDetails.location}</span>
              </div>
              <div className="bg-white border border-[#f2efdf] p-4 rounded-xl shadow-2xs">
                <span className="text-[9px] text-brand-gold uppercase tracking-wider font-extrabold block">Compensation</span>
                <span className="text-xs font-bold text-brand-green block mt-1">{selectedJobForDetails.salary || 'N/A'}</span>
              </div>
              <div className="bg-white border border-[#f2efdf] p-4 rounded-xl shadow-2xs">
                <span className="text-[9px] text-brand-gold uppercase tracking-wider font-extrabold block">Duration</span>
                <span className="text-xs font-bold text-brand-green block mt-1">{selectedJobForDetails.duration || 'N/A'}</span>
              </div>
              <div className="bg-white border border-[#f2efdf] p-4 rounded-xl shadow-2xs">
                <span className="text-[9px] text-brand-gold uppercase tracking-wider font-extrabold block">Deadline</span>
                <span className="text-xs font-bold text-brand-green block mt-1">{selectedJobForDetails.deadline || 'N/A'}</span>
              </div>
            </div>

            {/* Eligibility & Skills */}
            <div className="space-y-4">
              <div className="bg-white border border-[#f2efdf] p-4.5 rounded-2xl shadow-2xs space-y-2">
                <span className="text-[9px] text-brand-gold uppercase tracking-wider font-extrabold block">Eligibility Criteria</span>
                <p className="text-xs text-brand-green font-bold">{selectedJobForDetails.eligibility || 'None specified'}</p>
              </div>

              <div className="space-y-2">
                <span className="text-[9px] text-brand-gold uppercase tracking-wider font-extrabold block">Required Skill Assets</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedJobForDetails.skills && selectedJobForDetails.skills.length > 0 ? (
                    selectedJobForDetails.skills.map((skill) => (
                      <span key={skill} className="bg-white border border-[#f2efdf] text-brand-green font-bold text-[10px] px-3 py-1 rounded-full shadow-2xs">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="italic text-brand-green/45 text-xs">No explicit skills required</span>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <span className="text-[9px] text-brand-gold uppercase tracking-wider font-extrabold block">Role Description</span>
              <p className="text-xs text-brand-green/75 leading-relaxed font-semibold bg-white border border-[#f2efdf] p-5 rounded-2xl shadow-2xs whitespace-pre-wrap">
                {selectedJobForDetails.description || 'No description provided.'}
              </p>
            </div>

            {/* Footer */}
            <div className="flex justify-end pt-4 border-t border-brand-green/5">
              <button 
                onClick={() => { setShowJobDetailsModal(false); setSelectedJobForDetails(null); }}
                className="bg-[#022c22] hover:bg-brand-gold text-brand-cream hover:text-[#022c22] font-semibold text-xs py-2.5 px-6 rounded-xl transition-all cursor-pointer shadow-sm uppercase tracking-wider"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- APPLICATION TIMELINE POPUP MODAL --- */}
      {showApplicationDetailsModal && selectedApplicationDetails && (() => {
        const app = selectedApplicationDetails;
        const job = jobs.find(j => j.id === app.jobId);
        
        // Define timeline events list
        const events = [];
        
        // 1. Application Submitted
        events.push({
          date: app.appliedDate || 'N/A',
          title: 'Application Submitted',
          status: 'Applied',
          result: 'Successfully Received',
          type: 'submission',
          badgeStyles: 'bg-amber-50 text-amber-700 border border-amber-100'
        });

        // 2. Interviews matching jobId and studentEmail
        const matchingInterviews = interviews.filter(
          int => int.studentEmail.toLowerCase() === app.studentEmail.toLowerCase() && int.jobId === app.jobId
        );

        matchingInterviews.forEach((int) => {
          let badgeStyles = 'bg-gray-50 text-gray-700 border border-gray-100';
          if (int.status === 'Completed') {
            if (int.result === 'Placed' || int.result === 'Next Round') {
              badgeStyles = 'bg-emerald-50 text-emerald-700 border border-emerald-100';
            } else if (int.result === 'Eliminated') {
              badgeStyles = 'bg-red-50 text-red-700 border border-red-100';
            } else {
              badgeStyles = 'bg-teal-50 text-teal-700 border border-teal-100';
            }
          } else if (int.status === 'Scheduled') {
            badgeStyles = 'bg-amber-50 text-[#b38b3f] border border-amber-100';
          }

          events.push({
            date: int.dateTime || 'N/A',
            title: int.round || 'Interview Round',
            status: int.status || 'Scheduled',
            result: int.result || 'Pending Result',
            type: 'interview',
            badgeStyles
          });
        });

        // 3. Final Offer / Selection / Rejection status if matches
        if (app.status === 'Offer' || app.status === 'Selected') {
          events.push({
            date: 'Recent',
            title: 'Offer Extended 🎉',
            status: app.status,
            result: 'Selected for Role',
            type: 'outcome',
            badgeStyles: 'bg-brand-gold/10 text-brand-gold border border-brand-gold/25'
          });
        } else if (app.status === 'Rejected') {
          events.push({
            date: 'Recent',
            title: 'Process Ended',
            status: app.status,
            result: 'Eliminated',
            type: 'outcome',
            badgeStyles: 'bg-red-50 text-red-700 border border-red-100'
          });
        } else if (app.status === 'Shortlisted' && matchingInterviews.length === 0) {
          events.push({
            date: 'Recent',
            title: 'Shortlisted for Next Steps',
            status: app.status,
            result: 'Pending Schedule',
            type: 'outcome',
            badgeStyles: 'bg-emerald-50 text-emerald-700 border border-emerald-100'
          });
        }

        const parseEventDate = (dateStr) => {
          if (!dateStr || dateStr === 'Recent' || dateStr === 'N/A') {
            return new Date(8640000000000000);
          }
          let cleanStr = dateStr;
          if (dateStr.includes(' · ')) {
            cleanStr = dateStr.split(' · ')[0];
          }
          const d = new Date(cleanStr);
          return isNaN(d.getTime()) ? new Date(0) : d;
        };

        events.sort((a, b) => parseEventDate(a.date) - parseEventDate(b.date));

        return (
          <div className="fixed inset-0 bg-[#022c22]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in text-left">
            <div className="bg-brand-cream border border-[#f2efdf] max-w-md w-full rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl animate-fade-in-up max-h-[90vh] overflow-y-auto scrollbar-hide text-[#022c22] text-xs font-semibold">
              {/* Header */}
              <div className="flex justify-between items-start border-b border-[#022c22]/10 pb-4">
                <div>
                  <span className="text-[10px] text-brand-gold font-extrabold uppercase tracking-widest block">Application Timeline</span>
                  <h3 className="font-serif text-xl font-bold text-[#022c22] mt-1">{app.studentName}</h3>
                  <p className="text-xs text-text-secondary font-medium mt-0.5">{job?.title || 'Role'} · {job?.company || 'Company'}</p>
                </div>
                <button 
                  onClick={() => { setShowApplicationDetailsModal(false); setSelectedApplicationDetails(null); }} 
                  className="text-[#022c22]/40 hover:text-[#022c22] p-1.5 hover:bg-[#022c22]/5 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5.5 h-5.5" />
                </button>
              </div>

              {/* Timeline Flow */}
              <div className="relative pl-6 border-l-2 border-[#b38b3f]/20 ml-2 space-y-6 py-2 text-xs font-semibold">
                {events.map((event, idx) => (
                  <div key={idx} className="relative">
                    {/* Bullet marker */}
                    <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-brand-cream border-2 border-[#b38b3f] flex items-center justify-center shadow-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-green"></span>
                    </span>
                    
                    {/* Event detail */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center gap-2 flex-wrap">
                        <h4 className="font-serif text-sm font-bold text-brand-green">{event.title}</h4>
                        <span className="text-[9px] text-[#022c22]/50 font-normal">{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2 pt-0.5">
                        <span className="text-[9px] text-brand-gold uppercase tracking-wider">Status:</span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full capitalize ${event.badgeStyles}`}>
                          {event.status}
                        </span>
                      </div>
                      <div className="text-[10px] text-text-secondary leading-normal pt-0.5 font-medium">
                        Result: <span className="font-semibold text-brand-green/80">{event.result}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex justify-end pt-4 border-t border-[#022c22]/10">
                <button 
                  onClick={() => { setShowApplicationDetailsModal(false); setSelectedApplicationDetails(null); }}
                  className="bg-[#022c22] hover:bg-[#124237] text-white px-6 py-2.5 rounded-xl font-bold uppercase tracking-wider text-[10px] transition-colors cursor-pointer shadow-xs"
                >
                  Close Log
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* --- RECRUITER DELETE ACCOUNT CONFIRMATION MODAL --- */}
      {showDeleteConfirmModal && (
        <div className="fixed inset-0 bg-[#022c22]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in text-left">
          <div className="bg-brand-cream border border-[#f2efdf] max-w-md w-full rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl animate-fade-in-up text-[#022c22] text-xs font-semibold">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-[#022c22]/10 pb-4">
              <div>
                <span className="text-[10px] text-red-600 font-extrabold uppercase tracking-widest block">Irreversible Action</span>
                <h3 className="font-serif text-xl font-bold text-red-900 mt-1">Delete Recruiter Account</h3>
              </div>
              <button 
                onClick={() => { setShowDeleteConfirmModal(false); setDeleteConfirmText(''); setDeleteError(''); }} 
                className="text-[#022c22]/40 hover:text-[#022c22] p-1.5 hover:bg-[#022c22]/5 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5.5 h-5.5" />
              </button>
            </div>

            {/* Warning Message */}
            <div className="bg-red-50 border border-red-200/50 p-4 rounded-2xl space-y-2">
              <p className="text-red-800 text-[11px] leading-relaxed font-semibold">
                This will completely erase your profile, metrics, notifications, and all data from our servers. 
                All associated <strong>job postings, active student applications, and interviews</strong> will be permanently removed.
              </p>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-extrabold tracking-wider text-brand-gold block">
                  Please type your company name to confirm deletion:
                </label>
                <p className="text-[10px] text-brand-green/70 mb-1 font-semibold">
                  Type: <strong className="font-bold select-none text-brand-green">{companyConfirmationTarget}</strong>
                </p>
                <input
                  type="text"
                  placeholder={companyConfirmationTarget}
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className="w-full bg-[#f4f3ea]/50 border border-brand-green/5 rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:border-red-500 focus:bg-white transition-all text-brand-green placeholder:text-brand-green/40 shadow-inner"
                />
              </div>

              {deleteError && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-100 rounded-xl p-3 text-[11px] font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{deleteError}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-4 border-t border-[#022c22]/10">
              <button 
                onClick={() => { setShowDeleteConfirmModal(false); setDeleteConfirmText(''); setDeleteError(''); }}
                className="border border-[#022c22]/20 hover:bg-[#022c22]/5 text-[#022c22] px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider text-[10px] transition-colors cursor-pointer"
                disabled={deletingProgress}
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteAccountConfirm}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider text-[10px] transition-colors cursor-pointer shadow-xs"
                disabled={deletingProgress || deleteConfirmText !== companyConfirmationTarget}
              >
                {deletingProgress ? 'Deleting Account...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- REGISTER PANEL MEMBER MODAL --- */}
      {showAddPanelModal && (
        <div className="fixed inset-0 bg-[#022c22]/30 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-brand-cream border border-[#f2efdf] max-w-lg w-full rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl animate-fade-in-up max-h-[90vh] overflow-y-auto scrollbar-hide">
            <div className="flex justify-between items-start border-b border-[#022c22]/10 pb-4">
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#022c22]">Register Panel Member</h3>
                <p className="text-xs text-[#022c22]/70 font-semibold mt-1">
                  Specify weekly slots availability. Minimum 6 slots must be selected.
                </p>
              </div>
              <button 
                onClick={() => setShowAddPanelModal(false)}
                className="text-[#022c22]/40 hover:text-[#022c22] p-1.5 hover:bg-[#022c22]/5 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5.5 h-5.5" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (!newPanelName.trim()) {
                setPanelError('Please enter a valid panel member name.');
                return;
              }
              if (newPanelSlots.length < 6) {
                setPanelError(`Please select at least 6 slots. (Currently selected: ${newPanelSlots.length} slots)`);
                return;
              }

              const newMember = {
                name: newPanelName.trim(),
                slots: newPanelSlots
              };
              setPanels(prev => [newMember, ...prev]);
              setSuccessMsg(`Successfully registered availability for ${newPanelName}`);
              setTimeout(() => setSuccessMsg(''), 4000);

              setShowAddPanelModal(false);
              setNewPanelName('');
              setNewPanelSlots([]);
              setPanelError('');
            }} className="space-y-4 text-xs text-[#022c22] font-semibold">
              
              <div className="space-y-1">
                <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-bold">Panel Member Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. S. Bose"
                  value={newPanelName}
                  onChange={(e) => setNewPanelName(e.target.value)}
                  className="w-full p-3 bg-white border border-[#022c22]/10 rounded-xl focus:outline-none focus:border-brand-gold text-sm text-[#022c22]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-bold">Weekly Slots Availability Picker</label>
                
                <div className="border border-[#022c22]/10 rounded-2xl overflow-hidden bg-white shadow-xs max-h-[300px] overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#FAF7EE] border-b border-[#022c22]/10 text-[9px] uppercase tracking-wider text-brand-gold font-extrabold">
                        <th className="p-3">Day</th>
                        <th className="p-3 text-center">Morning (9-12)</th>
                        <th className="p-3 text-center">Afternoon (2-5)</th>
                        <th className="p-3 text-center">Evening (6-9)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#022c22]/5">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                        <tr key={day} className="hover:bg-brand-cream/10">
                          <td className="p-3 font-serif font-bold text-sm">{day}</td>
                          {[1, 2, 3].map(slotIdx => {
                            const val = `${day}-${slotIdx}`;
                            const isChecked = newPanelSlots.includes(val);
                            return (
                              <td key={slotIdx} className="p-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => {
                                    if (isChecked) {
                                      setNewPanelSlots(prev => prev.filter(v => v !== val));
                                    } else {
                                      setNewPanelSlots(prev => [...prev, val]);
                                    }
                                  }}
                                  className="w-5 h-5 accent-[#022c22] rounded cursor-pointer"
                                />
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {panelError && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-100 rounded-xl p-3 text-[11px] font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{panelError}</span>
                </div>
              )}

              <div className="flex gap-3 justify-end pt-4 border-t border-[#022c22]/5">
                <button 
                  type="button"
                  onClick={() => setShowAddPanelModal(false)}
                  className="border border-[#022c22]/10 px-5 py-2.5 rounded-xl font-bold cursor-pointer text-xs uppercase"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-[#022c22] hover:bg-brand-gold text-brand-cream hover:text-[#022c22] px-6 py-2.5 rounded-xl font-bold cursor-pointer text-xs uppercase shadow-sm"
                >
                  Register Availability ({newPanelSlots.length} selected)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- PREMIUM TOAST ALERTS --- */}
      {successMsg && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-[#022c22] border-2 border-brand-gold text-brand-cream px-6 py-3.5 rounded-2xl z-50 flex items-center gap-2 shadow-2xl animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-brand-gold" />
          <span className="font-semibold text-sm">{successMsg}</span>
        </div>
      )}

    </div>
  );
};
