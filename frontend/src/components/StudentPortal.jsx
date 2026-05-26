import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePortalState } from '../context/PortalStateContext';
import { 
  Briefcase, Calendar, FileText, Search, MapPin, User, Clock, 
  Bookmark, ChevronRight, Upload, X, ArrowUpRight, CheckCircle2, 
  Video, Plus, Pencil, Mail, Phone, MessageSquare, AlertCircle, Check,
  GraduationCap, XCircle, Globe
} from 'lucide-react';


export const StudentPortal = ({ activeSubTab, onTabChange }) => {
  const { user, updateUserProfile, deleteUserAccount } = useAuth();
  const { jobs, applications, interviews, notifications, applyToJob, markNotificationAsRead, recruiters, viewCompanyProfile, viewJob, clearNotifications } = usePortalState();
  const [highlightedJobId, setHighlightedJobId] = useState(null);

  if (!user) return null;

  // Calculate profile strength dynamically based on metrics configured
  const profileStrengthMetrics = [
    { label: 'Resume uploaded / verified', done: !!user?.studentDetails?.resumeName },
    { label: 'Academic profile registered (CGPA & Roll)', done: !!user?.studentDetails?.cgpa && !!user?.studentDetails?.roll },
    { label: 'Bio Summary / About configured', done: !!user?.studentDetails?.about },
    { label: 'LinkedIn coordinate linked', done: !!user?.studentDetails?.linkedin },
    { label: 'GitHub coordinate linked', done: !!user?.studentDetails?.github },
    { label: 'Skills configured', done: !!user?.studentDetails?.skills && user?.studentDetails?.skills?.length > 0 },
    { label: 'Education milestone(s) added', done: !!user?.studentDetails?.education && user?.studentDetails?.education?.length > 0 },
    { label: 'Projects & Internships listed', done: !!user?.studentDetails?.projects && user?.studentDetails?.projects?.length > 0 },
    { label: 'Certifications listed', done: !!user?.studentDetails?.certifications && user?.studentDetails?.certifications?.length > 0 }
  ];

  const completedMetricsCount = profileStrengthMetrics.filter(m => m.done).length;
  const profileStrengthScore = Math.round((completedMetricsCount / profileStrengthMetrics.length) * 100);

  // Search states for Jobs
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All'); // 'All', 'Internship', 'Full-time', 'Remote'
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [filterLocation, setFilterLocation] = useState('');
  const [filterMinSalary, setFilterMinSalary] = useState('');

  // New Modals states
  const [showCompanyProfileModal, setShowCompanyProfileModal] = useState(false);
  const [selectedCompanyProfile, setSelectedCompanyProfile] = useState(null);

  const [showJobDetailsModal, setShowJobDetailsModal] = useState(false);
  const [selectedJobDetails, setSelectedJobDetails] = useState(null);

  const [showApplicationDetailsModal, setShowApplicationDetailsModal] = useState(false);
  const [selectedApplicationDetails, setSelectedApplicationDetails] = useState(null);

  // Notifications Page filter state
  const [activeNotifFilter, setActiveNotifFilter] = useState('All');

  // Profile states
  const [newSkill, setNewSkill] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [profileForm, setFormState] = useState({
    name: '',
    department: '',
    roll: '',
    cgpa: '',
    batch: '2026',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    about: '',
    skills: '',
    education: [],
    projects: [],
    certifications: []
  });

  React.useEffect(() => {
    if (user) {
      setFormState({
        name: user.name || '',
        department: user.studentDetails?.department || '',
        roll: user.studentDetails?.roll || '',
        cgpa: user.studentDetails?.cgpa || '',
        batch: user.studentDetails?.batch || '2026',
        phone: user.studentDetails?.phone || '',
        location: user.studentDetails?.location || '',
        linkedin: user.studentDetails?.linkedin || '',
        github: user.studentDetails?.github || '',
        about: user.studentDetails?.about || '',
        skills: user.studentDetails?.skills?.join(', ') || '',
        education: user.studentDetails?.education || [
          { school: 'IIT Delhi', degree: `B.Tech, ${user.studentDetails?.department || 'Computer Science & Engineering'}`, duration: `2022 - ${user.studentDetails?.batch || '2026'}`, grade: `CGPA ${user.studentDetails?.cgpa || '9.1'}` },
          { school: 'Delhi Public School, R.K. Puram', degree: 'CBSE Class XII', duration: '2022', grade: '97.4%' }
        ],
        projects: user.studentDetails?.projects || [
          { title: 'Realtime fraud detection (Internship — Vault Capital)', description: 'Built streaming ML pipeline on Kafka + PyTorch reducing fraud losses by 23%.', date: 'Summer 2025' },
          { title: 'Open-source — torch-ensemble', description: 'Maintainer of PyTorch utility lib with 1.2k stars and 40+ contributors.', date: '2024 - present' }
        ],
        certifications: user.studentDetails?.certifications || [
          { title: 'AWS Certified Solutions Architect – Associate', issuer: 'Amazon Web Services', date: 'Feb 2025' },
          { title: 'Neural Networks and Deep Learning', issuer: 'DeepLearning.AI', date: 'Oct 2024' }
        ]
      });
    }
  }, [user]);

  React.useEffect(() => {
    if (activeSubTab === 'jobs' && highlightedJobId) {
      setTimeout(() => {
        const el = document.getElementById(`job-card-${highlightedJobId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      
      const timer = setTimeout(() => {
        setHighlightedJobId(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [activeSubTab, highlightedJobId]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const skillsArray = profileForm.skills
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const res = await updateUserProfile({
        name: profileForm.name,
        studentDetails: {
          department: profileForm.department,
          roll: profileForm.roll,
          cgpa: profileForm.cgpa,
          batch: profileForm.batch,
          phone: profileForm.phone,
          location: profileForm.location,
          linkedin: profileForm.linkedin,
          github: profileForm.github,
          about: profileForm.about,
          skills: skillsArray,
          education: profileForm.education,
          projects: profileForm.projects,
          certifications: profileForm.certifications,
          resumeName: user.studentDetails?.resumeName || ''
        }
      });

      if (res.success) {
        setShowEditModal(false);
        setSuccessMsg('Profile updated successfully!');
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        alert(`Failed to save changes: ${res.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      alert('Failed to save profile changes.');
    }
  };

  const handleOpenCompanyProfile = async (companyName) => {
    const foundRecruiter = recruiters.find(r => r.recruiterDetails?.company?.toLowerCase() === companyName.toLowerCase());
    setSelectedCompanyProfile({
      company: companyName,
      recruiter: foundRecruiter
    });
    setShowCompanyProfileModal(true);
    await viewCompanyProfile(companyName);
  };

  const handleOpenJobDetails = async (job) => {
    setSelectedJobDetails(job);
    setShowJobDetailsModal(true);
    await viewJob(job.id);
  };

  const handleAddEducation = () => {
    setFormState(prev => ({
      ...prev,
      education: [...prev.education, { school: '', degree: '', duration: '', grade: '' }]
    }));
  };

  const handleRemoveEducation = (index) => {
    setFormState(prev => ({
      ...prev,
      education: prev.education.filter((_, idx) => idx !== index)
    }));
  };

  const handleAddProject = () => {
    setFormState(prev => ({
      ...prev,
      projects: [...prev.projects, { title: '', description: '', date: '' }]
    }));
  };

  const handleRemoveProject = (index) => {
    setFormState(prev => ({
      ...prev,
      projects: prev.projects.filter((_, idx) => idx !== index)
    }));
  };

  const handleAddCertification = () => {
    setFormState(prev => ({
      ...prev,
      certifications: [...prev.certifications, { title: '', issuer: '', date: '' }]
    }));
  };

  const handleRemoveCertification = (index) => {
    setFormState(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, idx) => idx !== index)
    }));
  };

  const handleToggleSaveJob = async (jobId) => {
    const currentSaved = user.studentDetails?.savedJobs || [];
    let updatedSaved;
    if (currentSaved.includes(jobId)) {
      updatedSaved = currentSaved.filter(id => id !== jobId);
    } else {
      updatedSaved = [...currentSaved, jobId];
    }
    
    const res = await updateUserProfile({
      studentDetails: {
        ...user.studentDetails,
        savedJobs: updatedSaved
      }
    });
    
    if (!res.success) {
      alert(`Failed to save job: ${res.error || 'Unknown error'}`);
    }
  };

  // Checklist state for Interviews
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Review resume & projects', checked: false },
    { id: 2, text: 'Practice DSA - 2 problems/day', checked: false },
    { id: 3, text: 'Mock interview booked', checked: false },
    { id: 4, text: 'Company research notes', checked: false },
    { id: 5, text: 'STAR-format behavioural answers', checked: false }
  ]);

  const toggleChecklist = (id) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  // Filtering applications for this student (ensure the referenced job still exists)
  const studentApps = applications.filter(app => app.studentEmail === user.email && jobs.some(j => j.id === app.jobId));
  const studentInterviews = interviews.filter(int => int.studentEmail === user.email && jobs.some(j => j.id === int.jobId));

  const hasApplied = (jobId) => studentApps.some(app => app.jobId === jobId);

  // 1. OVERVIEW DASHBOARD VIEW
  const renderOverview = () => {
    const handleBrowseJobs = () => {
      if (onTabChange) onTabChange('jobs');
    };

    const recommendations = jobs.filter(j => j.status === 'Approved').slice(0, 4);

    const savedIds = user.studentDetails?.savedJobs || [];
    const savedJobsList = jobs
      .filter(j => j.status === 'Approved' && savedIds.includes(j.id))
      .map(j => ({ id: j.id, company: j.company, role: j.title }));

    return (
      <div className="space-y-8 animate-fade-in-up">
        {/* Greetings Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="editorial-heading font-serif text-3xl md:text-4xl text-brand-green font-bold">
              Good morning, {user?.name?.split(' ')[0] || 'Student'}
            </h1>
            <p className="text-text-secondary text-sm mt-1">
              Here's what's happening with your placement journey today.
            </p>
          </div>
          <button
            onClick={handleBrowseJobs}
            className="bg-brand-green hover:bg-brand-gold hover:text-brand-green text-white py-3 px-5 rounded-xl flex items-center gap-2 font-semibold text-sm transition-all shadow-sm"
          >
            <Briefcase className="w-4 h-4" />
            <span>Browse jobs</span>
          </button>
        </div>

        {/* Four Core Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* APPLICATIONS */}
          <div className="bg-white border border-[#eeeeec] p-5 rounded-2xl flex justify-between items-start shadow-xs">
            <div className="space-y-3">
              <span className="text-[10px] text-brand-green/50 uppercase tracking-widest font-bold">Applications</span>
              <div className="text-3xl font-serif font-bold text-brand-green">{studentApps.length}</div>
              <span className="text-xs text-brand-gold font-medium">Active drives</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#f4f3ea]/50 flex items-center justify-center text-brand-green/60">
              <FileText className="w-5 h-5" />
            </div>
          </div>

          {/* SHORTLISTED */}
          <div className="bg-white border border-[#eeeeec] p-5 rounded-2xl flex justify-between items-start shadow-xs">
            <div className="space-y-3">
              <span className="text-[10px] text-brand-green/50 uppercase tracking-widest font-bold">Shortlisted</span>
              <div className="text-3xl font-serif font-bold text-brand-green">
                {studentApps.filter(a => ['Shortlisted', 'Interview', 'Offer', 'Selected'].includes(a.status)).length}
              </div>
              <span className="text-xs text-brand-gold font-medium">In progression</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold">
              <Bookmark className="w-5 h-5 fill-current" />
            </div>
          </div>

          {/* INTERVIEWS */}
          <div className="bg-white border border-[#eeeeec] p-5 rounded-2xl flex justify-between items-start shadow-xs">
            <div className="space-y-3">
              <span className="text-[10px] text-brand-green/50 uppercase tracking-widest font-bold">Interviews</span>
              <div className="text-3xl font-serif font-bold text-brand-green">{studentInterviews.length}</div>
              <span className="text-xs text-brand-green/70 font-medium">Scheduled rounds</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#f4f3ea]/50 flex items-center justify-center text-brand-green/60">
              <Calendar className="w-5 h-5" />
            </div>
          </div>

          {/* PROFILE STRENGTH */}
          <div className="bg-white border border-[#eeeeec] p-5 rounded-2xl flex justify-between items-start shadow-xs">
            <div className="space-y-3">
              <span className="text-[10px] text-brand-green/50 uppercase tracking-widest font-bold">Profile Strength</span>
              <div className="text-3xl font-serif font-bold text-brand-green">
                {profileStrengthScore}%
              </div>
              <span className="text-xs text-brand-gold font-medium">
                {profileStrengthScore >= 80 ? 'Strong profile' : profileStrengthScore >= 50 ? 'Medium profile' : 'Weak profile'}
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#f4f3ea]/50 flex items-center justify-center text-brand-green/60">
              <User className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Two-column detailed workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Recommended for you */}
          <div className="lg:col-span-8 space-y-5">
            <div className="flex justify-between items-end border-b border-brand-green/5 pb-2">
              <h2 className="font-serif text-xl font-bold text-brand-green">Recommended for you</h2>
              <button
                onClick={handleBrowseJobs}
                className="text-xs font-semibold text-brand-green hover:text-brand-gold flex items-center gap-1 transition-all"
              >
                <span>View all</span>
                <span className="text-sm">→</span>
              </button>
            </div>

            <div className="bg-white border border-[#eeeeec] rounded-2xl divide-y divide-[#eeeeec] shadow-xs overflow-hidden">
              {recommendations.map((job) => {
                const initial = job.company ? job.company[0] : 'C';
                
                // Calculate dynamic skill match percentage
                const studentSkills = (user?.studentDetails?.skills || []).map(s => s.toLowerCase().trim()).filter(Boolean);
                const jobSkills = (job.skills || []).map(s => s.toLowerCase().trim()).filter(Boolean);
                const matchingSkills = jobSkills.filter(s => studentSkills.includes(s));
                const matchPercentage = jobSkills.length > 0 
                  ? Math.round((matchingSkills.length / jobSkills.length) * 100) 
                  : 85;

                let tagLabel = `Match ${matchPercentage}%`;
                let tagStyles = 'bg-brand-gold/10 text-brand-gold border border-brand-gold/25';
                if (matchPercentage >= 75) {
                  tagStyles = 'bg-emerald-55/10 text-emerald-700 border border-emerald-55/20';
                } else if (matchPercentage < 40) {
                  tagStyles = 'bg-gray-50 text-gray-700 border border-gray-100';
                }

                return (
                  <div key={job.id} className="p-5 flex items-start sm:items-center justify-between gap-4 hover:bg-brand-cream/20 transition-all">
                    <div className="flex items-start sm:items-center gap-4 overflow-hidden">
                      <div className="w-12 h-12 rounded-xl bg-[#f4f3ea] text-brand-green font-serif font-bold text-lg flex items-center justify-center shrink-0 border border-brand-green/5">
                        {initial}
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-semibold text-brand-green text-sm sm:text-base leading-snug">{job.title || 'Unknown Role'}</h4>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${tagStyles}`}>
                            {tagLabel}
                          </span>
                        </div>
                        <p className="text-xs text-text-secondary">
                          {job.company || 'Unknown Company'} · {job.location || 'Remote'} · {job.type || 'Full-time'}
                        </p>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {(job.skills || []).map(s => (
                            <span key={s} className="bg-[#f4f3ea]/50 text-brand-green text-[9px] font-semibold px-2 py-0.5 rounded-md">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0 space-y-2">
                      <div className="text-xs sm:text-sm font-bold text-brand-green">{job.salary}</div>
                      <button
                        onClick={() => {
                          setHighlightedJobId(job.id);
                          handleBrowseJobs();
                        }}
                        className="text-xs text-brand-green font-semibold hover:text-brand-gold flex items-center gap-0.5 justify-end transition-all"
                      >
                        <span>Apply</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Upcoming interviews & Saved jobs */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Upcoming Interviews */}
            <div className="bg-white border border-[#eeeeec] p-5 rounded-2xl space-y-4 shadow-xs">
              <h2 className="font-serif text-lg font-bold text-brand-green border-b border-brand-green/5 pb-2">
                Upcoming interviews
              </h2>
              <div className="space-y-4">
                {(() => {
                  const upcoming = studentInterviews.filter(int => int.status === 'Scheduled');
                  if (upcoming.length === 0) {
                    return (
                      <div className="text-center py-6 px-4">
                        <Calendar className="w-8 h-8 text-brand-green/20 mx-auto mb-2 animate-pulse" />
                        <p className="text-xs text-text-secondary font-semibold">No upcoming interviews scheduled.</p>
                      </div>
                    );
                  }
                  return upcoming.map((int) => {
                    const dateTimeStr = int.dateTime || 'Jun 15 at 10:00 AM';
                    const parts = dateTimeStr.split(' at ');
                    const dateStr = parts[0] || 'Jun 15';
                    const timeStr = parts[1] || '10:00 AM';
                    const dateParts = dateStr.trim().split(' ');
                    const day = dateParts[0] || '15';
                    const month = dateParts[1] || 'Jun';
                    return (
                      <div key={int.id} className="flex items-start gap-3.5 hover:translate-x-1 transition-transform">
                        <div className="w-12 h-12 bg-brand-green text-white rounded-lg flex flex-col items-center justify-center shrink-0 shadow-sm p-1 leading-tight">
                          <span className="text-[14px] font-bold block">{day}</span>
                          <span className="text-[8px] uppercase tracking-wider font-extrabold block text-white/70">{month}</span>
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="font-semibold text-sm text-brand-green truncate">{int.company || 'Unknown Company'}</h4>
                          <p className="text-xs text-text-secondary truncate mt-0.5">{int.round || 'Interview Round'}</p>
                          <p className="text-[10px] text-brand-gold font-medium mt-0.5">{timeStr || int.dateTime} · {int.mode || 'Online'}</p>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            {/* Saved Jobs */}
            <div className="bg-white border border-[#eeeeec] p-5 rounded-2xl space-y-4 shadow-xs">
              <h2 className="font-serif text-lg font-bold text-brand-green border-b border-brand-green/5 pb-2">
                Saved jobs
              </h2>
              <div className="space-y-3">
                {savedJobsList.length === 0 ? (
                  <div className="text-center py-6 px-4">
                    <Bookmark className="w-8 h-8 text-brand-green/20 mx-auto mb-2 animate-pulse" />
                    <p className="text-xs text-text-secondary font-semibold">No saved jobs yet.</p>
                  </div>
                ) : (
                  savedJobsList.map((job) => (
                    <div key={job.id} className="flex items-center justify-between gap-3 py-1 hover:translate-x-1 transition-transform">
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <Bookmark className="w-4 h-4 text-brand-gold shrink-0 fill-current" />
                        <div className="overflow-hidden">
                          <span className="font-semibold text-brand-green text-xs block truncate leading-tight">
                            {job.company}
                          </span>
                          <span className="text-[10px] text-text-secondary block truncate mt-0.5">
                            {job.role}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setHighlightedJobId(job.id);
                          handleBrowseJobs();
                        }}
                        className="bg-[#f4f3ea]/60 hover:bg-[#f4f3ea] text-brand-green text-[10px] font-bold px-3 py-1.5 rounded-lg border border-brand-green/5 transition-all cursor-pointer"
                      >
                        View
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

  // 2. JOBS LIST OPPORTUNITIES VIEW
  const renderJobs = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    // Exclude taken-down jobs - those are soft-deleted by recruiters and should no longer appear
    const liveJobs = jobs.filter(j => j.status === 'Approved' && !j.takenDown && (!j.deadline || j.deadline >= todayStr));

    const filteredJobs = liveJobs.filter(j => {
      const matchesSearch = (j.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (j.company || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (j.skills || []).some(s => (s || '').toLowerCase().includes(searchQuery.toLowerCase()));

      let matchesFilter = true;
      if (activeFilter === 'Internship') {
        matchesFilter = j.type === 'Internship';
      } else if (activeFilter === 'Full-time') {
        matchesFilter = j.type === 'Full-time';
      } else if (activeFilter === 'Remote') {
        matchesFilter = (j.location || '').toLowerCase().includes('remote');
      }

      let matchesLocation = true;
      if (filterLocation.trim()) {
        matchesLocation = (j.location || '').toLowerCase().includes(filterLocation.toLowerCase());
      }

      let matchesMinSalary = true;
      if (filterMinSalary.trim()) {
        const parseMonthlySalary = (salaryStr) => {
          if (!salaryStr) return 0;
          const str = salaryStr.toLowerCase().replace(/,/g, '');
          const match = str.match(/(\d+(?:\.\d+)?)/);
          if (!match) return 0;
          const val = parseFloat(match[1]);
          const isAnnual = str.includes('lpa') || (str.includes('lakh') && !str.includes('month')) || (str.includes('l') && !str.includes('month') && !str.includes('k'));
          if (isAnnual) {
            return (val * 100000) / 12;
          }
          if (str.includes('k')) {
            return val * 1000;
          }
          if (str.includes('lakh') || str.includes('l')) {
            return val * 100000;
          }
          if (val > 1000) {
            return val;
          }
          return val * 1000;
        };
        const jobMonthly = parseMonthlySalary(j.salary);
        const minMonthly = parseFloat(filterMinSalary);
        if (!isNaN(minMonthly)) {
          matchesMinSalary = jobMonthly >= minMonthly;
        }
      }

      return matchesSearch && matchesFilter && matchesLocation && matchesMinSalary;
    });

    const filterPills = ['All', 'Internship', 'Full-time', 'Remote'];

    return (
      <div className="space-y-8 animate-fade-in-up">
        {/* Header Title */}
        <div>
          <h1 className="editorial-heading font-serif text-3xl font-bold text-brand-green">
            Jobs & Internships
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Search and filter from active placement drives.
          </p>
        </div>

        {/* Dynamic Filter Search Toolbar */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative w-full lg:max-w-md shrink-0">
            <Search className="w-4 h-4 text-brand-green/30 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by role, skill, company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#eeeeec] rounded-xl py-2.5 pl-11 pr-4 text-xs sm:text-sm focus:outline-none focus:border-brand-gold focus:bg-white text-brand-green placeholder:text-brand-green/40 shadow-xs transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto overflow-x-auto no-scrollbar py-1">
            {filterPills.map((pill) => {
              const isActive = activeFilter === pill;
              return (
                <button
                  key={pill}
                  onClick={() => setActiveFilter(pill)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                    isActive
                      ? 'bg-brand-green text-white border-brand-green'
                      : 'bg-[#f4f3ea]/50 hover:bg-[#f4f3ea] text-brand-green border-brand-green/5'
                  }`}
                >
                  {pill}
                </button>
              );
            })}
            
            <button 
              onClick={() => setShowMoreFilters(!showMoreFilters)}
              className={`text-xs font-semibold px-4 py-2 rounded-xl border transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                showMoreFilters || filterLocation || filterMinSalary
                  ? 'bg-brand-gold text-brand-green border-brand-gold font-bold'
                  : 'bg-[#f4f3ea]/50 hover:bg-[#f4f3ea] text-brand-green border-brand-green/5'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
              </svg>
              <span>More filters{(filterLocation || filterMinSalary) ? ' (Active)' : ''}</span>
            </button>
          </div>
        </div>

        {/* Elegant More Filters Panel */}
        {showMoreFilters && (
          <div className="bg-white border border-[#eeeeec] p-5 rounded-2xl shadow-xs space-y-4 animate-fade-in-up">
            <div className="flex justify-between items-center border-b border-[#022c22]/5 pb-2">
              <h3 className="font-serif text-sm font-bold text-brand-green">Filter by Location & CTC Package</h3>
              <button 
                onClick={() => {
                  setFilterLocation('');
                  setFilterMinSalary('');
                }}
                className="text-[10px] text-brand-gold hover:underline font-bold uppercase tracking-wider cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-brand-green block uppercase tracking-wider">Location / City</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-brand-green/30 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. Noida, Gurgaon, Remote..."
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                    className="w-full bg-[#f4f3ea]/40 border border-brand-green/10 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-brand-gold text-brand-green"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-brand-green block uppercase tracking-wider">Min Monthly Salary (₹/month)</label>
                <div className="relative">
                  <span className="font-bold text-brand-green/40 absolute left-3 top-1/2 -translate-y-1/2 text-sm">₹</span>
                  <input
                    type="number"
                    placeholder="e.g. 50000, 100000, 150000..."
                    value={filterMinSalary}
                    onChange={(e) => setFilterMinSalary(e.target.value)}
                    className="w-full bg-[#f4f3ea]/40 border border-brand-green/10 rounded-xl py-2.5 pl-8 pr-4 focus:outline-none focus:border-brand-gold text-brand-green"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Meta Stats Row */}
        <div className="flex justify-between items-center border-b border-brand-green/5 pb-2 pt-2">
          <span className="text-sm font-semibold text-brand-green">{filteredJobs.length} open positions</span>
          <span className="text-xs text-text-secondary italic">Updated 2 min ago</span>
        </div>

        {/* 2-Column Job Cards Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredJobs.length === 0 ? (
            <div className="md:col-span-2 text-center bg-white border border-[#eeeeec] py-16 px-4 rounded-2xl shadow-xs">
              <p className="text-sm text-text-secondary">No active placement opportunities match your search.</p>
            </div>
          ) : (
            filteredJobs.map((job) => {
              const applied = hasApplied(job.id);
              const initial = job.company ? job.company[0] : 'C';

              const isHighlighted = highlightedJobId === job.id;

              return (
                <div 
                  key={job.id} 
                  id={`job-card-${job.id}`}
                  className={`p-6 rounded-2xl flex flex-col justify-between gap-5 shadow-xs transition-all duration-500 border ${
                    isHighlighted
                      ? 'border-brand-gold bg-brand-gold/5 shadow-[0_0_15px_rgba(179,139,63,0.35)] ring-2 ring-brand-gold/20 animate-pulse'
                      : 'bg-white border-[#eeeeec] hover:border-[#b38b3f]/30'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-12 h-12 bg-[#f4f3ea] text-brand-green font-serif font-bold text-lg flex items-center justify-center shrink-0 border border-brand-green/5 rounded-xl">
                          {initial}
                        </div>
                        <div className="overflow-hidden">
                          <h3 className="font-semibold text-brand-green text-base sm:text-lg truncate leading-tight">
                            {job.title || 'Unknown Role'}
                          </h3>
                          <span className="text-xs text-text-secondary mt-0.5 block truncate">
                            <span 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenCompanyProfile(job.company);
                              }}
                              className="hover:underline hover:text-brand-gold cursor-pointer font-bold text-brand-green/80 mr-1"
                              title="Click to view company profile"
                            >
                              {job.company || 'Unknown Company'}
                            </span>
                            · {(job.location || 'Remote')}
                          </span>
                        </div>
                      </div>

                      <span className={`text-[10px] font-semibold px-3 py-1 rounded-full shrink-0 ${
                        job.type === 'Internship'
                          ? 'bg-[#f4f3ea] text-[#b38b3f]'
                          : 'bg-[#eeeeec] text-brand-green'
                      }`}>
                        {job.type || 'Full-time'}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(job.skills || []).map((skill) => (
                        <span key={skill} className="bg-[#f4f3ea]/50 text-brand-green text-[9px] font-semibold px-2 py-0.5 rounded-md">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-brand-green/5 pt-4 flex justify-between items-center gap-3 mt-2">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-text-secondary uppercase tracking-widest block leading-none">Salary / Stipend</span>
                      <span className="text-base font-bold text-brand-green block leading-tight">{job.salary || 'Competitive'}</span>
                      <span className="text-[10px] text-brand-gold font-medium block">Apply by {(job.deadline || 'No deadline').split(',')[0]}</span>
                    </div>

                    <div className="flex gap-2 items-center">
                      <button
                        onClick={() => handleToggleSaveJob(job.id)}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                          (user.studentDetails?.savedJobs || []).includes(job.id)
                            ? 'bg-brand-gold/10 text-brand-gold border-brand-gold/30'
                            : 'border-brand-green/20 hover:bg-[#022c22]/5 text-[#022c22]/60 hover:text-[#022c22]'
                        }`}
                        title={(user.studentDetails?.savedJobs || []).includes(job.id) ? "Unsave Job" : "Save Job"}
                      >
                        <Bookmark className={`w-4 h-4 ${((user.studentDetails?.savedJobs || []).includes(job.id)) ? 'fill-current' : ''}`} />
                      </button>

                      <button
                        onClick={() => handleOpenJobDetails(job)}
                        className="border border-brand-green/20 hover:bg-[#022c22]/5 text-[#022c22] font-semibold text-xs py-2.5 px-3 rounded-xl transition-all cursor-pointer shadow-xs whitespace-nowrap"
                      >
                        View details
                      </button>

                      {applied ? (
                        <span className="bg-brand-green/5 text-brand-green text-xs font-semibold px-4 py-2.5 border border-brand-green/10 rounded-xl flex items-center gap-1.5 shadow-inner">
                          <svg className="w-4 h-4 text-brand-gold fill-current" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Applied</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => applyToJob(job.id, user)}
                          className="bg-brand-green hover:bg-brand-gold hover:text-brand-green text-white py-2.5 px-4 rounded-xl flex items-center gap-2 font-semibold text-xs transition-all shadow-xs shrink-0"
                        >
                          <Briefcase className="w-3.5 h-3.5" />
                          <span>Apply</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  // 3. MY APPLICATIONS TABLE LIST VIEW
  const renderApplications = () => {
    // Only show applications where the job still exists (admin hard-deleted jobs remove applications too)
    // Recruiter taken-down jobs are still shown (takenDown=true) but admin deleted jobs are gone from jobs array
    const visibleApps = studentApps.filter(app => jobs.some(j => j.id === app.jobId));

    const totalCount = visibleApps.length;
    const appliedCount = visibleApps.filter(a => a.status === 'Applied').length;
    const shortlistedCount = visibleApps.filter(a => a.status === 'Shortlisted').length;
    const interviewCount = visibleApps.filter(a => a.status === 'Interview').length;
    const offerCount = visibleApps.filter(a => a.status === 'Offer' || a.status === 'Selected').length;

    return (
      <div className="space-y-8 animate-fade-in-up">
        <div>
          <h1 className="editorial-heading font-serif text-3xl font-bold text-brand-green">
            My Applications
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Track every application from submission to offer.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="bg-white border border-[#eeeeec] p-4 rounded-xl text-center space-y-1 shadow-xs">
            <span className="text-[10px] text-text-secondary uppercase tracking-widest font-semibold block">Total</span>
            <div className="text-2xl font-serif font-bold text-brand-green">{totalCount}</div>
          </div>
          <div className="bg-white border border-[#eeeeec] p-4 rounded-xl text-center space-y-1 shadow-xs">
            <span className="text-[10px] text-text-secondary uppercase tracking-widest font-semibold block">Applied</span>
            <div className="text-2xl font-serif font-bold text-brand-green">{appliedCount}</div>
          </div>
          <div className="bg-white border border-[#eeeeec] p-4 rounded-xl text-center space-y-1 shadow-xs">
            <span className="text-[10px] text-text-secondary uppercase tracking-widest font-semibold block">Shortlisted</span>
            <div className="text-2xl font-serif font-bold text-brand-green">{shortlistedCount}</div>
          </div>
          <div className="bg-white border border-[#eeeeec] p-4 rounded-xl text-center space-y-1 shadow-xs">
            <span className="text-[10px] text-text-secondary uppercase tracking-widest font-semibold block">Interview</span>
            <div className="text-2xl font-serif font-bold text-brand-green">{interviewCount}</div>
          </div>
          <div className="bg-white border border-[#eeeeec] p-4 rounded-xl text-center space-y-1 shadow-xs col-span-2 sm:col-span-1">
            <span className="text-[10px] text-text-secondary uppercase tracking-widest font-semibold block text-brand-gold">Offers</span>
            <div className="text-2xl font-serif font-bold text-brand-gold">{offerCount}</div>
          </div>
        </div>

        <div className="bg-white border border-[#eeeeec] rounded-2xl shadow-xs overflow-hidden">
          <div className="p-5 border-b border-brand-green/5 flex justify-between items-center bg-[#f9f8f3]/20">
            <h2 className="font-serif text-lg font-bold text-brand-green">All applications</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f4f3ea]/20 border-b border-brand-green/5 text-[10px] uppercase font-bold text-brand-green/50 tracking-wider">
                  <th className="p-5">Company</th>
                  <th className="p-5">Role</th>
                  <th className="p-5">Applied</th>
                  <th className="p-5">Status</th>
                  <th className="p-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eeeeec] text-xs text-brand-green font-medium">
                {visibleApps.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-10 text-center text-text-secondary">
                      No active submissions found.
                    </td>
                  </tr>
                ) : (
                  visibleApps.map((app) => {
                    const job = jobs.find(j => j.id === app.jobId);
                    const initial = job?.company[0] || 'C';

                    let badgeStyles = 'bg-gray-50 text-gray-700';
                    if (app.status === 'Interview') {
                      badgeStyles = 'bg-teal-50 text-teal-700';
                    } else if (app.status === 'Shortlisted') {
                      badgeStyles = 'bg-emerald-50 text-emerald-700';
                    } else if (app.status === 'Applied') {
                      badgeStyles = 'bg-amber-50 text-amber-700';
                    } else if (app.status === 'Rejected') {
                      badgeStyles = 'bg-red-50 text-red-700';
                    } else if (app.status === 'Offer' || app.status === 'Selected') {
                      badgeStyles = 'bg-brand-gold/10 text-brand-gold border border-brand-gold/25';
                    }

                    return (
                      <tr key={app.id} className="hover:bg-brand-cream/10 transition-all">
                        <td className="p-5">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-8 h-8 rounded-lg bg-[#f4f3ea] text-brand-green font-serif font-bold text-sm flex items-center justify-center shrink-0 border border-brand-green/5">
                              {initial}
                            </div>
                            <div>
                              <span className="font-semibold block truncate leading-tight">{job?.company || 'Company'}</span>
                              {job?.takenDown && (
                                <span className="text-[9px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full block w-max mt-0.5">Taken Down</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-5">{job?.title || 'Unknown Role'}</td>
                        <td className="p-5 text-text-secondary">{app.appliedDate}</td>
                        <td className="p-5">
                          <span className={`text-[10px] font-bold px-3 py-1 rounded-full capitalize ${badgeStyles}`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="p-5 text-right">
                          <button 
                            onClick={() => {
                              setSelectedApplicationDetails(app);
                              setShowApplicationDetailsModal(true);
                            }}
                            className="text-brand-green font-bold hover:underline transition-all cursor-pointer"
                          >
                            Details →
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

      </div>
    );
  };


  // 4. HIGH-FIDELITY INTERVIEWS VIEW
  const renderInterviews = () => {
    // Stat metrics inside interviews
    const placedCount = studentInterviews.filter(i => i.result === 'Placed').length;
    const metrics = [
      { label: 'UPCOMING', value: studentInterviews.filter(i => i.status === 'Scheduled').length, icon: Calendar },
      { label: 'COMPLETED', value: studentInterviews.filter(i => i.status === 'Completed').length, icon: Clock },
      { label: 'CLEARED', value: studentApps.filter(a => ['Offer', 'Selected'].includes(a.status)).length, icon: CheckCircle2 },
      { label: 'TOTAL ROUNDS', value: studentInterviews.length, icon: Video }
    ];

    // Upcoming: interviews with status 'Scheduled'
    const upcomingInterviewsList = studentInterviews
      .filter(int => int.status === 'Scheduled')
      .map((int, index) => {
        let date = '24';
        let month = 'MAY';
        let time = '10:30 AM';
        try {
          const parts = int.dateTime.split(' ');
          if (parts.length >= 2) {
            date = parts[0];
            month = parts[1].toUpperCase();
            const timeParts = int.dateTime.split(' at ');
            if (timeParts.length >= 2) {
              time = timeParts[1];
            }
          }
        } catch (e) {
          console.error(e);
        }
        
        const isOnline = int.mode.toLowerCase().includes('online') || int.mode.toLowerCase().includes('meet') || int.mode.toLowerCase().includes('zoom');

        return {
          id: int.id || `ui-${index}`,
          company: int.company,
          role: int.round,
          date,
          month,
          time,
          mode: int.mode,
          tag: isOnline ? 'Online' : 'Onsite',
          tagStyles: isOnline ? 'bg-teal-50 text-teal-700 border border-teal-100' : 'bg-amber-50 text-amber-700 border border-amber-100',
          platformIcon: isOnline ? Video : MapPin,
          link: int.link
        };
      });

    // Past interviews: interviews with status 'Completed' or 'Cancelled'
    const pastInterviewsList = studentInterviews
      .filter(int => int.status === 'Completed' || int.status === 'Cancelled')
      .map(int => {
        const result = int.result || '';
        let resultLabel = result || 'Completed';
        let resultStyles = 'bg-gray-50 text-gray-700 border border-gray-100';
        let isCleared = false;

        if (result === 'Placed') {
          resultStyles = 'bg-emerald-50 text-emerald-700 border border-emerald-100';
          isCleared = true;
          resultLabel = 'Placed 🎉';
        } else if (result === 'Next Round') {
          resultStyles = 'bg-teal-50 text-teal-700 border border-teal-100';
          isCleared = true;
          resultLabel = 'Next Round';
        } else if (result === 'Eliminated') {
          resultStyles = 'bg-red-50 text-red-700 border border-red-100';
          isCleared = false;
          resultLabel = 'Eliminated';
        } else if (int.status === 'Cancelled') {
          resultStyles = 'bg-amber-50 text-amber-700 border border-amber-100';
          resultLabel = 'Cancelled';
        }

        return {
          interviewId: int.id,
          company: int.company,
          role: int.round,
          round: int.round,
          date: int.dateTime ? int.dateTime.split(' at ')[0] : 'N/A',
          result: resultLabel,
          styles: resultStyles,
          isCleared
        };
      });

    return (
      <div className="space-y-8 animate-fade-in-up">
        {/* Header */}
        <div>
          <h1 className="editorial-heading font-serif text-3xl font-bold text-brand-green">
            Interviews
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Your upcoming rounds and interview history.
          </p>
        </div>

        {/* Four summary metric cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {metrics.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="bg-white border border-[#eeeeec] p-5 rounded-2xl flex justify-between items-start shadow-xs">
                <div className="space-y-3">
                  <span className="text-[10px] text-brand-green/50 uppercase tracking-widest font-bold">{card.label}</span>
                  <div className="text-3xl font-serif font-bold text-brand-green">{card.value}</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#f4f3ea]/50 flex items-center justify-center text-brand-green/60">
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Upcoming interviews list (Left Column wrapped in white card container) */}
          <div className="lg:col-span-8 bg-white border border-[#eeeeec] p-6 rounded-2xl shadow-xs space-y-5">
            <h2 className="font-serif text-xl font-bold text-brand-green border-b border-brand-green/5 pb-3">
              Upcoming interviews
            </h2>
            
            <div className="space-y-4">
              {upcomingInterviewsList.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <Calendar className="w-8 h-8 text-brand-green/20 mx-auto mb-3" />
                  <p className="text-sm text-text-secondary">No upcoming interviews scheduled.</p>
                </div>
              ) : (
              upcomingInterviewsList.map((int) => {
                const PlatformIcon = int.platformIcon;
                return (
                  <div key={int.id} className="bg-[#fdfcf7] border border-[#eeeeec] p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-brand-gold/30 transition-all shadow-2xs animate-fade-in-up">
                    <div className="flex items-start sm:items-center gap-4 overflow-hidden">
                      {/* Left Date green badge */}
                      <div className="w-12 h-12 bg-brand-green text-white rounded-xl flex flex-col items-center justify-center shrink-0 p-1 leading-tight shadow-xs">
                        <span className="text-base font-bold block">{int.date}</span>
                        <span className="text-[8px] uppercase tracking-wider font-extrabold block text-white/70">{int.month}</span>
                      </div>
                      
                      {/* Center interview metadata details */}
                      <div className="space-y-1 overflow-hidden">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-brand-green text-sm sm:text-base leading-snug">{int.company}</h4>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full capitalize ${int.tagStyles}`}>
                            {int.tag}
                          </span>
                        </div>
                        <p className="text-xs text-text-secondary truncate">{int.role}</p>
                        
                        <div className="flex flex-wrap gap-4 text-[10px] text-text-secondary pt-0.5 font-medium">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-brand-green/30" />
                            {int.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <PlatformIcon className="w-3.5 h-3.5 text-brand-green/30" />
                            {int.mode}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right side: Join button only — no Reschedule */}
                    <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto pt-2 sm:pt-0">
                      <button className="flex-1 sm:flex-none bg-brand-green hover:bg-brand-gold hover:text-brand-green text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-xs">
                        Join
                      </button>
                    </div>
                  </div>
                );
              })
              )}
            </div>
          </div>

          {/* Checklist & Cell Tips (Right) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Checklist */}
            <div className="bg-white border border-[#eeeeec] p-5 rounded-2xl space-y-4 shadow-xs">
              <h2 className="font-serif text-lg font-bold text-brand-green border-b border-brand-green/5 pb-2">
                Prep checklist
              </h2>
              
              <div className="space-y-3.5">
                {checklist.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <button
                      onClick={() => toggleChecklist(item.id)}
                      className={`w-5 h-5 rounded-full flex items-center justify-center transition-all shrink-0 border ${
                        item.checked
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-600'
                          : 'bg-white border-brand-green/20 hover:border-brand-green/50'
                      }`}
                    >
                      {item.checked && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                    </button>
                    <span className={`text-xs font-semibold ${
                      item.checked
                        ? 'text-brand-green/40 line-through'
                        : 'text-brand-green'
                    }`}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* tips from cell guidelines card */}
            <div className="bg-white border border-[#eeeeec] p-5 rounded-2xl space-y-4 shadow-xs">
              <h2 className="font-serif text-lg font-bold text-brand-green border-b border-brand-green/5 pb-2">
                Tips from placement cell
              </h2>
              <p className="text-xs text-text-secondary leading-relaxed">
                Join virtual rounds 5 minutes early. Keep a printed copy of your resume for onsite interviews. Follow up within 24 hours with a thank-you note.
              </p>
            </div>

          </div>
        </div>

        {/* Past Interviews Table Card */}
        <div className="bg-white border border-[#eeeeec] rounded-2xl shadow-xs overflow-hidden">
          <div className="p-5 border-b border-brand-green/5 flex justify-between items-center bg-[#f9f8f3]/20">
            <h2 className="font-serif text-lg font-bold text-brand-green">Past interviews</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f4f3ea]/20 border-b border-brand-green/5 text-[10px] uppercase font-bold text-brand-green/50 tracking-wider">
                  <th className="p-5">Company</th>
                  <th className="p-5">Round</th>
                  <th className="p-5">Date</th>
                  <th className="p-5">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eeeeec] text-xs text-brand-green font-medium">
                {pastInterviewsList.map((past, idx) => (
                  <tr key={idx} className="hover:bg-brand-cream/10 transition-all">
                    <td className="p-5">
                      <div>
                        <span className="font-semibold block truncate leading-tight">{past.company}</span>
                        <span className="text-[10px] text-text-secondary mt-0.5 block">{past.role}</span>
                      </div>
                    </td>
                    <td className="p-5 text-text-secondary">{past.round}</td>
                    <td className="p-5 text-text-secondary">{past.date}</td>
                    <td className="p-5">
                      <span className={`text-[10px] font-bold px-3 py-1 rounded-full capitalize flex items-center gap-1 w-max ${past.styles}`}>
                        {past.isCleared ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5" />
                        )}
                        <span>{past.result}</span>
                      </span>
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

  // 5. HIGH-FIDELITY PROFILE & RESUME VIEW
  const renderProfile = () => {
    const handleResumeFileChange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      setIsUploading(true);
      try {
        setTimeout(async () => {
          setIsUploading(false);
          const res = await updateUserProfile({
            studentDetails: {
              ...user.studentDetails,
              resumeName: file.name
            }
          });
          if (res.success) {
            setSuccessMsg(`Resume "${file.name}" uploaded successfully!`);
          } else {
            alert(`Failed to save resume: ${res.error}`);
          }
          setTimeout(() => setSuccessMsg(''), 3000);
        }, 800);
      } catch (err) {
        setIsUploading(false);
        console.error(err);
        alert('Failed to upload resume.');
      }
    };

    const getStudentInitials = (name) => {
      if (!name) return 'ST';
      const words = name.trim().split(/\s+/);
      if (words.length === 0) return 'ST';
      if (words.length === 1) return words[0][0].toUpperCase();
      return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    };
    const initials = getStudentInitials(user?.name);
    
    
    // Skill tags grouped by categories or fallback
    const hasCustomSkills = user.studentDetails?.skills && user.studentDetails.skills.length > 0;
    const skillsCategories = hasCustomSkills 
      ? { 'MY SKILLS': user.studentDetails.skills }
      : {
          LANGUAGES: ['Python', 'TypeScript', 'Go', 'SQL', 'C++'],
          'ML & DATA': ['PyTorch', 'TensorFlow', 'scikit-learn', 'Pandas', 'Spark'],
          TOOLS: ['Docker', 'AWS', 'Git', 'Airflow', 'Figma']
        };

    const projectEntries = (user.studentDetails?.projects && user.studentDetails.projects.length > 0)
      ? user.studentDetails.projects
      : [
          {
            title: 'Realtime fraud detection (Internship — Vault Capital)',
            description: 'Built streaming ML pipeline on Kafka + PyTorch reducing fraud losses by 23%.',
            date: 'Summer 2025'
          },
          {
            title: 'Open-source — torch-ensemble',
            description: 'Maintainer of PyTorch utility lib with 1.2k stars and 40+ contributors.',
            date: '2024 - present'
          }
        ];

    const educationEntries = (user.studentDetails?.education && user.studentDetails.education.length > 0)
      ? user.studentDetails.education
      : [
          { school: 'IIT Delhi', degree: `B.Tech, ${user.studentDetails?.department || 'Computer Science & Engineering'}`, duration: `2022 - ${user.studentDetails?.batch || '2026'}`, grade: `CGPA ${user.studentDetails?.cgpa || '9.1'}` },
          { school: 'Delhi Public School, R.K. Puram', degree: 'CBSE Class XII', duration: '2022', grade: '97.4%' }
        ];

    const certEntries = (user.studentDetails?.certifications && user.studentDetails.certifications.length > 0)
      ? user.studentDetails.certifications
      : [
          { title: 'AWS Certified Solutions Architect – Associate', issuer: 'Amazon Web Services', date: 'Feb 2025' },
          { title: 'Neural Networks and Deep Learning', issuer: 'DeepLearning.AI', date: 'Oct 2024' }
        ];

    return (
      <div className="space-y-8 animate-fade-in-up">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="editorial-heading font-serif text-3xl font-bold text-brand-green">
              Profile & Resume
            </h1>
            <p className="text-text-secondary text-sm mt-1">
              Keep your profile up to date — recruiters search by skills and CGPA.
            </p>
          </div>
          <button 
            onClick={() => setShowEditModal(true)}
            className="bg-brand-green hover:bg-brand-gold hover:text-brand-green text-white py-2.5 px-4 rounded-xl flex items-center gap-2 font-semibold text-xs transition-all shadow-xs cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Edit profile</span>
          </button>
        </div>

        {/* Split grid 4:8 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column (Avatar card, profile strength, resume file) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Avatar & coordinates details */}
            <div className="bg-white border border-[#eeeeec] p-6 rounded-2xl shadow-xs text-center space-y-5">
              <div className="w-24 h-24 rounded-full bg-[#2e6b5e] text-white font-serif font-bold text-3xl flex items-center justify-center mx-auto shadow-sm ring-4 ring-[#2e6b5e]/5">
                {initials}
              </div>
              
              <div className="space-y-1">
                <h3 className="font-serif text-2xl font-bold text-brand-green">{user.name}</h3>
                <p className="text-xs text-text-secondary font-medium">B.Tech · {user.studentDetails?.department || 'Computer Science & Engineering'} · {user.studentDetails?.batch || '2026'}</p>
                <p className="text-[10px] text-text-secondary/60 font-semibold tracking-wider">Roll: {user.studentDetails?.roll || 'N/A'}</p>
              </div>

              <div className="flex justify-center items-center gap-2 pt-1">
                <span className="text-[10px] font-bold text-brand-gold bg-brand-gold/5 border border-brand-gold/25 px-3 py-1 rounded-full">
                  CGPA {user.studentDetails?.cgpa || 'N/A'}
                </span>
                <span className="text-[10px] font-bold text-teal-700 bg-teal-50 border border-teal-100 px-3 py-1 rounded-full">
                  Open to offers
                </span>
              </div>

              {/* Contact list with dynamic bindings */}
              <div className="border-t border-brand-green/5 pt-4 text-left space-y-2.5 text-xs text-brand-green/85 font-medium">
                <a href={`mailto:${user.email}`} className="flex items-center gap-3 hover:text-brand-gold transition-colors">
                  <Mail className="w-4 h-4 text-brand-green/30 shrink-0" />
                  <span className="truncate">{user.email}</span>
                </a>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-brand-green/30 shrink-0" />
                  <span>{user.studentDetails?.phone || '+91 99999 88888'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-brand-green/30 shrink-0" />
                  <span>{user.studentDetails?.location || 'New Delhi, India'}</span>
                </div>
                <a href="#linkedin" className="flex items-center gap-3 hover:text-brand-gold transition-colors">
                  <svg className="w-4 h-4 text-brand-green/30 shrink-0 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  <span>/in/{user.studentDetails?.linkedin || user.name.toLowerCase().replace(' ', '')}</span>
                </a>
                <a href="#github" className="flex items-center gap-3 hover:text-brand-gold transition-colors">
                  <svg className="w-4 h-4 text-brand-green/30 shrink-0 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span>github.com/{user.studentDetails?.github || user.name.toLowerCase().replace(' ', '')}</span>
                </a>
              </div>
            </div>

            {/* Profile strength card */}
            <div className="bg-white border border-[#eeeeec] p-5 rounded-2xl space-y-4 shadow-xs">
              <div className="flex justify-between items-center">
                <h3 className="font-serif text-lg font-bold text-brand-green">Profile strength</h3>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-bold text-brand-green">{profileStrengthScore}%</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    profileStrengthScore >= 80 
                      ? 'text-emerald-700 bg-emerald-55/15' 
                      : profileStrengthScore >= 50 
                        ? 'text-teal-700 bg-teal-55/15' 
                        : 'text-amber-700 bg-amber-55/15'
                  }`}>
                    {profileStrengthScore >= 80 ? 'Strong' : profileStrengthScore >= 50 ? 'Medium' : 'Weak'}
                  </span>
                </div>
              </div>

              <div className="w-full bg-[#f4f3ea] h-2.5 rounded-full overflow-hidden">
                <div className="bg-brand-gold h-2.5 rounded-full transition-all duration-500" style={{ width: `${profileStrengthScore}%` }}></div>
              </div>

              <div className="space-y-2 pt-1">
                {profileStrengthMetrics.map((strengthItem, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs font-semibold text-brand-green">
                    {strengthItem.done ? (
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-brand-green/20 shrink-0"></span>
                    )}
                    <span className={strengthItem.done ? 'text-brand-green/55' : 'text-brand-green'}>
                      {strengthItem.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Resume File asset */}
            <div className="bg-white border border-[#eeeeec] p-5 rounded-2xl space-y-4 shadow-xs">
              <h3 className="font-serif text-lg font-bold text-brand-green border-b border-brand-green/5 pb-2">
                Resume
              </h3>
              
              {successMsg && (
                <div className="bg-emerald-50 border-l-4 border-emerald-500 p-3 text-xs text-emerald-800 rounded-lg">
                  {successMsg}
                </div>
              )}

              <div className="border border-brand-green/5 bg-[#f4f3ea]/40 p-4 rounded-xl flex items-center gap-3">
                <FileText className="w-10 h-10 text-[#b38b3f] shrink-0" />
                <div className="overflow-hidden">
                  <span className="font-semibold text-xs text-brand-green block truncate">{user.studentDetails?.resumeName || 'upload_your_resume.pdf'}</span>
                  <span className="text-[10px] text-text-secondary block mt-0.5">PDF format · Max size 5MB</span>
                </div>
              </div>

              <input
                type="file"
                id="resume-file-input"
                accept=".pdf"
                className="hidden"
                onChange={handleResumeFileChange}
              />
              <button
                onClick={() => document.getElementById('resume-file-input').click()}
                disabled={isUploading}
                className="w-full bg-[#f4f3ea]/60 hover:bg-[#f4f3ea] border border-brand-green/5 hover:border-brand-gold text-brand-green font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <Upload className="w-4 h-4 shrink-0 text-brand-green/60" />
                <span>{isUploading ? 'Uploading...' : 'Upload new version'}</span>
              </button>
            </div>

          </div>

          {/* Right Column (About, Education, Skills, Projects) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* About Card */}
            <div className="bg-white border border-[#eeeeec] p-6 rounded-2xl space-y-3 shadow-xs">
              <h3 className="font-serif text-lg font-bold text-brand-green border-b border-brand-green/5 pb-2">
                About
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-medium">
                {user.studentDetails?.about || 'Student has not entered a bio yet. Click Edit Profile to share your background, interest, and goals.'}
              </p>
            </div>

            {/* Education Card */}
            <div className="bg-white border border-[#eeeeec] p-6 rounded-2xl space-y-4 shadow-xs">
              <div className="flex justify-between items-center border-b border-brand-green/5 pb-2">
                <h3 className="font-serif text-lg font-bold text-brand-green">Education</h3>
              </div>

              <div className="space-y-5">
                {educationEntries.map((edu, idx) => (
                  <div key={idx} className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#f4f3ea] text-brand-green/60 flex items-center justify-center shrink-0 border border-brand-green/5">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5 overflow-hidden">
                      <h4 className="font-bold text-brand-green text-sm sm:text-base leading-snug">{edu.school}</h4>
                      <p className="text-xs text-brand-green/70">{edu.degree} · {edu.duration}</p>
                      <p className="text-[11px] text-brand-gold font-bold pt-0.5">{edu.grade}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Inventory Matrix Card */}
            <div className="bg-white border border-[#eeeeec] p-6 rounded-2xl space-y-4 shadow-xs">
              <div className="flex justify-between items-center border-b border-brand-green/5 pb-2">
                <h3 className="font-serif text-lg font-bold text-brand-green">Skills</h3>
              </div>

              <div className="space-y-4 pt-1">
                {Object.entries(skillsCategories).map(([category, tagList]) => (
                  <div key={category} className="space-y-2">
                    <span className="text-[9px] text-brand-green/50 uppercase tracking-widest font-bold block">{category}</span>
                    <div className="flex flex-wrap gap-2">
                      {tagList.map((skill) => (
                        <span key={skill} className="bg-[#f4f3ea]/50 border border-brand-green/5 text-brand-green text-xs font-semibold px-3.5 py-1.5 rounded-xl shadow-xs transition-colors hover:border-brand-gold/30">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects & Experience Card */}
            <div className="bg-white border border-[#eeeeec] p-6 rounded-2xl space-y-4 shadow-xs">
              <div className="flex justify-between items-center border-b border-brand-green/5 pb-2">
                <h3 className="font-serif text-lg font-bold text-brand-green">Projects & experience</h3>
              </div>

              <div className="space-y-5 pt-1">
                {projectEntries.map((project, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <span className="w-1.5 h-16 bg-brand-green/10 rounded-full shrink-0 mt-1"></span>
                    <div className="space-y-1">
                      <div className="flex justify-between items-start gap-2 flex-wrap sm:flex-nowrap">
                        <h4 className="font-bold text-brand-green text-sm sm:text-base leading-snug">
                          {project.title}
                        </h4>
                        <span className="text-[10px] text-brand-gold font-bold shrink-0 pt-0.5">{project.date}</span>
                      </div>
                      <p className="text-xs text-text-secondary leading-relaxed font-medium">
                        {project.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications Card */}
            <div className="bg-white border border-[#eeeeec] p-6 rounded-2xl space-y-4 shadow-xs">
              <div className="flex justify-between items-center border-b border-brand-green/5 pb-2">
                <h3 className="font-serif text-lg font-bold text-brand-green">Certifications</h3>
              </div>

              <div className="space-y-4 pt-1">
                {certEntries.map((cert, idx) => (
                  <div key={idx} className="flex justify-between items-center gap-4 py-1">
                    <div>
                      <h4 className="font-bold text-brand-green text-xs sm:text-sm leading-snug">{cert.title}</h4>
                      <p className="text-xs text-text-secondary mt-0.5">{cert.issuer}</p>
                    </div>
                    <span className="text-[10px] text-brand-gold font-bold shrink-0">{cert.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Danger Zone: Delete Account */}
            <div className="bg-red-50/40 border border-red-200/50 p-6 rounded-2xl space-y-4 shadow-2xs">
              <div className="flex justify-between items-center border-b border-red-200/40 pb-2">
                <h3 className="font-serif text-lg font-bold text-red-800">Danger Zone</h3>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-semibold">
                <div className="space-y-1">
                  <p className="text-red-700 font-bold">Delete Student Account</p>
                  <p className="text-red-600/70 font-medium leading-normal">
                    Once you delete your account, all your active job applications, scheduled interviews, and notifications will be permanently removed from our system. This action is irreversible.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    const confirmFirst = window.confirm("Are you sure you want to permanently delete your student account? This cannot be undone.");
                    if (confirmFirst) {
                      const passwordConfirm = window.prompt("Please type DELETE to confirm your account deletion:");
                      if (passwordConfirm === "DELETE") {
                        try {
                          const res = await deleteUserAccount();
                          if (res.success) {
                            alert("Your account has been deleted successfully. We wish you the best in your career journey!");
                          } else {
                            alert(`Failed to delete account: ${res.error}`);
                          }
                        } catch (err) {
                          console.error("Error deleting student account:", err);
                        }
                      }
                    }
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs whitespace-nowrap shrink-0"
                >
                  Delete Account
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  };

  // 6. HIGH-FIDELITY NOTIFICATIONS VIEW
  const renderNotifications = () => {
    const myNotifications = notifications.filter(n => n.recipientEmail === user.email);
    const unreadCount = myNotifications.filter(n => !n.read).length;

    // Filter capsules row
    const notifFilters = ['All', 'Application Updates', 'Interview Alerts', 'Job Notifications', 'Reminders'];

    const getCategory = (notif) => {
      const title = notif.title.toLowerCase();
      const msg = notif.message.toLowerCase();
      if (title.includes('interview') || msg.includes('interview') || title.includes('round') || msg.includes('round')) {
        return 'Interview Alerts';
      }
      if (title.includes('job') || msg.includes('job') || title.includes('posting') || msg.includes('posting') || title.includes('role') || msg.includes('role') || title.includes('opportunity') || msg.includes('opportunity')) {
        return 'Job Notifications';
      }
      if (title.includes('reminder') || msg.includes('reminder') || title.includes('deadline') || msg.includes('deadline') || title.includes('warning') || msg.includes('warning') || title.includes('alert') || msg.includes('alert')) {
        return 'Reminders';
      }
      return 'Application Updates';
    };

    const getIconDetails = (notif) => {
      const cat = getCategory(notif);
      if (notif.type === 'success') {
        return {
          icon: CheckCircle2,
          iconStyles: 'bg-emerald-50 text-emerald-700 border border-emerald-100'
        };
      }
      if (notif.type === 'warning') {
        return {
          icon: AlertCircle,
          iconStyles: 'bg-red-50 text-red-700 border border-red-100'
        };
      }
      if (cat === 'Interview Alerts') {
        return {
          icon: Calendar,
          iconStyles: 'bg-amber-50 text-[#b38b3f] border border-amber-100'
        };
      }
      if (cat === 'Job Notifications') {
        return {
          icon: Briefcase,
          iconStyles: 'bg-teal-50 text-teal-700 border border-teal-100'
        };
      }
      if (cat === 'Reminders') {
        return {
          icon: Clock,
          iconStyles: 'bg-gray-50 text-brand-green/60 border border-gray-100'
        };
      }
      return {
        icon: FileText,
        iconStyles: 'bg-[#f4f3ea] text-brand-green/85 border border-[#eeeeec]'
      };
    };

    const notificationsFeed = myNotifications.map(n => {
      const details = getIconDetails(n);
      return {
        id: n.id,
        title: n.title,
        message: n.message,
        time: n.time || 'Just now',
        unread: !n.read,
        icon: details.icon,
        iconStyles: details.iconStyles,
        category: getCategory(n)
      };
    });

    const filteredNotifs = notificationsFeed.filter(n => {
      if (activeNotifFilter === 'All') return true;
      return n.category === activeNotifFilter;
    });

    return (
      <div className="space-y-8 animate-fade-in-up">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="editorial-heading font-serif text-3xl font-bold text-brand-green">
              Notifications
            </h1>
            <p className="text-text-secondary text-sm mt-1">
              {unreadCount} unread updates
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button 
              onClick={async () => {
                try {
                  await Promise.all(myNotifications.map(n => !n.read && markNotificationAsRead(n.id)));
                  setSuccessMsg('All updates marked as read.');
                  setTimeout(() => setSuccessMsg(''), 3000);
                } catch (err) {
                  console.error('Error marking all read:', err);
                }
              }}
              className="bg-[#f4f3ea]/60 hover:bg-[#f4f3ea] border border-brand-green/5 text-brand-green hover:text-brand-gold font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              Mark all as read
            </button>
            
            <button 
              onClick={async () => {
                if (window.confirm('Are you sure you want to clear all your notifications? This action cannot be undone.')) {
                  try {
                    const res = await clearNotifications();
                    if (res.success) {
                      setSuccessMsg('All notifications cleared successfully.');
                      setTimeout(() => setSuccessMsg(''), 3000);
                    } else {
                      alert(`Failed to clear notifications: ${res.error}`);
                    }
                  } catch (err) {
                    console.error('Error clearing notifications:', err);
                  }
                }
              }}
              className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              Clear all
            </button>
          </div>
        </div>

        {/* Toolbar Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {notifFilters.map((pill) => {
            const isActive = activeNotifFilter === pill;
            return (
              <button
                key={pill}
                onClick={() => setActiveNotifFilter(pill)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-brand-green text-white border-brand-green'
                    : 'bg-white hover:bg-[#f4f3ea]/35 text-brand-green border-[#eeeeec] hover:border-brand-green/30'
                }`}
              >
                {pill}
              </button>
            );
          })}
        </div>

        {/* Main Notifications Card feed */}
        <div className="bg-white border border-[#eeeeec] rounded-2xl shadow-xs overflow-hidden">
          <div className="p-5 border-b border-brand-green/5 flex justify-between items-center bg-[#f9f8f3]/20">
            <h2 className="font-serif text-lg font-bold text-brand-green">Recent</h2>
          </div>

          <div className="divide-y divide-[#eeeeec]">
            {filteredNotifs.length === 0 ? (
              <div className="text-center py-16 px-4">
                <p className="text-sm text-text-secondary">No recent notifications matching this filter.</p>
              </div>
            ) : (
              filteredNotifs.map((notif) => {
                const Icon = notif.icon;
                return (
                  <div key={notif.id} className="p-5 flex items-start sm:items-center justify-between gap-4 hover:bg-brand-cream/10 transition-colors">
                    
                    <div className="flex items-start sm:items-center gap-4 overflow-hidden">
                      {/* Left circular avatar background type */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${notif.iconStyles}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      
                      {/* Notification metadata content */}
                      <div className="space-y-0.5 overflow-hidden">
                        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                          <h4 className="font-bold text-brand-green text-sm sm:text-base leading-snug">
                            {notif.title}
                          </h4>
                          
                          {/* Gold Dot badge for Unread status */}
                          {notif.unread && (
                            <span className="w-2 h-2 rounded-full bg-brand-gold shrink-0 shadow-sm shadow-brand-gold/60" title="Unread"></span>
                          )}
                        </div>
                        <p className="text-xs text-text-secondary leading-relaxed font-medium">
                          {notif.message}
                        </p>
                        <span className="text-[10px] text-brand-gold font-semibold pt-0.5 block">{notif.time}</span>
                      </div>
                    </div>

                    {/* Right side View button */}
                    <button 
                      onClick={async () => {
                        if (notif.unread) {
                          await markNotificationAsRead(notif.id);
                        }
                      }}
                      className="bg-[#f4f3ea]/60 hover:bg-[#f4f3ea] text-brand-green text-[10px] font-bold px-3 py-1.5 rounded-lg border border-brand-green/5 transition-all shrink-0 cursor-pointer"
                    >
                      View
                    </button>
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
      {(() => {
        switch (activeSubTab) {
          case 'overview':
            return renderOverview();
          case 'jobs':
            return renderJobs();
          case 'applications':
            return renderApplications();
          case 'interviews':
            return renderInterviews();
          case 'profile':
            return renderProfile();
          case 'notifications':
            return renderNotifications();
          default:
            return renderOverview();
        }
      })()}

      {/* --- COMPANY PROFILE VIEW MODAL --- */}
      {showCompanyProfileModal && selectedCompanyProfile && (() => {
        const modalRecruiter = recruiters.find(r => r.recruiterDetails?.company?.toLowerCase() === selectedCompanyProfile.company?.toLowerCase()) || selectedCompanyProfile.recruiter;
        return (
          <div className="fixed inset-0 bg-[#022c22]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-brand-cream border border-[#f2efdf] max-w-2xl w-full rounded-3xl p-6.5 md:p-8 space-y-6 shadow-2xl animate-fade-in-up max-h-[90vh] overflow-y-auto scrollbar-hide text-[#022c22] text-xs font-semibold">
              {/* Header */}
              <div className="flex justify-between items-start border-b border-[#022c22]/10 pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-brand-gold text-[#022c22] text-2xl font-bold font-serif flex items-center justify-center shadow-md">
                    {selectedCompanyProfile.company ? selectedCompanyProfile.company[0].toUpperCase() : 'C'}
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#022c22]">{selectedCompanyProfile.company}</h3>
                    <p className="text-xs text-brand-gold font-extrabold mt-1 uppercase tracking-widest">
                      {modalRecruiter?.recruiterDetails?.industry || 'Technology'} · {modalRecruiter?.recruiterDetails?.companySize || '450+ employees'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => { setShowCompanyProfileModal(false); setSelectedCompanyProfile(null); }} 
                  className="text-[#022c22]/40 hover:text-[#022c22] p-1.5 hover:bg-[#022c22]/5 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5.5 h-5.5" />
                </button>
              </div>

              {/* Profile Content */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#022c22] font-semibold">
                {/* Left Details */}
                <div className="md:col-span-1 space-y-5 md:border-r md:border-[#022c22]/10 md:pr-6">
                  <div className="bg-white border border-[#022c22]/5 p-4 rounded-xl space-y-3">
                    <span className="text-[10px] text-brand-gold uppercase tracking-wider font-extrabold block">Profile stats</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-serif font-bold">{modalRecruiter?.recruiterDetails?.companyViews || 1}</span>
                      <span className="text-[10px] text-[#022c22]/50">Views</span>
                    </div>
                    <div className="pt-2 border-t border-[#022c22]/5 text-[10px] text-[#022c22]/70 space-y-1">
                      <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-brand-gold" /> {modalRecruiter?.recruiterDetails?.location || 'Bengaluru'}</div>
                      <div className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-brand-gold" /> {modalRecruiter?.recruiterDetails?.website || 'company.com'}</div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-extrabold">Contact email</label>
                    <p className="text-xs font-semibold">{modalRecruiter?.recruiterDetails?.contactEmail || modalRecruiter?.email || 'careers@company.com'}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-extrabold">Contact Phone</label>
                    <p className="text-xs font-semibold">{modalRecruiter?.recruiterDetails?.contactPhone || 'N/A'}</p>
                  </div>
                </div>

                {/* Right Content */}
                <div className="md:col-span-2 space-y-6">
                  <div>
                    <h4 className="font-serif text-sm font-bold border-b border-[#022c22]/5 pb-2 mb-2">About the Company</h4>
                    <p className="text-[#022c22]/75 leading-relaxed font-medium text-xs">
                      {modalRecruiter?.recruiterDetails?.about || 'No company bio provided yet.'}
                    </p>
                  </div>

                  {modalRecruiter?.recruiterDetails?.techStack && modalRecruiter.recruiterDetails.techStack.length > 0 && (
                    <div>
                      <h4 className="font-serif text-sm font-bold border-b border-[#022c22]/5 pb-2 mb-2">Tech Stack & Tools</h4>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {modalRecruiter.recruiterDetails.techStack.map(tech => (
                          <span key={tech} className="bg-white border border-[#022c22]/10 text-[#022c22] font-semibold text-[10px] px-2.5 py-0.5 rounded-full">{tech}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="font-serif text-sm font-bold border-b border-[#022c22]/5 pb-2 mb-2">What We Hire For</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                      {(modalRecruiter?.recruiterDetails?.whatWeHireFor || [
                        { title: 'Software Engineering', desc: 'Backend, infra, data platform' },
                        { title: 'Data Science', desc: 'Applied ML, forecasting, experimentation' }
                      ]).map((role, idx) => (
                        <div key={idx} className="bg-white border border-[#022c22]/5 p-3 rounded-xl">
                          <span className="font-bold text-[#022c22] block">{role.title}</span>
                          <span className="text-[10px] text-text-secondary font-medium block mt-1 leading-normal">{role.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end pt-4 border-t border-[#022c22]/5">
                <button 
                  onClick={() => { setShowCompanyProfileModal(false); setSelectedCompanyProfile(null); }}
                  className="bg-[#022c22] hover:bg-[#124237] text-white px-6 py-2 rounded-xl font-bold uppercase tracking-wider text-[10px] transition-colors cursor-pointer"
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        );
      })()}

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
          int => int.studentEmail === user.email && int.jobId === app.jobId
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
          // 1. Try to extract YYYY-MM-DD
          const matchYMD = dateStr.match(/\b(\d{4}-\d{2}-\d{2})\b/);
          if (matchYMD) {
            const d = new Date(matchYMD[1]);
            if (!isNaN(d.getTime())) return d;
          }
          // 2. Clean parenthetical parts and parse
          let cleanStr = dateStr;
          if (dateStr.includes(' · ')) {
            cleanStr = dateStr.split(' · ')[0];
          }
          cleanStr = cleanStr.replace(/\s*\([^)]*\)/g, '').trim();
          const d = new Date(cleanStr);
          return isNaN(d.getTime()) ? new Date(0) : d;
        };

        events.sort((a, b) => parseEventDate(a.date) - parseEventDate(b.date));

        return (
          <div className="fixed inset-0 bg-[#022c22]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-brand-cream border border-[#f2efdf] max-w-md w-full rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl animate-fade-in-up max-h-[90vh] overflow-y-auto scrollbar-hide text-[#022c22] text-xs font-semibold">
              {/* Header */}
              <div className="flex justify-between items-start border-b border-[#022c22]/10 pb-4">
                <div>
                  <span className="text-[10px] text-brand-gold font-extrabold uppercase tracking-widest block">Application Timeline</span>
                  <h3 className="font-serif text-xl font-bold text-[#022c22] mt-1">{job?.company || 'Company'}</h3>
                  <p className="text-xs text-text-secondary font-medium mt-0.5">{job?.title || 'Role'}</p>
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

      {/* --- JOB DETAILS VIEW MODAL --- */}
      {showJobDetailsModal && selectedJobDetails && (
        <div className="fixed inset-0 bg-[#022c22]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-brand-cream border border-[#f2efdf] max-w-lg w-full rounded-2xl p-6.5 space-y-6 shadow-2xl animate-fade-in-up max-h-[90vh] overflow-y-auto scrollbar-hide text-[#022c22] text-xs font-semibold">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-[#022c22]/5 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-brand-gold text-[#022c22] font-serif font-bold text-lg flex items-center justify-center rounded-xl shadow-xs shrink-0">
                  {selectedJobDetails.company ? selectedJobDetails.company[0].toUpperCase() : 'C'}
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#022c22] leading-tight">{selectedJobDetails.title}</h3>
                  <p className="text-[11px] text-brand-gold uppercase tracking-wider font-extrabold mt-1">{selectedJobDetails.company} · {selectedJobDetails.location}</p>
                </div>
              </div>
              <button 
                onClick={() => { setShowJobDetailsModal(false); setSelectedJobDetails(null); }} 
                className="text-[#022c22]/40 hover:text-[#022c22] p-1.5 hover:bg-[#022c22]/5 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5.5 h-5.5" />
              </button>
            </div>

            {/* Metrics block */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white border border-[#022c22]/5 p-3 rounded-xl text-center shadow-2xs">
                <span className="text-[9px] text-[#022c22]/50 uppercase tracking-wider block">Salary / Stipend</span>
                <span className="font-bold text-brand-green text-sm block mt-1">{selectedJobDetails.salary || 'Competitive'}</span>
              </div>
              <div className="bg-white border border-[#022c22]/5 p-3 rounded-xl text-center shadow-2xs">
                <span className="text-[9px] text-[#022c22]/50 uppercase tracking-wider block">Role Type</span>
                <span className="font-bold text-brand-green text-xs block mt-1.5 uppercase tracking-wide">{selectedJobDetails.type || 'Full-time'}</span>
              </div>
              <div className="bg-white border border-[#022c22]/5 p-3 rounded-xl text-center shadow-2xs">
                <span className="text-[9px] text-[#022c22]/50 uppercase tracking-wider block">Application Views</span>
                <span className="font-bold text-brand-green text-sm block mt-1">{selectedJobDetails.views || 0}</span>
              </div>
            </div>

            {/* Core Info */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-extrabold">Eligibility Requirements</label>
                <p className="bg-white border border-[#022c22]/5 p-3 rounded-xl font-medium leading-relaxed">{selectedJobDetails.eligibility || 'No strict criteria.'}</p>
              </div>

              {selectedJobDetails.skills && selectedJobDetails.skills.length > 0 && (
                <div className="space-y-1">
                  <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-extrabold">Required Skill Assets</label>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {selectedJobDetails.skills.map(skill => (
                      <span key={skill} className="bg-white border border-[#022c22]/10 text-[#022c22] font-semibold text-[10px] px-2.5 py-0.5 rounded-full">{skill}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] text-brand-gold uppercase tracking-wider block font-extrabold">Detailed Role Description</label>
                <p className="bg-white border border-[#022c22]/5 p-3.5 rounded-xl font-medium leading-relaxed text-[#022c22]/80 max-h-48 overflow-y-auto whitespace-pre-line">
                  {selectedJobDetails.description}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center pt-4 border-t border-[#022c22]/5">
              <span className="text-[10px] text-brand-gold font-bold uppercase tracking-wider">Deadline: {selectedJobDetails.deadline || 'No deadline'}</span>
              <div className="flex gap-2">
                <button 
                  onClick={() => { setShowJobDetailsModal(false); setSelectedJobDetails(null); }}
                  className="border border-[#022c22]/10 px-5 py-2 rounded-xl font-bold uppercase tracking-wider text-[10px] transition-colors cursor-pointer"
                >
                  Close
                </button>
                {!hasApplied(selectedJobDetails.id) && (
                  <button 
                    onClick={() => {
                      applyToJob(selectedJobDetails.id, user);
                      setShowJobDetailsModal(false);
                      setSelectedJobDetails(null);
                    }}
                    className="bg-brand-green hover:bg-brand-gold hover:text-brand-green text-white px-5 py-2 rounded-xl font-bold uppercase tracking-wider text-[10px] transition-colors cursor-pointer shadow-xs"
                  >
                    Apply Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- EDIT PROFILE POPUP MODAL --- */}
      {showEditModal && (
        <div className="fixed inset-0 bg-[#022c22]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-brand-cream border border-[#f2efdf] max-w-2xl w-full rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl animate-fade-in-up max-h-[90vh] overflow-y-auto scrollbar-hide text-[#022c22] text-xs font-semibold">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-[#022c22]/10 pb-4">
              <div>
                <span className="text-[10px] text-brand-gold font-extrabold uppercase tracking-widest block">Customize Profile</span>
                <h3 className="font-serif text-xl font-bold text-[#022c22] mt-1">Edit Profile & Credentials</h3>
              </div>
              <button 
                onClick={() => setShowEditModal(false)}
                className="text-[#022c22]/40 hover:text-[#022c22] p-1.5 hover:bg-[#022c22]/5 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5.5 h-5.5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="font-serif text-xs font-bold text-brand-gold uppercase tracking-wider border-b border-[#022c22]/5 pb-2">
                  Basic Coordinates & Info
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] text-[#022c22]/50 uppercase tracking-wider block font-bold mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={profileForm.name}
                      onChange={e => setFormState(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-white border border-[#022c22]/10 rounded-xl px-3 py-2 text-[#022c22] font-medium outline-none focus:border-brand-gold transition-colors text-xs"
                      placeholder="e.g. Aarav Sharma"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-[#022c22]/50 uppercase tracking-wider block font-bold mb-1">Phone Number *</label>
                    <input
                      type="text"
                      required
                      value={profileForm.phone}
                      onChange={e => setFormState(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full bg-white border border-[#022c22]/10 rounded-xl px-3 py-2 text-[#022c22] font-medium outline-none focus:border-brand-gold transition-colors text-xs"
                      placeholder="e.g. +91 98765 43210"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-[#022c22]/50 uppercase tracking-wider block font-bold mb-1">Department *</label>
                    <input
                      type="text"
                      required
                      value={profileForm.department}
                      onChange={e => setFormState(prev => ({ ...prev, department: e.target.value }))}
                      className="w-full bg-white border border-[#022c22]/10 rounded-xl px-3 py-2 text-[#022c22] font-medium outline-none focus:border-brand-gold transition-colors text-xs"
                      placeholder="e.g. Computer Science"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-[#022c22]/50 uppercase tracking-wider block font-bold mb-1">Roll Number *</label>
                    <input
                      type="text"
                      required
                      value={profileForm.roll}
                      onChange={e => setFormState(prev => ({ ...prev, roll: e.target.value }))}
                      className="w-full bg-white border border-[#022c22]/10 rounded-xl px-3 py-2 text-[#022c22] font-medium outline-none focus:border-brand-gold transition-colors text-xs"
                      placeholder="e.g. 2022CS10108"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-[#022c22]/50 uppercase tracking-wider block font-bold mb-1">CGPA *</label>
                    <input
                      type="text"
                      required
                      value={profileForm.cgpa}
                      onChange={e => setFormState(prev => ({ ...prev, cgpa: e.target.value }))}
                      className="w-full bg-white border border-[#022c22]/10 rounded-xl px-3 py-2 text-[#022c22] font-medium outline-none focus:border-brand-gold transition-colors text-xs"
                      placeholder="e.g. 9.15"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-[#022c22]/50 uppercase tracking-wider block font-bold mb-1">Graduation Batch *</label>
                    <input
                      type="text"
                      required
                      value={profileForm.batch}
                      onChange={e => setFormState(prev => ({ ...prev, batch: e.target.value }))}
                      className="w-full bg-white border border-[#022c22]/10 rounded-xl px-3 py-2 text-[#022c22] font-medium outline-none focus:border-brand-gold transition-colors text-xs"
                      placeholder="e.g. 2026"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-[#022c22]/50 uppercase tracking-wider block font-bold mb-1">Location *</label>
                    <input
                      type="text"
                      required
                      value={profileForm.location}
                      onChange={e => setFormState(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full bg-white border border-[#022c22]/10 rounded-xl px-3 py-2 text-[#022c22] font-medium outline-none focus:border-brand-gold transition-colors text-xs"
                      placeholder="e.g. New Delhi, India"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-[#022c22]/50 uppercase tracking-wider block font-bold mb-1">Skill Assets (Comma-separated) *</label>
                    <input
                      type="text"
                      required
                      value={profileForm.skills}
                      onChange={e => setFormState(prev => ({ ...prev, skills: e.target.value }))}
                      className="w-full bg-white border border-[#022c22]/10 rounded-xl px-3 py-2 text-[#022c22] font-medium outline-none focus:border-brand-gold transition-colors text-xs"
                      placeholder="e.g. React, Python, Kafka"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-[#022c22]/50 uppercase tracking-wider block font-bold mb-1">LinkedIn URL</label>
                    <input
                      type="text"
                      value={profileForm.linkedin}
                      onChange={e => setFormState(prev => ({ ...prev, linkedin: e.target.value }))}
                      className="w-full bg-white border border-[#022c22]/10 rounded-xl px-3 py-2 text-[#022c22] font-medium outline-none focus:border-brand-gold transition-colors text-xs"
                      placeholder="e.g. https://linkedin.com/in/username"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-[#022c22]/50 uppercase tracking-wider block font-bold mb-1">GitHub URL</label>
                    <input
                      type="text"
                      value={profileForm.github}
                      onChange={e => setFormState(prev => ({ ...prev, github: e.target.value }))}
                      className="w-full bg-white border border-[#022c22]/10 rounded-xl px-3 py-2 text-[#022c22] font-medium outline-none focus:border-brand-gold transition-colors text-xs"
                      placeholder="e.g. https://github.com/username"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[9px] text-[#022c22]/50 uppercase tracking-wider block font-bold mb-1">Professional Summary / About *</label>
                    <textarea
                      required
                      value={profileForm.about}
                      onChange={e => setFormState(prev => ({ ...prev, about: e.target.value }))}
                      rows="3"
                      className="w-full bg-white border border-[#022c22]/10 rounded-xl px-3 py-2 text-[#022c22] font-medium outline-none focus:border-brand-gold transition-colors text-xs resize-none"
                      placeholder="Share a short bio summarizing your background..."
                    />
                  </div>
                </div>
              </div>

              {/* Education Section */}
              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center border-b border-[#022c22]/5 pb-2">
                  <h4 className="font-serif text-xs font-bold text-brand-gold uppercase tracking-wider">
                    Education History
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddEducation}
                    className="bg-brand-green hover:bg-brand-gold text-white hover:text-brand-green py-1.5 px-3 rounded-lg flex items-center gap-1 font-bold uppercase tracking-wider text-[9px] transition-colors cursor-pointer shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
                {profileForm.education.length === 0 ? (
                  <p className="text-[10px] text-[#022c22]/50 italic">No education entries added yet. Click "+ Add" to include one.</p>
                ) : (
                  <div className="space-y-4">
                    {profileForm.education.map((edu, idx) => (
                      <div key={idx} className="bg-white/60 border border-[#022c22]/5 p-4 rounded-2xl relative space-y-3 shadow-2xs">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-brand-gold uppercase tracking-wider font-extrabold">Education #{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveEducation(idx)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded-full transition-colors cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[9px] text-[#022c22]/50 uppercase tracking-wider block font-bold mb-1">School / University *</label>
                            <input
                              type="text"
                              required
                              value={edu.school || ''}
                              onChange={(e) => {
                                const newEdu = [...profileForm.education];
                                newEdu[idx] = { ...newEdu[idx], school: e.target.value };
                                setFormState(prev => ({ ...prev, education: newEdu }));
                              }}
                              className="w-full bg-white border border-[#022c22]/10 rounded-xl px-3 py-2 text-[#022c22] font-medium outline-none focus:border-brand-gold transition-colors text-xs"
                              placeholder="e.g. IIT Delhi"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] text-[#022c22]/50 uppercase tracking-wider block font-bold mb-1">Degree / Course *</label>
                            <input
                              type="text"
                              required
                              value={edu.degree || ''}
                              onChange={(e) => {
                                const newEdu = [...profileForm.education];
                                newEdu[idx] = { ...newEdu[idx], degree: e.target.value };
                                setFormState(prev => ({ ...prev, education: newEdu }));
                              }}
                              className="w-full bg-white border border-[#022c22]/10 rounded-xl px-3 py-2 text-[#022c22] font-medium outline-none focus:border-brand-gold transition-colors text-xs"
                              placeholder="e.g. B.Tech Computer Science"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] text-[#022c22]/50 uppercase tracking-wider block font-bold mb-1">Duration *</label>
                            <input
                              type="text"
                              required
                              value={edu.duration || ''}
                              onChange={(e) => {
                                const newEdu = [...profileForm.education];
                                newEdu[idx] = { ...newEdu[idx], duration: e.target.value };
                                setFormState(prev => ({ ...prev, education: newEdu }));
                              }}
                              className="w-full bg-white border border-[#022c22]/10 rounded-xl px-3 py-2 text-[#022c22] font-medium outline-none focus:border-brand-gold transition-colors text-xs"
                              placeholder="e.g. 2022 - 2026"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] text-[#022c22]/50 uppercase tracking-wider block font-bold mb-1">Grade / CGPA</label>
                            <input
                              type="text"
                              value={edu.grade || ''}
                              onChange={(e) => {
                                const newEdu = [...profileForm.education];
                                newEdu[idx] = { ...newEdu[idx], grade: e.target.value };
                                setFormState(prev => ({ ...prev, education: newEdu }));
                              }}
                              className="w-full bg-white border border-[#022c22]/10 rounded-xl px-3 py-2 text-[#022c22] font-medium outline-none focus:border-brand-gold transition-colors text-xs"
                              placeholder="e.g. CGPA 9.1"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Projects Section */}
              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center border-b border-[#022c22]/5 pb-2">
                  <h4 className="font-serif text-xs font-bold text-brand-gold uppercase tracking-wider">
                    Projects & Internships
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddProject}
                    className="bg-brand-green hover:bg-brand-gold text-white hover:text-brand-green py-1.5 px-3 rounded-lg flex items-center gap-1 font-bold uppercase tracking-wider text-[9px] transition-colors cursor-pointer shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
                {profileForm.projects.length === 0 ? (
                  <p className="text-[10px] text-[#022c22]/50 italic">No projects added yet. Click "+ Add" to include one.</p>
                ) : (
                  <div className="space-y-4">
                    {profileForm.projects.map((proj, idx) => (
                      <div key={idx} className="bg-white/60 border border-[#022c22]/5 p-4 rounded-2xl relative space-y-3 shadow-2xs">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-brand-gold uppercase tracking-wider font-extrabold">Project / Internship #{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveProject(idx)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded-full transition-colors cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="sm:col-span-2">
                            <label className="text-[9px] text-[#022c22]/50 uppercase tracking-wider block font-bold mb-1">Project Title / Role *</label>
                            <input
                              type="text"
                              required
                              value={proj.title || ''}
                              onChange={(e) => {
                                const newProj = [...profileForm.projects];
                                newProj[idx] = { ...newProj[idx], title: e.target.value };
                                setFormState(prev => ({ ...prev, projects: newProj }));
                              }}
                              className="w-full bg-white border border-[#022c22]/10 rounded-xl px-3 py-2 text-[#022c22] font-medium outline-none focus:border-brand-gold transition-colors text-xs"
                              placeholder="e.g. OpenAI GPT Integration"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] text-[#022c22]/50 uppercase tracking-wider block font-bold mb-1">Date / Period *</label>
                            <input
                              type="text"
                              required
                              value={proj.date || ''}
                              onChange={(e) => {
                                const newProj = [...profileForm.projects];
                                newProj[idx] = { ...newProj[idx], date: e.target.value };
                                setFormState(prev => ({ ...prev, projects: newProj }));
                              }}
                              className="w-full bg-white border border-[#022c22]/10 rounded-xl px-3 py-2 text-[#022c22] font-medium outline-none focus:border-brand-gold transition-colors text-xs"
                              placeholder="e.g. Summer 2025"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="text-[9px] text-[#022c22]/50 uppercase tracking-wider block font-bold mb-1">Brief Description *</label>
                            <textarea
                              required
                              value={proj.description || ''}
                              onChange={(e) => {
                                const newProj = [...profileForm.projects];
                                newProj[idx] = { ...newProj[idx], description: e.target.value };
                                setFormState(prev => ({ ...prev, projects: newProj }));
                              }}
                              rows="2"
                              className="w-full bg-white border border-[#022c22]/10 rounded-xl px-3 py-2 text-[#022c22] font-medium outline-none focus:border-brand-gold transition-colors text-xs resize-none"
                              placeholder="Describe your achievements and technologies used..."
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Certifications Section */}
              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center border-b border-[#022c22]/5 pb-2">
                  <h4 className="font-serif text-xs font-bold text-brand-gold uppercase tracking-wider">
                    Certifications & Credentials
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddCertification}
                    className="bg-brand-green hover:bg-brand-gold text-white hover:text-brand-green py-1.5 px-3 rounded-lg flex items-center gap-1 font-bold uppercase tracking-wider text-[9px] transition-colors cursor-pointer shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
                {profileForm.certifications.length === 0 ? (
                  <p className="text-[10px] text-[#022c22]/50 italic">No certifications added yet. Click "+ Add" to include one.</p>
                ) : (
                  <div className="space-y-4">
                    {profileForm.certifications.map((cert, idx) => (
                      <div key={idx} className="bg-white/60 border border-[#022c22]/5 p-4 rounded-2xl relative space-y-3 shadow-2xs">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-brand-gold uppercase tracking-wider font-extrabold">Certification #{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveCertification(idx)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded-full transition-colors cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[9px] text-[#022c22]/50 uppercase tracking-wider block font-bold mb-1">Certification Name *</label>
                            <input
                              type="text"
                              required
                              value={cert.title || ''}
                              onChange={(e) => {
                                const newCert = [...profileForm.certifications];
                                newCert[idx] = { ...newCert[idx], title: e.target.value };
                                setFormState(prev => ({ ...prev, certifications: newCert }));
                              }}
                              className="w-full bg-white border border-[#022c22]/10 rounded-xl px-3 py-2 text-[#022c22] font-medium outline-none focus:border-brand-gold transition-colors text-xs"
                              placeholder="e.g. AWS Solutions Architect"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] text-[#022c22]/50 uppercase tracking-wider block font-bold mb-1">Issuer / Organization *</label>
                            <input
                              type="text"
                              required
                              value={cert.issuer || ''}
                              onChange={(e) => {
                                const newCert = [...profileForm.certifications];
                                newCert[idx] = { ...newCert[idx], issuer: e.target.value };
                                setFormState(prev => ({ ...prev, certifications: newCert }));
                              }}
                              className="w-full bg-white border border-[#022c22]/10 rounded-xl px-3 py-2 text-[#022c22] font-medium outline-none focus:border-brand-gold transition-colors text-xs"
                              placeholder="e.g. Amazon Web Services"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] text-[#022c22]/50 uppercase tracking-wider block font-bold mb-1">Date Issued *</label>
                            <input
                              type="text"
                              required
                              value={cert.date || ''}
                              onChange={(e) => {
                                const newCert = [...profileForm.certifications];
                                newCert[idx] = { ...newCert[idx], date: e.target.value };
                                setFormState(prev => ({ ...prev, certifications: newCert }));
                              }}
                              className="w-full bg-white border border-[#022c22]/10 rounded-xl px-3 py-2 text-[#022c22] font-medium outline-none focus:border-brand-gold transition-colors text-xs"
                              placeholder="e.g. Feb 2025"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[#022c22]/10">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="border border-[#022c22]/15 hover:bg-[#022c22]/5 text-[#022c22] px-6 py-2.5 rounded-xl font-bold uppercase tracking-wider text-[10px] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-brand-green hover:bg-brand-gold hover:text-brand-green text-white px-6 py-2.5 rounded-xl font-bold uppercase tracking-wider text-[10px] transition-colors cursor-pointer shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
