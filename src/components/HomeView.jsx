import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  Plus,
  X,
  Trash2
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
    bookmarks,
    homeSubjects,
    addHomeSubject,
    deleteHomeSubject,
    updateHomeSubjectProgress,
    updateHomeSubjectTopic,
    semesters
  } = useApp()

  const [newTaskInput, setNewTaskInput] = useState('')
  const [showTaskInput, setShowTaskInput] = useState(false)

  // Live clock
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Add Subject Modal States
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false)
  const [subjectToDelete, setSubjectToDelete] = useState(null)
  const [customSubName, setCustomSubName] = useState('')
  const [customSubTopic, setCustomSubTopic] = useState('')
  const [customSubProgress, setCustomSubProgress] = useState(0)
  const [customSubColor, setCustomSubColor] = useState('#3971b8')

  // Get list of standard subjects for the user's active branch and year/semester
  const getBranchSyllabusSubjects = () => {
    if (!semesters) return []
    const branchKey = (user?.branch || 'cse').toLowerCase()
    const branchData = semesters[branchKey] || {}
    const list = []
    Object.keys(branchData).forEach(semNum => {
      branchData[semNum].forEach(sub => {
        if (!list.some(item => item.title === sub.title)) {
          list.push(sub)
        }
      })
    })
    return list
  }
  const syllabusSubjects = getBranchSyllabusSubjects()

  // Map home subjects with dynamic icons/classes
  const mappedSubjects = (homeSubjects || []).map(sub => {
    let Icon = BookOpen
    let bgColor = 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800/40 dark:text-slate-350 dark:border-white/5'
    if (sub.color === '#3971b8') {
      Icon = Code2
      bgColor = 'bg-nest-blue/10 text-nest-blue border border-nest-blue/20'
    } else if (sub.color === '#c8a415') {
      Icon = Database
      bgColor = 'bg-nest-gold/25 text-[#735e07] dark:text-nest-gold border border-nest-gold/30'
    } else if (sub.color === '#5b6b2f') {
      Icon = Network
      bgColor = 'bg-nest-green/25 text-[#4c5628] dark:text-nest-green border border-nest-green/35'
    }
    return {
      ...sub,
      icon: Icon,
      bgColor
    }
  })

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

  // continueSubjects was removed in favor of dynamic homeSubjects state

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
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-nest-border dark:border-nest-navy/40 pb-5">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black font-display text-nest-navy tracking-tight">
            {getGreeting()}, <span className="text-nest-blue">{user?.name || 'Sweta'}!</span> 👋
          </h1>
          <p className="text-xs sm:text-sm font-medium text-nest-gray dark:text-[#a0af8c]">
            Ready to build your knowledge nest today?
          </p>
        </div>
        {/* Date + Live Clock Badge */}
        <div className="flex items-center gap-3 self-start sm:self-center px-4 py-2.5 rounded-2xl bg-nest-light-green dark:bg-nest-dark-input/80 border border-nest-green/40 dark:border-nest-green/25 shadow-xs">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-nest-blue" />
            <span className="text-xs font-bold text-nest-navy dark:text-[#a0af8c]">
              {now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
          </div>
          <div className="w-px h-4 bg-nest-green/30" />
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-nest-green" />
            <span className="text-xs font-black tabular-nums text-nest-navy dark:text-white tracking-wide">
              {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
            </span>
          </div>
        </div>
      </motion.div>


      {/* 3. Today's Focus Strip (Option B) - Compact Low Profile */}
      <motion.div
        variants={itemVariants}
        className="bg-nest-light-green dark:bg-nest-dark-input/60 text-nest-navy px-5 py-3 rounded-2xl flex items-center justify-between text-xs sm:text-sm font-semibold border border-nest-green/35 dark:border-white/5"
      >
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-nest-blue" />
          <span className="font-semibold text-nest-gray dark:text-[#a0af8c]">
            Daily Focus Session: <span className="font-bold text-nest-navy">1h 45m focused today</span>
          </span>
        </div>
        <button
          type="button"
          onClick={() => navigateTo('growth')}
          className="text-nest-blue dark:text-nest-green hover:underline font-black flex items-center gap-0.5 cursor-pointer"
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
              <h2 className="font-display font-semibold text-lg text-nest-navy dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-nest-blue" />
                Continue Learning
              </h2>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddSubjectOpen(true)}
                  className="px-2.5 py-1.5 rounded-lg bg-nest-light-blue dark:bg-nest-light-blue/20 hover:bg-nest-blue/20 text-nest-blue border border-nest-blue/20 text-xs font-black cursor-pointer flex items-center gap-1 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Subject
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('subjects')}
                  className="text-xs font-bold text-nest-blue hover:underline flex items-center gap-0.5"
                >
                  All Subjects <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {mappedSubjects.length === 0 ? (
              <div className="p-8 bg-white/90 dark:bg-nest-dark-input/90 border border-dashed border-nest-border dark:border-nest-navy/60 rounded-[20px] text-center space-y-4 shadow-xs">
                <div className="text-4xl select-none">📚</div>
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-sm text-nest-navy dark:text-white">No active subjects tracked</h3>
                  <p className="text-xs text-nest-gray dark:text-slate-400">Add a subject manually to begin tracking your study progress on the dashboard!</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddSubjectOpen(true)}
                  className="px-4 py-2 rounded-xl bg-nest-blue hover:bg-nest-blue/90 text-white font-semibold text-xs cursor-pointer inline-flex items-center gap-1 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Your First Subject
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {mappedSubjects.map((sub) => {
                  const Icon = sub.icon
                  return (
                    <div
                      key={sub.id}
                      className="relative overflow-hidden p-4 bg-white/90 dark:bg-nest-dark-input/90 border border-nest-border dark:border-nest-navy/60 rounded-[20px] flex items-center justify-between gap-4 group shadow-xs hover:border-nest-blue/40 hover:shadow-md transition-all duration-250"
                    >
                      {/* Premium Custom Confirm Overlay */}
                      {subjectToDelete === sub.id && (
                        <div className="absolute inset-0 bg-white/95 dark:bg-slate-900/95 rounded-[20px] flex items-center justify-between px-6 z-10">
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-350">
                            Remove <strong>{sub.name}</strong> from tracking?
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteHomeSubject(sub.id)
                                setSubjectToDelete(null)
                              }}
                              className="px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-650 text-white font-bold text-xs cursor-pointer shadow-xs"
                            >
                              Yes, Remove
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                setSubjectToDelete(null)
                              }}
                              className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-750"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-3.5 min-w-0 flex-1 cursor-pointer" onClick={() => navigateTo('subjects')}>
                        <div className={`w-9 h-9 rounded-xl ${sub.bgColor} flex items-center justify-center shrink-0 shadow-xs`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="truncate flex-1">
                          <h3 className="font-display font-semibold text-sm sm:text-base text-nest-navy group-hover:text-nest-blue transition-colors truncate">
                            {sub.name}
                          </h3>
                          <p className="text-xs text-nest-gray dark:text-slate-400 truncate mt-0.5">
                            Next: {sub.nextTopic}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 shrink-0">
                        {/* Progress slider / indicator */}
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden hidden sm:block">
                            <div className="h-full rounded-full" style={{ width: `${sub.progress}%`, backgroundColor: sub.color }} />
                          </div>
                          <span className="text-xs font-bold text-nest-navy">{sub.progress}%</span>
                        </div>

                        {/* Inline Actions */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              const newTopic = prompt(`Enter current/next topic for ${sub.name}:`, sub.nextTopic)
                              if (newTopic !== null) updateHomeSubjectTopic(sub.id, newTopic)
                            }}
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-nest-gray hover:text-nest-blue transition-colors cursor-pointer text-xs"
                            title="Edit Topic"
                          >
                            📝
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              const newProg = prompt(`Enter new progress for ${sub.name} (0-100):`, sub.progress)
                              if (newProg !== null) updateHomeSubjectProgress(sub.id, newProg)
                            }}
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-nest-gray hover:text-nest-blue transition-colors cursor-pointer text-xs"
                            title="Edit Progress"
                          >
                            ✏️
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSubjectToDelete(sub.id)
                            }}
                            className="p-1.5 rounded-lg hover:bg-red-500/10 text-nest-gray hover:text-red-500 transition-colors cursor-pointer"
                            title="Delete Subject"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </motion.section>

          {/* Knowledge Growth */}
          <motion.section
            variants={itemVariants}
            className="p-6 rounded-[24px] bg-white/90 dark:bg-nest-dark-input/90 border border-nest-border dark:border-nest-navy/60 shadow-xs space-y-4 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between border-b border-nest-border dark:border-nest-navy/50 pb-3">
              <h2 className="font-display font-black text-xs uppercase tracking-wider text-nest-gray dark:text-[#a0af8c]">
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
              <div className="w-20 h-20 rounded-2xl bg-nest-light-green dark:bg-nest-dark-input flex items-center justify-center shrink-0 border border-nest-green/40 dark:border-nest-green/15 shadow-xs">
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
                <p className="text-xs font-semibold text-nest-gray dark:text-[#a0af8c]">
                  {(homeSubjects || []).length} subject{(homeSubjects || []).length === 1 ? '' : 's'} progressing this week:
                </p>
                
                <div className="space-y-3">
                  {(homeSubjects || []).map((item, idx) => (
                    <div key={item.id || idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-nest-navy truncate max-w-[150px]">{item.name}</span>
                        <span className="text-nest-navy">{item.progress}%</span>
                      </div>
                      <div className="w-full h-1 bg-nest-light-green dark:bg-slate-800/40 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${item.progress}%`, backgroundColor: item.color }} />
                      </div>
                    </div>
                  ))}
                  {(homeSubjects || []).length === 0 && (
                    <p className="text-xs text-slate-500 text-center py-2">No active subjects tracked.</p>
                  )}
                </div>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => navigateTo('growth')}
                    className="px-4 py-2 rounded-xl bg-nest-light-green hover:bg-nest-green/20 dark:bg-nest-dark-input dark:hover:bg-nest-green/10 text-nest-navy dark:text-nest-green font-black text-xs cursor-pointer transition-all shadow-xs border border-nest-green/35 dark:border-white/5"
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
            className="p-5 rounded-[24px] bg-white/90 dark:bg-nest-dark-input/90 border border-nest-border dark:border-nest-navy/60 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg shrink-0">📅</span>
              <div>
                <h3 className="font-display font-bold text-sm text-nest-navy">
                  End Semester Exam
                </h3>
                <p className="text-xs text-nest-gray dark:text-[#a0af8c] mt-0.5">
                  15 Dec, 2024
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 justify-between sm:justify-end">
              <div className="bg-nest-light-green dark:bg-nest-dark-input px-3.5 py-1.5 rounded-xl border border-nest-green/40 dark:border-nest-green/15 shadow-xs text-xs font-bold text-nest-navy dark:text-nest-green">
                42 days left
              </div>

              <button
                type="button"
                onClick={() => navigateTo('planner')}
                className="text-xs font-black text-nest-blue dark:text-nest-green hover:underline cursor-pointer"
              >
                [ View Revision Plan ]
              </button>
            </div>
          </motion.section>
        </div>

        {/* Right Column (4 cols) - Today's Tasks in Single Clean Container */}
        <motion.section
          variants={itemVariants}
          className="lg:col-span-4 p-6 rounded-[24px] bg-white/90 dark:bg-nest-dark-input/90 border border-nest-border dark:border-nest-navy/60 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-all duration-300"
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-nest-border dark:border-nest-navy/50">
              <h2 className="font-display font-black text-base text-nest-navy flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-nest-blue" />
                Today's Tasks
              </h2>
              <button
                type="button"
                onClick={() => navigateTo('planner')}
                className="text-xs font-bold text-nest-blue hover:underline"
              >
                View Planner →
              </button>
            </div>

            {/* Task list divided by simple thin lines */}
            <div className="divide-y divide-nest-border dark:divide-white/5 mt-2">
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
                          task.completed ? 'line-through text-[#808d5b] dark:text-slate-500' : 'text-nest-navy'
                        }`}>
                          {task.text}
                        </p>
                        <p className="text-xs text-nest-gray dark:text-[#a0af8c] mt-0.5 truncate">
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
          <div className="pt-3 border-t border-nest-border dark:border-nest-navy/50">
            {showTaskInput ? (
              <form onSubmit={handleQuickAddTask} className="flex items-center gap-2">
                <input
                  type="text"
                  value={newTaskInput}
                  onChange={(e) => setNewTaskInput(e.target.value)}
                  placeholder="New study task..."
                  autoFocus
                  className="flex-1 px-3 py-1.5 rounded-xl bg-nest-light-input dark:bg-nest-dark-input border border-nest-border dark:border-slate-800 text-xs text-nest-navy focus:outline-none focus:ring-1 focus:ring-nest-blue"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-xl bg-nest-navy dark:bg-nest-green text-white dark:text-nest-dark text-xs font-black shadow-xs cursor-pointer hover:opacity-90 active:scale-95 transition-all"
                >
                  Add
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setShowTaskInput(true)}
                className="text-xs font-black text-nest-blue dark:text-nest-green hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add New Task
              </button>
            )}
          </div>
        </motion.section>

      </div>

      {/* Add Subject Modal */}
      <AnimatePresence>
        {isAddSubjectOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddSubjectOpen(false)}
            />
            <motion.div
              className="fixed inset-x-4 top-[10%] bottom-[10%] md:inset-x-auto md:left-1/2 md:top-1/2 md:bottom-auto md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md glass-card bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl z-50 overflow-hidden flex flex-col border border-slate-350 dark:border-white/15 shadow-2xl"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              role="dialog"
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-white/10">
                <h3 className="text-lg font-display font-black text-slate-900 dark:text-white">Add Study Subject</h3>
                <button
                  type="button"
                  onClick={() => setIsAddSubjectOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh] custom-scrollbar">
                {/* 1. Quick Select from Syllabus */}
                {syllabusSubjects.length > 0 && (
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-nest-navy dark:text-[#a0af8c] uppercase tracking-wider">
                      Quick Fill from Syllabus
                    </label>
                    <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto p-1 border border-slate-200 dark:border-white/5 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
                      {syllabusSubjects.map(sub => (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => {
                            setCustomSubName(sub.title || sub.name)
                            // Set a default color if matched
                            if (sub.title.toLowerCase().includes('java')) setCustomSubColor('#3971b8')
                            else if (sub.title.toLowerCase().includes('database') || sub.title.toLowerCase().includes('dbms')) setCustomSubColor('#c8a415')
                            else if (sub.title.toLowerCase().includes('data structure') || sub.title.toLowerCase().includes('dsa')) setCustomSubColor('#5b6b2f')
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-nest-blue/15 hover:text-nest-blue border border-slate-200 dark:border-slate-750 text-[11px] font-semibold transition-colors cursor-pointer shrink-0"
                        >
                          {sub.title || sub.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Custom Input Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (!customSubName.trim()) return
                    addHomeSubject({
                      name: customSubName.trim(),
                      nextTopic: customSubTopic.trim() || 'General Study',
                      progress: customSubProgress,
                      color: customSubColor
                    })
                    // Reset
                    setCustomSubName('')
                    setCustomSubTopic('')
                    setCustomSubProgress(0)
                    setCustomSubColor('#3971b8')
                    setIsAddSubjectOpen(false)
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-bold text-nest-navy dark:text-[#a0af8c] mb-1.5 uppercase tracking-wider">
                      Subject Name
                    </label>
                    <input
                      type="text"
                      required
                      value={customSubName}
                      onChange={(e) => setCustomSubName(e.target.value)}
                      placeholder="e.g. Compiler Design"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-250 dark:border-white/10 bg-white dark:bg-slate-850 text-sm font-semibold text-nest-navy dark:text-white focus:outline-none focus:border-nest-blue"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-nest-navy dark:text-[#a0af8c] mb-1.5 uppercase tracking-wider">
                      Current / Next Topic
                    </label>
                    <input
                      type="text"
                      value={customSubTopic}
                      onChange={(e) => setCustomSubTopic(e.target.value)}
                      placeholder="e.g. Lexical Analysis"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-250 dark:border-white/10 bg-white dark:bg-slate-850 text-sm font-semibold text-nest-navy dark:text-white focus:outline-none focus:border-nest-blue"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-nest-navy dark:text-[#a0af8c] mb-1.5 uppercase tracking-wider">
                      <span>Initial Progress</span>
                      <span>{customSubProgress}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={customSubProgress}
                      onChange={(e) => setCustomSubProgress(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 dark:bg-slate-850 rounded-lg appearance-none cursor-pointer accent-nest-blue"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-nest-navy dark:text-[#a0af8c] mb-1.5 uppercase tracking-wider">
                      Theme Color
                    </label>
                    <div className="flex gap-3">
                      {[
                        { color: '#3971b8', label: 'Blue' },
                        { color: '#c8a415', label: 'Gold' },
                        { color: '#5b6b2f', label: 'Green' },
                        { color: '#e11d48', label: 'Rose' },
                        { color: '#7c3aed', label: 'Purple' }
                      ].map(item => (
                        <button
                          key={item.color}
                          type="button"
                          onClick={() => setCustomSubColor(item.color)}
                          className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer hover:scale-110 ${customSubColor === item.color ? 'border-nest-navy dark:border-white scale-110' : 'border-transparent'}`}
                          style={{ backgroundColor: item.color }}
                          title={item.label}
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-nest-blue hover:bg-nest-blue/95 text-white font-bold text-sm shadow-md cursor-pointer transition-colors mt-2"
                  >
                    Add Subject to Tracking
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}