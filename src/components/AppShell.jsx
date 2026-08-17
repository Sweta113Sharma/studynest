import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  Sun,
  Moon,
  Settings,
  LogOut,
  ShieldCheck,
  Menu,
  Sparkles,
  LayoutDashboard,
  BookOpen,
  Clock,
  Sprout,
  FileText,
  Flame,
  Star,
  Award,
  Calendar,
  Trophy,
  Bell,
  User
} from 'lucide-react'
import HomeView from './HomeView'
import SubjectsView from './SubjectsView'
import SubjectDetailView from './SubjectDetailView'
import UnitDetailView from './UnitDetailView'
import NotesView from './NotesView'
import QuizView from './QuizView'
import FlashcardsView from './FlashcardsView'
import GrowthView from './GrowthView'
import PlannerView from './PlannerView'
import AchievementsView from './AchievementsView'
import SettingsModal from './SettingsModal'
import StudyTimer from './StudyTimer'
import AIAssistantDrawer from './AIAssistantDrawer'
import AdminPortalView from './AdminPortalView'
import Sidebar from './Sidebar'
import MascotOwl from './MascotOwl'
import { useApp } from '../context/AppContext'

import logo from '../assets/logo.png'

const viewVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 }
}

export default function AppShell() {
  const {
    user,
    currentView,
    setCurrentView,
    darkMode,
    setDarkMode,
    handleLogout,
    getGreeting,
    goHome,
    navigateTo,
    xp,
    level,
    levelTitle,
    focusHistory
  } = useApp()

  const [showSettings, setShowSettings] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false)

  const calculateStreak = () => {
    let streak = 0
    let checkDate = new Date()
    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0]
      if (focusHistory.includes(dateStr)) {
        streak++
        checkDate.setDate(checkDate.getDate() - 1)
      } else {
        if (streak === 0) {
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)
          const yesterdayStr = yesterday.toISOString().split('T')[0]
          if (focusHistory.includes(yesterdayStr)) {
            checkDate = yesterday
            continue
          }
        }
        break
      }
    }
    return streak
  }
  const currentStreak = calculateStreak()

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
      case 'notes':
        return <NotesView key="notes" onOpenAI={() => setIsAiDrawerOpen(true)} />
      case 'growth':
        return <GrowthView key="growth" />
      case 'planner':
        return <PlannerView key="planner" />
      case 'achievements':
        return <AchievementsView key="achievements" />
      case 'quiz':
      case 'quizzes':
        return <QuizView key="quiz" />
      case 'flashcards':
        return <FlashcardsView key="flashcards" />
      case 'focus':
        return (
          <div key="focus" className="max-w-3xl mx-auto py-4">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center p-3 rounded-3xl bg-[#f0fcee] dark:bg-slate-800 border border-[#f6e6a5]/40 mb-3">
                <MascotOwl state="focus" size="lg" />
              </div>
              <h1 className="text-2xl font-display font-black text-[#343b1b] dark:text-white">
                Quiet Study Nest
              </h1>
              <p className="text-xs sm:text-sm text-[#687386] dark:text-slate-400 mt-1">
                Distraction-free focus timer with ambient soundscapes. Complete sessions to nourish your streak!
              </p>
            </div>
            <StudyTimer isFullPage={true} />
          </div>
        )
      case 'admin-portal':
        return <AdminPortalView key="admin-portal" />
      default:
        return <HomeView key="home" />
    }
  }

  return (
    <div className="min-h-screen bg-[#f0fcee] dark:bg-[#0A1224] text-[#343b1b] dark:text-white transition-colors">
      {/* 1. Persistent Sidebar (Desktop) + Slide Drawer (Mobile) */}
      <Sidebar
        onOpenSettings={() => setShowSettings(true)}
        onOpenAI={() => setIsAiDrawerOpen(true)}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />

      {/* 2. Main Content Wrapper (Shifted right for 256px sidebar on lg screens) */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-[#E5EAF0] dark:border-white/10 px-4 sm:px-6 flex items-center justify-between">
          {/* Left: Mobile Menu Trigger + Brand on Mobile */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden cursor-pointer"
              aria-label="Open Navigation Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Mobile Logo Title */}
            <div className="flex items-center gap-2 lg:hidden">
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#E5EAF0] dark:border-white/20">
                <img src={logo} alt="StudyNest" className="w-full h-full object-cover" />
              </div>
              <span className="font-display font-black text-base text-[#343b1b] dark:text-white">
                Study<span className="text-[#3971b8]">Nest</span>
              </span>
            </div>

            {/* Desktop Breadcrumb */}
            <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-[#687386] dark:text-slate-400">
              <Home className="w-4 h-4 text-[#3971b8]" />
              <span className="font-bold text-[#343b1b] dark:text-white">StudyNest</span>
              <span className="text-slate-300 dark:text-slate-600">/</span>
              <span className="capitalize">{currentView === 'home' ? 'Home' : currentView.replace('-', ' ')}</span>
            </div>
          </div>

          {/* Right: Actions & Badges */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Notification Bell Icon */}
            <button
              type="button"
              onClick={() => alert("No new notifications!")}
              className="p-2 rounded-xl text-[#687386] dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer relative"
              aria-label="View Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#E52A7B] rounded-full" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl text-[#687386] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label={darkMode ? "Switch to Light Theme" : "Switch to Dark Theme"}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Settings Button */}
            <button
              type="button"
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-xl text-[#687386] dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
              title="Open Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* 3. Main View Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              variants={viewVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.2 }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* 4. Mobile Bottom Navigation Bar (Visible only on mobile/small screens) */}
      <nav
        className="fixed bottom-0 left-0 right-0 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-[#E5EAF0] dark:border-white/10 flex items-center justify-around z-40 lg:hidden px-2"
        aria-label="Mobile Navigation"
      >
        {[
          { id: 'home', label: 'Home', icon: Home },
          { id: 'subjects', label: 'Subjects', icon: BookOpen },
          { id: 'focus', label: 'Focus', icon: Clock },
          { id: 'growth', label: 'Growth', icon: Sprout },
          { id: 'profile', label: 'Profile', icon: User }
        ].map((tab) => {
          const active = tab.id === 'profile' ? showSettings : currentView === tab.id
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                if (tab.id === 'profile') {
                  setShowSettings(true)
                } else {
                  setCurrentView(tab.id)
                }
              }}
              className={`flex flex-col items-center justify-center gap-1 w-14 py-1 rounded-xl transition-all cursor-pointer ${
                active
                  ? 'text-[#3971b8] font-bold'
                  : 'text-[#687386] dark:text-slate-400 font-medium'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[10px] leading-none">{tab.label}</span>
            </button>
          )
        })}
      </nav>

      {/* 5. Drawers & Modals */}
      <AIAssistantDrawer isOpen={isAiDrawerOpen} onClose={() => setIsAiDrawerOpen(false)} />
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  )
}