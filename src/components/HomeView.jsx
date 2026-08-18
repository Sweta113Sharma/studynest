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
      bgColor: 'bg-[#3971b8]/10 text-[#3971b8] border border-[#3971b8]/20',
      color: '#3971b8'
    },
    {
      id: 'sub-dbms',
      name: 'DBMS',
      nextTopic: 'Normalization',
      progress: 45,
      icon: Database,
      bgColor: 'bg-[#f6e6a5]/25 text-[#735e07] dark:text-[#f6e6a5] border border-[#f6e6a5]/30',
      color: '#c8a415'
    },
    {
      id: 'sub-dsa',
      name: 'Data Structures',
      nextTopic: 'Arrays & Linked Lists',
      progress: 32,
      icon: Network,
      bgColor: 'bg-[#c8d69b]/25 text-[#4c5628] dark:text-[#c8d69b] border border-[#c8d69b]/35',
      color: '#5b6b2f'
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
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#e2ecd9] dark:border-[#343b1b]/40 pb-5">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black font-display text-[#343b1b] dark:text-[#f0fcee] tracking-tight">
            {getGreeting()}, <span className="text-[#3971b8]">{user?.name || 'Sweta'}!</span> 👋
          </h1>
          <p className="text-xs sm:text-sm font-medium text-[#646e46] dark:text-[#a0af8c]">
            Ready to build your knowledge nest today?
          </p>
        </div>
        {/* Date Capsule Badge */}
        <div className="flex items-center gap-2 self-start sm:self-center px-4 py-2 rounded-full bg-[#f2f9f0] dark:bg-[#1b1e0f]/80 border border-[#c8d69b]/40 dark:border-[#c8d69b]/25 shadow-xs">
          <Calendar className="w-4 h-4 text-[#3971b8]" />
          <span className="text-xs font-bold text-[#343b1b] dark:text-[#f0fcee]">
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
        </div>
      </motion.div>

      {/* 2. Today's Study Goal Hero Card (Dominant Component) */}
      <motion.section
        variants={itemVariants}
        className="w-full p-6 sm:p-8 rounded-[28px] bg-[#343b1b] text-white shadow-xl border border-[#c8d69b]/25 relative overflow-hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 group hover:border-[#c8d69b]/40 transition-all duration-300"
        aria-label="Today's Study Goal"
      >
        {/* Abstract gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#3971b8]/15 via-[#c8d69b]/5 to-transparent pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-lg">
          <span className="text-[10px] font-bold text-[#f6e6a5] tracking-widest uppercase block">
            Today's Study Goal
          </span>

          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black font-display text-[#f0fcee]">72%</span>
              <span className="text-xs sm:text-sm font-medium text-[#c8d69b]">Daily syllabus revision complete</span>
            </div>

            {/* Gold/Vanilla Progress Bar */}
            <div className="w-full max-w-md h-2.5 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/10 shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '72%' }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-[#f6e6a5] to-[#c8d69b] rounded-full shadow-[0_0_8px_rgba(246,230,165,0.4)]"
              />
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#f0fcee]/90 leading-relaxed font-normal">
            You're on track to master <span className="font-bold text-[#f6e6a5]">OOP Polymorphism</span> and finish <span className="font-bold text-[#f6e6a5]">Unit 2</span>.
          </p>

          <div className="pt-1">
            <button
              type="button"
              onClick={() => navigateTo('subjects')}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#f6e6a5] hover:bg-[#f6e6a5]/90 text-[#343b1b] font-black text-xs sm:text-sm shadow-md hover:scale-102 active:scale-95 transition-all cursor-pointer"
            >
              Start Studying →
            </button>
          </div>
        </div>

        {/* Mascot Owl Illustration on Right */}
        <div className="relative z-10 shrink-0 pointer-events-none hidden sm:block pr-4 transform group-hover:scale-105 transition-transform duration-300">
          <MascotOwl state="reading" size="xl" />
        </div>

        {/* Background Ambient Glow */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#c8d69b]/15 rounded-full blur-3xl pointer-events-none" />
      </motion.section>

      {/* 3. Today's Focus Strip (Option B) - Compact Low Profile */}
      <motion.div
        variants={itemVariants}
        className="bg-[#f2f9f0] dark:bg-[#1b1e0f]/60 text-[#343b1b] dark:text-[#f0fcee] px-5 py-3 rounded-2xl flex items-center justify-between text-xs sm:text-sm font-semibold border border-[#c8d69b]/35 dark:border-white/5"
      >
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#3971b8]" />
          <span className="font-semibold text-[#646e46] dark:text-[#a0af8c]">
            Daily Focus Session: <span className="font-bold text-[#343b1b] dark:text-[#f0fcee]">1h 45m focused today</span>
          </span>
        </div>
        <button
          type="button"
          onClick={() => navigateTo('growth')}
          className="text-[#3971b8] dark:text-[#c8d69b] hover:underline font-black flex items-center gap-0.5 cursor-pointer"
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
              <h2 className="font-display font-semibold text-lg text-[#343b1b] dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#3971b8]" />
                Continue Learning
              </h2>
              <button
                type="button"
                onClick={() => navigateTo('subjects')}
                className="text-xs font-bold text-[#3971b8] hover:underline flex items-center gap-0.5"
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
                    className="p-4 bg-white/90 dark:bg-[#1b1e0f]/90 border border-[#e2ecd9] dark:border-[#343b1b]/60 rounded-[20px] flex items-center justify-between gap-4 cursor-pointer hover:border-[#3971b8]/40 hover:shadow-md hover:scale-[1.01] hover:-translate-y-0.5 transition-all duration-250 group shadow-xs"
                  >
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <div className={`w-9 h-9 rounded-xl ${sub.bgColor} flex items-center justify-center shrink-0 shadow-xs`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="truncate flex-1">
                        <h3 className="font-display font-semibold text-sm sm:text-base text-[#343b1b] dark:text-[#f0fcee] group-hover:text-[#3971b8] transition-colors truncate">
                          {sub.name}
                        </h3>
                        <p className="text-xs text-[#687386] dark:text-slate-400 truncate mt-0.5">
                          Next: {sub.nextTopic}
                        </p>
                      </div>
                    </div>

                     <div className="flex items-center gap-4 shrink-0 min-w-[120px]">
                      <div className="flex-1 hidden sm:block">
                        <div className="w-full h-1.5 bg-[#f2f9f0] dark:bg-slate-800/60 border border-[#e2ecd9]/50 dark:border-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${sub.progress}%`, backgroundColor: sub.color }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-[#343b1b] dark:text-[#f0fcee]">
                          {sub.progress}%
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#3971b8] transition-colors" />
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
            className="p-6 rounded-[24px] bg-white/90 dark:bg-[#1b1e0f]/90 border border-[#e2ecd9] dark:border-[#343b1b]/60 shadow-xs space-y-4 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between border-b border-[#e2ecd9] dark:border-[#343b1b]/50 pb-3">
              <h2 className="font-display font-black text-xs uppercase tracking-wider text-[#646e46] dark:text-[#a0af8c]">
                Your Knowledge Growth
              </h2>
              {/* Single Display of Streak */}
              <div className="flex items-center gap-1 text-xs font-bold text-orange-650 dark:text-orange-400 bg-orange-50/50 dark:bg-orange-950/20 px-3 py-1 rounded-full border border-orange-200/50 dark:border-orange-500/25">
                <span>🔥</span>
                <span>{currentStreak} Day Streak</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Small Knowledge Tree SVG Illustration */}
              <div className="w-20 h-20 rounded-2xl bg-[#f2f9f0] dark:bg-[#1b1e0f] flex items-center justify-center shrink-0 border border-[#c8d69b]/40 dark:border-[#c8d69b]/15 shadow-xs">
                <svg viewBox="0 0 100 100" className="w-16 h-16 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  {/* Trunk */}
                  <path d="M49 85 L49 55 C49 50 51 46 51 40 M51 85 L51 60" stroke="#8B5A2B" strokeWidth="4" strokeLinecap="round" />
                  {/* Branches */}
                  <path d="M49 65 Q40 55 35 58" stroke="#8B5A2B" strokeWidth="3" strokeLinecap="round" />
                  <path d="M51 60 Q62 50 67 54" stroke="#8B5A2B" strokeWidth="3" strokeLinecap="round" />
                  {/* Leaves */}
                  <circle cx="50" cy="32" r="15" fill="#c8d69b" opacity="0.9" />
                  <circle cx="34" cy="46" r="11" fill="#c8d69b" opacity="0.8" />
                  <circle cx="66" cy="42" r="12" fill="#c8d69b" opacity="0.85" />
                  <circle cx="52" cy="44" r="8" fill="#4CAF50" opacity="0.75" />
                  {/* Twinkles */}
                  <circle cx="50" cy="12" r="2.5" fill="#f6e6a5" />
                  <circle cx="28" cy="28" r="1.5" fill="#f6e6a5" />
                  <circle cx="72" cy="22" r="2" fill="#f6e6a5" />
                </svg>
              </div>

              <div className="flex-1 w-full space-y-4">
                <p className="text-xs font-semibold text-[#646e46] dark:text-[#a0af8c]">
                  3 subjects progressing this week:
                </p>
                
                <div className="space-y-3">
                  {[
                    { name: 'Java Programming', progress: 68, color: '#3971b8' },
                    { name: 'DBMS', progress: 45, color: '#c8a415' },
                    { name: 'Data Structures', progress: 32, color: '#5b6b2f' }
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-[#343b1b] dark:text-[#f0fcee]">{item.name}</span>
                        <span className="text-[#343b1b] dark:text-[#f0fcee]">{item.progress}%</span>
                      </div>
                      <div className="w-full h-1 bg-[#f2f9f0] dark:bg-slate-800/40 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${item.progress}%`, backgroundColor: item.color }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => navigateTo('growth')}
                    className="px-4 py-2 rounded-xl bg-[#f2f9f0] hover:bg-[#c8d69b]/20 dark:bg-[#1b1e0f] dark:hover:bg-[#c8d69b]/10 text-[#343b1b] dark:text-[#c8d69b] font-black text-xs cursor-pointer transition-all shadow-xs border border-[#c8d69b]/35 dark:border-white/5"
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
            className="p-5 rounded-[24px] bg-white/90 dark:bg-[#1b1e0f]/90 border border-[#e2ecd9] dark:border-[#343b1b]/60 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg shrink-0">📅</span>
              <div>
                <h3 className="font-display font-bold text-sm text-[#343b1b] dark:text-[#f0fcee]">
                  End Semester Exam
                </h3>
                <p className="text-xs text-[#646e46] dark:text-[#a0af8c] mt-0.5">
                  15 Dec, 2024
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 justify-between sm:justify-end">
              <div className="bg-[#f2f9f0] dark:bg-[#1b1e0f] px-3.5 py-1.5 rounded-xl border border-[#c8d69b]/40 dark:border-[#c8d69b]/15 shadow-xs text-xs font-bold text-[#343b1b] dark:text-[#c8d69b]">
                42 days left
              </div>

              <button
                type="button"
                onClick={() => navigateTo('planner')}
                className="text-xs font-black text-[#3971b8] dark:text-[#c8d69b] hover:underline cursor-pointer"
              >
                [ View Revision Plan ]
              </button>
            </div>
          </motion.section>
        </div>

        {/* Right Column (4 cols) - Today's Tasks in Single Clean Container */}
        <motion.section
          variants={itemVariants}
          className="lg:col-span-4 p-6 rounded-[24px] bg-white/90 dark:bg-[#1b1e0f]/90 border border-[#e2ecd9] dark:border-[#343b1b]/60 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-all duration-300"
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#e2ecd9] dark:border-[#343b1b]/50">
              <h2 className="font-display font-black text-base text-[#343b1b] dark:text-[#f0fcee] flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#3971b8]" />
                Today's Tasks
              </h2>
              <button
                type="button"
                onClick={() => navigateTo('planner')}
                className="text-xs font-bold text-[#3971b8] hover:underline"
              >
                View Planner →
              </button>
            </div>

            {/* Task list divided by simple thin lines */}
            <div className="divide-y divide-[#e2ecd9] dark:divide-white/5 mt-2">
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
                      <div className="text-slate-400 group-hover:text-emerald-650 shrink-0">
                        {task.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100 dark:fill-emerald-950" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-350 dark:text-slate-700" />
                        )}
                      </div>
                      <div className="truncate">
                        <p className={`text-sm font-semibold truncate ${
                          task.completed ? 'line-through text-[#808d5b] dark:text-slate-500' : 'text-[#343b1b] dark:text-[#f0fcee]'
                        }`}>
                          {task.text}
                        </p>
                        <p className="text-xs text-[#646e46] dark:text-[#a0af8c] mt-0.5 truncate">
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
          <div className="pt-3 border-t border-[#e2ecd9] dark:border-[#343b1b]/50">
            {showTaskInput ? (
              <form onSubmit={handleQuickAddTask} className="flex items-center gap-2">
                <input
                  type="text"
                  value={newTaskInput}
                  onChange={(e) => setNewTaskInput(e.target.value)}
                  placeholder="New study task..."
                  autoFocus
                  className="flex-1 px-3 py-1.5 rounded-xl bg-[#f8fdf6] dark:bg-[#1b1e0f] border border-[#e2ecd9] dark:border-slate-800 text-xs text-[#343b1b] dark:text-[#f0fcee] focus:outline-none focus:ring-1 focus:ring-[#3971b8]"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-xl bg-[#343b1b] dark:bg-[#c8d69b] text-white dark:text-[#14170b] text-xs font-black shadow-xs cursor-pointer hover:opacity-90 active:scale-95 transition-all"
                >
                  Add
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setShowTaskInput(true)}
                className="text-xs font-black text-[#3971b8] dark:text-[#c8d69b] hover:underline flex items-center gap-1 cursor-pointer"
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