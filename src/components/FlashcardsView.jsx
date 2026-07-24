import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, RotateCw, CheckCircle2, HelpCircle, Sparkles, Trophy, RotateCcw, Flame } from 'lucide-react'
import { aiService } from '../services/aiService'

export default function FlashcardsView({ context }) {
  const { selectedSubject, selectedUnit, navigateTo, goToSubjectDetail, goBack } = context || {}

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
        <Sparkles className="w-10 h-10 animate-spin text-primary mb-4" />
        <h3 className="font-display font-bold text-lg">Generating Smart Flashcards...</h3>
        <p className="text-sm text-muted-foreground mt-1">Creating high-yield active recall cards for exam prep</p>
      </div>
    )
  }

  if (completed) {
    const scorePercent = Math.round((mastered.length / cards.length) * 100)
    return (
      <motion.div
        className="max-w-md mx-auto text-center py-12"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-primary/20 flex items-center justify-center text-primary shadow-glow">
          <Trophy className="w-10 h-10 text-amber-300" />
        </div>

        <h2 className="text-3xl font-display font-bold mb-2">Flashcard Deck Complete!</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Great job practicing active recall for {selectedUnit?.title || selectedSubject?.title}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-2xl glass-card border border-emerald-500/20 text-center">
            <span className="text-2xl font-bold text-emerald-400">{mastered.length}</span>
            <p className="text-xs text-muted-foreground mt-0.5">Mastered</p>
          </div>
          <div className="p-4 rounded-2xl glass-card border border-amber-900/40 text-center">
            <span className="text-2xl font-bold text-amber-300">{needsReview.length}</span>
            <p className="text-xs text-muted-foreground mt-0.5">Needs Review</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleRestart}
            className="px-5 py-2.5 rounded-xl glass-card border border-white/10 font-medium text-sm flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
          >
            <RotateCcw className="w-4 h-4" /> Restart All
          </button>
          {needsReview.length > 0 && (
            <button
              onClick={handleReviewFlaggedOnly}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#78350F] to-amber-900 text-white font-semibold text-sm flex items-center justify-center gap-2 hover:brightness-110 transition-all"
            >
              <Flame className="w-4 h-4" /> Review ({needsReview.length}) Flagged
            </button>
          )}
          <button
            onClick={() => (selectedUnit ? navigateTo('unit-detail') : goToSubjectDetail())}
            className="px-5 py-2.5 rounded-xl bg-primary text-white font-medium text-sm flex items-center justify-center gap-2 hover:brightness-110 transition-all"
          >
            Done
          </button>
        </div>
      </motion.div>
    )
  }

  const currentCard = cards[currentIndex]

  return (
    <motion.div className="space-y-6 max-w-xl mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between">
        <button
          onClick={goBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors py-1 px-2 rounded-lg hover:bg-white/5 text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
          <span>Card {currentIndex + 1} of {cards.length}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="text-primary">{selectedUnit?.title || selectedSubject?.title}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-[#78350F] via-amber-900 to-[#451A03] rounded-full"
          animate={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
        />
      </div>

      {/* 3D Flip Card Container */}
      <div className="perspective-1000 min-h-[320px] cursor-pointer" onClick={handleFlip}>
        <motion.div
          className="w-full h-full min-h-[320px] glass-card rounded-3xl p-8 flex flex-col justify-between relative shadow-2xl border border-white/10 hover:border-primary/40 transition-colors"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 200, damping: 20 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front Side */}
          {!isFlipped ? (
            <div className="flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-primary/20 text-primary">
                  Question / Concept
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <RotateCw className="w-3.5 h-3.5" /> Click to Flip
                </span>
              </div>

              <div className="my-auto text-center py-6">
                <h3 className="text-xl md:text-2xl font-display font-bold leading-relaxed">
                  {currentCard?.front}
                </h3>
              </div>

              <div className="text-center text-xs text-muted-foreground">
                Tap card to reveal answer
              </div>
            </div>
          ) : (
            /* Back Side (Un-flip horizontal mirroring from 180deg parent rotation) */
            <div className="flex flex-col justify-between h-full" style={{ transform: 'rotateY(180deg)' }}>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-300/50 dark:border-amber-800/40">
                  Answer & Explanation
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <RotateCw className="w-3.5 h-3.5" /> Click to Flip
                </span>
              </div>

              <div className="my-auto py-6">
                <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
                  {currentCard?.back}
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-4 border-t border-white/10" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => handleResponse(false)}
                  className="flex-1 py-2.5 rounded-xl glass-card border border-amber-800/40 text-amber-900 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-950/40 font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <HelpCircle className="w-4 h-4" /> Need Practice
                </button>
                <button
                  onClick={() => handleResponse(true)}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-black hover:brightness-110 font-semibold text-xs transition-all flex items-center justify-center gap-1.5 shadow-glow"
                >
                  <CheckCircle2 className="w-4 h-4" /> Got It!
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
