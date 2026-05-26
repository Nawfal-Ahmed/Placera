import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const PortalStateContext = createContext(null);

export const PortalStateProvider = ({ children }) => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [students, setStudents] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [eligibilityList, setEligibilityList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Helper to get authorization headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('placera_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // Fetch all state data from server when user session is active
  const fetchPortalData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const headers = getAuthHeaders();

      // 1. Fetch Jobs
      const jobsRes = await fetch('/api/jobs', { headers });
      const jobsData = await jobsRes.json();
      if (jobsData.success) {
        // Map _id to id for seamless UI compatibility
        setJobs(jobsData.jobs.map(j => ({ ...j, id: j._id })));
      }

      // 2. Fetch Applications
      const appsRes = await fetch('/api/applications', { headers });
      const appsData = await appsRes.json();
      if (appsData.success) {
        setApplications(appsData.applications.map(a => ({ ...a, id: a._id })));
      }

      // 3. Fetch Interviews
      const intsRes = await fetch('/api/interviews', { headers });
      const intsData = await intsRes.json();
      if (intsData.success) {
        setInterviews(intsData.interviews.map(i => ({ ...i, id: i._id })));
      }

      // 4. Fetch Notifications
      const notifsRes = await fetch('/api/notifications', { headers });
      const notifsData = await notifsRes.json();
      if (notifsData.success) {
        setNotifications(notifsData.notifications.map(n => ({ ...n, id: n._id })));
      }

      // 5. Fetch Students
      const studentsRes = await fetch('/api/auth/students', { headers });
      const studentsData = await studentsRes.json();
      if (studentsData.success) {
        setStudents(studentsData.students);
      }

      // 6. Fetch Recruiters
      const recruitersRes = await fetch('/api/auth/recruiters', { headers });
      const recruitersData = await recruitersRes.json();
      if (recruitersData.success) {
        setRecruiters(recruitersData.recruiters);
      }

      // 7. Fetch Eligibility Criteria
      const eligibilityRes = await fetch('/api/eligibility', { headers });
      const eligibilityData = await eligibilityRes.json();
      if (eligibilityData.success) {
        setEligibilityList(eligibilityData.criteria);
      }
    } catch (err) {
      console.error('Error loading dynamic portal state:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPortalDataLightweight = async () => {
    if (!user) return;
    try {
      const headers = getAuthHeaders();

      // 1. Fetch Notifications
      const notifsRes = await fetch('/api/notifications', { headers });
      const notifsData = await notifsRes.json();
      if (notifsData && notifsData.success) {
        setNotifications(notifsData.notifications.map(n => ({ ...n, id: n._id })));
      }

      // 2. Fetch Jobs
      const jobsRes = await fetch('/api/jobs', { headers });
      const jobsData = await jobsRes.json();
      if (jobsData && jobsData.success) {
        setJobs(jobsData.jobs.map(j => ({ ...j, id: j._id })));
      }

      // 3. Fetch Applications
      const appsRes = await fetch('/api/applications', { headers });
      const appsData = await appsRes.json();
      if (appsData && appsData.success) {
        setApplications(appsData.applications.map(a => ({ ...a, id: a._id })));
      }

      // 4. Fetch Interviews
      const intsRes = await fetch('/api/interviews', { headers });
      const intsData = await intsRes.json();
      if (intsData && intsData.success) {
        setInterviews(intsData.interviews.map(i => ({ ...i, id: i._id })));
      }

      // 5. Fetch Students
      const studentsRes = await fetch('/api/auth/students', { headers });
      const studentsData = await studentsRes.json();
      if (studentsData && studentsData.success) {
        setStudents(studentsData.students);
      }

      // 6. Fetch Recruiters
      const recruitersRes = await fetch('/api/auth/recruiters', { headers });
      const recruitersData = await recruitersRes.json();
      if (recruitersData && recruitersData.success) {
        setRecruiters(recruitersData.recruiters);
      }

      // 7. Fetch Eligibility Criteria
      const eligibilityRes = await fetch('/api/eligibility', { headers });
      const eligibilityData = await eligibilityRes.json();
      if (eligibilityData && eligibilityData.success) {
        setEligibilityList(eligibilityData.criteria);
      }
    } catch (err) {
      console.error('Error in lightweight background sync:', err);
    }
  };

  // Fetch data on login session update
  useEffect(() => {
    if (user) {
      fetchPortalData();
    } else {
      // Clear state on logout
      setJobs([]);
      setApplications([]);
      setInterviews([]);
      setNotifications([]);
      setStudents([]);
      setRecruiters([]);
      setEligibilityList([]);
    }
  }, [user]);

  // Set up background polling sync every 3 seconds for real-time notifications
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      fetchPortalDataLightweight();
    }, 3000);

    return () => clearInterval(interval);
  }, [user]);

  // Methods linked directly to backend REST endpoints

  const addJob = async (newJob) => {
    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newJob)
      });
      const data = await response.json();
      if (data.success && data.job) {
        const mappedJob = { ...data.job, id: data.job._id };
        setJobs(prev => [mappedJob, ...prev]);

        // Send admin notification
        await addNotification(
          'admin@placera.edu',
          'New Job Posting Requiring Approval',
          `${newJob.company} has posted a new role: "${newJob.title}".`,
          'warning'
        );
        return { success: true, job: mappedJob };
      }
      return { success: false, error: data.message || 'Failed to post job' };
    } catch (error) {
      console.error('Error posting job:', error);
      return { success: false, error: error.message || 'Network error' };
    }
  };

  const approveJob = async (jobId, tier = '') => {
    try {
      const response = await fetch(`/api/jobs/${jobId}/approve`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ tier })
      });
      const data = await response.json();
      if (data.success && data.job) {
        const mappedJob = { ...data.job, id: data.job._id };
        setJobs(prev => prev.map(job => job.id === jobId ? mappedJob : job));
        
        // Notify recruiter (Helix Analytics or matched user)
        const targetJob = jobs.find(j => j.id === jobId);
        if (targetJob) {
          // Resolve recruiter email dynamically by company name
          const recruiter = recruiters.find(r => r.recruiterDetails?.company?.toLowerCase() === targetJob.company.toLowerCase());
          const recruiterEmail = recruiter ? recruiter.email : 'talent@helixanalytics.com';
          await addNotification(
            recruiterEmail,
            'Job Listing Approved',
            `Your job posting "${targetJob.title}" has been approved by the Admin and is now live.`,
            'success'
          );
        }
      }
    } catch (error) {
      console.error('Error approving job:', error);
    }
  };

  const rejectJob = async (jobId) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}/reject`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        // Update job status to Rejected in frontend state
        setJobs(prev => prev.map(job => job.id === jobId ? { ...job, status: 'Rejected' } : job));
      }
    } catch (error) {
      console.error('Error rejecting job:', error);
    }
  };

  const applyToJob = async (jobId, student) => {
    const targetJob = jobs.find(j => j.id === jobId);
    if (!targetJob) return;

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          jobId,
          studentEmail: student.email,
          studentName: student.name,
          department: student.studentDetails?.department || 'Computer Science & Engineering',
          cgpa: student.studentDetails?.cgpa || '9.0',
          skills: student.studentDetails?.skills || []
        })
      });
      const data = await response.json();
      if (data.success && data.application) {
        const mappedApp = { ...data.application, id: data.application._id };
        setApplications(prev => [...prev, mappedApp]);

        // Send recruiter notification dynamically
        const recruiter = recruiters.find(r => r.recruiterDetails?.company?.toLowerCase() === targetJob.company.toLowerCase());
        const recruiterEmail = recruiter ? recruiter.email : 'talent@helixanalytics.com';
        await addNotification(
          recruiterEmail,
          'New Job Applicant',
          `${student.name} applied for "${targetJob.title}".`,
          'info'
        );
      }
    } catch (error) {
      console.error('Error applying to job:', error);
    }
  };

  const updateApplicationStatus = async (appId, newStatus) => {
    try {
      const response = await fetch(`/api/applications/${appId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus })
      });
      const data = await response.json();
      if (data.success && data.application) {
        setApplications(prev => prev.map(app => app.id === appId ? { ...app, status: newStatus } : app));

        const app = applications.find(a => a.id === appId);
        if (app) {
          const targetJob = jobs.find(j => j.id === app.jobId);
          await addNotification(
            app.studentEmail,
            'Application Status Update',
            `Your application for ${targetJob?.company || 'Company'} - ${targetJob?.title || 'Role'} has been marked as "${newStatus}".`,
            newStatus === 'Rejected' ? 'error' : 'success'
          );
        }
      }
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  const updateApplicationCtc = async (appId, ctc, extraFields = {}) => {
    try {
      const response = await fetch(`/api/applications/${appId}/ctc`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ ctc, ...extraFields })
      });
      const data = await response.json();
      if (data.success && data.application) {
        setApplications(prev => prev.map(app => app.id === appId ? { ...app, ctc, ...extraFields } : app));
        return { success: true };
      }
      return { success: false, error: data.message };
    } catch (error) {
      console.error('Error updating application CTC:', error);
      return { success: false, error: 'Network error' };
    }
  };

  const scheduleInterview = async (appId, round, dateTime, mode, link) => {
    const app = applications.find(a => a.id === appId);
    if (!app) return;

    const targetJob = jobs.find(j => j.id === app.jobId);

    try {
      // 1. Create Interview
      const response = await fetch('/api/interviews', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          jobId: app.jobId,
          company: targetJob?.company || 'Company',
          studentName: app.studentName,
          studentEmail: app.studentEmail,
          round,
          dateTime,
          mode,
          link
        })
      });
      const data = await response.json();
      if (data.success && data.interview) {
        const mappedInt = { ...data.interview, id: data.interview._id };
        setInterviews(prev => [...prev, mappedInt]);

        // 2. Update Application Status to Interview
        await updateApplicationStatus(appId, 'Interview');

        // 3. Notify Student
        await addNotification(
          app.studentEmail,
          'Interview Scheduled',
          `Your interview for ${targetJob?.company || 'Company'} (${round}) is scheduled for ${dateTime}.`,
          'success'
        );
      }
    } catch (error) {
      console.error('Error scheduling interview:', error);
    }
  };

  const updateInterviewStatus = async (interviewId, status, result) => {
    try {
      const body = { status };
      if (result !== undefined) body.result = result;
      const response = await fetch(`/api/interviews/${interviewId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(body)
      });
      const data = await response.json();
      if (data.success && data.interview) {
        setInterviews(prev => prev.map(int => int.id === interviewId ? { ...int, status, ...(result !== undefined ? { result } : {}) } : int));
      }
    } catch (error) {
      console.error('Error updating interview status:', error);
    }
  };


  const addNotification = async (recipientEmail, title, message, type = 'info') => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          recipientEmail,
          title,
          message,
          type
        })
      });
      const data = await response.json();
      if (data.success && data.notification) {
        const mappedNotif = { ...data.notification, id: data.notification._id };
        setNotifications(prev => [mappedNotif, ...prev]);
      }
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  const markNotificationAsRead = async (notifId) => {
    try {
      const response = await fetch(`/api/notifications/${notifId}/read`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
      }
    } catch (error) {
      console.error('Error marking notification read:', error);
    }
  };

  const clearNotifications = async () => {
    try {
      const response = await fetch('/api/notifications/clear', {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setNotifications([]);
        return { success: true };
      }
      return { success: false, error: data.message || 'Failed to clear notifications' };
    } catch (error) {
      console.error('Error clearing notifications:', error);
      return { success: false, error: 'Network error' };
    }
  };

  const addStudent = async (studentData) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: studentData.name,
          email: studentData.email,
          password: 'password123',
          role: 'student',
          studentDetails: {
            roll: studentData.roll,
            cgpa: studentData.cgpa,
            department: studentData.department,
            batch: studentData.batch || '2026',
            skills: studentData.skills || [],
            appliedJobsCount: 0,
            interviewsCount: 0
          }
        })
      });
      const data = await response.json();
      if (data.success && data.user) {
        setStudents(prev => [data.user, ...prev]);
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Error registering student:', error);
      return { success: false, error: 'Network error' };
    }
  };

  const addRecruiter = async (recruiterData) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: recruiterData.name,
          email: recruiterData.email,
          password: 'password123',
          role: 'recruiter',
          recruiterDetails: {
            company: recruiterData.company,
            industry: recruiterData.industry,
            tier: recruiterData.tier || 'Tier 1',
            status: recruiterData.status || 'Pending',
            activeJobsCount: 0,
            totalApplicantsCount: 0
          }
        })
      });
      const data = await response.json();
      if (data.success && data.user) {
        setRecruiters(prev => [data.user, ...prev]);
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Error registering recruiter:', error);
      return { success: false, error: 'Network error' };
    }
  };

  const verifyRecruiter = async (recruiterId) => {
    try {
      const response = await fetch(`/api/auth/users/${recruiterId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          recruiterDetails: {
            status: 'Verified'
          }
        })
      });
      const data = await response.json();
      if (data.success && data.user) {
        setRecruiters(prev => prev.map(rec => rec._id === recruiterId ? data.user : rec));
        return { success: true };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Error verifying recruiter:', error);
      return { success: false, error: 'Network error' };
    }
  };

  const addEligibility = async (title, detail) => {
    try {
      const response = await fetch('/api/eligibility', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ title, detail })
      });
      const data = await response.json();
      if (data.success && data.criteria) {
        setEligibilityList(prev => [...prev, data.criteria]);
        return { success: true };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Error adding eligibility:', error);
      return { success: false, error: 'Network error' };
    }
  };

  const updateEligibility = async (id, title, detail) => {
    try {
      const response = await fetch(`/api/eligibility/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ title, detail })
      });
      const data = await response.json();
      if (data.success && data.criteria) {
        setEligibilityList(prev => prev.map(c => c._id === id ? data.criteria : c));
        return { success: true };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Error updating eligibility:', error);
      return { success: false, error: 'Network error' };
    }
  };

  const deleteEligibility = async (id) => {
    try {
      const response = await fetch(`/api/eligibility/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setEligibilityList(prev => prev.filter(c => c._id !== id));
        return { success: true };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Error deleting eligibility:', error);
      return { success: false, error: 'Network error' };
    }
  };

  const updateJob = async (jobId, updatedFields) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedFields)
      });
      const data = await response.json();
      if (data.success && data.job) {
        const mappedJob = { ...data.job, id: data.job._id };
        setJobs(prev => prev.map(job => job.id === jobId ? mappedJob : job));
        return { success: true };
      }
      return { success: false, error: data.message || 'Failed to update job' };
    } catch (error) {
      console.error('Error updating job context action:', error);
      return { success: false, error: 'Network error' };
    }
  };

  const deleteJob = async (jobId) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        // Admin hard delete: remove from all local state
        setJobs(prev => prev.filter(job => job.id !== jobId));
        setApplications(prev => prev.filter(app => app.jobId !== jobId));
        setInterviews(prev => prev.filter(int => int.jobId !== jobId));
        return { success: true };
      }
      return { success: false, error: data.message || 'Failed to delete job' };
    } catch (error) {
      console.error('Error deleting job context action:', error);
      return { success: false, error: 'Network error' };
    }
  };

  // Recruiter soft-delete: marks job as takenDown (hidden from students) but preserves application history
  const takeDownJob = async (jobId) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}/takedown`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setJobs(prev => prev.map(job => job.id === jobId ? { ...job, takenDown: true } : job));
        return { success: true };
      }
      return { success: false, error: data.message || 'Failed to take down job' };
    } catch (error) {
      console.error('Error taking down job:', error);
      return { success: false, error: 'Network error' };
    }
  };

  const viewCompanyProfile = async (companyName) => {
    try {
      const response = await fetch(`/api/auth/recruiters/company/${encodeURIComponent(companyName)}/view`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setRecruiters(prev => prev.map(rec => {
          if (rec.recruiterDetails?.company?.toLowerCase() === companyName.toLowerCase()) {
            return {
              ...rec,
              recruiterDetails: {
                ...rec.recruiterDetails,
                companyViews: data.companyViews
              }
            };
          }
          return rec;
        }));
      }
    } catch (error) {
      console.error('Error incrementing company views:', error);
    }
  };

  const viewJob = async (jobId) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}/view`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setJobs(prev => prev.map(j => {
          if (j.id === jobId) {
            return { ...j, views: data.views };
          }
          return j;
        }));
      }
    } catch (error) {
      console.error('Error incrementing job views:', error);
    }
  };

  return (
    <PortalStateContext.Provider value={{
      jobs,
      applications,
      interviews,
      notifications,
      students,
      recruiters,
      loading,
      eligibilityList,
      addJob,
      approveJob,
      rejectJob,
      applyToJob,
      updateApplicationStatus,
      updateApplicationCtc,
      scheduleInterview,
      addNotification,
      markNotificationAsRead,
      addStudent,
      addRecruiter,
      verifyRecruiter,
      addEligibility,
      updateEligibility,
      deleteEligibility,
      updateInterviewStatus,
      updateJob,
      deleteJob,
      takeDownJob,
      clearNotifications,
      viewCompanyProfile,
      viewJob,
      refreshPortalData: fetchPortalData
    }}>
      {children}
    </PortalStateContext.Provider>
  );
};

export const usePortalState = () => useContext(PortalStateContext);
