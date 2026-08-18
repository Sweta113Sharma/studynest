# StudyNest — AI-Powered Syllabus Manager & Study Tracker

<div align="center">

[![Live Demo](https://img.shields.io/badge/Live%20Website-GitHub%20Pages-4F46E5?style=for-the-badge&logo=github)](https://sweta113sharma.github.io/studynest/)
[![React](https://img.shields.io/badge/React-18.0+-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.4+-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4+-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**StudyNest** is an AI-powered academic companion designed for university students pursuing B.Tech degrees. It combines comprehensive syllabus management, AI-assisted learning, and productivity tools to streamline exam preparation and study workflows.

[View Live Portal](https://sweta113sharma.github.io/studynest/) • [Quick Start](#quick-start) • [Key Features](#key-features) • [Tech Stack](#tech-stack)

</div>

---

## 🎯 Overview

StudyNest is a complete digital study companion for engineering students. Whether you're managing a complex B.Tech syllabus across 8 semesters or seeking personalized AI-powered study assistance, StudyNest provides all the tools you need in one unified platform.

**Key Highlights:**
- ✅ Complete curriculum for 6 engineering branches (CSE, ECE, EE, ME, CE, IT)
- ✅ AI-powered study assistant with textbook-grade notes
- ✅ Interactive quiz generation & flashcard system
- ✅ Pomodoro focus timer with streak tracking
- ✅ Instant unit bookmarking for quick access
- ✅ Modern glassmorphism UI with dark/light themes
- ✅ Offline-first architecture with local persistence

---

## ✨ Key Features

### 1. **Complete Engineering Curriculum (Sem 1 to Sem 8)**
Comprehensive B.Tech syllabi for all major engineering branches.

**Features:**
- **Multi-Branch Support**: Dedicated subjects and unit breakdowns for:
  - 🖥️ **CSE** (Computer Science & Engineering)
  - 📡 **ECE** (Electronics & Communication Engineering)
  - ⚡ **EE** (Electrical Engineering)
  - 🔧 **ME** (Mechanical Engineering)
  - 🏗️ **CE** (Civil Engineering)
  - 💻 **IT** (Information Technology)

- **Semester Organization**: Structured from 1st Year (Fundamentals) to 4th Year (Advanced & Electives)
- **Curated Learning Resources**: Unit-by-unit links to:
  - 📊 Lecture slides & presentation materials
  - 📝 Formula cheat sheets & quick reference guides
  - 🎥 YouTube playlists (Gate Smashers, Neso Academy, etc.)
  - 📚 Reference textbooks & academic papers

### 2. **AI Study Partner - Powered by OpenRouter & Wikipedia**
Your personal AI tutor that generates textbook-grade study materials instantly.

**Features:**
- **Textbook-Grade Master Notes**: Comprehensive revision notes featuring:
  - ASCII architecture diagrams & flowcharts
  - Complexity metric tables & algorithm analysis
  - Working code implementations with explanations
  - Exam mnemonics & key takeaways
  - Step-by-step derivations & proofs

- **Interactive MCQ Quiz Generator**: 
  - Instant multiple-choice question generation
  - Step-by-step answer explanations
  - Difficulty level selection (Easy, Medium, Hard)
  - Topic-specific question filtering
  - Instant feedback & performance tracking

- **Active Recall Flashcard Deck**:
  - Auto-generated flashcards with AI-powered Q&A
  - Spaced repetition algorithm
  - Bookmark & favorite cards for revision
  - Study streak tracking

- **Dual AI Engine**:
  - **Live AI Queries**: Powered by OpenRouter API for real-time, context-aware responses
  - **Wikipedia Integration**: Seamless knowledge retrieval from Wikipedia REST API
  - **Offline Fallbacks**: Mock responses for demo & offline learning

### 3. **Pomodoro Focus Study Timer**
Maximize productivity with scientifically-proven time management.

**Features:**
- **Customizable Intervals**:
  - Set custom focus session duration (default: 25 min)
  - Adjustable short break timer (default: 5 min)
  - Adjustable long break timer (default: 15 min)
  - Auto-cycle between sessions & breaks

- **Auditory & Visual Feedback**:
  - Loud dual-pulse acoustic alarm chime on session completion
  - High-energy box shake animation (`@keyframes timer-shake`)
  - Real-time countdown display
  - Visual progress indicator

- **Streak & Session Tracking**:
  - Total focus sessions completed per study day
  - Weekly & monthly productivity analytics
  - Motivation badges & milestones
  - Persistent streak history in local storage

- **Study Environment Control**:
  - Distraction-free fullscreen mode
  - Ambient study soundscapes (optional)
  - Break reminders & hydration alerts

### 4. **Instant Unit Bookmarking**
One-click system for saving your favorite units and quick filtering.

**Features:**
- **Reactive State Persistence**: Bookmarks saved instantly to browser local storage
- **Visual Feedback**: 
  - Golden filled bookmark badge on bookmarked units
  - Animated bookmark toggle animation
  - Quick-filter panel on the dashboard

- **Quick Access Sidebar**: Dedicated bookmarks section for rapid navigation
- **Sync Across Sessions**: Bookmarks persist across browser sessions
- **Smart Bookmark Management**: Remove bookmarks with one click

### 5. **Glassmorphism Design & Dual Theme Support**
Modern, aesthetic UI with physics-based animations.

**Features:**
- **Glassmorphic UI System**:
  - Frosted glass backdrop filters with blur effects
  - Gradient borders with ambient glow effects
  - Smooth transparency transitions
  - Shadow & depth layering

- **Physics-Based Micro-Animations**:
  - Framer Motion for smooth enter/exit transitions
  - Stagger animations on list rendering
  - Hover ripple effects on interactive elements
  - Shake animations for alerts & notifications

- **Dark & Light Mode Toggle**:
  - Seamless theme switching with 0.3s transition
  - Custom color palette for each theme:
    - **Dark Mode**: Slate-900 base with amber accents
    - **Light Mode**: Slate-50 base with blue accents
  - Automatic theme detection (system preference)
  - Manual toggle in navbar

- **Streamlined Authentication**:
  - Quick name & email sign-in
  - No password friction or security complexity
  - One-click demo access
  - Profile customization options

### 6. **Responsive & Accessible Design**
Works seamlessly across all devices.

**Features:**
- **Ultra-Responsive Layout**:
  - Mobile-first design (320px & up)
  - Tablet optimization (768px & up)
  - Desktop HD support (1920px & up)
  - Touch-friendly interaction targets

- **Accessibility Standards**:
  - WCAG 2.1 Level AA compliance
  - Keyboard navigation support
  - Screen reader optimized
  - High contrast mode support
  - Semantic HTML structure

---

## 🛠️ Tech Stack

| Domain | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | [React 18](https://reactjs.org/) | Component-based UI with hooks |
| **Build Tooling** | [Vite 6](https://vitejs.dev/) | Lightning-fast HMR & optimized builds |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com/) | Utility-first CSS framework |
| **Styling** | Custom Glassmorphism System | Frosted glass effects & animations |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) | Smooth page transitions & micro-interactions |
| **Icons** | [Lucide React](https://lucide.dev/) | 700+ beautiful SVG icons |
| **PDF Rendering** | [PDF.js](https://mozilla.github.io/pdf.js/) | Inline PDF viewer for resources |
| **AI Integration** | [OpenRouter API](https://openrouter.ai/) | Multi-model LLM access (GPT, Claude, etc.) |
| **Knowledge Base** | [Wikipedia REST API](https://en.wikipedia.org/w/api.php) | Supplementary knowledge retrieval |
| **State Management** | React Context API | Global app state & bookmarks |
| **Deployment** | [GitHub Pages](https://pages.github.com/) | Free static hosting with auto CI/CD |

---

## 📁 Project Structure

```
studynest/
├── public/                          # Static assets & favicon
├── src/
│   ├── assets/                      # Logo, brand images & illustrations
│   ├── components/                  # React UI Components
│   │   ├── LoginScreen.jsx          # Authentication screen
│   │   ├── AppShell.jsx             # Main app layout & navigation
│   │   ├── HomeView.jsx             # Dashboard with branch & subject selection
│   │   ├── SubjectDetail.jsx        # Subject units & resources
│   │   ├── UnitDetail.jsx           # Unit details & resource links
│   │   ├── StudyTimer.jsx           # Pomodoro timer component
│   │   ├── AIAssistant.jsx          # AI chat interface
│   │   ├── QuizGenerator.jsx        # MCQ & quiz creation
│   │   ├── FlashcardDeck.jsx        # Spaced repetition flashcards
│   │   ├── BookmarkPanel.jsx        # Quick access bookmarks
│   │   └── ThemeToggle.jsx          # Dark/Light mode switcher
│   │
│   ├── context/
│   │   └── AppContext.jsx           # Global app state & bookmarks store
│   │
│   ├── data/
│   │   └── studyData.js             # Complete B.Tech syllabus database
│   │
│   ├── services/
│   │   ├── aiService.js             # OpenRouter & Wikipedia API integration
│   │   ├── quizService.js           # Quiz generation & validation logic
│   │   └── storageService.js        # LocalStorage persistence utilities
│   │
│   ├── App.jsx                      # Root component & error boundary
│   ├── index.css                    # Global styles, glassmorphism utilities & keyframes
│   └── main.jsx                     # React entry point
│
├── .gitignore                       # Git ignore rules
├── index.html                       # HTML entry point
├── package.json                     # Dependencies & npm scripts
├── vite.config.js                   # Vite configuration & GitHub Pages base path
├── tailwind.config.js               # Tailwind CSS configuration
├── postcss.config.js                # PostCSS plugins configuration
└── README.md                        # This file

```

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v16.0 or higher)
- npm or yarn package manager
- Git for version control

### Installation & Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/Sweta113Sharma/studynest.git

# 2. Navigate to project directory
cd studynest

# 3. Install dependencies
npm install

# 4. Set up environment variables (optional for AI features)
# Create a .env file in the root directory:
# VITE_OPENROUTER_API_KEY=your_api_key_here

# 5. Start development server
npm run dev
```

Your app will be live at **`http://localhost:5173/`** with hot module reloading enabled!

### Building for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview

# Deploy to GitHub Pages (requires gh-pages setup)
npm run deploy
```

---

## 🎓 How to Use StudyNest

### Getting Started
1. **Sign In**: Enter your name and email to get started (no password needed!)
2. **Select Your Branch**: Choose from CSE, ECE, EE, ME, CE, or IT
3. **Browse Subjects**: Navigate through your semester curriculum

### Studying
1. **Review Syllabi**: Click on any subject to see all units and learning outcomes
2. **Access Resources**: Links to lectures, textbooks, and YouTube playlists
3. **Bookmark Important Units**: Click the bookmark icon for quick access later
4. **Generate Study Materials**:
   - Ask the AI Assistant for detailed notes on any topic
   - Generate quizzes to test your knowledge
   - Create flashcard decks for active recall

### Productivity
1. **Start the Timer**: Set your focus session length (default 25 min)
2. **Study Focused**: Timer will shake & alert when your session ends
3. **Take Breaks**: Follow the recommended break schedule
4. **Track Streaks**: Monitor your daily study consistency

### AI Features
- **Ask Questions**: Query the AI assistant about any topic
- **Get Notes**: Generate comprehensive revision notes with diagrams
- **Quiz Yourself**: Auto-generated multiple-choice questions with explanations
- **Build Flashcards**: Create spaced repetition decks for memorization

---

## 📱 Responsive Breakpoints

StudyNest is optimized for:
- 📱 **Mobile**: 320px - 640px
- 📱 **Tablet**: 641px - 1024px
- 🖥️ **Desktop**: 1025px - 1440px
- 🖥️ **Large Display**: 1441px+

---

## 🎨 Color Palette

### Dark Mode (Default)
- **Primary**: Amber-400, Amber-600
- **Surface**: Slate-900, Slate-800, Slate-700
- **Text**: White, Slate-200, Slate-300
- **Accent**: Cyan-400, Blue-400

### Light Mode
- **Primary**: Blue-600, Blue-700
- **Surface**: Slate-50, Slate-100, Slate-200
- **Text**: Slate-900, Slate-800, Slate-700
- **Accent**: Amber-500, Cyan-500

---

## 🔐 Privacy & Data

- **No Backend Server**: All data stored locally in your browser (LocalStorage)
- **No Tracking**: Zero analytics or third-party tracking
- **Secure API**: OpenRouter API calls don't store your data
- **Offline First**: Full functionality without internet (with mock AI responses)

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork** the repository
2. **Create** a new feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow the existing code style & component structure
- Test responsive design across all breakpoints
- Ensure accessibility standards (WCAG 2.1 AA)
- Add meaningful commit messages
- Update documentation as needed

---

## 🐛 Known Issues & Roadmap

### Currently Working On
- [ ] Offline AI model integration (Ollama support)
- [ ] Cloud sync with Firebase
- [ ] PDF note-taking with annotations
- [ ] Collaborative study groups
- [ ] Mobile app (React Native)

### Known Limitations
- AI features require OpenRouter API key for full functionality
- Some resources may be region-locked
- PDF rendering works best on modern browsers

---

## 📞 Support & Feedback

Found a bug? Have a feature request? 
- 📧 **Email**: sweta113sharma@gmail.com
- 🐙 **GitHub Issues**: [Create an issue](https://github.com/Sweta113Sharma/studynest/issues)
- 💬 **Discussions**: [Join the community](https://github.com/Sweta113Sharma/studynest/discussions)

---

## 📄 License

This project is open-source and available under the **[MIT License](LICENSE)**.

You are free to use, modify, and distribute this project with proper attribution.

---

## 🙏 Acknowledgments

**StudyNest** was created to solve a real problem: engineering students need better tools to manage complex syllabi and retain knowledge effectively.

Special thanks to:
- **React & Vite** communities for amazing frameworks
- **OpenRouter** for multi-model AI access
- **Tailwind CSS** for elegant utility-first styling
- **All contributors** who have improved this project

---

<div align="center">

**Made with ❤️ by Sweta Sharma for Engineering Students Everywhere**

⭐ If you find StudyNest helpful, please star this repository!

[GitHub](https://github.com/Sweta113Sharma/studynest) • [Live Demo](https://sweta113sharma.github.io/studynest/)

</div>
