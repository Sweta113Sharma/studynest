import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, Clock, Coffee, Sparkles, X, Volume2, VolumeX, Plus, Minus, Settings2 } from 'lucide-react'
import { useApp } from '../context/AppContext'

const TIMER_MODES = {
  focus: { label: 'Focus', defaultDuration: 25 * 60, color: 'text-amber-600', bg: 'bg-amber-600' },
  shortBreak: { label: 'Short Break', duration: 5 * 60, color: 'text-emerald-600', bg: 'bg-emerald-600' },
  longBreak: { label: 'Long Break', duration: 15 * 60, color: 'text-violet-600', bg: 'bg-violet-600' }
}

const PRESET_MINUTES = [15, 25, 35, 45, 60, 90]

export default function StudyTimer({ isFullPage = false }) {
  const { logFocusSession, addXP } = useApp()
  const [isOpen, setIsOpen] = useState(isFullPage)
  const [mode, setMode] = useState('focus')
  const [customFocusMinutes, setCustomFocusMinutes] = useState(25)
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [sessionsCompleted, setSessionsCompleted] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [isShaking, setIsShaking] = useState(false)
  const [ambientSound, setAmbientSound] = useState('none')

  const timerRef = useRef(null)
  const popoverRef = useRef(null)
  const ambientAudioCtxRef = useRef(null)
  const ambientSourceRef = useRef(null)

  useEffect(() => {
    if (isRunning && ambientSound !== 'none') {
      startAmbientSound();
    } else {
      stopAmbientSound();
    }
    return () => stopAmbientSound();
  }, [isRunning, ambientSound])

  const requestNotificationPermission = () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }

  const showNotification = (title, body) => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body });
    }
  }

  const startAmbientSound = () => {
    try {
      stopAmbientSound();
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      ambientAudioCtxRef.current = ctx;

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.18, ctx.currentTime);
      gainNode.connect(ctx.destination);

      if (ambientSound === 'white' || ambientSound === 'brown' || ambientSound === 'rain') {
        const bufferSize = 2 * ctx.sampleRate;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let lastOut = 0.0;
        
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          if (ambientSound === 'white') {
            data[i] = white;
          } else {
            data[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = data[i];
            data[i] *= 3.5;
          }
        }

        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;

        if (ambientSound === 'rain') {
          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(800, ctx.currentTime);
          source.connect(filter);
          filter.connect(gainNode);
        } else {
          source.connect(gainNode);
        }
        
        source.start(0);
        ambientSourceRef.current = source;
      } else if (ambientSound === 'binaural') {
        const oscL = ctx.createOscillator();
        const oscR = ctx.createOscillator();
        oscL.type = 'sine';
        oscL.frequency.setValueAtTime(100, ctx.currentTime);
        oscR.type = 'sine';
        oscR.frequency.setValueAtTime(104, ctx.currentTime);

        const pannerL = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
        const pannerR = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

        if (pannerL && pannerR) {
          pannerL.pan.setValueAtTime(-1, ctx.currentTime);
          pannerR.pan.setValueAtTime(1, ctx.currentTime);
          oscL.connect(pannerL);
          oscR.connect(pannerR);
          pannerL.connect(gainNode);
          pannerR.connect(gainNode);
        } else {
          oscL.connect(gainNode);
          oscR.connect(gainNode);
        }

        oscL.start(0);
        oscR.start(0);

        ambientSourceRef.current = {
          stop: () => {
            try { oscL.stop(); oscR.stop(); } catch(e){}
          }
        };
      }
    } catch (e) {
      console.warn("Failed to start ambient audio synthesis:", e);
    }
  }

  const stopAmbientSound = () => {
    try {
      if (ambientSourceRef.current) {
        ambientSourceRef.current.stop();
        ambientSourceRef.current = null;
      }
      if (ambientAudioCtxRef.current) {
        ambientAudioCtxRef.current.close();
        ambientAudioCtxRef.current = null;
      }
    } catch (e) {}
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

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
            setIsShaking(true)
            playAlert()
            setTimeout(() => setIsShaking(false), 2500)

            if (mode === 'focus') {
              const newCount = sessionsCompleted + 1
              setSessionsCompleted(newCount)
              localStorage.setItem('studynest_timer_sessions', newCount.toString())
              logFocusSession()
              addXP(25, 'Finished 25-min study session')
              showNotification("Focus Session Complete! ⚡", "Awesome job! Ready for a well-deserved break?")
              setIsOpen(true)
              setShowCompletionModal(true)
            } else {
              showNotification("Break Over! 📚", "Time to get back to focus. You got this!")
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

      const notes = [
        { freq: 523.25, time: now + 0.00, duration: 0.18, vol: 0.85 },
        { freq: 659.25, time: now + 0.12, duration: 0.18, vol: 0.85 },
        { freq: 783.99, time: now + 0.24, duration: 0.22, vol: 0.90 },
        { freq: 1046.50, time: now + 0.38, duration: 0.35, vol: 0.95 },
        { freq: 659.25, time: now + 0.70, duration: 0.18, vol: 0.85 },
        { freq: 1046.50, time: now + 0.82, duration: 0.22, vol: 0.90 },
        { freq: 1318.51, time: now + 0.96, duration: 0.25, vol: 0.95 },
        { freq: 1567.98, time: now + 1.12, duration: 0.55, vol: 1.00 }
      ]

      notes.forEach(({ freq, time, duration, vol }) => {
        const osc1 = audioCtx.createOscillator()
        const osc2 = audioCtx.createOscillator()
        const gain = audioCtx.createGain()

        osc1.type = 'triangle'
        osc1.frequency.setValueAtTime(freq, time)

        osc2.type = 'square'
        osc2.frequency.setValueAtTime(freq * 1.002, time)

        gain.gain.setValueAtTime(0, time)
        gain.gain.linearRampToValueAtTime(vol * 0.75, time + 0.015)
        gain.gain.exponentialRampToValueAtTime(0.001, time + duration)

        osc1.connect(gain)
        osc2.connect(gain)
        gain.connect(audioCtx.destination)

        osc1.start(time)
        osc2.start(time)
        osc1.stop(time + duration)
        osc2.stop(time + duration)
      })
    } catch (e) {
      console.log('Audio playback context', e)
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
    <div className="relative" ref={popoverRef}>
      {/* Header Pill Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/50 transition-all border border-emerald-200 dark:border-emerald-500/30 shadow-2xs focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer ${
          isShaking ? 'animate-timer-shake border-emerald-500 ring-4 ring-emerald-500/40' : isRunning ? 'border-emerald-500 ring-2 ring-emerald-500/30' : ''
        }`}
        aria-label={`Study Timer: ${formatTime(timeLeft)}`}
      >
        <Clock className={`w-3.5 h-3.5 ${isRunning || isShaking ? 'animate-pulse text-emerald-600' : 'text-emerald-600'}`} />
        <span className="font-mono tracking-wide">{formatTime(timeLeft)}</span>
        {sessionsCompleted > 0 && (
          <span className="px-1.5 py-0.2 rounded-full bg-emerald-200/60 dark:bg-emerald-800/60 text-emerald-900 dark:text-emerald-100 text-[10px] font-bold">
            {sessionsCompleted}⚡
          </span>
        )}
      </button>

      {/* Popover Light Glass Timer Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`absolute right-0 top-12 w-84 max-w-[92vw] glass-panel-morphism bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-5 z-50 shadow-2xl border border-slate-300 dark:border-white/15`}
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30">
                  <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-sm text-slate-900 dark:text-white tracking-wide">Focus Timer</h3>
                  <p className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">Boost your study productivity</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-1.5 rounded-xl glass-pill-badge hover:bg-amber-500/10 text-slate-700 dark:text-slate-300 transition-colors focus-visible:ring-2 focus-visible:ring-amber-500"
                  aria-label={soundEnabled ? 'Disable alert sound' : 'Enable alert sound'}
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-600 dark:text-amber-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-xl glass-pill-badge hover:bg-amber-500/10 text-slate-700 dark:text-slate-300 transition-colors focus-visible:ring-2 focus-visible:ring-amber-500"
                  aria-label="Close Timer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {showCompletionModal ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-3 text-center space-y-4"
              >
                <div className="relative w-16 h-16 mx-auto flex items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 shadow-xl text-3xl">
                  <span>🎉</span>
                </div>

                <div>
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white font-display">Focus Session Complete!</h4>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">Great job! You stayed focused for {customFocusMinutes} minutes.</p>
                </div>

                <div className="space-y-2.5 pt-2">
                  <button
                    type="button"
                    onClick={handleStartBreak}
                    className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all focus-visible:ring-2 focus-visible:ring-amber-500"
                  >
                    <Coffee className="w-4 h-4" /> Start 5-Min Short Break
                  </button>

                  <button
                    type="button"
                    onClick={handleKeepFocusGoing}
                    className="w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all focus-visible:ring-2 focus-visible:ring-amber-500"
                  >
                    <Sparkles className="w-4 h-4" /> Keep Focus Going (Restart Timer)
                  </button>

                  <button
                    type="button"
                    onClick={handleDismissCompletion}
                    className="w-full py-2.5 rounded-2xl glass-pill-badge text-slate-700 dark:text-slate-300 font-bold text-xs border border-slate-300 dark:border-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-amber-500"
                  >
                    Done for Now
                  </button>
                </div>
              </motion.div>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-300 dark:border-white/10 mb-4 text-xs font-bold">
                  {Object.keys(TIMER_MODES).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => switchMode(key)}
                      className={`py-1.5 rounded-xl transition-all focus-visible:ring-2 focus-visible:ring-amber-500 ${
                        mode === key
                          ? 'bg-amber-600 text-white font-bold shadow-sm'
                          : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {TIMER_MODES[key].label}
                    </button>
                  ))}
                </div>

                {mode === 'focus' && (
                  <div className="mb-4 glass-card bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-amber-500/20">
                    {/* Ambient Focus Sound Selector */}
                    <div className="mb-3.5 pb-3 border-b border-slate-200 dark:border-white/10">
                      <div className="flex items-center justify-between mb-2 text-xs font-semibold">
                        <span className="text-slate-900 dark:text-white font-bold flex items-center gap-1.5">
                          🎧 Ambient Focus Audio:
                        </span>
                      </div>
                      <div className="grid grid-cols-5 gap-1 text-[9px] font-bold">
                        {[
                          { id: 'none', label: 'Off' },
                          { id: 'white', label: 'White' },
                          { id: 'brown', label: 'Brown' },
                          { id: 'rain', label: 'Rain' },
                          { id: 'binaural', label: 'Binaural' }
                        ].map(snd => (
                          <button
                            key={snd.id}
                            type="button"
                            onClick={() => {
                              requestNotificationPermission();
                              setAmbientSound(snd.id);
                            }}
                            className={`py-1 rounded-lg transition-all focus-visible:ring-1 focus-visible:ring-amber-500 ${
                              ambientSound === snd.id
                                ? 'bg-amber-600 text-white shadow-sm'
                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/5 hover:border-amber-500/20'
                            }`}
                          >
                            {snd.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs font-semibold mb-2.5">
                      <span className="text-slate-900 dark:text-white font-bold flex items-center gap-1.5">
                        <Settings2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Set Focus Minutes:
                      </span>
                      <div className="flex items-center gap-1 font-mono font-bold">
                        <button
                          type="button"
                          onClick={() => updateFocusMinutes(customFocusMinutes - 5)}
                          disabled={isRunning || customFocusMinutes <= 5}
                          className="w-7 h-7 rounded-xl bg-amber-500/15 text-amber-800 dark:text-amber-300 font-bold border border-amber-500/30 flex items-center justify-center transition-all disabled:opacity-30 focus-visible:ring-2 focus-visible:ring-amber-500"
                          aria-label="Decrease focus time by 5 minutes"
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
                          className="w-14 text-center bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl py-1 text-sm font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                          aria-label="Custom focus minutes"
                        />
                        <span className="text-slate-700 dark:text-slate-300 font-sans text-xs">min</span>
                        <button
                          type="button"
                          onClick={() => updateFocusMinutes(customFocusMinutes + 5)}
                          disabled={isRunning || customFocusMinutes >= 300}
                          className="w-7 h-7 rounded-xl bg-amber-500/15 text-amber-800 dark:text-amber-300 font-bold border border-amber-500/30 flex items-center justify-center transition-all disabled:opacity-30 focus-visible:ring-2 focus-visible:ring-amber-500"
                          aria-label="Increase focus time by 5 minutes"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-1 flex-wrap pt-1 border-t border-slate-200 dark:border-white/10">
                      {PRESET_MINUTES.map((mins) => (
                        <button
                          key={mins}
                          type="button"
                          onClick={() => updateFocusMinutes(mins)}
                          disabled={isRunning}
                          className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition-all focus-visible:ring-2 focus-visible:ring-amber-500 ${
                            customFocusMinutes === mins
                              ? 'bg-amber-600 text-white font-bold border border-amber-500 shadow-sm'
                              : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-white/10'
                          }`}
                        >
                          {mins}m
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="relative w-44 h-44 mx-auto mb-5 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      className="stroke-slate-200 dark:stroke-slate-800"
                      strokeWidth="6"
                      fill="transparent"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="42"
                      stroke="#D97706"
                      strokeWidth="6"
                      strokeDasharray="263.89"
                      strokeDashoffset={263.89 - (263.89 * progressPercent) / 100}
                      strokeLinecap="round"
                      fill="transparent"
                      transition={{ duration: 0.5 }}
                    />
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-mono font-black text-slate-900 dark:text-white">
                      {formatTime(timeLeft)}
                    </span>
                    <span className="text-xs text-amber-800 dark:text-amber-300 font-bold mt-1 capitalize flex items-center gap-1.5 bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                      {mode === 'focus' ? `${customFocusMinutes} Min Focus` : TIMER_MODES[mode].label}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={resetTimer}
                    className="w-11 h-11 rounded-2xl glass-pill-badge bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-white/15 shadow-sm flex items-center justify-center hover:rotate-180 transition-all cursor-pointer hover:bg-amber-500/10 focus-visible:ring-2 focus-visible:ring-amber-500"
                    aria-label="Reset Timer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={toggleTimer}
                    className="px-8 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm flex items-center gap-2 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-500"
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

                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/10 text-center text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Completed today:</span>
                  <span className="font-bold text-amber-800 dark:text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded-lg border border-amber-500/30">{sessionsCompleted} sessions ({sessionsCompleted * customFocusMinutes} mins)</span>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
