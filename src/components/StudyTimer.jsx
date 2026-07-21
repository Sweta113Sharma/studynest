import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, Clock, Coffee, Sparkles, X, Volume2, VolumeX, Plus, Minus, Settings2 } from 'lucide-react'

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
  const [showManualInput, setShowManualInput] = useState(false)

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
      const osc = audioCtx.createOscillator()
      const gain = audioCtx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3)
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5)
      osc.connect(gain)
      gain.connect(audioCtx.destination)
      osc.start()
      osc.stop(audioCtx.currentTime + 0.5)
    } catch (e) {
      console.log('Audio playback not supported or blocked')
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
    if (newMode === 'focus') {
      setTimeLeft(customFocusMinutes * 60)
    } else {
      setTimeLeft(TIMER_MODES[newMode].duration)
    }
  }

  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    setIsRunning(false)
    if (mode === 'focus') {
      setTimeLeft(customFocusMinutes * 60)
    } else {
      setTimeLeft(TIMER_MODES[mode].duration)
    }
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
        className={`px-3 py-1.5 rounded-xl glass-card text-xs font-mono font-bold flex items-center gap-2 hover:bg-white/10 transition-all border border-white/10 ${
          isRunning ? 'border-primary/50 shadow-glow-sm' : ''
        }`}
        title="Pomodoro Study Timer"
      >
        <Clock className={`w-3.5 h-3.5 ${isRunning ? 'animate-pulse text-primary' : 'text-muted-foreground'}`} />
        <span>{formatTime(timeLeft)}</span>
        {sessionsCompleted > 0 && (
          <span className="px-1.5 py-0.5 rounded-full bg-primary/20 text-primary text-[10px]">
            {sessionsCompleted}⚡
          </span>
        )}
      </button>

      {/* Popover / Floating Timer Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="absolute right-0 top-12 w-84 max-w-[92vw] glass-card rounded-2xl p-5 z-50 shadow-2xl border border-white/10"
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <h3 className="font-display font-bold text-sm">Focus Timer</h3>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setShowManualInput(!showManualInput)}
                    className={`p-1.5 rounded-lg transition-colors ${showManualInput ? 'bg-primary/20 text-primary' : 'hover:bg-white/10 text-muted-foreground hover:text-foreground'}`}
                    title="Set Custom Focus Duration"
                  >
                    <Settings2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
                    title={soundEnabled ? 'Disable alert sound' : 'Enable alert sound'}
                  >
                    {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Mode Tabs */}
              <div className="grid grid-cols-3 gap-1 bg-white/5 p-1 rounded-xl mb-4 text-xs font-medium">
                {Object.keys(TIMER_MODES).map((key) => (
                  <button
                    key={key}
                    onClick={() => switchMode(key)}
                    className={`py-1.5 rounded-lg transition-all ${
                      mode === key
                        ? 'bg-primary text-white font-bold shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {TIMER_MODES[key].label}
                  </button>
                ))}
              </div>

              {/* Manual Custom Focus Duration Bar */}
              {mode === 'focus' && (
                <div className="mb-4 bg-white/5 p-3 rounded-xl border border-white/10">
                  <div className="flex items-center justify-between text-xs font-medium mb-2">
                    <span className="text-muted-foreground">Focus Duration:</span>
                    <div className="flex items-center gap-1 font-mono font-bold text-primary">
                      <button
                        onClick={() => updateFocusMinutes(customFocusMinutes - 5)}
                        disabled={isRunning || customFocusMinutes <= 5}
                        className="p-1 rounded bg-white/10 hover:bg-white/20 disabled:opacity-30 transition-all text-foreground"
                        title="-5 Minutes"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <input
                        type="number"
                        min="1"
                        max="300"
                        value={customFocusMinutes}
                        disabled={isRunning}
                        onChange={(e) => updateFocusMinutes(parseInt(e.target.value) || 1)}
                        className="w-12 text-center bg-black/40 border border-primary/30 rounded py-0.5 text-xs font-mono font-bold text-primary focus:outline-none focus:border-primary"
                      />
                      <span>min</span>
                      <button
                        onClick={() => updateFocusMinutes(customFocusMinutes + 5)}
                        disabled={isRunning || customFocusMinutes >= 300}
                        className="p-1 rounded bg-white/10 hover:bg-white/20 disabled:opacity-30 transition-all text-foreground"
                        title="+5 Minutes"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Preset Minute Chips */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {PRESET_MINUTES.map((mins) => (
                      <button
                        key={mins}
                        onClick={() => updateFocusMinutes(mins)}
                        disabled={isRunning}
                        className={`px-2 py-1 rounded-lg text-[11px] font-mono transition-all ${
                          customFocusMinutes === mins
                            ? 'bg-primary/20 text-primary border border-primary/40 font-bold'
                            : 'bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground'
                        }`}
                      >
                        {mins}m
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Timer Display Circle */}
              <div className="relative w-44 h-44 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    className="stroke-white/10"
                    strokeWidth="6"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="42"
                    className="stroke-primary"
                    strokeWidth="6"
                    strokeDasharray="263.89"
                    strokeDashoffset={263.89 - (263.89 * progressPercent) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                    transition={{ duration: 0.5 }}
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-mono font-bold tracking-tight">
                    {formatTime(timeLeft)}
                  </span>
                  <span className="text-[11px] text-muted-foreground mt-1 capitalize flex items-center gap-1">
                    {mode === 'focus' ? <Sparkles className="w-3 h-3 text-primary" /> : <Coffee className="w-3 h-3 text-emerald-400" />}
                    {mode === 'focus' ? `${customFocusMinutes} Min Focus` : TIMER_MODES[mode].label}
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={resetTimer}
                  className="w-10 h-10 rounded-xl glass-card border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-4 h-4 text-muted-foreground" />
                </button>

                <button
                  onClick={toggleTimer}
                  className="px-6 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm flex items-center gap-2 hover:brightness-110 shadow-glow transition-all"
                >
                  {isRunning ? (
                    <>
                      <Pause className="w-4 h-4" /> Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" /> Start
                    </>
                  )}
                </button>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 text-center text-[11px] text-muted-foreground flex items-center justify-between">
                <span>Completed today:</span>
                <span className="font-bold text-primary">{sessionsCompleted} sessions ({sessionsCompleted * customFocusMinutes} mins)</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
