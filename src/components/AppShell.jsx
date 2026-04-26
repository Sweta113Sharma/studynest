import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon, Settings, LogOut, Sparkles, BookOpen, Video, FileText, HelpCircle, ChevronRight, Check, Plus, X } from 'lucide-react'
import HomeView from './HomeView'
import SubjectsView from './SubjectsView'
import SubjectDetailView from './SubjectDetailView'
import UnitDetailView from './UnitDetailView'
import QuizView from './QuizView'
import SettingsModal from './SettingsModal'

const viewVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
}

export default function AppShell({ context }) {
  const {
    user, selectedYear, setSelectedYear, selectedBranch, setSelectedBranch,
    selectedSemester, setSelectedSemester, selectedSubject, setSelectedSubject,
    selectedUnit, setSelectedUnit, currentView, setCurrentView,
    darkMode, setDarkMode, handleLogout, getGreeting, getInitials,
    yearToSemesters
  } = context

  const [showSettings, setShowSettings] = useState(false)

  const navigateTo = (view) => {
    setCurrentView(view)
  }

  const goHome = () => {
    setSelectedYear(null)
    setSelectedBranch(null)
    setSelectedSemester(null)
    setSelectedSubject(null)
    setSelectedUnit(null)
    navigateTo('home')
  }

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return (
          <HomeView
            key="home"
            context={{
              ...context,
              navigateTo,
              goHome,
              selectedYear,
              setSelectedYear,
              setSelectedBranch,
              yearToSemesters
            }}
          />
        )
      case 'subjects':
        return (
          <SubjectsView
            key="subjects"
            context={{
              ...context,
              navigateTo,
              goHome
            }}
          />
        )
      case 'subject-detail':
        return (
          <SubjectDetailView
            key="subject-detail"
            context={{
              ...context,
              navigateTo,
              goHome,
              setSelectedUnit
            }}
          />
        )
      case 'unit-detail':
        return (
          <UnitDetailView
            key="unit-detail"
            context={{
              ...context,
              navigateTo,
              goToSubjectDetail: () => navigateTo('subject-detail')
            }}
          />
        )
      case 'quiz':
        return (
          <QuizView
            key="quiz"
            context={{
              ...context,
              navigateTo,
              goToSubjectDetail: () => navigateTo('subject-detail')
            }}
          />
        )
      default:
        return <HomeView key="home" context={{ ...context, navigateTo, goHome }} />
    }
  }

  return (
    <div className="min-h-screen">
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/5"
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      >
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={goHome}
            className="flex items-center gap-2 text-xl font-display font-bold hover:opacity-80 transition-opacity"
          >
            <span className="text-2xl">⚡</span>
            <span>Study<span className="text-gradient">Nest</span></span>
          </button>

          <nav className="hidden md:flex items-center gap-1">
            {['home', 'subjects'].map((view) => (
              <button
                key={view}
                onClick={() => view === 'home' ? goHome() : navigateTo('subjects')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentView === view
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                }`}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-10 h-10 rounded-xl glass-card hover:bg-white/10 flex items-center justify-center transition-all hover:scale-105"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setShowSettings(true)}
              className="w-10 h-10 rounded-xl glass-card hover:bg-white/10 flex items-center justify-center transition-all hover:scale-105"
            >
              <Settings className="w-4 h-4" />
            </button>

            <button
              onClick={handleLogout}
              className="w-10 h-10 rounded-xl glass-card hover:bg-white/10 flex items-center justify-center transition-all hover:scale-105 text-destructive"
            >
              <LogOut className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 ml-2 pl-4 border-l border-white/10">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{getGreeting()}, {user?.name?.split(' ')[0]}</p>
                <p className="text-xs text-muted-foreground">Ready to learn</p>
              </div>
              <div
                className="w-10 h-10 rounded-xl animated-gradient flex items-center justify-center text-sm font-bold"
              >
                {user?.initials || 'ST'}
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="pt-20 pb-10 px-4 max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            variants={viewVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} context={context} />
    </div>
  )
}