import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ChevronRight, CheckCircle, XCircle, Trophy, Sparkles, RotateCcw, Home } from 'lucide-react'
import { aiService } from '../services/aiService'

export default function QuizView({ context }) {
  const { currentQuiz, setCurrentQuiz, setQuizState, quizState, getQuizzes, selectedSubject, navigateTo, goToSubjectDetail } = context

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
  }, [selectedSubject, currentQuiz])

  if (!quiz || questions.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-display font-bold mb-4">No Quiz Available</h2>
        <p className="text-muted-foreground mb-6">This subject doesn't have any quizzes yet.</p>
        <button onClick={goToSubjectDetail} className="px-6 py-3 rounded-xl bg-primary text-white font-medium">
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
          {isPassed ? <Trophy className="w-12 h-12 text-emerald-400" /> : <XCircle className="w-12 h-12 text-red-400" />}
        </motion.div>
        <h2 className="text-3xl font-display font-bold mb-2">
          {isPassed ? 'Congratulations!' : 'Keep Practicing!'}
        </h2>
        <p className="text-muted-foreground mb-6">You scored {quizState.score} out of {questions.length}</p>
        <div className="relative h-3 rounded-full overflow-hidden glass-card mb-6">
          <motion.div
            className={`absolute inset-y-0 left-0 rounded-full ${
              isPassed ? 'bg-gradient-to-r from-emerald-400 to-teal-500' : 'bg-gradient-to-r from-red-400 to-pink-500'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, delay: 0.3 }}
          />
        </div>
        <p className="text-4xl font-display font-bold mb-8">{percentage}%</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={handleRestart}
            className="px-6 py-3 rounded-xl glass-card border border-white/10 font-medium flex items-center gap-2 hover:bg-white/10 transition-all"
          >
            <RotateCcw className="w-4 h-4" /> Try Again
          </button>
          <button
            onClick={goToSubjectDetail}
            className="px-6 py-3 rounded-xl bg-primary text-white font-medium flex items-center gap-2 hover:brightness-110 transition-all"
          >
            <Home className="w-4 h-4" /> Back to Subject
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between">
        <button onClick={goToSubjectDetail} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="text-sm text-muted-foreground">
          {quizState.currentIndex + 1} / {questions.length}
        </div>
      </div>

      <div className="h-1.5 rounded-full overflow-hidden glass-card">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${((quizState.currentIndex + 1) / questions.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="glass-card rounded-2xl p-6 md:p-8">
        <div className="flex items-start gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl font-semibold">{currentQ.question}</h2>
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
                onClick={() => handleSelect(i)}
                disabled={quizState.selectedOption !== null}
                className={`w-full p-4 rounded-xl text-left transition-all flex items-center gap-3 ${
                  showCorrect
                    ? 'bg-emerald-500/20 border-2 border-emerald-500'
                    : showWrong
                    ? 'bg-red-500/20 border-2 border-red-500'
                    : isSelected
                    ? 'bg-primary/20 border-2 border-primary'
                    : 'glass-card border border-white/5 hover:border-primary/30'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium ${
                  showCorrect ? 'bg-emerald-500 text-white' : showWrong ? 'bg-red-500 text-white' : 'bg-white/10'
                }`}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="flex-1">{option}</span>
                {showCorrect && <CheckCircle className="w-5 h-5 text-emerald-400" />}
                {showWrong && <XCircle className="w-5 h-5 text-red-400" />}
              </motion.button>
            )
          })}
        </div>

        <AnimatePresence>
          {quizState.selectedOption !== null && (
            <motion.div
              className={`mt-6 p-4 rounded-xl ${
                feedback === 'correct' ? 'bg-emerald-500/10' : 'bg-red-500/10'
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className={`font-semibold mb-2 ${feedback === 'correct' ? 'text-emerald-400' : 'text-red-400'}`}>
                {feedback === 'correct' ? 'Correct!' : 'Incorrect!'}
              </p>
              {currentQ.explanation && (
                <p className="text-sm text-muted-foreground">{currentQ.explanation}</p>
              )}
              <button
                onClick={() => setShowExplanation(true)}
                className="mt-3 text-sm text-primary hover:underline"
              >
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
            onClick={handleNext}
            className="px-6 py-3 rounded-xl bg-primary text-white font-medium flex items-center gap-2 hover:brightness-110 transition-all"
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
    <motion.div className="mt-3 p-3 rounded-lg bg-white/5 text-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {loading ? (
        <span className="text-muted-foreground">Generating AI explanation...</span>
      ) : (
        <p className="text-foreground/80">{explanation}</p>
      )}
    </motion.div>
  )
}