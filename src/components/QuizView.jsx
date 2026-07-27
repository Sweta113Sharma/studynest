import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ChevronRight, CheckCircle, XCircle, Trophy, Sparkles, RotateCcw, Home } from 'lucide-react'
import { aiService } from '../services/aiService'
import { useApp } from '../context/AppContext'

export default function QuizView() {
  const {
    currentQuiz,
    setCurrentQuiz,
    setQuizState,
    quizState,
    getQuizzes,
    selectedSubject,
    navigateTo,
    goToSubjectDetail,
    goBack
  } = useApp()

  const [feedback, setFeedback] = useState(null)
  const [showExplanation, setShowExplanation] = useState(false)

  const quiz = currentQuiz || getQuizzes(selectedSubject?.id)?.[0]
  const questions = quiz?.questions || []
  const currentQ = questions[quizState.currentIndex]

  useEffect(() => {
    if (!currentQuiz && selectedSubject) {
      const available = getQuizzes(selectedSubject.id)
      if (available.length > 0) {
        setCurrentQuiz(available[0])
      }
    }
  }, [selectedSubject, currentQuiz, getQuizzes, setCurrentQuiz])

  if (!quiz || questions.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-4">No Quiz Available</h2>
        <p className="text-slate-700 dark:text-slate-300 font-semibold mb-6">This subject doesn't have any quizzes yet.</p>
        <button onClick={goToSubjectDetail} className="btn-primary focus-visible:ring-2 focus-visible:ring-amber-500">
          Go Back
        </button>
      </div>
    )
  }

  const handleSelect = (optionIdx) => {
    if (quizState.selectedOption !== null) return
    const correct = optionIdx === currentQ.correctAnswer
    setQuizState(prev => ({
      ...prev,
      selectedOption: optionIdx,
      score: prev.score + (correct ? 1 : 0)
    }))
    setFeedback(correct ? 'correct' : 'incorrect')
  }

  const handleNext = () => {
    if (quizState.currentIndex < questions.length - 1) {
      setQuizState(prev => ({ ...prev, currentIndex: prev.currentIndex + 1, selectedOption: null }))
      setFeedback(null)
      setShowExplanation(false)
    } else {
      setQuizState(prev => ({ ...prev, completed: true }))
    }
  }

  const handleRestart = () => {
    setQuizState({ currentIndex: 0, score: 0, selectedOption: null, completed: false })
    setFeedback(null)
    setShowExplanation(false)
  }

  const percentage = Math.round((quizState.score / questions.length) * 100)
  const isPassed = percentage >= 70

  if (quizState.completed) {
    return (
      <motion.div
        className="max-w-md mx-auto text-center py-12"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <motion.div
          className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
            isPassed ? 'bg-emerald-500/20' : 'bg-red-500/20'
          }`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
        >
          {isPassed ? <Trophy className="w-12 h-12 text-emerald-600 dark:text-emerald-400" /> : <XCircle className="w-12 h-12 text-red-600 dark:text-red-400" />}
        </motion.div>
        <h2 className="text-3xl font-display font-black text-slate-900 dark:text-white mb-2">
          {isPassed ? 'Congratulations!' : 'Keep Practicing!'}
        </h2>
        <p className="text-slate-700 dark:text-slate-300 font-semibold mb-6">You scored {quizState.score} out of {questions.length}</p>
        <div className="relative h-3 rounded-full overflow-hidden glass-card border border-slate-300 dark:border-white/10 mb-6">
          <motion.div
            className={`absolute inset-y-0 left-0 rounded-full ${
              isPassed ? 'bg-gradient-to-r from-emerald-500 to-teal-600' : 'bg-gradient-to-r from-red-500 to-pink-600'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, delay: 0.3 }}
          />
        </div>
        <p className="text-4xl font-display font-black text-slate-900 dark:text-white mb-8">{percentage}%</p>
        <div className="flex gap-3 justify-center">
          <button
            type="button"
            onClick={handleRestart}
            className="px-6 py-3 rounded-xl glass-card border border-slate-300 dark:border-white/10 font-bold text-slate-900 dark:text-white flex items-center gap-2 hover:bg-slate-200 dark:hover:bg-white/10 transition-all focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            <RotateCcw className="w-4 h-4" /> Try Again
          </button>
          <button
            type="button"
            onClick={() => currentQuiz?.title?.includes('AI Quiz:') ? navigateTo('unit-detail') : goToSubjectDetail()}
            className="px-6 py-3 rounded-xl bg-amber-600 text-white font-bold flex items-center gap-2 hover:bg-amber-700 transition-all focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            <Home className="w-4 h-4" /> {currentQuiz?.title?.includes('AI Quiz:') ? 'Back to Unit' : 'Back to Subject'}
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between">
        <motion.button 
          type="button"
          onClick={goBack} 
          className="flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:text-amber-600 font-semibold text-sm transition-colors py-1.5 px-3 rounded-xl hover:bg-slate-200 dark:hover:bg-white/10 w-fit focus-visible:ring-2 focus-visible:ring-amber-500"
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.92 }}
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </motion.button>
        <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
          {quizState.currentIndex + 1} / {questions.length}
        </div>
      </div>

      <div className="h-2 rounded-full overflow-hidden glass-card border border-slate-300 dark:border-white/10">
        <motion.div
          className="h-full bg-amber-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${((quizState.currentIndex + 1) / questions.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="glass-card rounded-2xl p-6 md:p-8 border border-slate-300 dark:border-white/10">
        <div className="flex items-start gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{currentQ.question}</h2>
        </div>

        <div className="space-y-3">
          {currentQ.options.map((option, i) => {
            const isSelected = quizState.selectedOption === i
            const isCorrect = i === currentQ.correctAnswer
            const showCorrect = quizState.selectedOption !== null && isCorrect
            const showWrong = isSelected && !isCorrect

            return (
              <motion.button
                key={i}
                type="button"
                onClick={() => handleSelect(i)}
                disabled={quizState.selectedOption !== null}
                className={`w-full p-4 rounded-xl text-left transition-all flex items-center gap-3 font-semibold focus-visible:ring-2 focus-visible:ring-amber-500 ${
                  showCorrect
                    ? 'bg-emerald-500/20 border-2 border-emerald-500 text-slate-900 dark:text-white'
                    : showWrong
                    ? 'bg-red-500/20 border-2 border-red-500 text-slate-900 dark:text-white'
                    : isSelected
                    ? 'bg-amber-500/20 border-2 border-amber-500 text-slate-900 dark:text-white'
                    : 'glass-card border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white hover:border-amber-500/40'
                }`}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                  showCorrect ? 'bg-emerald-600 text-white' : showWrong ? 'bg-red-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white'
                }`}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="flex-1 text-slate-900 dark:text-white">{option}</span>
                {showCorrect && <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
                {showWrong && <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />}
              </motion.button>
            )
          })}
        </div>

        <AnimatePresence>
          {quizState.selectedOption !== null && (
            <motion.div
              className={`mt-6 p-5 rounded-xl border ${
                feedback === 'correct' 
                  ? 'bg-emerald-500/10 border-emerald-500/30' 
                  : 'bg-red-500/10 border-red-500/30'
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className={`font-bold mb-2 ${feedback === 'correct' ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
                {feedback === 'correct' ? 'Correct!' : 'Incorrect!'}
              </p>
              {currentQ.explanation && (
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-3">{currentQ.explanation}</p>
              )}
              
              <button
                type="button"
                onClick={() => setShowExplanation(!showExplanation)}
                className="mt-2 text-xs font-bold px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-800 dark:text-amber-300 hover:bg-amber-500/20 border border-amber-500/30 transition-all flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {showExplanation ? 'Hide AI Explanation' : 'Get AI Explanation'}
              </button>
              
              {showExplanation && (
                <AIGeneratedExplanation 
                  question={currentQ.question} 
                  correctAnswer={currentQ.options[currentQ.correctAnswer]} 
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {quizState.selectedOption !== null && (
        <motion.div className="flex justify-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-3 rounded-xl bg-amber-600 text-white font-bold flex items-center gap-2 hover:bg-amber-700 transition-all focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            {quizState.currentIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </motion.div>
  )
}

function AIGeneratedExplanation({ question, correctAnswer }) {
  const [explanation, setExplanation] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const fetchExplanation = async () => {
      try {
        const result = await aiService.explainAnswer(question, correctAnswer)
        if (!cancelled) setExplanation(result)
      } catch (e) {
        if (!cancelled) setExplanation('Could not generate explanation at this time.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchExplanation()
    return () => { cancelled = true }
  }, [question, correctAnswer])

  return (
    <motion.div className="mt-3 p-3 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-sm font-medium" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {loading ? (
        <span className="text-slate-700 dark:text-slate-300">Generating AI explanation...</span>
      ) : (
        <p className="text-slate-900 dark:text-white leading-relaxed">{explanation}</p>
      )}
    </motion.div>
  )
}