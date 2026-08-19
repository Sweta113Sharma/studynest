import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  CheckCircle2,
  Circle,
  Plus,
  Clock,
  AlertCircle,
  Trash2,
  Flame,
  Bookmark,
  ChevronRight
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import MascotOwl from './MascotOwl'

export default function PlannerView() {
  const { tasks, addTask, toggleTask, deleteTask, exams, addExam, deleteExam } = useApp()
  const [taskInput, setTaskInput] = useState('')
  const [taskSubject, setTaskSubject] = useState('Java Programming')
  const [taskPriority, setTaskPriority] = useState('medium')
  const [taskDueDate, setTaskDueDate] = useState('Today')

  const [isExamModalOpen, setIsExamModalOpen] = useState(false)
  const [examName, setExamName] = useState('')
  const [examSubject, setExamSubject] = useState('Java Programming')
  const [examDaysLeft, setExamDaysLeft] = useState('14')
  const [examDate, setExamDate] = useState('Nov 15')
  const [examProgress, setExamProgress] = useState('60')

  const handleAddTask = (e) => {
    e.preventDefault()
    if (!taskInput.trim()) return
    addTask({
      text: taskInput,
      subject: taskSubject,
      priority: taskPriority,
      dueDate: taskDueDate
    })
    setTaskInput('')
  }

  const handleAddExam = (e) => {
    e.preventDefault()
    if (!examName.trim()) return
    addExam({
      name: examName,
      subject: examSubject,
      daysLeft: examDaysLeft,
      prepProgress: examProgress,
      date: examDate
    })
    setExamName('')
    setIsExamModalOpen(false)
  }

  const priorityStyles = {
    high: {
      badge: 'bg-red-500/15 text-red-700 dark:text-red-300 border border-red-500/30',
      label: 'High Priority'
    },
    medium: {
      badge: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30',
      label: 'Medium'
    },
    low: {
      badge: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30',
      label: 'Normal'
    }
  }

  const pendingTasks = tasks.filter(t => !t.completed)
  const completedTasks = tasks.filter(t => t.completed)

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-nest-border dark:border-white/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-nest-blue dark:text-blue-400 uppercase tracking-wider mb-1">
            <Calendar className="w-4 h-4" />
            Study Schedule & Deadlines
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-nest-navy dark:text-white">
            Planner & Exam Countdown
          </h1>
          <p className="text-xs sm:text-sm text-nest-gray dark:text-slate-300 mt-1">
            Organize daily syllabus targets and stay ahead of upcoming midterms & final exams.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsExamModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-nest-navy hover:bg-nest-blue text-white text-xs font-bold transition-all shadow-md cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Exam Countdown
        </button>
      </div>

      {/* Exam Countdown Cards Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-display font-bold text-nest-navy dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-nest-gold" />
            Upcoming Exam Countdowns
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {exams.map((exam) => (
            <article
              key={exam.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-nest-border dark:border-white/10 shadow-sm relative overflow-hidden flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-nest-light-blue dark:bg-blue-950/60 text-nest-blue dark:text-blue-300 border border-nest-blue/20">
                    {exam.subject}
                  </span>

                  <button
                    type="button"
                    onClick={() => deleteExam(exam.id)}
                    className="p-1 text-slate-600 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete exam"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="font-display font-bold text-sm sm:text-base text-nest-navy dark:text-white leading-snug">
                  {exam.name}
                </h3>
                <p className="text-xs text-nest-gray dark:text-slate-400 mt-1">Exam Date: {exam.date}</p>

                {/* Big Days Left Callout */}
                <div className="my-3 flex items-baseline gap-1.5">
                  <span className="text-3xl font-black font-display text-nest-navy dark:text-blue-400">
                    {exam.daysLeft}
                  </span>
                  <span className="text-xs font-bold text-nest-gray dark:text-slate-400">Days Left</span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold text-nest-gray dark:text-slate-300">
                    <span>Preparation</span>
                    <span className="font-bold text-nest-navy dark:text-white">{exam.prepProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-nest-gold rounded-full"
                      style={{ width: `${exam.prepProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Daily Study Tasks Checklist */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl border border-nest-border dark:border-white/10 p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-lg text-nest-navy dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-nest-green" />
              Today's Study Checklist ({pendingTasks.length} Pending)
            </h2>
            <p className="text-xs text-nest-gray dark:text-slate-400 mt-0.5">
              Check off tasks to maintain your study streak and earn +20 XP per item!
            </p>
          </div>
        </div>

        {/* Add Task Input Form */}
        <form onSubmit={handleAddTask} className="flex flex-col sm:flex-row gap-2.5 p-2 rounded-2xl bg-nest-light-input dark:bg-slate-800 border border-nest-border dark:border-slate-700">
          <input
            type="text"
            required
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            placeholder="Add new study goal (e.g. Complete Unit 2 Notes)..."
            className="flex-1 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-nest-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-nest-blue"
          />

          <select
            value={taskPriority}
            onChange={(e) => setTaskPriority(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-nest-navy dark:text-white"
          >
            <option value="high">High Priority</option>
            <option value="medium">Medium</option>
            <option value="low">Low Priority</option>
          </select>

          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-nest-navy hover:bg-nest-blue text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Goal
          </button>
        </form>

        {/* Task Items List */}
        <div className="space-y-2.5">
          {tasks.length === 0 ? (
            <div className="text-center py-10 flex flex-col items-center">
              <MascotOwl state="empty" size="md" />
              <p className="text-xs font-bold text-nest-navy dark:text-white mt-3">Nothing planned yet!</p>
              <p className="text-xs text-nest-gray dark:text-slate-400">Add your next study goal to keep your progress moving.</p>
            </div>
          ) : (
            tasks.map((task) => {
              const priority = priorityStyles[task.priority] || priorityStyles.medium
              return (
                <div
                  key={task.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    task.completed
                      ? 'bg-slate-50/50 dark:bg-slate-950/40 border-slate-200 dark:border-white/5 opacity-60'
                      : 'bg-white dark:bg-slate-900 border-nest-border dark:border-white/10 hover:border-nest-blue/40 shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      type="button"
                      onClick={() => toggleTask(task.id)}
                      className="text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer shrink-0"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100 dark:fill-emerald-950" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-400" />
                      )}
                    </button>

                    <div className="min-w-0">
                      <p className={`text-xs sm:text-sm font-semibold truncate ${
                        task.completed ? 'line-through text-nest-gray dark:text-slate-500' : 'text-nest-navy dark:text-white'
                      }`}>
                        {task.text}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-nest-gray dark:text-slate-400 font-medium">
                          {task.subject} • {task.dueDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${priority.badge}`}>
                      {priority.label}
                    </span>

                    <button
                      type="button"
                      onClick={() => deleteTask(task.id)}
                      className="p-1 text-slate-600 hover:text-red-700 transition-colors"
                      title="Delete goal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </section>

      {/* Add Exam Modal */}
      <AnimatePresence>
        {isExamModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-nest-border dark:border-white/10 shadow-2xl p-6 relative"
            >
              <div className="flex items-center justify-between pb-3 border-b border-nest-border dark:border-white/10">
                <h3 className="font-display font-bold text-base text-nest-navy dark:text-white">
                  Add Exam Countdown
                </h3>
                <button
                  type="button"
                  onClick={() => setIsExamModalOpen(false)}
                  className="text-slate-600 hover:text-slate-900 dark:hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddExam} className="space-y-3.5 pt-4">
                <div>
                  <label className="block text-xs font-bold text-nest-navy dark:text-slate-200 mb-1">
                    Exam Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={examName}
                    onChange={(e) => setExamName(e.target.value)}
                    placeholder="e.g. Operating Systems Final"
                    className="w-full px-3.5 py-2 rounded-xl bg-nest-light-input dark:bg-slate-800 border border-nest-border dark:border-slate-700 text-xs text-nest-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-nest-blue"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-nest-navy dark:text-slate-200 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={examSubject}
                      onChange={(e) => setExamSubject(e.target.value)}
                      placeholder="e.g. OS / CSE"
                      className="w-full px-3.5 py-2 rounded-xl bg-nest-light-input dark:bg-slate-800 border border-nest-border dark:border-slate-700 text-xs text-nest-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-nest-blue"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-nest-navy dark:text-slate-200 mb-1">
                      Days Remaining
                    </label>
                    <input
                      type="number"
                      value={examDaysLeft}
                      onChange={(e) => setExamDaysLeft(e.target.value)}
                      min="1"
                      className="w-full px-3.5 py-2 rounded-xl bg-nest-light-input dark:bg-slate-800 border border-nest-border dark:border-slate-700 text-xs text-nest-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-nest-blue"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-nest-border dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsExamModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-nest-gray hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-nest-navy text-white text-xs font-bold shadow-md"
                  >
                    Save Exam Target
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
