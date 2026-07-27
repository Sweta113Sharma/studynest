import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon, Settings, LogOut } from 'lucide-react'
import HomeView from './HomeView'
import SubjectsView from './SubjectsView'
import SubjectDetailView from './SubjectDetailView'
import UnitDetailView from './UnitDetailView'
import QuizView from './QuizView'
import FlashcardsView from './FlashcardsView'
import SettingsModal from './SettingsModal'
import StudyTimer from './StudyTimer'
import AIAssistantDrawer from './AIAssistantDrawer'
import { useApp } from '../context/AppContext'

import logo from '../assets/logo.png'

const viewVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
}

export default function AppShell() {
  const {
    user,
    currentView,
    darkMode,
    setDarkMode,
    handleLogout,
    getGreeting,
    goHome
  } = useApp()

  const [showSettings, setShowSettings] = useState(false)

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView key="home" />
      case 'subjects':
        return <SubjectsView key="subjects" />
      case 'subject-detail':
        return <SubjectDetailView key="subject-detail" />
      case 'unit-detail':
        return <UnitDetailView key="unit-detail" />
      case 'quiz':
        return <QuizView key="quiz" />
      case 'flashcards':
        return <FlashcardsView key="flashcards" />
      default:
        return <HomeView key="home" />
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-slate-300 dark:border-white/10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            type="button"
            onClick={goHome}
            className="flex items-center gap-2 hover:opacity-90 transition-all hover:scale-105 focus-visible:ring-2 focus-visible:ring-amber-500 rounded-xl"
            aria-label="StudyNest Home"
          >
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-white/20 p-0.5 shadow-md">
              <img 
                src={logo} 
                alt="StudyNest Logo" 
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <span className="font-display font-extrabold text-lg text-slate-900 dark:text-white hidden xs:inline">
              Study<span className="text-amber-600 dark:text-amber-400">Nest</span>
            </span>
          </button>

          <nav className="flex items-center gap-2" aria-label="Main Utilities">
            <StudyTimer />

            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              className="w-10 h-10 rounded-xl glass-card hover:bg-slate-200/50 dark:hover:bg-white/10 flex items-center justify-center transition-all focus-visible:ring-2 focus-visible:ring-amber-500"
              aria-label={darkMode ? "Switch to Light Theme" : "Switch to Dark Theme"}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            <button
              type="button"
              onClick={() => setShowSettings(true)}
              className="w-10 h-10 rounded-xl glass-card hover:bg-slate-200/50 dark:hover:bg-white/10 flex items-center justify-center transition-all focus-visible:ring-2 focus-visible:ring-amber-500 text-slate-800 dark:text-slate-200"
              aria-label="Open Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="w-10 h-10 rounded-xl glass-card hover:bg-red-500/10 flex items-center justify-center transition-all focus-visible:ring-2 focus-visible:ring-amber-500 text-red-600 dark:text-red-400"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 ml-2 pl-4 border-l border-slate-300 dark:border-white/10">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {getGreeting()}, {user?.name?.split(' ')[0]}
                </p>
                <p className="text-xs text-slate-700 dark:text-slate-300">Ready to learn</p>
              </div>
              <div
                className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center text-sm font-bold text-white shadow-md"
                aria-label={`User Initials: ${user?.initials || 'ST'}`}
              >
                {user?.initials || 'ST'}
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Main View Area */}
      <main className="pt-20 pb-12 px-4 max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            variants={viewVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.25 }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      <AIAssistantDrawer />
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  )
}