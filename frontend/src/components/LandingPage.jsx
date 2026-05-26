import React from 'react';
import { 
  GraduationCap, 
  Briefcase, 
  FileText, 
  Calendar, 
  CheckCircle2, 
  ArrowRight, 
  Building, 
  ShieldCheck, 
  UserCheck, 
  Bell, 
  BarChart3, 
  ArrowUpRight 
} from 'lucide-react';

// Custom SVG Checkmark matching the thin outline circle checkmark in the screenshots exactly
const ThinCircleCheck = () => (
  <svg className="w-4 h-4 text-brand-green shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
    <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
  </svg>
);

// Custom Academic Olive Wreath SVG icon for the Hero badge
const WreathBadgeIcon = () => (
  <svg className="w-4 h-4 text-brand-green/75 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M6 18c-2-1.5-3-3.5-3-6a9 9 0 0 1 7-8.8" strokeLinecap="round" />
    <path d="M18 18c2-1.5 3-3.5 3-6a9 9 0 0 0-7-8.8" strokeLinecap="round" />
    <path d="M12 6v14" strokeDasharray="2 2" />
    <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" fill="currentColor" opacity="0.2" />
    <path d="M16 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" fill="currentColor" opacity="0.2" />
    <path d="M7 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" fill="currentColor" opacity="0.2" />
    <path d="M17 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" fill="currentColor" opacity="0.2" />
  </svg>
);

export const LandingPage = ({ onNavigate }) => {
  return (
    <div className="bg-brand-cream text-brand-green min-h-screen flex flex-col font-sans selection:bg-brand-gold/30 antialiased">
      
      {/* 1. Header Navigation */}
      <header className="border-b border-border-low bg-brand-cream/80 backdrop-blur-md py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-50 transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#022c22] text-brand-cream rounded-sm flex items-center justify-center font-bold text-lg select-none">
            <GraduationCap className="w-6 h-6 text-brand-cream" />
          </div>
          <div>
            <span className="font-serif text-lg font-bold tracking-tight block leading-none">Placera</span>
            <span className="text-[7.5px] uppercase tracking-widest font-black text-brand-green/60 block mt-1">Placement Portal</span>
          </div>
        </div>
        
        {/* Scroll Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-wider text-brand-green/75">
          <a href="#overview" className="hover:text-brand-gold transition-colors duration-250">Overview</a>
          <a href="#features" className="hover:text-brand-gold transition-colors duration-250">Features</a>
          <a href="#roles" className="hover:text-brand-gold transition-colors duration-250">Roles</a>
          <a href="#workflow" className="hover:text-brand-gold transition-colors duration-250">Workflow</a>
        </nav>

        <div className="flex items-center gap-5">
          <button
            onClick={() => onNavigate('login')}
            className="text-[11px] font-bold uppercase tracking-wider text-brand-green/85 hover:text-brand-green hover:underline transition-all cursor-pointer"
          >
            Sign in
          </button>
          <button
            onClick={() => onNavigate('login')}
            className="bg-[#022c22] hover:bg-brand-gold text-brand-cream hover:text-brand-green transition-all duration-300 font-bold px-5 py-2.5 rounded-sm text-[11px] tracking-wider uppercase shadow-xs cursor-pointer"
          >
            Get started
          </button>
        </div>
      </header>

      {/* Main Sections */}
      <main className="flex-1">

        {/* 2. Hero Section with Premium Radial Background Gradient and Statistics */}
        <section 
          id="overview" 
          className="relative py-16 md:py-24 px-6 md:px-12 border-b border-border-low transition-all duration-300"
          style={{
            background: 'radial-gradient(circle at 10% 10%, rgba(220, 236, 216, 0.45) 0%, rgba(249, 249, 247, 0.95) 50%, rgba(246, 242, 229, 0.5) 100%)'
          }}
        >
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Title and Details */}
            <div className="lg:col-span-6 space-y-8 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-brand-green/10 bg-brand-green/[0.03] text-brand-green text-[10px] font-bold tracking-wide uppercase">
                <WreathBadgeIcon />
                <span>Built for modern placement cells</span>
              </div>
              
              <h1 className="editorial-heading font-serif text-[42px] leading-[1.08] md:text-[64px] font-light text-brand-green tracking-tight">
                Where careers <span className="italic font-serif font-normal text-brand-green">begin,</span><br />
                and companies <span className="italic font-serif font-normal text-brand-green">find</span><br />
                their next hires.
              </h1>

              <p className="text-text-secondary text-sm md:text-[15px] max-w-lg leading-relaxed font-normal">
                Placera is a centralized internship & placement portal that unifies students, recruiters and administrators — from application to offer letter.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => onNavigate('login')}
                  className="bg-[#022c22] hover:bg-brand-gold text-brand-cream hover:text-brand-green font-bold py-3.5 px-6 rounded-sm text-xs tracking-widest uppercase flex items-center gap-2.5 transition-all duration-300 shadow-sm cursor-pointer"
                >
                  Enter the portal <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
                <a
                  href="#features"
                  className="border border-brand-green/20 bg-[#f4f3eb] hover:border-brand-green hover:bg-[#eae8de] text-brand-green py-3.5 px-6 rounded-sm text-xs tracking-widest uppercase font-bold transition-all duration-300 flex items-center justify-center text-center"
                >
                  See features
                </a>
              </div>
            </div>

            {/* Right Column: Today Snapshot Card */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end animate-fade-in-up">
              <div className="bg-white border border-border-low rounded-2xl p-7 max-w-md w-full shadow-[0_15px_40px_-15px_rgba(2,44,34,0.08)] space-y-6">
                
                <div className="flex justify-between items-center border-b border-border-low pb-4">
                  <div>
                    <span className="text-[10px] text-text-secondary uppercase tracking-widest font-bold block">Today · Placement Cell</span>
                    <h3 className="font-serif text-2xl text-brand-green mt-1">Drive 2026 — Snapshot</h3>
                  </div>
                  <span className="text-[9px] bg-[#fcf8ed] text-brand-gold font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-brand-gold/20 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse"></span> Live
                  </span>
                </div>

                {/* Grid 2x2 */}
                <div className="grid grid-cols-2 gap-4">
                  
                  {/* Active Jobs */}
                  <div className="bg-[#fbfbf9] border border-brand-green/5 rounded-xl p-4 relative overflow-hidden flex flex-col justify-between min-h-[85px] hover:border-brand-green/20 transition-colors duration-250">
                    <Briefcase className="w-4 h-4 text-brand-green/30 absolute right-3.5 top-3.5" />
                    <div>
                      <span className="text-[10px] text-text-secondary uppercase font-semibold block">Active jobs</span>
                      <span className="text-2xl font-serif font-bold text-brand-green mt-1 block leading-none">38</span>
                    </div>
                  </div>

                  {/* Applications */}
                  <div className="bg-[#fbfbf9] border border-brand-green/5 rounded-xl p-4 relative overflow-hidden flex flex-col justify-between min-h-[85px] hover:border-brand-green/20 transition-colors duration-250">
                    <FileText className="w-4 h-4 text-brand-green/30 absolute right-3.5 top-3.5" />
                    <div>
                      <span className="text-[10px] text-text-secondary uppercase font-semibold block">Applications</span>
                      <span className="text-2xl font-serif font-bold text-brand-green mt-1 block leading-none">1,204</span>
                    </div>
                  </div>

                  {/* Interviews Today */}
                  <div className="bg-[#fbfbf9] border border-brand-green/5 rounded-xl p-4 relative overflow-hidden flex flex-col justify-between min-h-[85px] hover:border-brand-green/20 transition-colors duration-250">
                    <Calendar className="w-4 h-4 text-brand-green/30 absolute right-3.5 top-3.5" />
                    <div>
                      <span className="text-[10px] text-text-secondary uppercase font-semibold block">Interviews today</span>
                      <span className="text-2xl font-serif font-bold text-brand-green mt-1 block leading-none">27</span>
                    </div>
                  </div>

                  {/* Offers Extended */}
                  <div className="bg-[#fbfbf9] border border-brand-green/5 rounded-xl p-4 relative overflow-hidden flex flex-col justify-between min-h-[85px] hover:border-brand-green/20 transition-colors duration-250">
                    <CheckCircle2 className="w-4 h-4 text-brand-green/30 absolute right-3.5 top-3.5" />
                    <div>
                      <span className="text-[10px] text-text-secondary uppercase font-semibold block">Offers extended</span>
                      <span className="text-2xl font-serif font-bold text-brand-green mt-1 block leading-none">112</span>
                    </div>
                  </div>
                </div>

                {/* Placement Progress Section */}
                <div className="pt-4 border-t border-border-low space-y-3.5">
                  <div className="flex justify-between items-center text-[10px] uppercase font-bold text-brand-green">
                    <span>Placement Progress</span>
                    <span className="text-brand-gold">+12% vs last drive</span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center text-[10px] mb-1">
                        <span className="font-semibold text-text-secondary">Engineering</span>
                        <span className="font-bold text-brand-green">88%</span>
                      </div>
                      <div className="w-full bg-[#f4f3ee] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#022c22] h-1.5 rounded-full transition-all duration-500" style={{ width: '88%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-[10px] mb-1">
                        <span className="font-semibold text-text-secondary">Business</span>
                        <span className="font-bold text-brand-green">76%</span>
                      </div>
                      <div className="w-full bg-[#f4f3ee] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#022c22] h-1.5 rounded-full transition-all duration-500" style={{ width: '76%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-[10px] mb-1">
                        <span className="font-semibold text-text-secondary">Design</span>
                        <span className="font-bold text-brand-green">64%</span>
                      </div>
                      <div className="w-full bg-[#f4f3ee] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#022c22] h-1.5 rounded-full transition-all duration-500" style={{ width: '64%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Premium Relocated Metrics Ticker - spans 12 columns inside the hero container */}
            <div className="col-span-12 border-t border-brand-green/10 pt-10 mt-6 grid grid-cols-3 gap-6 md:gap-12 text-left">
              <div>
                <span className="text-3xl md:text-[40px] font-serif font-light text-brand-green block leading-none">12k+</span>
                <span className="text-[10px] text-text-secondary uppercase tracking-widest font-bold mt-2 block">Graduates Placed</span>
              </div>
              <div>
                <span className="text-3xl md:text-[40px] font-serif font-light text-brand-green block leading-none">480+</span>
                <span className="text-[10px] text-text-secondary uppercase tracking-widest font-bold mt-2 block">Active Drive Partners</span>
              </div>
              <div>
                <span className="text-3xl md:text-[40px] font-serif font-light text-brand-green block leading-none">94%</span>
                <span className="text-[10px] text-text-secondary uppercase tracking-widest font-bold mt-2 block">Placement Success</span>
              </div>
            </div>

          </div>
        </section>

        {/* 3. Choose How You Sign In (Roles Section with pristine white background) */}
        <section id="roles" className="py-24 px-6 md:px-12 bg-white border-b border-border-low">
          <div className="max-w-7xl mx-auto space-y-16">
            
            <div className="text-left space-y-2">
              <span className="text-[10px] text-brand-gold uppercase tracking-widest font-bold block">Three doors, one portal</span>
              <h2 className="editorial-heading font-serif text-3xl md:text-5xl font-light text-brand-green">Choose how you sign in</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Card 1: Student */}
              <div className="bg-[#fbfbf9] border border-brand-green/5 p-8 rounded-2xl flex flex-col justify-between hover:shadow-lg transition-all duration-300 group">
                <div className="space-y-6">
                  <div className="w-12 h-12 bg-[#022c22] text-brand-cream rounded-xl flex items-center justify-center shadow-xs">
                    <GraduationCap className="w-6 h-6 text-brand-cream" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-serif text-[26px] font-medium text-brand-green">Student</h3>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      Build your profile, apply to drives, track interviews and offers in real time.
                    </p>
                  </div>
                  <ul className="space-y-3.5 text-xs font-semibold text-brand-green/85">
                    <li className="flex items-center gap-3">
                      <ThinCircleCheck /> <span>Resume & skills vault</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <ThinCircleCheck /> <span>Smart job recommendations</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <ThinCircleCheck /> <span>Interview calendar</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => onNavigate('login')}
                  className="mt-10 text-xs font-bold uppercase tracking-wider text-[#022c22] flex items-center gap-2 group-hover:text-brand-gold transition-colors duration-250 cursor-pointer"
                >
                  Open dashboard <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Card 2: Recruiter */}
              <div className="bg-[#fbfbf9] border border-brand-green/5 p-8 rounded-2xl flex flex-col justify-between hover:shadow-lg transition-all duration-300 group">
                <div className="space-y-6">
                  <div className="w-12 h-12 bg-[#022c22] text-brand-cream rounded-xl flex items-center justify-center shadow-xs">
                    <Building className="w-6 h-6 text-brand-cream" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-serif text-[26px] font-medium text-brand-green">Recruiter</h3>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      Post roles, shortlist applicants, and schedule interviews with verified students.
                    </p>
                  </div>
                  <ul className="space-y-3.5 text-xs font-semibold text-brand-green/85">
                    <li className="flex items-center gap-3">
                      <ThinCircleCheck /> <span>Job postings & funnels</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <ThinCircleCheck /> <span>Applicant pipelines</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <ThinCircleCheck /> <span>Selection workflow</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => onNavigate('login')}
                  className="mt-10 text-xs font-bold uppercase tracking-wider text-[#022c22] flex items-center gap-2 group-hover:text-brand-gold transition-colors duration-250 cursor-pointer"
                >
                  Open dashboard <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Card 3: Admin */}
              <div className="bg-[#fbfbf9] border border-brand-green/5 p-8 rounded-2xl flex flex-col justify-between hover:shadow-lg transition-all duration-300 group">
                <div className="space-y-6">
                  <div className="w-12 h-12 bg-[#022c22] text-brand-cream rounded-xl flex items-center justify-center shadow-xs">
                    <ShieldCheck className="w-6 h-6 text-brand-cream" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-serif text-[26px] font-medium text-brand-green">Admin</h3>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      Oversee the entire placement cell — students, companies, reports and analytics.
                    </p>
                  </div>
                  <ul className="space-y-3.5 text-xs font-semibold text-brand-green/85">
                    <li className="flex items-center gap-3">
                      <ThinCircleCheck /> <span>Drive management</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <ThinCircleCheck /> <span>Reports & analytics</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <ThinCircleCheck /> <span>Audit & approvals</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => onNavigate('login')}
                  className="mt-10 text-xs font-bold uppercase tracking-wider text-[#022c22] flex items-center gap-2 group-hover:text-brand-gold transition-colors duration-250 cursor-pointer"
                >
                  Open dashboard <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </div>

          </div>
        </section>

        {/* 4. Capabilities Grid Section (Unified single grid container with premium borders) */}
        <section id="features" className="py-24 px-6 md:px-12 max-w-7xl mx-auto space-y-14">
          
          <div className="space-y-2 text-left animate-fade-in-up">
            <span className="text-[10px] text-brand-gold uppercase tracking-widest font-bold block">Capabilities</span>
            <h2 className="editorial-heading font-serif text-3xl md:text-5xl font-light text-brand-green">Everything a placement cell needs.</h2>
            <p className="text-text-secondary text-xs max-w-md leading-relaxed">From the first registration to the final offer letter — a single, coherent workflow.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 border border-brand-green/10 rounded-2xl overflow-hidden bg-brand-green/[0.01]">
            
            {/* Cell 1: Onboarding */}
            <div className="p-8 md:p-10 bg-white border-b md:border-r border-brand-green/10 flex flex-col justify-between gap-6 hover:bg-[#fbfbf9]/60 transition-colors duration-250">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-brand-green/5 text-brand-green flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-xl text-brand-green font-medium">Student & recruiter onboarding</h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Verified roles with secure JWT auth and profile management.
                </p>
              </div>
            </div>

            {/* Cell 2: Listings */}
            <div className="p-8 md:p-10 bg-white border-b md:border-r border-brand-green/10 flex flex-col justify-between gap-6 hover:bg-[#fbfbf9]/60 transition-colors duration-250">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-brand-green/5 text-brand-green flex items-center justify-center">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-xl text-brand-green font-medium">Job & internship listings</h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Eligibility, deadlines, search and filters in one place.
                </p>
              </div>
            </div>

            {/* Cell 3: Application tracking */}
            <div className="p-8 md:p-10 bg-white border-b border-brand-green/10 flex flex-col justify-between gap-6 hover:bg-[#fbfbf9]/60 transition-colors duration-250">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-brand-green/5 text-brand-green flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-xl text-brand-green font-medium">Application tracking</h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  From submitted to shortlisted to offer — see every status.
                </p>
              </div>
            </div>
            
            {/* Cell 4: Interview scheduling */}
            <div className="p-8 md:p-10 bg-white border-b md:border-b-0 md:border-r border-brand-green/10 flex flex-col justify-between gap-6 hover:bg-[#fbfbf9]/60 transition-colors duration-250">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-brand-green/5 text-brand-green flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-xl text-brand-green font-medium">Interview scheduling</h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Online or onsite, with reminders and conflict detection.
                </p>
              </div>
            </div>

            {/* Cell 5: Notifications */}
            <div className="p-8 md:p-10 bg-white border-b md:border-b-0 md:border-r border-brand-green/10 flex flex-col justify-between gap-6 hover:bg-[#fbfbf9]/60 transition-colors duration-250">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-brand-green/5 text-brand-green flex items-center justify-center">
                  <Bell className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-xl text-brand-green font-medium">Notifications</h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Real-time alerts for applications, interviews and deadlines.
                </p>
              </div>
            </div>

            {/* Cell 6: Reports & analytics */}
            <div className="p-8 md:p-10 bg-white flex flex-col justify-between gap-6 hover:bg-[#fbfbf9]/60 transition-colors duration-250">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-brand-green/5 text-brand-green flex items-center justify-center">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-xl text-brand-green font-medium">Reports & analytics</h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Placement statistics, company-wise and program-wise insights.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* 5. Workflow Section (Dark background, high fidelity cards with hover states) */}
        <section id="workflow" className="bg-[#022c22] text-brand-cream py-24 px-6 md:px-12 border-b border-[#022c22]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column Info */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-[10px] text-brand-gold uppercase tracking-widest font-bold block">Workflow</span>
              <h2 className="editorial-heading font-serif text-3xl md:text-5xl font-light text-brand-cream leading-tight">
                A clean path,<br />
                from registration to offer.
              </h2>
              <p className="text-white/60 text-sm max-w-sm leading-relaxed">
                Designed around the real timeline of campus placements — built to remove friction at every stage.
              </p>
            </div>

            {/* Right Column vertical timeline list */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Item 01 */}
              <div className="border border-white/10 bg-white/[0.02] p-5 rounded-2xl flex items-start gap-4 hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 group">
                <span className="font-serif text-3xl text-brand-gold font-light mt-0.5 select-none shrink-0 group-hover:scale-105 transition-transform duration-250">01</span>
                <div>
                  <h4 className="font-bold text-sm text-brand-cream">Register & verify</h4>
                  <p className="text-[11.5px] text-white/50 leading-relaxed mt-1">
                    Students and recruiters create role-based accounts with JWT-backed auth.
                  </p>
                </div>
              </div>

              {/* Item 02 */}
              <div className="border border-white/10 bg-white/[0.02] p-5 rounded-2xl flex items-start gap-4 hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 group">
                <span className="font-serif text-3xl text-brand-gold font-light mt-0.5 select-none shrink-0 group-hover:scale-105 transition-transform duration-250">02</span>
                <div>
                  <h4 className="font-bold text-sm text-brand-cream">Post & discover</h4>
                  <p className="text-[11.5px] text-white/50 leading-relaxed mt-1">
                    Recruiters list roles. Students discover them through filters and recommendations.
                  </p>
                </div>
              </div>

              {/* Item 03 */}
              <div className="border border-white/10 bg-white/[0.02] p-5 rounded-2xl flex items-start gap-4 hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 group">
                <span className="font-serif text-3xl text-brand-gold font-light mt-0.5 select-none shrink-0 group-hover:scale-105 transition-transform duration-250">03</span>
                <div>
                  <h4 className="font-bold text-sm text-brand-cream">Apply & shortlist</h4>
                  <p className="text-[11.5px] text-white/50 leading-relaxed mt-1">
                    Applications flow into recruiter pipelines with structured statuses.
                  </p>
                </div>
              </div>

              {/* Item 04 */}
              <div className="border border-white/10 bg-white/[0.02] p-5 rounded-2xl flex items-start gap-4 hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 group">
                <span className="font-serif text-3xl text-brand-gold font-light mt-0.5 select-none shrink-0 group-hover:scale-105 transition-transform duration-250">04</span>
                <div>
                  <h4 className="font-bold text-sm text-brand-cream">Interview & decide</h4>
                  <p className="text-[11.5px] text-white/50 leading-relaxed mt-1">
                    Schedule rounds, capture feedback, send offers — all tracked.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 6. Bring Your Entire Placement Workflow Under One Roof (CTA Section - high-fidelity rounded-2xl container) */}
        <section className="py-24 px-6 bg-[#fafaf9] flex justify-center border-b border-border-low">
          <div className="max-w-4xl w-full border border-brand-green/10 bg-white rounded-2xl p-10 md:p-16 shadow-[0_15px_40px_-20px_rgba(2,44,34,0.06)] text-center space-y-7">
            <h2 className="editorial-heading font-serif text-3xl md:text-5xl font-light text-brand-green max-w-xl mx-auto leading-tight">
              Bring your entire placement workflow under one roof.
            </h2>
            <p className="text-text-secondary text-[13px] leading-relaxed max-w-md mx-auto">
              Open the portal as a student, recruiter or admin — no setup required.
            </p>
            <div className="flex justify-center gap-4 pt-3">
              <button
                onClick={() => onNavigate('login')}
                className="bg-[#022c22] hover:bg-brand-gold text-brand-cream hover:text-brand-green font-bold py-3.5 px-7 rounded-sm text-xs tracking-widest uppercase flex items-center gap-2.5 transition-all duration-300 shadow-sm cursor-pointer"
              >
                Sign in <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
              <button
                onClick={() => onNavigate('login')}
                className="border border-brand-green/20 bg-brand-cream/30 hover:border-brand-green hover:bg-[#f4f3eb] text-brand-green font-bold py-3.5 px-7 rounded-sm text-xs tracking-widest uppercase transition-all duration-300 cursor-pointer"
              >
                Try the demo
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* 7. Footer */}
      <footer className="py-8 px-6 md:px-12 bg-brand-cream flex flex-col sm:flex-row items-center justify-between text-xs text-text-secondary font-bold">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4.5 h-4.5 text-[#022c22]" />
          <span>Placera · Smart Internship & Placement Portal</span>
        </div>
        <div className="mt-3 sm:mt-0 font-medium text-brand-green/60">
          <span>© 2026 Placera. All rights reserved.</span>
        </div>
      </footer>

    </div>
  );
};
