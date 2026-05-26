import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, 
  Building, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight,
  User,
  Mail,
  Lock
} from 'lucide-react';

export const RegisterPage = ({ onNavigate }) => {
  const { register } = useAuth();
  const [activeTab, setActiveTab] = useState('student');
  
  // General Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Student Specific Fields
  const [cgpa, setCgpa] = useState('');
  const [department, setDepartment] = useState('');
  const [batch, setBatch] = useState('');
  
  // Recruiter Specific Fields
  const [company, setCompany] = useState('');
  const [recruiterDesignation, setRecruiterDesignation] = useState('');
  
  // Admin Specific Fields
  const [adminDesignation, setAdminDesignation] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    // Dynamic Payload Creation
    const userData = {
      name,
      email,
      password,
      role: activeTab
    };

    if (activeTab === 'student') {
      userData.studentDetails = {
        cgpa,
        department,
        batch,
        skills: ['React', 'Node.js', 'MongoDB'],
        resumeName: 'uploaded_resume.pdf',
        appliedJobsCount: 0,
        interviewsCount: 0
      };
    } else if (activeTab === 'recruiter') {
      userData.recruiterDetails = {
        company,
        designation: recruiterDesignation,
        activeJobsCount: 0,
        totalApplicantsCount: 0
      };
      // Map name to company name if empty
      if (!name) userData.name = company;
    } else if (activeTab === 'admin') {
      userData.adminDetails = {
        designation: adminDesignation,
        totalStudentsCount: 2148,
        totalRecruitersCount: 184,
        placementPercentage: 94
      };
    }

    const result = await register(userData);
    
    if (result.success) {
      setIsSuccess(true);
      setTimeout(() => {
        onNavigate(`${activeTab}-dashboard`);
        setIsSuccess(false);
      }, 700);
    } else {
      setErrorMessage(result.error || 'Registration failed. Try a different email address.');
    }
  };

  return (
    <div className="bg-[#fbfbf9] text-brand-green min-h-screen grid grid-cols-1 lg:grid-cols-12 selection:bg-brand-gold/30 font-sans antialiased">
      
      {/* Left Column: Premium Dark Green Brand Graphic */}
      <div 
        className="lg:col-span-5 bg-[#022c22] p-8 md:p-16 text-brand-cream flex flex-col justify-between relative overflow-hidden"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(179,139,63,0.1),transparent)]"></div>
        
        {/* Brand Logo Header */}
        <div className="flex items-center gap-3 z-10 select-none">
          <img src="/favicon.svg" alt="Placera Logo" className="w-11 h-11 object-contain" />
          <div>
            <span className="font-serif text-lg font-bold text-white block leading-none">Placera</span>
            <span className="text-[7.5px] uppercase tracking-widest font-black text-brand-cream/60 block mt-1">Placement Portal</span>
          </div>
        </div>

        {/* Center Philosophy Text */}
        <div className="my-auto py-12 z-10 space-y-6">
          <span className="text-brand-gold uppercase tracking-wider text-[10px] font-bold block">Secure enrollment</span>
          <h2 className="editorial-heading font-serif text-[38px] leading-[1.1] md:text-[44px] font-light text-brand-cream tracking-tight max-w-sm">
            Create your live portal account.
          </h2>
          <p className="text-white/50 text-xs md:text-sm max-w-sm leading-relaxed font-normal">
            Sign up to securely store your placement profile. Your password is fully encrypted, and connection details are verified with MongoDB Atlas.
          </p>
        </div>

        {/* Footer Credit */}
        <div className="border-t border-white/10 pt-6 z-10 text-[10px] text-white/30 tracking-widest font-medium">
          <span>© 2026 Placera Institute of Careers</span>
        </div>
      </div>

      {/* Right Column: Registration Form */}
      <div className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-center bg-[#fbfbf9] overflow-y-auto">
        <div className="max-w-lg mx-auto w-full space-y-6 py-6">
          
          {/* Back Button */}
          <button
            onClick={() => onNavigate('login')}
            className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest font-bold text-brand-green/60 hover:text-brand-green transition-colors duration-250 cursor-pointer select-none"
          >
            <span>←</span> BACK TO LOGIN
          </button>

          {/* Heading */}
          <div className="space-y-1">
            <h3 className="editorial-heading font-serif text-[28px] text-brand-green leading-tight">Join PLACERA</h3>
            <p className="text-brand-green/60 text-xs font-semibold">Enter your details below to create an active account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Role Switcher */}
            <div className="bg-[#f4f3ea] p-1.5 border border-brand-green/5 rounded-xl flex w-full">
              {['student', 'recruiter'].map((role) => (
                <button
                  type="button"
                  key={role}
                  onClick={() => {
                    setActiveTab(role);
                    setErrorMessage('');
                  }}
                  className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-lg text-xs transition-all duration-300 cursor-pointer ${
                    activeTab === role
                      ? 'bg-white text-[#022c22] shadow-sm font-bold'
                      : 'text-[#022c22]/60 hover:text-[#022c22] font-semibold'
                  }`}
                >
                  {role === 'student' && <GraduationCap className="w-3.5 h-3.5 shrink-0" />}
                  {role === 'recruiter' && <Building className="w-3.5 h-3.5 shrink-0" />}
                  {role === 'admin' && <ShieldCheck className="w-3.5 h-3.5 shrink-0" />}
                  <span className="text-[9px] tracking-wide uppercase font-bold">{role}</span>
                </button>
              ))}
            </div>

            {/* Error notifications */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200/50 rounded-xl p-4 text-xs text-red-700 flex items-start gap-2.5 animate-fade-in-up">
                <ShieldAlert className="w-4.5 h-4.5 text-red-500 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {isSuccess && (
              <div className="bg-emerald-50 border border-emerald-200/50 rounded-xl p-4 text-xs text-emerald-700 flex items-start gap-2.5 animate-fade-in-up">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Account created successfully! Connecting session and redirecting...</span>
              </div>
            )}

            {/* General form fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-[9px] text-brand-green/60 uppercase tracking-widest font-black block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-green/30" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-brand-green/10 rounded-xl focus:outline-none focus:border-brand-green text-xs text-brand-green transition-all"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-[9px] text-brand-green/60 uppercase tracking-widest font-black block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-green/30" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-brand-green/10 rounded-xl focus:outline-none focus:border-brand-green text-xs text-brand-green transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-[9px] text-brand-green/60 uppercase tracking-widest font-black block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-green/30" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-brand-green/10 rounded-xl focus:outline-none focus:border-brand-green text-xs text-brand-green transition-all"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-[9px] text-brand-green/60 uppercase tracking-widest font-black block">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-green/30" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-brand-green/10 rounded-xl focus:outline-none focus:border-brand-green text-xs text-brand-green transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Dynamic Role-specific details block */}
            <div className="bg-[#f4f3ea]/50 border border-brand-green/5 rounded-xl p-4 space-y-3">
              <span className="text-[9px] text-brand-gold uppercase tracking-wider font-extrabold block">
                💼 Dynamic Profile Details ({activeTab.toUpperCase()})
              </span>

              {activeTab === 'student' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[8px] text-brand-green/60 uppercase tracking-wider font-black block">CGPA</label>
                    <input
                      type="text"
                      required
                      value={cgpa}
                      onChange={(e) => setCgpa(e.target.value)}
                      placeholder="e.g. 9.2"
                      className="w-full px-3 py-2 bg-white border border-brand-green/10 rounded-lg text-xs focus:outline-none text-brand-green"
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[8px] text-brand-green/60 uppercase tracking-wider font-black block">Department / Program</label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-white border border-brand-green/10 rounded-lg text-xs focus:outline-none text-brand-green"
                    >
                      <option value="">Select Department</option>
                      <optgroup label="⚙ Technology & Engineering">
                        <option value="Computer Science & Engineering">Computer Science &amp; Engineering</option>
                        <option value="Electronics & Communication">Electronics &amp; Communication</option>
                        <option value="Information Technology">Information Technology</option>
                        <option value="Electrical & Electronics">Electrical &amp; Electronics</option>
                        <option value="Mechanical Engineering">Mechanical Engineering</option>
                      </optgroup>
                      <optgroup label="📊 Management & Business">
                        <option value="MBA">MBA</option>
                        <option value="Business Administration">Business Administration</option>
                        <option value="Commerce">Commerce</option>
                        <option value="Finance">Finance</option>
                      </optgroup>
                      <optgroup label="🔬 Applied Sciences & Design">
                        <option value="M.Sc Data Science">M.Sc Data Science</option>
                        <option value="B.Des">B.Des (Design)</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="Physics">Physics</option>
                        <option value="Chemistry">Chemistry</option>
                      </optgroup>
                    </select>
                  </div>

                  <div className="space-y-1 md:col-span-3">
                    <label className="text-[8px] text-brand-green/60 uppercase tracking-wider font-black block">Batch</label>
                    <input
                      type="text"
                      required
                      value={batch}
                      onChange={(e) => setBatch(e.target.value)}
                      placeholder="e.g. 2026"
                      className="w-full px-3 py-2 bg-white border border-brand-green/10 rounded-lg text-xs focus:outline-none text-brand-green"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'recruiter' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[8px] text-brand-green/60 uppercase tracking-wider font-black block">Company Name</label>
                    <input
                      type="text"
                      required
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Helix Analytics"
                      className="w-full px-3 py-2 bg-white border border-brand-green/10 rounded-lg text-xs focus:outline-none text-brand-green"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8px] text-brand-green/60 uppercase tracking-wider font-black block">Designation</label>
                    <input
                      type="text"
                      required
                      value={recruiterDesignation}
                      onChange={(e) => setRecruiterDesignation(e.target.value)}
                      placeholder="e.g. Talent · Bengaluru"
                      className="w-full px-3 py-2 bg-white border border-brand-green/10 rounded-lg text-xs focus:outline-none text-brand-green"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'admin' && (
                <div className="space-y-1">
                  <label className="text-[8px] text-brand-green/60 uppercase tracking-wider font-black block">Placement Title</label>
                  <input
                    type="text"
                    required
                    value={adminDesignation}
                    onChange={(e) => setAdminDesignation(e.target.value)}
                    placeholder="e.g. Placement Officer"
                    className="w-full px-3 py-2 bg-white border border-brand-green/10 rounded-lg text-xs focus:outline-none text-brand-green"
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSuccess}
              className="w-full bg-[#022c22] text-brand-cream hover:bg-brand-gold hover:text-brand-green font-bold py-3 rounded-xl text-xs tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Create Account & Log in</span> <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </form>

          {/* Under Form Footer */}
          <div className="text-center">
            <span className="text-xs text-brand-green/60 font-medium">Already have an account? </span>
            <button 
              type="button"
              onClick={() => onNavigate('login')}
              className="text-xs font-bold text-brand-green hover:underline cursor-pointer"
            >
              Login here
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
