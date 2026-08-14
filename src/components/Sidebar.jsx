import React from 'react'
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Sparkles,
  Award,
  Clock,
  Calendar,
  Sprout,
  Trophy,
  Shield,
  Settings,
  LogOut,
  ChevronRight,
  Flame
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import MascotOwl from './MascotOwl'

export default function Sidebar({ onOpenSettings, onOpenAI, isMobileOpen, setIsMobileOpen }) {
  const {
    currentView,
    setCurrentView,
    user,
    handleLogout,
    xp,
    level,
    levelTitle,
    focusHistory
  } = useApp()

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

  const navItems = [
    { id: 'home', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'subjects', label: 'Subjects', icon: BookOpen },
    { id: 'notes', label: 'Notes', icon: FileText, badge: 'New' },
    { id: 'ai-tutor', label: 'AI Tutor', icon: Sparkles, isAction: true },
    { id: 'quizzes', label: 'Quizzes', icon: Award },
    { id: 'focus', label: 'Focus', icon: Clock },
    { id: 'planner', label: 'Planner', icon: Calendar },
    { id: 'growth', label: 'My Growth', icon: Sprout, badge: 'Tree' },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
  ]

  const handleNavClick = (item) => {
    if (item.isAction) {
      if (item.id === 'ai-tutor' && onOpenAI) {
        onOpenAI()
      }
    } else {
      setCurrentView(item.id)
    }
    if (setIsMobileOpen) setIsMobileOpen(false)
  }

  const isItemActive = (id) => {
    if (id === 'home' && currentView === 'home') return true
    if (id === 'subjects' && (currentView === 'subjects' || currentView === 'subject-detail' || currentView === 'unit-detail')) return true
    if (id === 'quizzes' && (currentView === 'quiz' || currentView === 'flashcards' || currentView === 'quizzes')) return true
    return currentView === id
  }

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Persistent Desktop Sidebar / Slide-out Drawer for Mobile */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-white dark:bg-slate-900 border-r border-[#E5EAF0] dark:border-white/10 flex flex-col justify-between z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Top Branding */}
        <div>
          <div className="p-5 flex items-center gap-3 border-b border-[#E5EAF0] dark:border-white/10">
            <div className="w-10 h-10 rounded-xl bg-[#EAF4FF] dark:bg-blue-950/60 border border-[#2878D4]/20 flex items-center justify-center p-1 shadow-sm">
              <MascotOwl state="default" size="sm" animate={false} />
            </div>
            <div>
              <h1 className="font-display font-black text-lg text-[#123B70] dark:text-white leading-tight tracking-tight flex items-center gap-1">
                Study<span className="text-[#2878D4]">Nest</span>
              </h1>
              <p className="text-[10px] font-semibold text-[#687386] dark:text-slate-400">
                Academic Study Workspace
              </p>
            </div>
          </div>

          {/* User Level & Streak Summary Pill */}
          <div className="mx-4 mt-4 p-3 rounded-2xl bg-[#FFF9EE] dark:bg-slate-800/60 border border-[#F5B72C]/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#F5B72C]/20 text-[#F5B72C] flex items-center justify-center font-bold text-xs">
                ⭐
              </div>
              <div>
                <p className="text-xs font-bold text-[#172033] dark:text-white leading-none">
                  Lvl {level} • {xp} XP
                </p>
                <p className="text-[10px] font-medium text-[#687386] dark:text-slate-400 mt-0.5 truncate max-w-[90px]">
                  {levelTitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 bg-amber-500/15 px-2 py-1 rounded-xl text-xs font-extrabold text-amber-700 dark:text-amber-300">
              <Flame className="w-3.5 h-3.5 fill-current text-amber-600" />
              <span>{currentStreak}d</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 mt-2 overflow-y-auto max-h-[calc(100vh-280px)] custom-scrollbar">
            {navItems.map((item) => {
              const active = isItemActive(item.id)
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${
                    active
                      ? 'bg-[#EAF4FF] dark:bg-blue-900/40 text-[#123B70] dark:text-blue-300 shadow-sm border border-[#2878D4]/20'
                      : 'text-[#687386] dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#172033] dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        active ? 'text-[#2878D4] dark:text-blue-400' : 'text-[#687386] dark:text-slate-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                      active
                        ? 'bg-[#2878D4] text-white'
                        : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}

            {/* Admin Portal Tab (When User is Admin) */}
            {user?.role === 'admin' && (
              <div className="pt-2">
                <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-400">
                  Administration
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentView('admin-portal')
                    if (setIsMobileOpen) setIsMobileOpen(false)
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${
                    currentView === 'admin-portal'
                      ? 'bg-purple-500/15 text-purple-900 dark:text-purple-200 border border-purple-500/30 shadow-sm'
                      : 'text-[#687386] dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span>Admin Panel</span>
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-purple-600 text-white">
                    Root
                  </span>
                </button>
              </div>
            )}
          </nav>
        </div>

        {/* Bottom Profile & Settings */}
        <div className="p-3 border-t border-[#E5EAF0] dark:border-white/10 space-y-1 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            type="button"
            onClick={() => {
              if (onOpenSettings) onOpenSettings()
              if (setIsMobileOpen) setIsMobileOpen(false)
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-[#687386] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4" />
            <span>Settings & Preferences</span>
          </button>

          <div className="pt-2 flex items-center justify-between px-2">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-[#123B70] text-white flex items-center justify-center text-xs font-bold shrink-0">
                {user?.name?.charAt(0) || 'S'}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-[#172033] dark:text-white truncate">
                  {user?.name || 'Student'}
                </p>
                <p className="text-[10px] text-[#687386] dark:text-slate-400 truncate">
                  {user?.branch || 'CSE'} • {user?.role === 'admin' ? 'Admin' : 'Student'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              title="Log Out"
              className="p-1.5 rounded-lg text-slate-700 hover:text-red-700 hover:bg-red-500/15 dark:hover:bg-red-500/20 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
