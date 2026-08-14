import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  BookOpen,
  Clock,
  Sparkles,
  Award,
  ArrowRight,
  Flame,
  CheckCircle2,
  Circle,
  Star,
  ChevronRight,
  Calendar,
  Code2,
  Database,
  Network,
  Plus
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import MascotOwl from './MascotOwl'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.08 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 130, damping: 15 }
  }
}

export default function HomeView() {
  const {
    user,
    navigateTo,
    setCurrentView,
    focusHistory,
    xp,
    level,
    tasks,
    toggleTask,
    addTask,
    bookmarks
  } = useApp()

  const [newTaskInput, setNewTaskInput] = useState('')
  const [showTaskInput, setShowTaskInput] = useState(false)

  // Calculate consecutive streak days
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

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 18) return 'Good Afternoon'
    return 'Good Evening'
  }

  // Active Subject Cards in "Continue Learning"
  const continueSubjects = [
    {
      id: 'sub-java',
      name: 'Java Programming',
      nextTopic: 'OOP Concepts & Polymorphism',
      progress: 68,
      icon: Code2,
      bgColor: 'bg-indigo-600',
      color: '#4F46E5'
    },
    {
      id: 'sub-dbms',
      name: 'DBMS',
      nextTopic: 'Normalization',
      progress: 45,
      icon: Database,
      bgColor: 'bg-amber-500',
      color: '#F59E0B'
    },
    {
      id: 'sub-dsa',
      name: 'Data Structures',
      nextTopic: 'Arrays & Linked Lists',
      progress: 32,
      icon: Network,
      bgColor: 'bg-emerald-600',
      color: '#059669'
    }
  ]

  const handleQuickAddTask = (e) => {
    e.preventDefault()
    if (!newTaskInput.trim()) return
    addTask({
      text: newTaskInput.trim(),
      subject: 'General Study',
      priority: 'medium',
      dueDate: 'Today'
    })
    setNewTaskInput('')
    setShowTaskInput(false)
  }

  return (
    <motion.div
      className="space-y-6 max-w-7xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 1. Greeting Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-[#172033] dark:text-white tracking-tight">
            {getGreeting()}, <span className="text-[#2878D4] dark:text-blue-400">{user?.name || 'sweta'}!</span> 👋
          </h1>
          <p className="text-xs sm:text-sm font-medium text-[#687386] dark:text-slate-400 mt-0.5">
            Ready to build your knowledge nest today?
          </p>
        </div>
      </motion.div>

      {/* 2. Top Row: Hero Study Card (Left 8 cols) + Quick Overview (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Hero Study Card (8 cols) */}
        <motion.section
          variants={itemVariants}
          className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#123B70] via-[#1A4B8C] to-[#123B70] text-white shadow-lg border border-white/10 relative overflow-hidden flex flex-col justify-between"
          aria-label="Today's Study Progress Hero"
        >
          <div className="relative z-10 space-y-4">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-blue-100">
              <Clock className="w-3.5 h-3.5 text-blue-200" />
              <span>Today's Focus Goal</span>
            </div>

            {/* Progress Header */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl sm:text-5xl font-black font-display text-white">72%</span>
                <span className="text-xs sm:text-sm font-medium text-blue-200">Daily syllabus revision complete</span>
              </div>

              {/* Gold Progress Bar */}
              <div className="w-full max-w-md h-2.5 bg-black/30 rounded-full overflow-hidden p-0.5 border border-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '72%' }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className="h-full bg-[#F5B72C] rounded-full"
                />
              </div>
            </div>

            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed max-w-md font-normal">
              You're on track to master <span className="font-bold text-white">OOP Polymorphism</span> and finish <span className="font-bold text-white">Unit 2</span> before your study streak resets.
            </p>

            {/* Gold CTA Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => navigateTo('subjects')}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#F5B72C] hover:bg-amber-400 text-[#123B70] font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                Start Studying →
              </button>
            </div>
          </div>

          {/* Owl Mascot Illustration on Right */}
          <div className="absolute right-4 sm:right-8 bottom-4 sm:bottom-6 pointer-events-none hidden sm:block">
            <MascotOwl state="reading" size="xl" />
          </div>

          {/* Background Soft Glows */}
          <div className="absolute top-0 right-1/4 w-60 h-60 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        </motion.section>

        {/* Quick Overview (4 cols) */}
        <motion.section
          variants={itemVariants}
          className="lg:col-span-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-[#E5EAF0] dark:border-white/10 shadow-sm flex flex-col justify-between space-y-3"
          aria-label="Quick Overview"
        >
          <h2 className="text-xs font-bold text-[#172033] dark:text-white uppercase tracking-wider">
            Quick Overview
          </h2>

          <div className="space-y-3">
            {/* 1. Topics Completed */}
            <div className="p-3 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#EAF4FF] text-[#2878D4] flex items-center justify-center shrink-0 border border-[#2878D4]/20">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <p className="text-lg font-bold font-display text-[#172033] dark:text-white leading-tight">
                  {bookmarks?.length > 0 ? bookmarks.length : 3}
                </p>
                <p className="text-[11px] text-[#687386] dark:text-slate-400">Topics Completed</p>
              </div>
            </div>

            {/* 2. Focus Time */}
            <div className="p-3 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-lg font-bold font-display text-[#172033] dark:text-white leading-tight">
                  1h 45m
                </p>
                <p className="text-[11px] text-[#687386] dark:text-slate-400">Focus Time</p>
              </div>
            </div>

            {/* 3. Current Streak */}
            <div className="p-3 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0 border border-red-200">
                <Flame className="w-5 h-5 fill-current" />
              </div>
              <div>
                <p className="text-lg font-bold font-display text-[#172033] dark:text-white leading-tight">
                  {currentStreak} Days
                </p>
                <p className="text-[11px] text-[#687386] dark:text-slate-400">Current Streak</p>
              </div>
            </div>

            {/* 4. Total Earned XP */}
            <div className="p-3 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
                <Star className="w-5 h-5 fill-current" />
              </div>
              <div>
                <p className="text-lg font-bold font-display text-[#172033] dark:text-white leading-tight">
                  {xp} XP
                </p>
                <p className="text-[11px] text-[#687386] dark:text-slate-400">Total Earned</p>
              </div>
            </div>
          </div>
        </motion.section>
      </div>

      {/* 3. Middle Row: Continue Learning (4.5 cols) + Subjects at a Glance Donut (3.5 cols) + Today's Tasks (4 cols) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
        {/* Continue Learning (5 cols) */}
        <motion.section
          variants={itemVariants}
          className="lg:col-span-5 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-[#E5EAF0] dark:border-white/10 shadow-sm space-y-3.5 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-sm sm:text-base text-[#172033] dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#2878D4]" />
              Continue Learning
            </h2>
            <button
              type="button"
              onClick={() => navigateTo('subjects')}
              className="text-xs font-bold text-[#2878D4] hover:underline flex items-center gap-0.5"
            >
              All Subjects <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {continueSubjects.map((sub) => {
              const Icon = sub.icon
              return (
                <div
                  key={sub.id}
                  onClick={() => navigateTo('subjects')}
                  className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-[#E5EAF0] dark:border-white/5 hover:border-[#2878D4]/40 hover:shadow-sm transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-8 h-8 rounded-xl ${sub.bgColor} text-white flex items-center justify-center shrink-0 shadow-xs`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <h3 className="font-display font-bold text-xs sm:text-sm text-[#172033] dark:text-white group-hover:text-[#2878D4] transition-colors truncate">
                          {sub.name}
                        </h3>
                        <p className="text-[10px] text-[#687386] dark:text-slate-400 truncate">
                          Next: {sub.nextTopic}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-bold text-[#172033] dark:text-white">
                        {sub.progress}%
                      </span>
                      <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 group-hover:bg-[#123B70] group-hover:text-white transition-all text-xs">
                        →
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-2.5 w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${sub.progress}%`, backgroundColor: sub.color }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </motion.section>

        {/* Subjects at a Glance Donut Chart Widget (3 cols) */}
        <motion.section
          variants={itemVariants}
          className="lg:col-span-3 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-[#E5EAF0] dark:border-white/10 shadow-sm flex flex-col justify-between items-center text-center space-y-3"
        >
          <h2 className="text-xs font-bold text-[#172033] dark:text-white uppercase tracking-wider self-start">
            Subjects at a Glance
          </h2>

          {/* Circular Donut Ring Chart */}
          <div className="relative w-28 h-28 my-1 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              {/* Segment 1: Completed (Green 33%) */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="transparent"
                stroke="#55A85A"
                strokeWidth="12"
                strokeDasharray="80 160"
                strokeDashoffset="0"
              />
              {/* Segment 2: In Progress (Blue 33%) */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="transparent"
                stroke="#2878D4"
                strokeWidth="12"
                strokeDasharray="80 160"
                strokeDashoffset="-80"
              />
              {/* Segment 3: Not Started (Slate 33%) */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="transparent"
                stroke="#CBD5E1"
                strokeWidth="12"
                strokeDasharray="80 160"
                strokeDashoffset="-160"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black font-display text-[#172033] dark:text-white leading-none">6</span>
              <span className="text-[10px] font-semibold text-[#687386] dark:text-slate-400 mt-0.5">Subjects</span>
            </div>
          </div>

          {/* Donut Legend */}
          <div className="w-full space-y-1 text-left text-xs font-medium text-[#172033] dark:text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#55A85A]" />
              <span>2 Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2878D4]" />
              <span>2 In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
              <span>2 Not Started</span>
            </div>
          </div>

          {/* Bottom View All Link */}
          <button
            type="button"
            onClick={() => navigateTo('subjects')}
            className="text-xs font-bold text-[#2878D4] dark:text-blue-400 hover:underline flex items-center gap-1 pt-1 cursor-pointer"
          >
            View All Subjects →
          </button>
        </motion.section>

        {/* Today's Tasks (4 cols) */}
        <motion.section
          variants={itemVariants}
          className="lg:col-span-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-[#E5EAF0] dark:border-white/10 shadow-sm space-y-3 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between pb-1">
              <h2 className="font-display font-bold text-sm sm:text-base text-[#172033] dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2878D4]" />
                Today's Tasks
              </h2>
              <button
                type="button"
                onClick={() => navigateTo('planner')}
                className="text-xs font-bold text-[#2878D4] hover:underline flex items-center gap-0.5"
              >
                Open Planner <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Task list */}
            <div className="space-y-2.5 mt-2">
              {tasks.slice(0, 4).map((task) => {
                const isHigh = task.priority === 'high'
                const isMed = task.priority === 'medium'
                return (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className={`p-2.5 rounded-2xl border transition-all flex items-center justify-between gap-2.5 cursor-pointer ${
                      task.completed
                        ? 'bg-slate-50/50 dark:bg-slate-950/40 border-slate-200 dark:border-white/5 opacity-60'
                        : 'bg-white dark:bg-slate-800/80 border-[#E5EAF0] dark:border-white/5 hover:border-[#2878D4]/40'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <button type="button" className="text-slate-400 hover:text-emerald-600 shrink-0">
                        {task.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100 dark:fill-emerald-950" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-400" />
                        )}
                      </button>
                      <div className="truncate">
                        <p className={`text-xs font-semibold truncate ${
                          task.completed ? 'line-through text-[#687386]' : 'text-[#172033] dark:text-white'
                        }`}>
                          {task.text}
                        </p>
                        <p className="text-[10px] text-[#687386] dark:text-slate-400 truncate">
                          {task.subject}
                        </p>
                      </div>
                    </div>

                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      isHigh
                        ? 'bg-red-50 text-red-600 border border-red-200'
                        : isMed
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {isHigh ? 'High' : isMed ? 'Medium' : 'Low'}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Quick Add Task */}
          {showTaskInput ? (
            <form onSubmit={handleQuickAddTask} className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={newTaskInput}
                onChange={(e) => setNewTaskInput(e.target.value)}
                placeholder="New study task..."
                autoFocus
                className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-[#172033] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#2878D4]"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-[#123B70] text-white text-xs font-bold shadow-xs"
              >
                Add
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setShowTaskInput(true)}
              className="text-xs font-bold text-[#2878D4] dark:text-blue-400 hover:underline flex items-center gap-1 pt-1 cursor-pointer self-start"
            >
              <Plus className="w-3.5 h-3.5" /> Add New Task
            </button>
          )}
        </motion.section>
      </div>

      {/* 4. Bottom Row: Exam Countdown Horizontal Banner (Spanning columns) */}
      <motion.section
        variants={itemVariants}
        className="p-5 rounded-3xl bg-gradient-to-r from-emerald-50/80 via-teal-50/70 to-emerald-50/80 dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-emerald-950/30 border border-emerald-200/80 dark:border-emerald-500/20 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        aria-label="Exam Countdown Target"
      >
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-white dark:bg-slate-800 border border-emerald-300/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm sm:text-base text-emerald-950 dark:text-emerald-200">
              Exam Countdown
            </h3>
            <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80 font-medium mt-0.5">
              End Semester Exam • 15 Dec, 2024
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-baseline gap-1 bg-white dark:bg-slate-800/90 px-4 py-2 rounded-2xl border border-emerald-300/40 shadow-xs">
            <span className="text-2xl font-black font-display text-emerald-700 dark:text-emerald-300">
              42
            </span>
            <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">Days Left</span>
          </div>

          <button
            type="button"
            onClick={() => navigateTo('planner')}
            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            View Revision Plan
          </button>
        </div>
      </motion.section>
    </motion.div>
  )
}