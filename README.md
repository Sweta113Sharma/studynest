# StudyNest — Modern B.Tech Engineering Portal & AI Study Companion

<div align="center">

[![Live Demo](https://img.shields.io/badge/Live%20Website-GitHub%20Pages-4F46E5?style=for-the-badge&logo=github)](https://sweta113sharma.github.io/studynest/)
[![React](https://img.shields.io/badge/React-18.0+-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.4+-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4+-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

**StudyNest** is a modern, ultra-responsive academic preparation portal designed for engineering students. It streamlines B.Tech exam preparation with organized branch syllabi, textbook-grade AI notes, interactive MCQ quizzes, active recall flashcards, and a Pomodoro focus timer.

[View Live Portal](https://sweta113sharma.github.io/studynest/) • [Quick Start](#quick-start) • [Key Features](#key-features) • [Tech Stack](#tech-stack)

</div>

---

## Key Features

### 1. Complete Engineering Curriculum (Sem 1 to Sem 8)
- **Multi-Branch Support**: Dedicated subjects and unit breakdowns for **CSE, ECE, EE, ME, CE, and IT**.
- **Year & Semester Classification**: Organizes syllabus from 1st Year (Basics) through 4th Year (Advanced Core & Electives).
- **Curated Learning Resources**: Unit-by-unit links to lecture slides (PPTs), formula cheat sheets, and top YouTube playlists (Gate Smashers, Neso Academy, etc.).

### 2. In-Depth AI Study Partner
- **Textbook-Grade Master Notes**: Generates comprehensive revision notes with ASCII architecture diagrams, complexity metric tables, code implementations, and exam mnemonics.
- **Interactive AI Quiz & Flashcards**: Instant MCQ generation with step-by-step answer explanations and active recall flashcard decks.
- **Dual AI Engine**: Powered by **OpenRouter API** for live AI queries, with built-in Wikipedia knowledge integration and offline mock fallbacks.

### 3. Pomodoro Focus Study Timer
- **Customizable Intervals**: Set custom focus sessions (e.g., 25 min) and short/long break timers.
- **Loud Attentive Alarm & Shake Effect**: Dual-pulse acoustic alarm chime accompanied by a high-energy `@keyframes timer-shake` box animation when time expires.
- **Streak & Session Tracker**: Tracks total focus sessions completed per study day.

### 4. Instant Unit Bookmarking
- **Reactive State Persistence**: One-click bookmarking for quick unit access saved to local storage.
- **Visual Feedback**: Golden filled bookmark badge and quick-filter panel on the dashboard.

### 5. Glassmorphism Design & Dark/Light Themes
- **Modern UI Aesthetics**: Smooth glassmorphic backdrop filters, gradient borders, ambient glow effects, and physics-based Framer Motion micro-animations.
- **Light & Dark Mode**: Seamless toggle between sleek dark mode and bright ambient light mode.
- **Streamlined Login**: Instant name & email sign-in without password friction or clutter.

---

## Tech Stack

| Domain | Technology |
| :--- | :--- |
| **Frontend Framework** | [React 18](https://reactjs.org/) + JSX |
| **Build Tooling** | [Vite 6](https://vitejs.dev/) (Lightning-fast HMR) |
| **Styling & Theme** | [Tailwind CSS 3](https://tailwindcss.com/) + Custom Glassmorphism System |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **AI Integration** | [OpenRouter API](https://openrouter.ai/) + Wikipedia REST API |
| **Deployment** | [GitHub Pages](https://pages.github.com/) |

---

## Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v16.0 or higher)
- `npm` or `yarn`

### Installation & Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/Sweta113Sharma/studynest.git

# 2. Navigate to the project directory
cd studynest

# 3. Install dependencies
npm install

# 4. Start the local development server
npm run dev
```

Open `http://localhost:5173/` in your browser to view the application live!

### Building for Production

```bash
# Create an optimized production build
npm run build

# Preview the production build locally
npm run preview
```

---

## Project Structure

```
studynest/
├── public/                # Static assets & icons
├── src/
│   ├── assets/            # Brand logo & images
│   ├── components/        # UI Views (LoginScreen, HomeView, SubjectDetail, UnitDetail, StudyTimer, AIAssistant)
│   ├── data/              # Core B.Tech syllabus database (studyData.js)
│   ├── services/          # AI Service integration (aiService.js)
│   ├── App.jsx            # Main app router & reactive bookmark state
│   ├── index.css          # Design system, glassmorphism utilities & keyframes
│   └── main.jsx           # App entry point
├── package.json           # Scripts & dependencies
├── vite.config.js         # Vite configuration & GitHub Pages base path
└── README.md              # Project documentation
```

---

## License

This project is open-source and available under the [MIT License](LICENSE).

---

<div align="center">
  Crafted by Sweta Sharma for Engineering Students
</div>
