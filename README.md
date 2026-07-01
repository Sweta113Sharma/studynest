# StudyNest: An AI-Powered Syllabus Manager & Study Tracker

<div align="center">

![StudyNest Banner](https://img.shields.io/badge/StudyNest-AI%20Study%20Companion-blueviolet?style=for-the-badge&logo=graduation-cap)
![React](https://img.shields.io/badge/React-18.0+-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-Lightning%20Fast-646CFF?style=flat-square&logo=vite)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
![Status](https://img.shields.io/badge/Status-Active%20Development-brightgreen?style=flat-square)

```
   ╔════════════════════════════════════╗
   ║     STUDYNEST                      ║
   ║     Your AI Study Companion        ║
   ║     Master Every Subject           ║
   ║     Ace Every Test                 ║
   ╚════════════════════════════════════╝
```

</div>

---

## What is StudyNest?

StudyNest is a **modern, premium academic preparation portal** tailored for university students (specifically designed for AKTU/UP engineering syllabus standards). It streamlines exam preparation by organizing coursework, generating AI-powered study materials, and providing interactive quizzes to ensure comprehensive learning.

> **Mission:** Transform how engineering students study—combining AI intelligence, beautiful design, and practical learning tools into one seamless platform.

---

## Key Features

<table>
<tr>
<td width="50%">

### Syllabus & Course Manager
- Full curriculum organization across multiple branches
- **Computer Science (CSE)** | **Electronics (ECE)** | **Mechanical (ME)** | **Civil (CE)** | **Chemical (ChE)**
- Unit-wise breakdowns with resource links
- Semester and year-wise classification

</td>
<td width="50%">

### AI Study Partner
- Integrates with **OpenRouter API** for live AI generation
- Dynamic summaries, study sheets & flashcards in real-time
- **Offline Simulation Mode** with cached material
- Supports core subjects like DSA, DBMS, OS & more

</td>
</tr>
<tr>
<td width="50%">

### Smart Quiz Engine
- Interactive sessional-pattern MCQs
- Instant grading & score summaries
- Deep conceptual explanations
- Performance tracking analytics

</td>
<td width="50%">

### Curated Resource Hub
- Downloadable lecture slides (PPTs)
- Formula sheets & quick reference guides
- Curated YouTube playlists
- Gate Smashers, Abdul Bari & more

</td>
</tr>
<tr>
<td width="50%">

### Premium Glassmorphic UI
- Dark-mode first design
- Custom Tailwind OKLCH colors
- Interactive mesh gradients
- Glowing background animations

</td>
<td width="50%">

### Lightning-Fast Performance
- Vite-powered instant hot reloads
- Optimized bundle sizes
- Smooth physics-based animations
- Framer Motion integration

</td>
</tr>
</table>

---

## Technology Stack

<div align="center">

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + Vite | Fast, modern UI framework |
| **Styling** | Tailwind CSS | Utility-first CSS with custom themes |
| **Animations** | Framer Motion | Smooth, physics-based transitions |
| **AI/ML** | OpenRouter API | LLM integration for study materials |
| **State** | React Hooks | Efficient state management |
| **Responsive** | Mobile-First Design | Works seamlessly on all devices |

</div>

### Language Composition

```
JavaScript  ████████████████████████████████████░  95.9%
CSS         ███░                                    3.6%
HTML        ░                                       0.5%
```

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    STUDYNEST ARCHITECTURE                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │          React 18 + Vite Frontend Layer               │  │
│  │  ┌─────────────┬──────────────┬───────────────────┐   │  │
│  │  │  AppShell   │  HomeView    │  LoginScreen      │   │  │
│  │  │  Navigation │  Dashboard   │  Onboarding       │   │  │
│  │  └─────────────┴──────────────┴───────────────────┘   │  │
│  │  ┌─────────────┬──────────────┬───────────────────┐   │  │
│  │  │  SubjectsV  │ QuizView     │ UnitDetailView    │   │  │
│  │  │  Subject    │ Interactive  │ Resource Panel    │   │  │
│  │  │  Grid       │ Testing      │                   │   │  │
│  │  └─────────────┴──────────────┴───────────────────┘   │  │
│  └───────────────────────────────────────────────────────┘  │
│                          ↓                                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │            Service Layer & State Management            │  │
│  │  ┌─────────────────┬────────────────────────────────┐ │  │
│  │  │  AI Service     │  Local Storage Service         │ │  │
│  │  │  OpenRouter API │  State Management (Hooks)      │ │  │
│  │  └─────────────────┴────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────┘  │
│                          ↓                                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Data & Resources Layer                    │  │
│  │  ┌─────────────────┬────────────────────────────────┐ │  │
│  │  │  Study Data     │  Course Database               │ │  │
│  │  │  AKTU Syllabus  │  Quiz Sheets & Materials       │ │  │
│  │  └─────────────────┴────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
studynest/
│
├── public/                       Static assets & PDF materials
│
├── src/
│   ├── components/               React Components
│   │   ├── AppShell.jsx          Main navigation wrapper
│   │   ├── HomeView.jsx          Landing dashboard
│   │   ├── LoginScreen.jsx       Student onboarding
│   │   ├── QuizView.jsx          Interactive testing
│   │   ├── SettingsModal.jsx     Configuration panel
│   │   ├── SubjectsView.jsx      Subject grid
│   │   ├── SubjectDetailView.jsx Subject overview
│   │   └── UnitDetailView.jsx    Detailed resources
│   │
│   ├── data/
│   │   └── studyData.js          AKTU course database
│   │
│   ├── services/
│   │   └── aiService.js          AI API integration
│   │
│   ├── index.css                 Global styles
│   ├── main.jsx                  App entry point
│   └── App.jsx                   Core router
│
├── package.json                  Dependencies
├── vite.config.js                Vite configuration
├── tailwind.config.js            Theme configuration
└── README.md                     Documentation

```

---

## Data Flow Diagram

```
┌────────────────────────────────────────────────────────────────┐
│                     USER INTERACTION FLOW                      │
└────────────────────────────────────────────────────────────────┘

    User Login
        ↓
    [Branch Selection]
        ↓
    [Semester Selection]
        ↓
    ┌─────────────────────────────────────┐
    │     Subject Dashboard (HomeView)    │
    │   Browse all available subjects     │
    └─────────────────────────────────────┘
        ↓                          ↓
    [Select Subject]       [Open Settings]
        ↓                          ↓
   ┌────────────────┐      ┌──────────────────┐
   │  SubjectDetail │      │ Configure AI Key │
   │  - Units       │      │ Select Model     │
   │  - Resources   │      └──────────────────┘
   └────────────────┘
        ↓
    [Select Unit]
        ↓
   ┌──────────────────────────────────────┐
   │      UnitDetailView (Tabbed)         │
   ├──────────────────────────────────────┤
   │  [AI Summary] [PPTs] [YouTube Links] │
   └──────────────────────────────────────┘
        ↓
    ┌────────────────────────────┐
    │   AI Generation Services   │
    ├────────────────────────────┤
    │ OpenRouter API Integration │
    │ OR Offline Mode (Fallback) │
    └────────────────────────────┘
        ↓
    [Start Quiz]
        ↓
   ┌─────────────────────────────┐
   │   Quiz Engine (QuizView)    │
   │  - Multiple Choice Qs       │
   │  - Instant Grading         │
   │  - Score Summary           │
   │  - Explanations            │
   └─────────────────────────────┘
```

---

## Getting Started

### Prerequisites
- **Node.js** v18.x or higher ([Download](https://nodejs.org/))
- **npm** v9.x or higher (comes with Node.js)

### Installation Steps

#### 1. Clone the Repository
```bash
git clone https://github.com/Sweta113Sharma/studynest.git
cd studynest
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Run Development Server
```bash
npm run dev
```
The app will be available at **`http://localhost:5173`**

#### 4. Build for Production
```bash
npm run build
```

---

## AI Configuration & Setup

### Activate AI Features

To unlock live AI generation of study summaries and personalized quizzes:

1. **Launch StudyNest** and select your branch/semester
2. Click the **Profile Avatar** in the top-right corner
3. Enter your **OpenRouter API Key**
   - Get a free key at [OpenRouter.ai](https://openrouter.ai)
   - Supports free models: `openai/gpt-oss-120b:free`
4. Save your key (stored securely in browser local storage)
5. Enjoy AI-powered study materials!

> **Tip:** No API key? No problem! StudyNest falls back to **offline simulation mode** with pre-cached quality content.

---

## Feature Showcase

### Dashboard Overview
- Real-time progress tracking
- Semester-wise organization
- Quick-access subject cards
- Performance analytics

### Study Materials
- AI-generated summaries
- Downloadable formula sheets
- Curated video playlists
- Important concepts highlighted

### Quiz System
- Adaptive difficulty levels
- Instant feedback with explanations
- Score history tracking
- Performance insights

### User Interface
- **Dark Mode**: OLED-friendly, eye-friendly design
- **Responsive**: Perfect on mobile, tablet & desktop
- **Smooth Animations**: Delightful micro-interactions
- **Accessible**: WCAG-compliant, screen reader ready

---

## Performance Metrics

```
┌──────────────────────────────────────────────────────┐
│          BUILD & PERFORMANCE STATISTICS              │
├──────────────────────────────────────────────────────┤
│ Framework             │ React 18 + Vite              │
│ Bundle Size           │ Optimized with Tree-Shaking   │
│ Load Time             │ Sub-1s with Vite             │
│ API Response          │ Real-time with OpenRouter    │
│ Offline Support       │ 100% with Cached Data        │
│ Browser Storage       │ IndexedDB + LocalStorage      │
│ Mobile Responsive     │ Mobile-First Design          │
│ Accessibility         │ WCAG 2.1 Level AA            │
└──────────────────────────────────────────────────────┘
```

---

## Data Privacy & Security

- **Client-side Processing**: All data stored locally
- **No Server Dependency**: Works offline
- **Secure API Integration**: Only your OpenRouter key is transmitted
- **Browser Storage**: Encrypted local storage for settings
- **Privacy First**: No analytics or tracking

---

## Contributing

We'd love your contributions! Whether it's:
- Bug fixes
- New features
- Additional syllabus content
- UI/UX improvements

**Steps to contribute:**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## Development Roadmap

```
PHASE 1 - COMPLETE
├── Core AKTU syllabus integration
├── AI study material generation
└── Interactive quiz engine

PHASE 2 - IN PROGRESS
├── Performance analytics dashboard
├── Spaced repetition algorithm
└── Mobile app version

PHASE 3 - UPCOMING
├── Collaborative study groups
├── Real-time peer quizzes
├── Gamification & leaderboards
└── Multi-university support

PHASE 4 - FUTURE
├── Advanced ML recommendations
├── Adaptive learning paths
└── Export study materials
```

---

## API Integration Flow

```
┌─────────────────────────────────────────────────┐
│       OpenRouter API Integration Flow           │
├─────────────────────────────────────────────────┤
│                                                 │
│  User Input (Topic/Unit)                        │
│      ↓                                          │
│  Check Local Cache                              │
│      ↓                                          │
│  Found? ────→ YES ─→ Return Cached Data        │
│      │                                          │
│      NO                                         │
│      ↓                                          │
│  Validate API Key                               │
│      ↓                                          │
│  Prepare Request                                │
│  - Model Selection                              │
│  - Prompt Engineering                           │
│  ↓                                              │
│  POST to OpenRouter API                         │
���      ↓                                          │
│  Generate Study Material                        │
│  - Summary                                      │
│  - Quiz Questions                               │
│  - Key Concepts                                 │
│      ↓                                          │
│  Cache Response                                 │
│      ↓                                          │
│  Display to User                                │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## Support & Contact

- **Issues**: [GitHub Issues](https://github.com/Sweta113Sharma/studynest/issues)
- **Email**: [Reach out](mailto:your-email@example.com)
- **Twitter**: [@YourHandle](https://twitter.com)
- **LinkedIn**: [Your Profile](https://linkedin.com)

---

## License

This project is licensed under the **MIT License** - see the LICENSE file for details.

---

## Show Your Support

If StudyNest helped you ace your exams, please consider:
- Starring this repository
- Sharing with fellow students
- Reporting bugs & suggesting features
- Contributing to the project

<div align="center">

### Made with dedication by [Sweta Sharma](https://github.com/Sweta113Sharma)

**StudyNest** - _Because great students don't just study hard, they study smart_

---

![Footer Badge](https://img.shields.io/badge/Built%20with-React%20%2B%20Vite%20%2B%20Tailwind-blueviolet?style=for-the-badge)
![Learning Badge](https://img.shields.io/badge/Learning%20is%20Powerful-Let's%20Go-brightgreen?style=for-the-badge)

</div>
