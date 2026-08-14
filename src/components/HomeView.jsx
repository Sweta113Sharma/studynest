import React from 'react'
import { motion } from 'framer-motion'
import {
  BookOpen,
  Clock,
  Sparkles,
  Award,
  ArrowRight,
  Bookmark,
  Flame,
  CheckCircle2,
  Sprout,
  Star,
  ChevronRight,
  Circle,
  Trophy,
  Plus
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import MascotOwl from './MascotOwl'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 120, damping: 14 }
  }
}

export default function HomeView() {
  const {
    user,
    navigateTo,
    selectedYear,
    setSelectedYear,
    setSelectedBranch,
    setSelectedSubject,
    setSelectedUnit,
    branches,
    getBookmarks,
    toggleBookmark,
    focusHistory,
    xp,
    level,
    levelTitle,
    tasks,
    toggleTask,
    semesters
  } = useApp()

  const bookmarks = getBookmarks()
  const sessionsCount = parseInt(localStorage.getItem('studynest_timer_sessions') || '0', 10)

  // Calculate Streak
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

  // Greeting based on time of day
  const getGreetingText = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 18) return 'Good Afternoon'
    return 'Good Evening'
  }

  // Active Subject Cards for Continue Learning
  const activeSubjects = [
    {
      id: 'sub-java',
      name: 'Java Programming',
      progress: 68,
      nextTopic: 'OOP Concepts & Polymorphism',
      branch: 'CSE',
      icon: '💻',
      color: '#2878D4'
    },
    {
      id: 'sub-dsa',
      name: 'Data Structures & Algorithms',
      progress: 55,
      nextTopic: 'Binary Search Tree & Rotations',
      branch: 'CSE',
      icon: '🌲',
      color: '#55A85A'
    },
    {
      id: 'sub-math',
      name: 'Engineering Mathematics II',
      progress: 40,
      nextTopic: 'Eigenvalues & Characteristic Equations',
      branch: 'All',
      icon: '📐',
      color: '#F5B72C'
    }
  ]

  const handleYearSelect = (year) => {
    setSelectedYear(year)
    setSelectedBranch(null)
  }

  const handleBranchSelect = (branch) => {
    setSelectedBranch(branch.id)
    navigateTo('subjects')
  }

  return (
    <motion.div
      className="space-y-6 max-w-7xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 1. Header Greeting */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-[#172033] dark:text-white tracking-tight">
            {getGreetingText()}, <span className="text-[#2878D4] dark:text-blue-400">{user?.name?.split(' ')[0] || 'Scholar'}!</span> 👋
          </h1>
          <p className="text-xs sm:text-sm font-medium text-[#687386] dark:text-slate-300 mt-0.5">
            Ready to build your knowledge nest today?
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#FFF9EE] dark:bg-slate-800 border border-[#F5B72C]/40 text-xs font-bold text-amber-800 dark:text-amber-300">
            <Flame className="w-4 h-4 text-amber-600 fill-current" />
            <span>{currentStreak} Day Streak</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#EAF4FF] dark:bg-slate-800 border border-[#2878D4]/30 text-xs font-bold text-[#123B70] dark:text-blue-300">
            <Star className="w-4 h-4 text-[#F5B72C] fill-current" />
            <span>{xp} XP</span>
          </div>
        </div>
      </motion.div>

      {/* 2. Hero Study Card */}
      <motion.section
        variants={itemVariants}
        className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#123B70] via-[#1A4B8C] to-[#123B70] text-white shadow-xl border border-white/10 overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6"
        aria-label="Today's Study Progress Hero"
      >
        <div className="relative z-10 max-w-xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Today's Focus Goal
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black font-display text-white">72%</span>
              <span className="text-xs font-semibold text-blue-200">Daily syllabus revision complete</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-black/25 rounded-full overflow-hidden p-0.5 border border-white/20">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '72%' }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-amber-400 to-[#F5B72C] rounded-full"
              />
            </div>
          </div>

          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed font-normal">
            You're on track to master <span className="font-bold text-white">OOP Polymorphism</span> and finish Unit 2 before your study streak resets.
          </p>

          {/* Gold CTA Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => navigateTo('subjects')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F5B72C] hover:bg-amber-400 text-[#123B70] font-bold text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all duration-150 cursor-pointer"
            >
              Start Studying →
            </button>
          </div>
        </div>

        {/* Mascot Illustration on Right */}
        <div className="relative z-10 flex items-center justify-center shrink-0">
          <div className="p-3 bg-white/10 rounded-3xl border border-white/15 backdrop-blur-sm shadow-inner">
            <MascotOwl state="reading" size="lg" />
          </div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
      </motion.section>

      {/* 3. Today's Overview (4 Compact Cards) */}
      <motion.section
        variants={itemVariants}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
        aria-label="Today's Overview Metrics"
      >
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#E5EAF0] dark:border-white/10 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#EAF4FF] dark:bg-blue-950/60 text-[#2878D4] dark:text-blue-400 flex items-center justify-center border border-[#2878D4]/20 shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-bold font-display text-[#172033] dark:text-white">
              {bookmarks.length > 0 ? bookmarks.length : 3}
            </span>
            <p className="text-xs font-semibold text-[#687386] dark:text-slate-400">Topics Completed</p>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#E5EAF0] dark:border-white/10 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300 flex items-center justify-center border border-amber-500/30 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-bold font-display text-[#172033] dark:text-white">
              {sessionsCount > 0 ? `${sessionsCount * 25}m` : '1h 45m'}
            </span>
            <p className="text-xs font-semibold text-[#687386] dark:text-slate-400">Focus Time</p>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#E5EAF0] dark:border-white/10 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-red-500/15 text-red-700 dark:text-red-300 flex items-center justify-center border border-red-500/30 shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-bold font-display text-[#172033] dark:text-white">
              {currentStreak} Days
            </span>
            <p className="text-xs font-semibold text-[#687386] dark:text-slate-400">Current Streak</p>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#E5EAF0] dark:border-white/10 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#FFF9EE] dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 flex items-center justify-center border border-[#F5B72C]/40 shrink-0">
            <Star className="w-5 h-5 fill-current text-[#F5B72C]" />
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-bold font-display text-[#172033] dark:text-white">
              {xp} XP
            </span>
            <p className="text-xs font-semibold text-[#687386] dark:text-slate-400">Total Earned</p>
          </div>
        </div>
      </motion.section>

      {/* 4. Continue Learning & Today's Tasks (2-Column Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Continue Learning (7 Cols) */}
        <motion.section variants={itemVariants} className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-lg text-[#172033] dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#2878D4]" />
              Continue Learning
            </h2>
            <button
              type="button"
              onClick={() => navigateTo('subjects')}
              className="text-xs font-bold text-[#2878D4] dark:text-blue-400 hover:underline flex items-center gap-0.5"
            >
              All Subjects <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {activeSubjects.map((sub) => (
              <div
                key={sub.id}
                onClick={() => navigateTo('subjects')}
                className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#E5EAF0] dark:border-white/10 shadow-sm hover:shadow-md hover:border-[#2878D4]/40 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{sub.icon}</span>
                    <div>
                      <h3 className="font-display font-bold text-sm sm:text-base text-[#172033] dark:text-white group-hover:text-[#2878D4] transition-colors">
                        {sub.name}
                      </h3>
                      <p className="text-xs text-[#687386] dark:text-slate-400 mt-0.5">
                        Next: <span className="font-medium text-slate-800 dark:text-slate-200">{sub.nextTopic}</span>
                      </p>
                    </div>
                  </div>

                  <span className="text-xs sm:text-sm font-extrabold text-[#123B70] dark:text-blue-400 shrink-0">
                    {sub.progress}%
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between gap-4">
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#2878D4] rounded-full"
                      style={{ width: `${sub.progress}%` }}
                    />
                  </div>

                  <span className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 group-hover:bg-[#123B70] group-hover:text-white transition-all shrink-0">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Right: Today's Tasks Checklist (5 Cols) */}
        <motion.section variants={itemVariants} className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-lg text-[#172033] dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#55A85A]" />
              Today's Tasks
            </h2>
            <button
              type="button"
              onClick={() => navigateTo('planner')}
              className="text-xs font-bold text-[#2878D4] dark:text-blue-400 hover:underline flex items-center gap-0.5"
            >
              Open Planner <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-[#E5EAF0] dark:border-white/10 shadow-sm space-y-3">
            {tasks.slice(0, 3).map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`p-3 rounded-2xl border transition-all flex items-center gap-3 cursor-pointer ${
                  task.completed
                    ? 'bg-slate-50/50 dark:bg-slate-950/40 border-slate-200 dark:border-white/5 opacity-60'
                    : 'bg-[#F6F9FD] dark:bg-slate-800/60 border-[#E5EAF0] dark:border-slate-700/60 hover:border-[#2878D4]/40'
                }`}
              >
                <button type="button" className="text-slate-400 hover:text-emerald-600">
                  {task.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100 dark:fill-emerald-950" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                <div className="min-w-0 flex-1">
                  <p className={`text-xs font-semibold truncate ${
                    task.completed ? 'line-through text-[#687386]' : 'text-[#172033] dark:text-white'
                  }`}>
                    {task.text}
                  </p>
                  <p className="text-[10px] text-[#687386] dark:text-slate-400">
                    {task.subject}
                  </p>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => navigateTo('planner')}
              className="w-full py-2.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-xs font-bold text-[#687386] dark:text-slate-300 hover:border-[#2878D4] hover:text-[#2878D4] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Study Goal
            </button>
          </div>
        </motion.section>
      </div>

      {/* 5. Year & Branch Curriculum Navigator */}
      <motion.section variants={itemVariants} className="space-y-4 pt-2" aria-label="Branch Curriculum Selector">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-display font-bold text-[#172033] dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#123B70] dark:text-blue-400" />
              Explore Syllabus by Branch
            </h2>
            <p className="text-xs text-[#687386] dark:text-slate-400">Select your academic year and department to view unit modules</p>
          </div>
        </div>

        {/* Year Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {[1, 2, 3, 4].map((yr) => (
            <button
              key={yr}
              type="button"
              onClick={() => handleYearSelect(yr)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedYear === yr
                  ? 'bg-[#123B70] text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-[#E5EAF0] dark:border-white/10 text-[#687386] dark:text-slate-300 hover:border-[#2878D4]/40'
              }`}
            >
              Year {yr}
            </button>
          ))}
        </div>

        {/* Branch Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {branches.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => handleBranchSelect(b)}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#E5EAF0] dark:border-white/10 shadow-xs hover:shadow-md hover:border-[#2878D4]/50 transition-all text-center group cursor-pointer flex flex-col items-center"
            >
              <div className="w-10 h-10 rounded-xl bg-[#EAF4FF] dark:bg-blue-950/60 text-[#2878D4] flex items-center justify-center font-bold text-sm mb-2 group-hover:scale-105 transition-transform">
                {b.name.substring(0, 3)}
              </div>
              <p className="text-xs font-bold text-[#172033] dark:text-white leading-tight">
                {b.name}
              </p>
            </button>
          ))}
        </div>
      </motion.section>
    </motion.div>
  )
}