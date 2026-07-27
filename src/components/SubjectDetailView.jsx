import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, CheckCircle, Circle, Plus, Trash2, Sparkles, Loader2, X, Bookmark, Layers } from 'lucide-react'
import { aiService } from '../services/aiService'
import { useApp } from '../context/AppContext'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 120, damping: 14 }
  }
}

export default function SubjectDetailView() {
  const {
    selectedSubject,
    setSelectedUnit,
    navigateTo,
    goToSubjects,
    goHome,
    goBack,
    subjectColors,
    getSubjectProgress,
    getUnitProgress,
    setUnitProgress,
    getTodos,
    saveTodos,
    setCurrentQuiz,
    setQuizState,
    toggleBookmark,
    isBookmarked
  } = useApp()

  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiSummary, setAiSummary] = useState(null)

  useEffect(() => {
    if (selectedSubject) {
      setTodos(getTodos(selectedSubject.id))
    }
  }, [selectedSubject, getTodos])

  if (!selectedSubject) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">No Subject Selected</h2>
        <p className="text-slate-700 dark:text-slate-300 text-sm">Please select a subject to view syllabus and units.</p>
        <button
          type="button"
          onClick={goToSubjects || goHome}
          className="btn-primary focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          Back to Subjects
        </button>
      </div>
    )
  }

  const colors = subjectColors[selectedSubject.key] || subjectColors.default
  const progress = getSubjectProgress(selectedSubject.id)

  const handleUnitToggle = (unitTitle) => {
    const current = getUnitProgress(selectedSubject.id, unitTitle)
    setUnitProgress(selectedSubject.id, unitTitle, !current)
  }

  const handleAddTodo = () => {
    if (!newTodo.trim()) return
    const updated = [...todos, { text: newTodo.trim(), done: false }]
    setTodos(updated)
    saveTodos(selectedSubject.id, updated)
    setNewTodo('')
  }

  const handleTodoToggle = (index) => {
    const updated = [...todos]
    updated[index].done = !updated[index].done
    setTodos(updated)
    saveTodos(selectedSubject.id, updated)
  }

  const handleDeleteTodo = (index) => {
    const updated = todos.filter((_, i) => i !== index)
    setTodos(updated)
    saveTodos(selectedSubject.id, updated)
  }

  const openUnit = (unit) => {
    setSelectedUnit(unit)
    navigateTo('unit-detail')
  }

  const startFlashcards = () => {
    navigateTo('flashcards')
  }

  const handleAISubjectSummary = async () => {
    setAiLoading(true)
    try {
      const combinedContent = selectedSubject.units.map(u => `${u.title}: ${u.aiSummary || ''}`).join('\n\n')
      const summary = await aiService.generateSummary(combinedContent)
      setAiSummary(summary)
    } catch (e) {
      alert('Summary generation failed: ' + e.message)
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.button
        type="button"
        onClick={goBack}
        className="flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 font-semibold text-sm transition-colors py-1.5 px-3 rounded-xl hover:bg-slate-200/60 dark:hover:bg-white/10 w-fit focus-visible:ring-2 focus-visible:ring-amber-500"
        variants={itemVariants}
        whileHover={{ x: -4 }}
        whileTap={{ scale: 0.92 }}
        aria-label="Back to Subjects"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Subjects</span>
      </motion.button>

      {/* Header Banner */}
      <motion.header
        className="p-6 rounded-2xl glass-card border border-slate-300 dark:border-white/10 relative overflow-hidden"
        variants={itemVariants}
      >
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-black tracking-tight text-slate-900 dark:text-white">
              {selectedSubject.title}
            </h1>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={startFlashcards}
              className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 font-bold text-sm flex items-center gap-2 hover:bg-amber-500/20 transition-all focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              <Layers className="w-4 h-4" />
              <span>Flashcards</span>
            </button>
            <button
              type="button"
              onClick={handleAISubjectSummary}
              disabled={aiLoading}
              className="px-4 py-2 rounded-xl glass-card border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white font-bold text-sm flex items-center gap-2 hover:border-amber-500/40 transition-all disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
              <span>AI Overview</span>
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="text-slate-700 dark:text-slate-300">Overall Progress</span>
            <span className="font-bold" style={{ color: colors.border }}>{progress}%</span>
          </div>
          <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: colors.border }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {aiSummary && (
          <motion.article
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card rounded-2xl p-6 border border-amber-500/30 relative"
          >
            <button 
              type="button"
              onClick={() => setAiSummary(null)}
              className="absolute top-4 right-4 p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-amber-500"
              aria-label="Close AI Overview"
            >
              <X className="w-4 h-4 text-slate-700 dark:text-slate-300" />
            </button>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              AI Subject Overview
            </h3>
            <div className="prose dark:prose-invert max-w-none text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
              {aiSummary}
            </div>
          </motion.article>
        )}
      </AnimatePresence>

      {/* Units List */}
      <section aria-label="Subject units">
        <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="w-1.5 h-5 rounded-full bg-amber-600 dark:bg-amber-400" />
          Units
        </h2>
        <div className="space-y-3">
          {selectedSubject.units.map((unit, i) => {
            const done = getUnitProgress(selectedSubject.id, unit.title)
            const bookmarkId = `unit_${selectedSubject.id}_${unit.title}`
            const bookmarked = isBookmarked(bookmarkId)
            return (
              <motion.div
                key={i}
                onClick={() => openUnit(unit)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    openUnit(unit)
                  }
                }}
                className={`w-full p-4 rounded-xl flex items-center gap-4 text-left transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-500 ${
                  done ? 'glass-card opacity-70 bg-slate-100 dark:bg-slate-900/40' : 'glass-card border border-slate-300 dark:border-white/10 hover:border-amber-500/40'
                }`}
                variants={itemVariants}
                whileHover={{ scale: 1.01, x: 3 }}
                whileTap={{ scale: 0.99 }}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleUnitToggle(unit.title)
                  }}
                  className="flex-shrink-0 cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-500 rounded-full"
                  aria-label={done ? `Mark ${unit.title} incomplete` : `Mark ${unit.title} complete`}
                >
                  {done ? (
                    <CheckCircle className="w-6 h-6" style={{ color: colors.border }} />
                  ) : (
                    <Circle className="w-6 h-6 text-slate-500 dark:text-slate-400" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-bold text-base text-slate-900 dark:text-white ${done ? 'line-through opacity-60' : ''}`}>
                    {unit.title}
                  </h3>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-0.5">
                    {unit.youtube?.length || 0} videos • {unit.ppts?.length || 0} PPTs • AI notes
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleBookmark({
                      id: bookmarkId,
                      title: unit.title,
                      subjectTitle: selectedSubject.title,
                      subject: selectedSubject,
                      unit: unit
                    })
                  }}
                  className={`p-2 rounded-xl border transition-all duration-200 focus-visible:ring-2 focus-visible:ring-amber-500 ${
                    bookmarked
                      ? 'bg-amber-500/20 border-amber-500 text-amber-700 dark:text-amber-300 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border-transparent'
                  }`}
                  aria-label={bookmarked ? `Remove bookmark for ${unit.title}` : `Bookmark ${unit.title}`}
                >
                  <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
                </button>
                <span className="text-slate-500 dark:text-slate-400 font-bold">→</span>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Important Topics Section */}
      <section aria-labelledby="topics-heading">
        <h2 id="topics-heading" className="text-lg font-display font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="w-1.5 h-5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
          Important Topics & To-Dos
        </h2>
        <div className="glass-card rounded-xl p-4 border border-slate-300 dark:border-white/10 space-y-3">
          {todos.length === 0 ? (
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 text-center py-4">
              No topics added yet. Add important topics to track your study goals!
            </p>
          ) : (
            todos.map((todo, i) => (
              <motion.div
                key={i}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                  todo.done ? 'bg-slate-100 dark:bg-slate-900/40 opacity-70' : 'bg-slate-50 dark:bg-slate-900/60'
                }`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <input
                  type="checkbox"
                  checked={todo.done}
                  onChange={() => handleTodoToggle(i)}
                  className="w-5 h-5 rounded border-slate-400 accent-amber-600 cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-500"
                  aria-label={`Toggle completion for ${todo.text}`}
                />
                <span className={`flex-1 text-sm font-semibold text-slate-900 dark:text-white ${todo.done ? 'line-through opacity-60' : ''}`}>
                  {todo.text}
                </span>
                <button
                  type="button"
                  onClick={() => handleDeleteTodo(i)}
                  className="p-1.5 hover:text-red-600 text-slate-500 transition-colors focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg"
                  aria-label={`Delete topic ${todo.text}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))
          )}
          <div className="flex gap-2">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
              placeholder="Add an important topic..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-white/15 text-sm text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
              aria-label="New important topic text"
            />
            <button
              type="button"
              onClick={handleAddTodo}
              className="px-4 py-2.5 rounded-xl bg-amber-600 text-white text-sm font-bold hover:bg-amber-700 transition-all focus-visible:ring-2 focus-visible:ring-amber-500"
              aria-label="Add topic"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </motion.div>
  )
}