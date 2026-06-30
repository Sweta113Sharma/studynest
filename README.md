# StudyNest: An AI-Powered Syllabus Manager & Study Tracker

StudyNest is a modern, premium academic preparation portal tailored for university students (specifically designed for AKTU/UP engineering syllabus standards). It streamlines exam preparation by organizing chapter-wise syllabi, providing Faculity PPTs, curating top YouTube lectures, and integrating an AI engine that generates instant unit summaries, revision notes, Q&A flashcards, and sessional mock quizzes.

---

## Key Features

*   **Syllabus & Course Manager:** Full curriculum organization across multiple engineering branches (**Computer Science (CSE)**, **Electronics (ECE)**, **Mechanical (ME)**, **Civil (CE)**, and **Electrical (EE)**) and their respective semesters.
*   **AI Study Partner:** 
    *   Integrates with the **OpenRouter API** (defaults to free models like `openai/gpt-oss-120b:free` or similar) to generate dynamic summaries, study sheets, and flashcards in real-time.
    *   Includes a built-in **Offline Simulation Mode** with pre-cached high-quality AI material for core subjects like *Data Structures & Algorithms II*, *Database Management Systems (DBMS)*, and *Operating Systems*.
*   **Smart Quiz Engine:** Interactive, sessional-pattern multiple-choice quizzes with instant grading, score summaries, and deep conceptual explanations for each answer.
*   **Curated Resource Hub:** Quick downloads for lecture presentation slides (PPTs), formula sheets, and quick-access links to top-tier academic YouTube video playlists (e.g., Gate Smashers, Abdul Bari, Dr. Gajendra Purohit).
*   **Premium Glassmorphic UI:** A dark-mode first design constructed with custom Tailwind OKLCH colors, interactive mesh gradients, glowing background grids, and smooth physics-based animations via **Framer Motion**.

---

## Technology Stack

*   **Framework:** React 18 (Vite-powered for rapid development and builds)
*   **Styling:** Tailwind CSS (configured with class-based dark mode, custom mesh grids, and high-fidelity OKLCH color spaces)
*   **Animations:** Framer Motion (for fluid page changes, modal transitions, and slide animations)
*   **Icons:** Emoji indicators matched to specific subject color themes
*   **API Service:** OpenRouter API Client (supporting user-supplied keys and local fallback cache)

---

## Project Structure

```text
studynest/
├── public/                # Static assets & PDF study materials
├── src/
│   ├── components/        # UI Views and Layouts
│   │   ├── AppShell.jsx   # Main application sidebar & navigation wrapper
│   │   ├── HomeView.jsx   # Landing dashboard with stats & branch selections
│   │   ├── LoginScreen.jsx# Student onboarding (Branch, Year, Semester selection)
│   │   ├── QuizView.jsx   # Dynamic interactive testing interface
│   │   ├── SettingsModal.jsx # API configuration & personalization settings
│   │   ├── SubjectsView.jsx# Grid of subjects for the selected semester
│   │   ├── SubjectDetailView.jsx # Subject overview and unit listings
│   │   └── UnitDetailView.jsx # Tabbed resource panel (AI Summary, PPTs, Youtube)
│   ├── data/
│   │   └── studyData.js   # Structured database of AKTU courses, units, and quiz sheets
│   ├── services/
│   │   └── aiService.js   # OpenRouter API integration and offline mockup handler
│   ├── index.css          # Global Tailwind CSS configurations
│   ├── main.jsx           # React app mount point
│   └── App.jsx            # Core state machine & view router
├── package.json           # Project dependencies & script shortcuts
├── vite.config.js         # Vite dev-server configurations
├── tailwind.config.js     # Tailwind display theme, fonts, and animations
└── README.md              # Documentation
```

---

## Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18.x or higher recommended)
*   npm (v9.x or higher)

### Setup Instructions

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/Sweta113Sharma/studynest.git
    cd studynest
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    The application will be hosted locally at `http://localhost:5173`.

4.  **Build for Production:**
    ```bash
    npm run build
    ```

---

## AI Configurations & API Key

To activate live AI generation of study summaries and quizzes:
1.  Open the application and select your branch and semester.
2.  Click on the **Profile Avatar / Settings** icon in the upper-right corner.
3.  Enter your **OpenRouter API Key**.
4.  *(Optional)* You can customize or select the AI model query settings.
5.  Save your key. It will be stored securely in your browser's local storage and used for subsequent requests. 
    *(If no key is provided, StudyNest seamlessly falls back to local simulated data so key functions remain interactive).*
