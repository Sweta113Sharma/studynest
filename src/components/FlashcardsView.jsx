import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, RotateCw, CheckCircle2, HelpCircle, Sparkles, Trophy, RotateCcw, Flame, Download } from 'lucide-react'
import { aiService } from '../services/aiService'
import { useApp } from '../context/AppContext'

export default function FlashcardsView() {
  const { selectedSubject, selectedUnit, navigateTo, goToSubjectDetail, goBack } = useApp()

  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [mastered, setMastered] = useState([])
  const [needsReview, setNeedsReview] = useState([])
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    loadFlashcards()
  }, [selectedSubject, selectedUnit])

  const loadFlashcards = async () => {
    setLoading(true)
    setCompleted(false)
    setCurrentIndex(0)
    setIsFlipped(false)
    setMastered([])
    setNeedsReview([])

    try {
      const content = selectedUnit
        ? selectedUnit.aiSummary || selectedUnit.title
        : selectedSubject
        ? selectedSubject.units.map((u) => `${u.title}: ${u.aiSummary || ''}`).join('\n')
        : 'Engineering Fundamentals'

      const flashcardsData = await aiService.generateFlashcards(content, 6)
      setCards(flashcardsData)
    } catch (e) {
      console.error('Failed to load flashcards', e)
    } finally {
      setLoading(false)
    }
  }

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleResponse = (isMastered) => {
    const currentCard = cards[currentIndex]
    if (isMastered) {
      setMastered([...mastered, currentCard])
    } else {
      setNeedsReview([...needsReview, currentCard])
    }

    if (currentIndex < cards.length - 1) {
      setIsFlipped(false)
      setCurrentIndex(currentIndex + 1)
    } else {
      setCompleted(true)
    }
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setIsFlipped(false)
    setMastered([])
    setNeedsReview([])
    setCompleted(false)
  }

  const handleReviewFlaggedOnly = () => {
    if (needsReview.length > 0) {
      setCards(needsReview)
      setCurrentIndex(0)
      setIsFlipped(false)
      setMastered([])
      setNeedsReview([])
      setCompleted(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Sparkles className="w-10 h-10 animate-spin text-amber-600 dark:text-amber-400 mb-4" />
        <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Generating Smart Flashcards...</h3>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-1">Creating active recall cards for exam prep</p>
      </div>
    )
  }

  if (completed) {
    return (
      <motion.div
        className="max-w-md mx-auto text-center py-12"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
          <Trophy className="w-10 h-10" />
        </div>

        <h2 className="text-3xl font-display font-black text-slate-900 dark:text-white mb-2">Flashcard Deck Complete!</h2>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-6">
          Great job practicing active recall for {selectedUnit?.title || selectedSubject?.title}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-2xl glass-card border border-emerald-500/30 text-center">
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{mastered.length}</span>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">Mastered</p>
          </div>
          <div className="p-4 rounded-2xl glass-card border border-amber-500/30 text-center">
            <span className="text-2xl font-bold text-amber-700 dark:text-amber-300">{needsReview.length}</span>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">Needs Review</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={handleRestart}
            className="px-5 py-2.5 rounded-xl glass-card border border-slate-300 dark:border-white/10 font-bold text-slate-900 dark:text-white text-sm flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-white/10 transition-all focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            <RotateCcw className="w-4 h-4" /> Restart All
          </button>
          {needsReview.length > 0 && (
            <button
              type="button"
              onClick={handleReviewFlaggedOnly}
              className="px-5 py-2.5 rounded-xl bg-amber-700 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-amber-800 transition-all focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              <Flame className="w-4 h-4" /> Review ({needsReview.length}) Flagged
            </button>
          )}
          <button
            type="button"
            onClick={() => (selectedUnit ? navigateTo('unit-detail') : goToSubjectDetail())}
            className="px-5 py-2.5 rounded-xl bg-amber-600 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-amber-700 transition-all focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            Done
          </button>
        </div>
      </motion.div>
    )
  }

  const currentCard = cards[currentIndex]

  const exportCards = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cards, null, 2))
      const downloadAnchor = document.createElement('a')
      downloadAnchor.setAttribute("href", dataStr)
      downloadAnchor.setAttribute("download", `study_flashcards_${selectedUnit?.title || 'subject'}.json`)
      document.body.appendChild(downloadAnchor)
      downloadAnchor.click()
      downloadAnchor.remove()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <motion.div className="space-y-6 max-w-xl mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goBack}
            className="flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:text-amber-600 font-semibold text-sm transition-colors py-1.5 px-3 rounded-xl hover:bg-slate-200 dark:hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          
          {cards.length > 0 && (
            <button
              type="button"
              onClick={exportCards}
              className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200 hover:text-amber-600 font-semibold text-xs transition-colors py-1.5 px-3 rounded-xl hover:bg-slate-200 dark:hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-amber-500"
              title="Export Flashcards as JSON"
            >
              <Download className="w-3.5 h-3.5" /> Export
            </button>
          )}
        </div>
        <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <span>Card {currentIndex + 1} of {cards.length}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
          <span className="text-amber-700 dark:text-amber-400">{selectedUnit?.title || selectedSubject?.title}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
        <motion.div
          className="h-full bg-amber-600 rounded-full"
          animate={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
        />
      </div>

      {/* 3D Flip Card Container */}
      <div 
        className="min-h-[320px] cursor-pointer" 
        style={{ perspective: '1000px' }}
        onClick={handleFlip}
        role="button"
        tabIndex={0}
        aria-label="Flashcard. Click to flip"
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleFlip(); } }}
      >
        <motion.div
          className="w-full min-h-[320px] relative"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 200, damping: 20 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front Side */}
          <div 
            className="absolute inset-0 glass-card rounded-3xl p-8 flex flex-col justify-between shadow-2xl border border-slate-300 hover:border-amber-500/40 transition-colors"
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold tracking-wider px-2.5 py-1 rounded-full bg-amber-500/20" style={{ color: '#92400e' }}>
                Question / Concept
              </span>
              <span className="text-xs font-semibold flex items-center gap-1" style={{ color: '#334155' }}>
                <RotateCw className="w-3.5 h-3.5" /> Click to Flip
              </span>
            </div>

            <div className="my-auto text-center py-6">
              <h3 className="text-xl md:text-2xl font-display font-bold leading-relaxed" style={{ color: '#073B3A' }}>
                {currentCard?.front}
              </h3>
            </div>

            <div className="text-center text-xs font-semibold" style={{ color: '#475569' }}>
              Tap card to reveal answer
            </div>
          </div>

          {/* Back Side */}
          <div 
            className="absolute inset-0 glass-card rounded-3xl p-8 flex flex-col justify-between shadow-2xl border border-slate-300 hover:border-amber-500/40 transition-colors"
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold tracking-wider px-2.5 py-1 rounded-full bg-amber-500/20" style={{ color: '#92400e' }}>
                Answer & Explanation
              </span>
              <span className="text-xs font-semibold flex items-center gap-1" style={{ color: '#334155' }}>
                <RotateCw className="w-3.5 h-3.5" /> Click to Flip
              </span>
            </div>

            <div className="my-auto py-6">
              <p className="text-base md:text-lg font-semibold leading-relaxed" style={{ color: '#073B3A' }}>
                {currentCard?.back}
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-300" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => handleResponse(false)}
                className="flex-1 py-2.5 rounded-xl glass-card border border-amber-500/40 hover:bg-amber-500/20 font-bold text-xs transition-all flex items-center justify-center gap-1.5 focus-visible:ring-2 focus-visible:ring-amber-500"
                style={{ color: '#92400e' }}
              >
                <HelpCircle className="w-4 h-4" /> Need Practice
              </button>
              <button
                type="button"
                onClick={() => handleResponse(true)}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                <CheckCircle2 className="w-4 h-4" /> Got It!
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
