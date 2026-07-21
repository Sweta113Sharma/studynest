import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, Clock, Coffee, Sparkles, X, Volume2, VolumeX, Plus, Minus, Settings2, CheckCircle2 } from 'lucide-react'

const TIMER_MODES = {
  focus: { label: 'Focus', defaultDuration: 25 * 60, color: 'text-primary', bg: 'bg-primary' },
  shortBreak: { label: 'Short Break', duration: 5 * 60, color: 'text-emerald-400', bg: 'bg-emerald-500' },
  longBreak: { label: 'Long Break', duration: 15 * 60, color: 'text-violet-400', bg: 'bg-violet-500' }
}

const PRESET_MINUTES = [15, 25, 35, 45, 60, 90]

export default function StudyTimer() {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState('focus')
  const [customFocusMinutes, setCustomFocusMinutes] = useState(25)
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [sessionsCompleted, setSessionsCompleted] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [showCompletionModal, setShowCompletionModal] = useState(false)

  const timerRef = useRef(null)

  useEffect(() => {
    const savedSessions = localStorage.getItem('studynest_timer_sessions')
    if (savedSessions) {
      setSessionsCompleted(parseInt(savedSessions, 10))
    }

    const savedFocusMins = localStorage.getItem('studynest_custom_focus_minutes')
    if (savedFocusMins) {
      const mins = parseInt(savedFocusMins, 10)
      if (mins > 0 && !isNaN(mins)) {
        setCustomFocusMinutes(mins)
        setTimeLeft(mins * 60)
      }
    }
  }, [])

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current)
            setIsRunning(false)
            playAlert()
            if (mode === 'focus') {
              const newCount = sessionsCompleted + 1
              setSessionsCompleted(newCount)
              localStorage.setItem('studynest_timer_sessions', newCount.toString())
              setIsOpen(true)
              setShowCompletionModal(true)
            } else {
              setIsOpen(true)
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      clearInterval(timerRef.current)
    }

    return () => clearInterval(timerRef.current)
  }, [isRunning, mode, sessionsCompleted])

  const playAlert = () => {
    if (!soundEnabled) return
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
      const now = audioCtx.currentTime

      // Alertive 4-Note Ascending Bright Bell Chime (E5 -> A5 -> C6 -> E6)
      const notes = [
        { freq: 659.25, time: now, duration: 0.18 },       // E5
        { freq: 880.00, time: now + 0.12, duration: 0.18 }, // A5
        { freq: 1046.50, time: now + 0.24, duration: 0.22 },// C6
        { freq: 1318.51, time: now + 0.38, duration: 0.45 } // E6 (High alert finale)
      ]

      notes.forEach(({ freq, time, duration }) => {
        // Main bright chime tone
        const osc = audioCtx.createOscillator()
        const gain = audioCtx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, time)

        // Shimmer harmonic (sine 1 octave up)
        const harmonic = audioCtx.createOscillator()
        const harmonicGain = audioCtx.createGain()
        harmonic.type = 'sine'
        harmonic.frequency.setValueAtTime(freq * 2, time)

        // Envelopes with crisp attack & decay
        gain.gain.setValueAtTime(0, time)
        gain.gain.linearRampToValueAtTime(0.35, time + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.001, time + duration)

        harmonicGain.gain.setValueAtTime(0, time)
        harmonicGain.gain.linearRampToValueAtTime(0.12, time + 0.02)
        harmonicGain.gain.exponentialRampToValueAtTime(0.001, time + duration)

        osc.connect(gain)
        harmonic.connect(harmonicGain)
        gain.connect(audioCtx.destination)
        harmonicGain.connect(audioCtx.destination)

        osc.start(time)
        harmonic.start(time)
        osc.stop(time + duration)
        harmonic.stop(time + duration)
      })
    } catch (e) {
      console.log('Audio playback not supported or blocked', e)
    }
  }

  const updateFocusMinutes = (newMins) => {
    const validMins = Math.max(1, Math.min(300, newMins))
    setCustomFocusMinutes(validMins)
    localStorage.setItem('studynest_custom_focus_minutes', validMins.toString())
    if (mode === 'focus' && !isRunning) {
      setTimeLeft(validMins * 60)
    }
  }

  const switchMode = (newMode) => {
    setMode(newMode)
    setIsRunning(false)
    setShowCompletionModal(false)
    if (newMode === 'focus') {
      setTimeLeft(customFocusMinutes * 60)
    } else {
      setTimeLeft(TIMER_MODES[newMode].duration)
    }
  }

  const toggleTimer = () => {
    setShowCompletionModal(false)
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setShowCompletionModal(false)
    if (mode === 'focus') {
      setTimeLeft(customFocusMinutes * 60)
    } else {
      setTimeLeft(TIMER_MODES[mode].duration)
    }
  }

  const handleStartBreak = () => {
    setMode('shortBreak')
    setTimeLeft(5 * 60)
    setShowCompletionModal(false)
    setIsRunning(true)
  }

  const handleKeepFocusGoing = () => {
    setMode('focus')
    setTimeLeft(customFocusMinutes * 60)
    setShowCompletionModal(false)
    setIsRunning(true)
  }

  const handleDismissCompletion = () => {
    setMode('focus')
    setTimeLeft(customFocusMinutes * 60)
    setShowCompletionModal(false)
    setIsRunning(false)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getTotalDuration = () => {
    return mode === 'focus' ? customFocusMinutes * 60 : TIMER_MODES[mode].duration
  }

  const totalDuration = getTotalDuration()
  const progressPercent = Math.min(100, Math.max(0, ((totalDuration - timeLeft) / totalDuration) * 100))

  return (
    <div className="relative">
      {/* Header Pill Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3.5 py-1.5 rounded-xl bg-slate-900/90 dark:bg-slate-900/90 text-amber-400 text-xs font-mono font-bold flex items-center gap-2 hover:bg-slate-800 transition-all border border-amber-500/30 shadow-md hover:scale-105 active:scale-95 ${
          isRunning ? 'border-amber-400 shadow-glow-sm shadow-amber-500/40' : ''
        }`}
        title="Pomodoro Study Timer"
      >
        <Clock className={`w-3.5 h-3.5 ${isRunning ? 'animate-pulse text-amber-400' : 'text-amber-500/70'}`} />
        <span className="text-white font-mono tracking-wide">{formatTime(timeLeft)}</span>
        {sessionsCompleted > 0 && (
          <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
            {sessionsCompleted}⚡
          </span>
        )}
      </button>

      {/* Popover / Floating Timer Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-xs"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="absolute right-0 top-12 w-84 max-w-[92vw] bg-slate-950/95 text-white backdrop-blur-3xl rounded-3xl p-5 z-50 shadow-2xl shadow-black/80 border border-amber-500/30 ring-1 ring-amber-500/20"
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-amber-500/20 border border-amber-500/30">
                    <Clock className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-display font-extrabold text-sm text-white tracking-wide">Focus Timer</h3>
                    <p className="text-[10px] text-slate-400">Boost your study productivity</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                    title={soundEnabled ? 'Disable alert sound' : 'Enable alert sound'}
                  >
                    {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {showCompletionModal ? (
                /* Timer Complete Overlay Prompt */
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-3 text-center space-y-4"
                >
                  <div className="relative w-16 h-16 mx-auto flex items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-xl shadow-amber-500/40 text-3xl">
                    <span>🎉</span>
                  </div>

                  <div>
                    <h4 className="text-base font-extrabold text-white font-display">Focus Session Complete!</h4>
                    <p className="text-xs text-slate-300 mt-1">Great job! You stayed focused for {customFocusMinutes} minutes.</p>
                  </div>

                  <div className="space-y-2.5 pt-2">
                    <button
                      onClick={handleStartBreak}
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-xs shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                    >
                      <Coffee className="w-4 h-4" /> Start 5-Min Short Break
                    </button>

                    <button
                      onClick={handleKeepFocusGoing}
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/35 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" /> Keep Focus Going (Restart Timer)
                    </button>

                    <button
                      onClick={handleDismissCompletion}
                      className="w-full py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white font-medium text-xs border border-white/10 transition-colors"
                    >
                      Done for Now
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* Standard Timer Controls & Circle */
                <>
                  {/* Mode Tabs */}
                  <div className="grid grid-cols-3 gap-1 bg-slate-900/90 p-1.5 rounded-2xl border border-white/10 mb-4 text-xs font-semibold">
                    {Object.keys(TIMER_MODES).map((key) => (
                      <button
                        key={key}
                        onClick={() => switchMode(key)}
                        className={`py-1.5 rounded-xl transition-all ${
                          mode === key
                            ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/35 scale-[1.02]'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {TIMER_MODES[key].label}
                      </button>
                    ))}
                  </div>

                  {/* Manual Custom Focus Duration Bar */}
                  {mode === 'focus' && (
                    <div className="mb-4 bg-slate-900/90 p-3.5 rounded-2xl border border-amber-500/25 shadow-inner">
                      <div className="flex items-center justify-between text-xs font-medium mb-2.5">
                        <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                          <Settings2 className="w-3.5 h-3.5 text-amber-400" /> Set Focus Minutes:
                        </span>
                        <div className="flex items-center gap-1 font-mono font-bold">
                          <button
                            onClick={() => updateFocusMinutes(customFocusMinutes - 5)}
                            disabled={isRunning || customFocusMinutes <= 5}
                            className="w-7 h-7 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 font-bold border border-amber-500/40 flex items-center justify-center transition-all hover:scale-110 active:scale-90 disabled:opacity-30"
                            title="-5 Minutes"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <input
                            type="number"
                            min="1"
                            max="300"
                            value={customFocusMinutes}
                            disabled={isRunning}
                            onChange={(e) => updateFocusMinutes(parseInt(e.target.value) || 1)}
                            className="w-14 text-center bg-slate-950 border-2 border-amber-500/50 rounded-xl py-1 text-sm font-mono font-black text-amber-300 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/40 shadow-inner"
                          />
                          <span className="text-slate-400 font-sans text-xs">min</span>
                          <button
                            onClick={() => updateFocusMinutes(customFocusMinutes + 5)}
                            disabled={isRunning || customFocusMinutes >= 300}
                            className="w-7 h-7 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 font-bold border border-amber-500/40 flex items-center justify-center transition-all hover:scale-110 active:scale-90 disabled:opacity-30"
                            title="+5 Minutes"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Preset Minute Chips */}
                      <div className="flex items-center justify-between gap-1 flex-wrap pt-1 border-t border-white/5">
                        {PRESET_MINUTES.map((mins) => (
                          <button
                            key={mins}
                            onClick={() => updateFocusMinutes(mins)}
                            disabled={isRunning}
                            className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition-all ${
                              customFocusMinutes === mins
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black border border-amber-400 shadow-md shadow-amber-500/30 scale-105'
                                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-white/10 hover:scale-105'
                            }`}
                          >
                            {mins}m
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Timer Display Circle */}
                  <div className="relative w-44 h-44 mx-auto mb-5 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <defs>
                        <linearGradient id="timer-amber-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#F59E0B" />
                          <stop offset="100%" stopColor="#EA580C" />
                        </linearGradient>
                      </defs>
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        className="stroke-slate-800/80"
                        strokeWidth="6"
                        fill="transparent"
                      />
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="42"
                        stroke="url(#timer-amber-gradient)"
                        strokeWidth="6"
                        strokeDasharray="263.89"
                        strokeDashoffset={263.89 - (263.89 * progressPercent) / 100}
                        strokeLinecap="round"
                        fill="transparent"
                        transition={{ duration: 0.5 }}
                      />
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-mono font-black tracking-tight text-white drop-shadow-[0_0_18px_rgba(245,158,11,0.6)]">
                        {formatTime(timeLeft)}
                      </span>
                      <span className="text-xs text-amber-400 font-semibold mt-1 capitalize flex items-center gap-1.5 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                        {mode === 'focus' ? <Sparkles className="w-3 h-3 text-amber-400 animate-spin-slow" /> : <Coffee className="w-3 h-3 text-emerald-400" />}
                        {mode === 'focus' ? `${customFocusMinutes} Min Focus` : TIMER_MODES[mode].label}
                      </span>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={resetTimer}
                      className="w-11 h-11 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/15 shadow-md flex items-center justify-center hover:rotate-180 transition-all cursor-pointer"
                      title="Reset Timer"
                    >
                      <RotateCcw className="w-4 h-4 text-slate-300" />
                    </button>

                    <button
                      onClick={toggleTimer}
                      className="px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:via-orange-400 hover:to-amber-500 text-slate-950 font-black text-sm flex items-center gap-2 shadow-xl shadow-amber-500/40 hover:shadow-amber-500/60 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                      {isRunning ? (
                        <>
                          <Pause className="w-4 h-4 fill-current" /> Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-current" /> Start Focus
                        </>
                      )}
                    </button>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 text-center text-xs text-slate-400 flex items-center justify-between">
                    <span>Completed today:</span>
                    <span className="font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">{sessionsCompleted} sessions ({sessionsCompleted * customFocusMinutes} mins)</span>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
