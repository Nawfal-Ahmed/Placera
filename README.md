# 🎓 PLACERA — Premium Placement Portal

A unified, real-time placement management system designed to connect students, recruiters, and administrators in a single ecosystem. Built with a luxurious dark-emerald aesthetic, robust JWT-based authentication, and a real-time reactive MongoDB database.

---

## 🚀 Deployed Project Link

* **Frontend Portal (Vercel):** [https://placera-17zu1s430-nawfalahmed204-8990s-projects.vercel.app/](https://placera-17zu1s430-nawfalahmed204-8990s-projects.vercel.app/)

---

## 🌟 Core Features

### 👤 Student Workspace
* **Personalized Dashboard:** View status of recommended, active, and saved jobs.
* **Interactive Profile:** Edit CGPA, upload resumes, and list custom skill tags.
* **Linear Application Timeline:** Fully ordered steps (Applied, Shortlisted, Interview, Accepted/Rejected).
* **Smart Notifications:** Real-time reminders, application updates, and interview alerts.

### 🏢 Recruiter Console
* **Job Posting & Management:** Write descriptions, set eligibility criteria, and manage active drives.
* **Applicant Review System:** See student stats, download resumes, and accept/reject applicants.
* **Interview Scheduler:** Integrated scheduler to invite candidates directly.

### 👑 Admin Control Panel
* **Comprehensive Metrics:** Live placement percentages, active recruiter counts, and total enrollment statistics.
* **Real-time Sector-Wise Analysis:** Placed students automatically tracked under **Technology & Engineering**, **Business & Operations**, and **Applied Sciences & Design**.
* **Approvals Engine:** Authorize or decline recruiter requests in real-time.

---

## 🛠️ Technology Stack

* **Frontend:** React 18, Vite, Tailwind CSS v4, Lucide Icons, Glassmorphism design system.
* **Backend:** Node.js, Express, MongoDB Atlas (Mongoose), JWT, BcryptJS.
* **Hosting:** Vercel (Frontend), Render (Backend).

---

## ⚙️ Local Development Setup

### 1. Clone & Install
```bash
# Clone the repository
git clone https://github.com/Nawfal-Ahmed/Placera.git
cd Placera

# Install Backend dependencies
cd backend
npm install

# Install Frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret_key
```

### 3. Run Locally
Use the helper startup scripts in the root directory:
```bash
# On Windows (PowerShell)
./run_project.ps1

# On Windows (Command Prompt)
run_project.bat
```
