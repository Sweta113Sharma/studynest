import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  BookOpen,
  Clock,
  Sparkles,
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
    transition: { staggerChildren: 0.05, delayChildren: 0.05 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 140, damping: 16 }
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
      className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 1. Dashboard Header (Spacious, calm, simple greeting) */}
      <motion.div variants={itemVariants} className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-[#172033] dark:text-white tracking-tight">
          {getGreeting()}, <span className="text-[#2878D4]">{user?.name || 'Sweta'}!</span> 👋
        </h1>
        <p className="text-xs sm:text-sm font-medium text-[#687386] dark:text-slate-400">
          Ready to build your knowledge nest today?
        </p>
      </motion.div>

      {/* 2. Today's Study Goal Hero Card (Dominant Component) */}
      <motion.section
        variants={itemVariants}
        className="w-full p-6 sm:p-8 rounded-[24px] bg-[#123B70] text-white shadow-sm border border-white/5 relative overflow-hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
        aria-label="Today's Study Goal"
      >
        <div className="relative z-10 space-y-4 max-w-lg">
          <span className="text-[10px] font-bold text-blue-200 tracking-widest uppercase block">
            Today's Study Goal
          </span>

          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black font-display">72%</span>
              <span className="text-xs sm:text-sm font-medium text-blue-200">Daily syllabus revision complete</span>
            </div>

            {/* Gold Progress Bar */}
            <div className="w-full max-w-md h-2 bg-black/25 rounded-full overflow-hidden p-0.5 border border-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '72%' }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-[#F5B72C] rounded-full"
              />
            </div>
          </div>

          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed font-normal">
            You're on track to master <span className="font-bold text-white">OOP Polymorphism</span> and finish <span className="font-bold text-white">Unit 2</span>.
          </p>

          <div className="pt-1">
            <button
              type="button"
              onClick={() => navigateTo('subjects')}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#F5B72C] hover:bg-amber-400 text-[#123B70] font-bold text-xs sm:text-sm shadow-xs hover:shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              Start Studying →
            </button>
          </div>
        </div>

        {/* Mascot Owl Illustration on Right */}
        <div className="relative z-10 shrink-0 pointer-events-none hidden sm:block pr-4">
          <MascotOwl state="reading" size="xl" />
        </div>

        {/* Background Ambient Glow */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      </motion.section>

      {/* 3. Today's Focus Strip (Option B) - Compact Low Profile */}
      <motion.div
        variants={itemVariants}
        className="bg-[#EAF4FF] dark:bg-blue-950/20 text-[#123B70] dark:text-blue-200 px-5 py-3 rounded-2xl flex items-center justify-between text-xs sm:text-sm font-semibold border border-[#E5EAF0] dark:border-white/5"
      >
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#2878D4]" />
          <span>1h 45m focused today</span>
        </div>
        <button
          type="button"
          onClick={() => navigateTo('growth')}
          className="text-[#2878D4] hover:underline font-bold flex items-center gap-0.5 cursor-pointer"
        >
          View Progress →
        </button>
      </motion.div>

      {/* 4. Two Column Layout (LEFT Continue/Growth/Countdown ~65%, RIGHT Tasks ~35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (8 cols) - Stacked dashboard sub-sections */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Continue Learning */}
          <motion.section
            variants={itemVariants}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold text-lg text-[#172033] dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#2878D4]" />
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

            <div className="space-y-3">
              {continueSubjects.map((sub) => {
                const Icon = sub.icon
                return (
                  <div
                    key={sub.id}
                    onClick={() => navigateTo('subjects')}
                    className="p-4 bg-white dark:bg-slate-900 border border-[#E5EAF0] dark:border-white/10 rounded-2xl flex items-center justify-between gap-4 cursor-pointer hover:border-[#2878D4]/40 hover:shadow-xs transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <div className={`w-9 h-9 rounded-xl ${sub.bgColor} text-white flex items-center justify-center shrink-0 shadow-xs`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="truncate flex-1">
                        <h3 className="font-display font-semibold text-sm sm:text-base text-[#172033] dark:text-white group-hover:text-[#2878D4] transition-colors truncate">
                          {sub.name}
                        </h3>
                        <p className="text-xs text-[#687386] dark:text-slate-400 truncate mt-0.5">
                          Next: {sub.nextTopic}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 min-w-[120px]">
                      <div className="flex-1 hidden sm:block">
                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${sub.progress}%`, backgroundColor: sub.color }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-[#172033] dark:text-white">
                          {sub.progress}%
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#2878D4] transition-colors" />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.section>

          {/* Knowledge Growth */}
          <motion.section
            variants={itemVariants}
            className="p-6 rounded-[20px] bg-white dark:bg-slate-900 border border-[#E5EAF0] dark:border-white/10 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#E5EAF0] dark:border-white/10 pb-3">
              <h2 className="font-display font-bold text-xs uppercase tracking-wider text-[#687386] dark:text-slate-400">
                Your Knowledge Growth
              </h2>
              {/* Single Display of Streak */}
              <div className="flex items-center gap-1 text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-50/70 dark:bg-orange-950/20 px-3 py-1 rounded-full border border-orange-200/50 dark:border-orange-500/20">
                <span>🔥</span>
                <span>{currentStreak} Day Streak</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Small Knowledge Tree SVG Illustration */}
              <div className="w-20 h-20 rounded-2xl bg-[#EAF4FF] dark:bg-blue-950/30 flex items-center justify-center shrink-0 border border-[#2878D4]/10 shadow-xs">
                <svg viewBox="0 0 100 100" className="w-16 h-16 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  {/* Trunk */}
                  <path d="M49 85 L49 55 C49 50 51 46 51 40 M51 85 L51 60" stroke="#8B5A2B" strokeWidth="4" strokeLinecap="round" />
                  {/* Branches */}
                  <path d="M49 65 Q40 55 35 58" stroke="#8B5A2B" strokeWidth="3" strokeLinecap="round" />
                  <path d="M51 60 Q62 50 67 54" stroke="#8B5A2B" strokeWidth="3" strokeLinecap="round" />
                  {/* Leaves */}
                  <circle cx="50" cy="32" r="15" fill="#55A85A" opacity="0.9" />
                  <circle cx="34" cy="46" r="11" fill="#55A85A" opacity="0.8" />
                  <circle cx="66" cy="42" r="12" fill="#55A85A" opacity="0.85" />
                  <circle cx="52" cy="44" r="8" fill="#4CAF50" opacity="0.75" />
                  {/* Twinkles */}
                  <circle cx="50" cy="12" r="2.5" fill="#F5B72C" />
                  <circle cx="28" cy="28" r="1.5" fill="#F5B72C" />
                  <circle cx="72" cy="22" r="2" fill="#F5B72C" />
                </svg>
              </div>

              <div className="flex-1 w-full space-y-4">
                <p className="text-xs font-semibold text-[#687386] dark:text-slate-400">
                  3 subjects progressing this week:
                </p>
                
                <div className="space-y-2">
                  {[
                    { name: 'Java Programming', progress: 68, color: '#4F46E5' },
                    { name: 'DBMS', progress: 45, color: '#F59E0B' },
                    { name: 'Data Structures', progress: 32, color: '#059669' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-[#172033] dark:text-slate-200">{item.name}</span>
                      <span className="text-[#172033] dark:text-white">{item.progress}%</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => navigateTo('growth')}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#123B70] dark:text-blue-300 font-bold text-xs cursor-pointer transition-colors shadow-xs"
                  >
                    View My Growth →
                  </button>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Exam Countdown (Compact Horizontal Banner) */}
          <motion.section
            variants={itemVariants}
            className="p-5 rounded-[20px] bg-white dark:bg-slate-900 border border-[#E5EAF0] dark:border-white/10 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg shrink-0">📅</span>
              <div>
                <h3 className="font-display font-bold text-sm text-[#172033] dark:text-white">
                  End Semester Exam
                </h3>
                <p className="text-xs text-[#687386] dark:text-slate-400 mt-0.5">
                  15 Dec, 2024
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 justify-between sm:justify-end">
              <div className="bg-[#EAF4FF] dark:bg-blue-950/20 px-3.5 py-1.5 rounded-xl border border-[#2878D4]/10 shadow-xs text-xs font-bold text-[#123B70] dark:text-blue-300">
                42 days left
              </div>

              <button
                type="button"
                onClick={() => navigateTo('planner')}
                className="text-xs font-bold text-[#2878D4] dark:text-blue-400 hover:underline cursor-pointer"
              >
                [ View Revision Plan ]
              </button>
            </div>
          </motion.section>
        </div>

        {/* Right Column (4 cols) - Today's Tasks in Single Clean Container */}
        <motion.section
          variants={itemVariants}
          className="lg:col-span-4 p-6 rounded-[20px] bg-white dark:bg-slate-900 border border-[#E5EAF0] dark:border-white/10 shadow-xs flex flex-col justify-between space-y-4"
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF0] dark:border-white/10">
              <h2 className="font-display font-bold text-base text-[#172033] dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#2878D4]" />
                Today's Tasks
              </h2>
              <button
                type="button"
                onClick={() => navigateTo('planner')}
                className="text-xs font-bold text-[#2878D4] hover:underline"
              >
                View Planner →
              </button>
            </div>

            {/* Task list divided by simple thin lines */}
            <div className="divide-y divide-[#E5EAF0] dark:divide-white/5 mt-2">
              {tasks.slice(0, 4).map((task) => {
                const isHigh = task.priority === 'high'
                const isMed = task.priority === 'medium'
                return (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className="py-3 flex items-center justify-between gap-3 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="text-slate-400 group-hover:text-emerald-600 shrink-0">
                        {task.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100 dark:fill-emerald-950" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-350 dark:text-slate-700" />
                        )}
                      </div>
                      <div className="truncate">
                        <p className={`text-sm font-semibold truncate ${
                          task.completed ? 'line-through text-[#687386] dark:text-slate-500' : 'text-[#172033] dark:text-white'
                        }`}>
                          {task.text}
                        </p>
                        <p className="text-xs text-[#687386] dark:text-slate-400 mt-0.5 truncate">
                          {task.subject}
                        </p>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
                      isHigh
                        ? 'bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 border border-red-200/50 dark:border-red-500/20'
                        : isMed
                        ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-750 dark:text-amber-400 border border-amber-200/50 dark:border-amber-500/20'
                        : 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-500/20'
                    }`}>
                      {isHigh ? 'High' : isMed ? 'Medium' : 'Low'}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Quick Add Task Form */}
          <div className="pt-3 border-t border-[#E5EAF0] dark:border-white/10">
            {showTaskInput ? (
              <form onSubmit={handleQuickAddTask} className="flex items-center gap-2">
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
                  className="px-3.5 py-1.5 rounded-xl bg-[#123B70] text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Add
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setShowTaskInput(true)}
                className="text-xs font-bold text-[#2878D4] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add New Task
              </button>
            )}
          </div>
        </motion.section>

      </div>
    </motion.div>
  )
}