import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Building,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export const LoginPage = ({ onNavigate }) => {
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleTabChange = (role) => {
    setActiveTab(role);
    setErrorMessage('');
  };

  const handleDemoFill = (role, demoEmail, demoPassword) => {
    setActiveTab(role);
    setEmail(demoEmail);
    setPassword(demoPassword);
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const result = await login(email, password);
    if (result.success) {
      setIsSuccess(true);
      setTimeout(() => {
        onNavigate(`${result.user.role}-dashboard`);
        setIsSuccess(false);
      }, 700);
    } else {
      setErrorMessage(result.error);
    }
  };


  return (
    <div className="bg-[#fbfbf9] text-brand-green min-h-screen grid grid-cols-1 lg:grid-cols-12 selection:bg-brand-gold/30 font-sans antialiased">

      {/* Left Column: Premium Dark Green Brand Graphic with Dotted Grid Pattern */}
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
          <div className="w-11 h-11 bg-brand-gold text-[#022c22] rounded-lg flex items-center justify-center shadow-xs">
            <GraduationCap className="w-6 h-6 text-[#022c22]" />
          </div>
          <div>
            <span className="font-serif text-lg font-bold text-white block leading-none">Placera</span>
            <span className="text-[7.5px] uppercase tracking-widest font-black text-brand-cream/60 block mt-1">Placement Portal</span>
          </div>
        </div>

        {/* Center Philosophy Text */}
        <div className="my-auto py-12 z-10 space-y-6">
          <span className="text-brand-gold uppercase tracking-wider text-[10px] font-bold block">A unified workspace</span>
          <h2 className="editorial-heading font-serif text-[38px] leading-[1.1] md:text-[44px] font-light text-brand-cream tracking-tight max-w-sm">
            Where students,<br />
            recruiters and<br />
            administrators meet to<br />
            build careers.
          </h2>
          <p className="text-white/50 text-xs md:text-sm max-w-sm leading-relaxed font-normal">
            One credential. One portal. The entire placement lifecycle, from registration to the final offer letter.
          </p>
        </div>

        {/* Footer Credit */}
        <div className="border-t border-white/10 pt-6 z-10 text-[10px] text-white/30 tracking-widest font-medium">
          <span>© 2026 Placera Institute of Careers</span>
        </div>
      </div>

      {/* Right Column: Clean Login Form and Demo Credentials Grid */}
      <div className="lg:col-span-7 p-8 md:p-12 xl:p-16 flex flex-col justify-center bg-[#fbfbf9] transition-all duration-300">
        <div className="max-w-5xl mx-auto w-full grid grid-cols-1 xl:grid-cols-12 gap-10 xl:gap-14 items-center">

          {/* Form Block */}
          <div className="xl:col-span-7 space-y-8 w-full">
            {/* Back Button */}
            <button
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest font-bold text-brand-green/60 hover:text-brand-green transition-colors duration-250 cursor-pointer select-none"
            >
              <span>←</span> BACK TO HOME
            </button>

            {/* Heading */}
            <div className="space-y-2">
              <h3 className="editorial-heading font-serif text-[32px] text-brand-green leading-tight">Welcome back</h3>
              <p className="text-brand-green/60 text-xs font-semibold">Sign in to continue to your dashboard.</p>
            </div>

            {/* Dynamic Form Card */}
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Role Segmented Switcher / Tabs */}
              <div className="bg-[#f4f3ea] p-1.5 border border-brand-green/5 rounded-xl flex w-full">
                {['student', 'recruiter', 'admin'].map((role) => (
                  <button
                    type="button"
                    key={role}
                    onClick={() => handleTabChange(role)}
                    className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-lg text-xs transition-all duration-300 cursor-pointer ${activeTab === role
                        ? 'bg-white text-[#022c22] shadow-sm font-bold'
                        : 'text-[#022c22]/60 hover:text-[#022c22] font-semibold'
                      }`}
                  >
                    {role === 'student' && <GraduationCap className="w-4 h-4 shrink-0" />}
                    {role === 'recruiter' && <Building className="w-4 h-4 shrink-0" />}
                    {role === 'admin' && <ShieldCheck className="w-4 h-4 shrink-0" />}
                    <span className="text-[10px] tracking-wide uppercase font-bold">{role}</span>
                  </button>
                ))}
              </div>

              {/* Dynamic Helper Text */}
              <p className="text-brand-green/60 text-[11px] font-semibold tracking-wide">
                {activeTab === 'student' && 'Apply to drives, track interviews.'}
                {activeTab === 'recruiter' && 'Post roles, manage applicants.'}
                {activeTab === 'admin' && 'Oversee placements & reports.'}
              </p>

              {/* Feedback Notifications */}
              {errorMessage && (
                <div className="bg-red-50 border border-red-200/50 rounded-xl p-4 text-xs text-red-700 flex items-start gap-2.5 animate-fade-in-up">
                  <ShieldAlert className="w-4.5 h-4.5 text-red-500 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {isSuccess && (
                <div className="bg-emerald-50 border border-emerald-200/50 rounded-xl p-4 text-xs text-emerald-700 flex items-start gap-2.5 animate-fade-in-up">
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Securing connection... redirecting to dashboard.</span>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-[10px] text-brand-green/60 uppercase tracking-widest font-black block">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@university.edu"
                  className="w-full px-4 py-3 bg-white border border-brand-green/10 rounded-xl focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green text-sm transition-all text-brand-green shadow-2xs placeholder:text-brand-green/30"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] text-brand-green/60 uppercase tracking-widest font-black block">Password</label>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-white border border-brand-green/10 rounded-xl focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green text-sm transition-all text-brand-green shadow-2xs placeholder:text-brand-green/30"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSuccess}
                className="w-full bg-[#022c22] text-brand-cream hover:bg-brand-gold hover:text-brand-green font-bold py-3.5 rounded-xl text-xs tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Sign in as {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</span> <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            </form>

            {/* Under Form Footer */}
            <div className="text-center">
              <span className="text-xs text-brand-green/60 font-medium">New here? </span>
              <button
                type="button"
                onClick={() => onNavigate('register')}
                className="text-xs font-bold text-brand-green hover:underline cursor-pointer"
              >
                Create an account
              </button>
            </div>
          </div>

          {/* Demo Credentials Panel */}
          <div className="xl:col-span-5 bg-[#f4f3ea]/50 border border-brand-green/10 rounded-2xl p-6 space-y-5 shadow-xs w-full">
            <div className="space-y-1">
              <h4 className="font-serif text-base text-[#022c22] font-semibold flex items-center gap-2 select-none">
                <span className="text-brand-gold">✦</span> Demo Accounts
              </h4>
              <p className="text-[10.5px] text-[#022c22]/60 font-semibold leading-normal">
                Click any card to auto-fill details and switch to the correct portal console.
              </p>
            </div>

            <div className="space-y-3.5">
              {/* Student Card */}
              <button
                type="button"
                onClick={() => handleDemoFill('student', 'student@placera.edu', 'password123')}
                className={`w-full text-left p-3.5 rounded-xl border transition-all duration-300 cursor-pointer flex flex-col gap-1.5 ${
                  activeTab === 'student'
                    ? 'bg-white border-[#022c22] shadow-sm'
                    : 'bg-white/60 border-brand-green/5 hover:border-brand-green/20 hover:bg-white'
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-[#022c22] flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-[#022c22]" /> Student
                  </span>
                  <span className="text-[8.5px] bg-[#022c22]/5 text-[#022c22] font-extrabold px-1.5 py-0.5 rounded">Quick Fill</span>
                </div>
                <div className="text-[10.5px] text-[#022c22] font-medium leading-none">
                  <span className="font-bold text-[#022c22]/50">Email:</span> student@placera.edu
                </div>
                <div className="text-[11px] text-[#022c22]/60 leading-tight">
                  Apply to corporate drives, submit resume profiles & view selection steps.
                </div>
              </button>

              {/* Recruiter Card */}
              <button
                type="button"
                onClick={() => handleDemoFill('recruiter', 'talent@helixanalytics.com', 'password123')}
                className={`w-full text-left p-3.5 rounded-xl border transition-all duration-300 cursor-pointer flex flex-col gap-1.5 ${
                  activeTab === 'recruiter'
                    ? 'bg-white border-[#022c22] shadow-sm'
                    : 'bg-white/60 border-brand-green/5 hover:border-brand-green/20 hover:bg-white'
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-[#022c22] flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-[#022c22]" /> Recruiter
                  </span>
                  <span className="text-[8.5px] bg-[#022c22]/5 text-[#022c22] font-extrabold px-1.5 py-0.5 rounded">Quick Fill</span>
                </div>
                <div className="text-[10.5px] text-[#022c22] font-medium leading-none">
                  <span className="font-bold text-[#022c22]/50">Email:</span> talent@helixanalytics.com
                </div>
                <div className="text-[11px] text-[#022c22]/60 leading-tight">
                  Advertise openings, review applications & schedule interviews.
                </div>
              </button>

              {/* Admin Card */}
              <button
                type="button"
                onClick={() => handleDemoFill('admin', 'admin@placera.edu', 'password123')}
                className={`w-full text-left p-3.5 rounded-xl border transition-all duration-300 cursor-pointer flex flex-col gap-1.5 ${
                  activeTab === 'admin'
                    ? 'bg-white border-[#022c22] shadow-sm'
                    : 'bg-white/60 border-brand-green/5 hover:border-brand-green/20 hover:bg-white'
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-[#022c22] flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#022c22]" /> Admin
                  </span>
                  <span className="text-[8.5px] bg-[#022c22]/5 text-[#022c22] font-extrabold px-1.5 py-0.5 rounded">Quick Fill</span>
                </div>
                <div className="text-[10.5px] text-[#022c22] font-medium leading-none">
                  <span className="font-bold text-[#022c22]/50">Email:</span> admin@placera.edu
                </div>
                <div className="text-[11px] text-[#022c22]/60 leading-tight">
                  Verify companies, review posted jobs & monitor real-time placement stats.
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
