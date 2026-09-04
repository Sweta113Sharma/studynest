import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,

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
              <div className="inline-flex items-center justify-center p-3 rounded-3xl bg-nest-cream dark:bg-slate-800 border border-nest-gold/40 mb-3">
                <MascotOwl state="focus" size="lg" />
              </div>
              <h1 className="text-2xl font-display font-black text-nest-navy dark:text-white">
                Quiet Study Nest
              </h1>
              <p className="text-xs sm:text-sm text-nest-gray dark:text-slate-400 mt-1">
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
    <div className="min-h-screen bg-transparent text-nest-navy transition-colors">
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
        <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-nest-light-input/80 backdrop-blur-md border-b border-nest-border px-4 sm:px-6 flex items-center justify-between">
          {/* Left: Mobile Menu Trigger + Brand on Mobile */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 rounded-xl text-nest-gray hover:bg-nest-light-blue/20 dark:hover:bg-nest-light-input lg:hidden cursor-pointer"
              aria-label="Open Navigation Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Mobile Logo Title */}
            <div className="flex items-center gap-2 lg:hidden">
              <img src="/owl-logo.png" alt="StudyNest" className="w-7 h-7 rounded-full object-cover" />
              <span className="font-display font-black text-base text-nest-navy">
                Study<span className="text-nest-blue">Nest</span>
              </span>
            </div>

            {/* Desktop Breadcrumb */}
            <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-nest-gray">
              <img src="/owl-logo.png" alt="StudyNest" className="w-5 h-5 rounded-full object-cover" />
              <span className="font-bold text-nest-navy">StudyNest</span>
              <span className="text-slate-300">/</span>
              <span className="capitalize">{currentView === 'home' ? 'Home' : currentView.replace('-', ' ')}</span>
            </div>
          </div>

          {/* Right: Actions & Badges */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Notification Bell Icon */}
            <button
              type="button"
              onClick={() => alert("No new notifications!")}
              className="p-2 rounded-xl text-nest-gray hover:bg-nest-light-blue/20 dark:hover:bg-nest-light-input transition-colors cursor-pointer relative"
              aria-label="View Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#E52A7B] rounded-full" />
            </button>


            {/* Settings Button */}
            <button
              type="button"
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-xl text-nest-gray hover:bg-nest-light-blue/20 dark:hover:bg-nest-light-input transition-colors cursor-pointer shrink-0"
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
        className="fixed bottom-0 left-0 right-0 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-nest-border dark:border-white/10 flex items-center justify-around z-40 lg:hidden px-2"
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
                  ? 'text-nest-blue font-bold'
                  : 'text-nest-gray dark:text-slate-400 font-medium'
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