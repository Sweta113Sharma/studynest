import React from 'react'
import {
  Home,
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
      if (focusHistory && focusHistory.includes(dateStr)) {
        streak++
        checkDate.setDate(checkDate.getDate() - 1)
      } else {
        if (streak === 0) {
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)
          const yesterdayStr = yesterday.toISOString().split('T')[0]
          if (focusHistory && focusHistory.includes(yesterdayStr)) {
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
    { id: 'home', label: 'Home', icon: Home },
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

      {/* Persistent Desktop Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-white dark:bg-nest-light-input border-r border-nest-border flex flex-col justify-between z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Top Branding */}
        <div>
          <div className="p-5 flex items-center gap-3 border-b border-nest-border">
            <div className="w-10 h-10 rounded-full bg-nest-light-blue dark:bg-nest-light-blue/20 border border-nest-blue/20 flex items-center justify-center p-0.5 shadow-sm overflow-hidden">
              <MascotOwl state="default" size="sm" animate={false} />
            </div>
            <div>
              <h1 className="font-display font-black text-lg text-nest-navy dark:text-white leading-tight tracking-tight flex items-center gap-1">
                Study<span className="text-nest-blue">Nest</span>
              </h1>
              <p className="text-[10px] font-semibold text-nest-gray dark:text-slate-400">
                Academic Study Workspace
              </p>
            </div>
          </div>
 
          {/* Navigation Links */}
          <nav className="p-3 space-y-1 mt-2 overflow-y-auto max-h-[calc(100vh-290px)] custom-scrollbar">
            {navItems.map((item) => {
              const active = isItemActive(item.id)
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-[12px] text-sm font-semibold transition-all duration-150 cursor-pointer ${
                    active
                      ? 'bg-nest-light-blue dark:bg-nest-light-blue/25 text-nest-navy dark:text-nest-blue shadow-xs'
                      : 'text-nest-gray dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-nest-navy dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        active ? 'text-nest-blue dark:text-nest-blue' : 'text-nest-gray dark:text-slate-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                      active
                        ? 'bg-nest-blue text-white'
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
                      : 'text-nest-gray dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
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

        {/* Bottom Section: Profile + Settings */}
        <div className="p-3 border-t border-nest-border dark:border-white/10 space-y-2 bg-slate-50/50 dark:bg-slate-900/50">
          {/* Profile Bar */}
          <div className="pt-1 px-1 flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="truncate">
                <p className="text-xs font-bold text-nest-navy dark:text-white truncate">
                  {user?.name || 'sweta'}
                </p>
                <p className="text-[10px] text-nest-gray dark:text-slate-400 truncate">
                  {user?.branch || 'CSE'} • {user?.role === 'admin' ? 'Admin' : 'Student'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              title="Log Out"
              className="p-1.5 rounded-lg text-slate-600 hover:text-red-650 hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Settings Button */}
          <button
            type="button"
            onClick={() => {
              if (onOpenSettings) onOpenSettings()
              if (setIsMobileOpen) setIsMobileOpen(false)
            }}
            className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-[12px] text-xs font-semibold text-nest-gray dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4" />
            <span>Settings & Preferences</span>
          </button>
        </div>
      </aside>
    </>
  )
}
