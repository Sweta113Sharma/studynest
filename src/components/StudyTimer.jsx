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

  // Shared timer body content (used in both full-page and popover)
  const timerBody = (
    <>
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
    </>
  )

  // ── COLOR THEMES — one picked randomly per mount ──
  const FOCUS_THEMES = [
    { name: 'Aurora',   bg: 'from-emerald-950 via-teal-900 to-cyan-950',   accent: '#34d399', accentRgb: '52,211,153',  btnBg: 'bg-emerald-500 hover:bg-emerald-600', pillBg: 'bg-emerald-500/15', pillBorder: 'border-emerald-500/30', pillText: 'text-emerald-300', cardBg: 'bg-emerald-950/60', borderColor: 'border-emerald-500/20', headlineColor: 'text-emerald-300', subText: 'text-emerald-200/70', tabActive: 'bg-emerald-500 text-white', tagBg: 'bg-emerald-500/12', tagText: 'text-emerald-300', tagBorder: 'border-emerald-500/25', completionGrad: 'from-emerald-500 to-emerald-700' },
    { name: 'Sunset',   bg: 'from-orange-950 via-rose-950 to-red-950',     accent: '#fb923c', accentRgb: '251,146,60',  btnBg: 'bg-orange-500 hover:bg-orange-600',  pillBg: 'bg-orange-500/15',  pillBorder: 'border-orange-500/30',  pillText: 'text-orange-300',  cardBg: 'bg-orange-950/60',  borderColor: 'border-orange-500/20',  headlineColor: 'text-orange-300',  subText: 'text-orange-200/70',  tabActive: 'bg-orange-500 text-white',  tagBg: 'bg-orange-500/12',  tagText: 'text-orange-300',  tagBorder: 'border-orange-500/25',  completionGrad: 'from-orange-500 to-orange-700' },
    { name: 'Cosmic',   bg: 'from-violet-950 via-purple-950 to-indigo-950', accent: '#a78bfa', accentRgb: '167,139,250', btnBg: 'bg-violet-500 hover:bg-violet-600',  pillBg: 'bg-violet-500/15',  pillBorder: 'border-violet-500/30',  pillText: 'text-violet-300',  cardBg: 'bg-violet-950/60',  borderColor: 'border-violet-500/20',  headlineColor: 'text-violet-300',  subText: 'text-violet-200/70',  tabActive: 'bg-violet-500 text-white',  tagBg: 'bg-violet-500/12',  tagText: 'text-violet-300',  tagBorder: 'border-violet-500/25',  completionGrad: 'from-violet-500 to-violet-700' },
    { name: 'Ocean',    bg: 'from-blue-950 via-sky-950 to-cyan-950',       accent: '#38bdf8', accentRgb: '56,189,248',  btnBg: 'bg-sky-500 hover:bg-sky-600',       pillBg: 'bg-sky-500/15',     pillBorder: 'border-sky-500/30',     pillText: 'text-sky-300',     cardBg: 'bg-sky-950/60',     borderColor: 'border-sky-500/20',     headlineColor: 'text-sky-300',     subText: 'text-sky-200/70',     tabActive: 'bg-sky-500 text-white',     tagBg: 'bg-sky-500/12',     tagText: 'text-sky-300',     tagBorder: 'border-sky-500/25',     completionGrad: 'from-sky-500 to-sky-700' },
    { name: 'Cherry',   bg: 'from-pink-950 via-rose-950 to-fuchsia-950',   accent: '#f472b6', accentRgb: '244,114,182', btnBg: 'bg-pink-500 hover:bg-pink-600',     pillBg: 'bg-pink-500/15',    pillBorder: 'border-pink-500/30',    pillText: 'text-pink-300',    cardBg: 'bg-pink-950/60',    borderColor: 'border-pink-500/20',    headlineColor: 'text-pink-300',    subText: 'text-pink-200/70',    tabActive: 'bg-pink-500 text-white',    tagBg: 'bg-pink-500/12',    tagText: 'text-pink-300',    tagBorder: 'border-pink-500/25',    completionGrad: 'from-pink-500 to-pink-700' },
    { name: 'Mint',     bg: 'from-teal-950 via-emerald-950 to-green-950',  accent: '#2dd4bf', accentRgb: '45,212,191',  btnBg: 'bg-teal-500 hover:bg-teal-600',     pillBg: 'bg-teal-500/15',    pillBorder: 'border-teal-500/30',    pillText: 'text-teal-300',    cardBg: 'bg-teal-950/60',    borderColor: 'border-teal-500/20',    headlineColor: 'text-teal-300',    subText: 'text-teal-200/70',    tabActive: 'bg-teal-500 text-white',    tagBg: 'bg-teal-500/12',    tagText: 'text-teal-300',    tagBorder: 'border-teal-500/25',    completionGrad: 'from-teal-500 to-teal-700' },
    { name: 'Amber',    bg: 'from-amber-950 via-yellow-950 to-orange-950', accent: '#fbbf24', accentRgb: '251,191,36',  btnBg: 'bg-amber-500 hover:bg-amber-600',   pillBg: 'bg-amber-500/15',   pillBorder: 'border-amber-500/30',   pillText: 'text-amber-300',   cardBg: 'bg-amber-950/60',   borderColor: 'border-amber-500/20',   headlineColor: 'text-amber-300',   subText: 'text-amber-200/70',   tabActive: 'bg-amber-500 text-white',   tagBg: 'bg-amber-500/12',   tagText: 'text-amber-300',   tagBorder: 'border-amber-500/25',   completionGrad: 'from-amber-500 to-amber-700' },
    { name: 'Midnight', bg: 'from-slate-950 via-zinc-900 to-neutral-950',  accent: '#94a3b8', accentRgb: '148,163,184', btnBg: 'bg-slate-500 hover:bg-slate-600',   pillBg: 'bg-slate-500/15',   pillBorder: 'border-slate-400/30',   pillText: 'text-slate-300',   cardBg: 'bg-slate-900/80',   borderColor: 'border-slate-400/20',   headlineColor: 'text-slate-200',   subText: 'text-slate-400',       tabActive: 'bg-slate-500 text-white',   tagBg: 'bg-slate-500/12',   tagText: 'text-slate-300',   tagBorder: 'border-slate-400/25',   completionGrad: 'from-slate-500 to-slate-700' },
  ]

  // Pick a random theme once on mount
  const [focusTheme] = useState(() => FOCUS_THEMES[Math.floor(Math.random() * FOCUS_THEMES.length)])

  // ── QUIRKY LINES — pick a random subset each mount, reveal one by one ──
  const ALL_QUIRKY_LINES = [
    { emoji: "🤫", text: "Shhhh, it's study time." },
    { emoji: "🧠", text: "Big brain mode: ON." },
    { emoji: "📵", text: "Phone? Never heard of it." },
    { emoji: "☕", text: "Fuelled by deadlines." },
    { emoji: "🔥", text: "No cap, we're grinding." },
    { emoji: "🦉", text: "The owl believes in you." },
    { emoji: "💀", text: "Exams don't care. Neither do we." },
    { emoji: "🚀", text: "Your future self said thanks." },
    { emoji: "😤", text: "Distraction? Blocked. Focus? Locked." },
    { emoji: "🎯", text: "One session at a time." },
    { emoji: "⚡", text: "Charging up that GPA." },
    { emoji: "🌙", text: "Late nights, big dreams." },
    { emoji: "🎧", text: "Headphones on. World off." },
    { emoji: "📚", text: "Stack those knowledge bricks." },
    { emoji: "💡", text: "Every page counts." },
    { emoji: "🏔️", text: "Climb that syllabus mountain." },
    { emoji: "🔒", text: "Lock in. Zone in. Win." },
    { emoji: "✨", text: "You're about to level up." },
  ]

  // Pick 3-5 random lines once on mount
  const [selectedLines] = useState(() => {
    const shuffled = [...ALL_QUIRKY_LINES].sort(() => Math.random() - 0.5)
    const count = 3 + Math.floor(Math.random() * 3) // 3 to 5
    return shuffled.slice(0, count)
  })

  // ── FULL-PAGE MODE: immersive themed layout ──
  if (isFullPage) {
    const t = focusTheme

    return (
      <div className={`w-full min-h-[calc(100vh-4rem)] bg-gradient-to-br ${t.bg} rounded-3xl relative overflow-hidden`}>
        {/* Animated glow orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl animate-pulse" style={{ background: `radial-gradient(circle, rgba(${t.accentRgb},0.15) 0%, transparent 70%)` }} />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full blur-3xl animate-pulse" style={{ background: `radial-gradient(circle, rgba(${t.accentRgb},0.1) 0%, transparent 70%)`, animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-30" style={{ background: `radial-gradient(circle, rgba(${t.accentRgb},0.06) 0%, transparent 60%)` }} />
        </div>

        <div className="relative z-10 w-full space-y-6 p-6 sm:p-8">

          {/* Staggered Quirky Lines */}
          <div className="text-center px-4 space-y-3 py-4">
            {selectedLines.map((line, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{
                  delay: 0.3 + idx * 0.5,
                  duration: 0.7,
                  type: 'spring',
                  stiffness: 120,
                  damping: 20,
                }}
                className={idx === 0 ? '' : 'mt-1'}
              >
                {idx === 0 ? (
                  <>
                    <div className="text-5xl sm:text-6xl mb-2">{line.emoji}</div>
                    <h1 className={`text-3xl sm:text-4xl md:text-5xl font-black font-display ${t.headlineColor} tracking-tight leading-tight`}>
                      {line.text}
                    </h1>
                  </>
                ) : (
                  <p className={`text-base sm:text-lg md:text-xl font-semibold ${t.subText} flex items-center justify-center gap-2`}>
                    <span className="text-2xl">{line.emoji}</span>
                    <span>{line.text}</span>
                  </p>
                )}
              </motion.div>
            ))}

            {/* Theme badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + selectedLines.length * 0.5, duration: 0.5 }}
              className="pt-2"
            >
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${t.pillBg} ${t.pillText} ${t.pillBorder} border`}>
                ✦ {t.name} Theme
              </span>
            </motion.div>
          </div>

          {/* Timer Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6, type: 'spring' }}
            className={`w-full ${t.cardBg} backdrop-blur-xl text-white rounded-3xl shadow-2xl border ${t.borderColor} overflow-hidden`}
          >
            {/* Top bar */}
            <div className={`flex items-center justify-between px-6 sm:px-8 py-5 border-b ${t.borderColor}`}>
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-2xl ${t.pillBg} border ${t.pillBorder}`}>
                  <Clock className={`w-5 h-5 ${t.pillText}`} />
                </div>
                <div>
                  <h2 className="font-display font-black text-lg text-white tracking-tight">Quiet Study Nest</h2>
                  <p className="text-[11px] font-semibold text-white/50">Distraction-free focus timer · complete sessions to build your streak</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {sessionsCompleted > 0 && (
                  <span className={`px-3 py-1 rounded-full ${t.pillBg} border ${t.pillBorder} ${t.pillText} text-xs font-bold`}>
                    {sessionsCompleted} ⚡ today
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`p-2 rounded-xl hover:${t.pillBg} text-white/60 transition-colors`}
                  aria-label={soundEnabled ? 'Disable alert sound' : 'Enable alert sound'}
                >
                  {soundEnabled ? <Volume2 className={`w-5 h-5 ${t.pillText}`} /> : <VolumeX className="w-5 h-5 text-white/40" />}
                </button>
              </div>
            </div>

            {/* Main two-column body */}
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-0 divide-y lg:divide-y-0 lg:divide-x ${t.borderColor}`}>

              {/* LEFT: Settings Panel */}
              <div className="p-6 sm:p-8 space-y-6">

                {/* Mode Tabs */}
                <div>
                  <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Timer Mode</p>
                  <div className={`grid grid-cols-3 gap-1.5 bg-white/5 p-1.5 rounded-2xl border ${t.borderColor} text-xs font-bold`}>
                    {Object.keys(TIMER_MODES).map((key) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => switchMode(key)}
                        className={`py-2 rounded-xl transition-all ${
                          mode === key
                            ? `${t.tabActive} font-bold shadow-sm`
                            : 'text-white/60 hover:text-white'
                        }`}
                      >
                        {TIMER_MODES[key].label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ambient Sound */}
                {mode === 'focus' && (
                  <div>
                    <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">🎧 Ambient Sound</p>
                    <div className="grid grid-cols-5 gap-1.5 text-[10px] font-bold">
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
                          onClick={() => { requestNotificationPermission(); setAmbientSound(snd.id); }}
                          className={`py-2 rounded-xl transition-all ${
                            ambientSound === snd.id
                              ? `${t.tabActive} shadow-sm`
                              : `bg-white/5 text-white/60 border ${t.borderColor} hover:text-white`
                          }`}
                        >
                          {snd.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Focus Minutes */}
                {mode === 'focus' && (
                  <div>
                    <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">⏱ Set Focus Duration</p>
                    <div className="flex items-center gap-2 mb-3">
                      <button
                        type="button"
                        onClick={() => updateFocusMinutes(customFocusMinutes - 5)}
                        disabled={isRunning || customFocusMinutes <= 5}
                        className={`w-9 h-9 rounded-xl ${t.pillBg} ${t.pillText} font-bold border ${t.pillBorder} flex items-center justify-center transition-all disabled:opacity-30`}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        type="number"
                        min="1"
                        max="300"
                        value={customFocusMinutes}
                        disabled={isRunning}
                        onChange={(e) => updateFocusMinutes(parseInt(e.target.value) || 1)}
                        className={`flex-1 text-center bg-white/5 border ${t.borderColor} rounded-xl py-2 text-xl font-mono font-black text-white focus:outline-none focus:ring-2`}
                        style={{ '--tw-ring-color': t.accent }}
                      />
                      <span className="text-sm text-white/40 font-semibold">min</span>
                      <button
                        type="button"
                        onClick={() => updateFocusMinutes(customFocusMinutes + 5)}
                        disabled={isRunning || customFocusMinutes >= 300}
                        className={`w-9 h-9 rounded-xl ${t.pillBg} ${t.pillText} font-bold border ${t.pillBorder} flex items-center justify-center transition-all disabled:opacity-30`}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {PRESET_MINUTES.map((mins) => (
                        <button
                          key={mins}
                          type="button"
                          onClick={() => updateFocusMinutes(mins)}
                          disabled={isRunning}
                          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                            customFocusMinutes === mins
                              ? `${t.tabActive} border border-transparent shadow-sm`
                              : `bg-white/5 text-white/70 border ${t.borderColor} hover:text-white`
                          }`}
                        >
                          {mins}m
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sessions stat */}
                <div className={`pt-2 border-t ${t.borderColor}`}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-white/40">Completed today</span>
                    <span className={`font-black ${t.tagText} ${t.tagBg} px-3 py-1 rounded-lg border ${t.tagBorder}`}>
                      {sessionsCompleted} sessions · {sessionsCompleted * customFocusMinutes} min
                    </span>
                  </div>
                </div>
              </div>

              {/* RIGHT: Timer Circle + Controls */}
              <div className="p-6 sm:p-8 flex flex-col items-center justify-center gap-8">

                {showCompletionModal ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-5 w-full max-w-sm"
                  >
                    <div className={`relative w-20 h-20 mx-auto flex items-center justify-center rounded-3xl bg-gradient-to-br ${t.completionGrad} shadow-xl text-4xl`}>
                      <span>🎉</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-white font-display">Focus Session Complete!</h4>
                      <p className="text-sm font-semibold text-white/50 mt-1">Great job! You stayed focused for {customFocusMinutes} minutes.</p>
                    </div>
                    <div className="space-y-3">
                      <button
                        type="button"
                        onClick={handleStartBreak}
                        className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all"
                      >
                        <Coffee className="w-4 h-4" /> Start 5-Min Short Break
                      </button>
                      <button
                        type="button"
                        onClick={handleKeepFocusGoing}
                        className={`w-full py-3.5 rounded-2xl ${t.btnBg} text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all`}
                      >
                        <Sparkles className="w-4 h-4" /> Keep Focus Going
                      </button>
                      <button
                        type="button"
                        onClick={handleDismissCompletion}
                        className={`w-full py-3 rounded-2xl bg-white/10 text-white/70 font-bold text-sm border ${t.borderColor} transition-colors hover:bg-white/15`}
                      >
                        Done for Now
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <>
                    {/* Large Timer Ring */}
                    <div className="relative w-64 h-64 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="44" className="stroke-white/10" strokeWidth="5" fill="transparent" />
                        <motion.circle
                          cx="50" cy="50" r="44"
                          stroke={t.accent}
                          strokeWidth="5"
                          strokeDasharray="276.46"
                          strokeDashoffset={276.46 - (276.46 * progressPercent) / 100}
                          strokeLinecap="round"
                          fill="transparent"
                          transition={{ duration: 0.5 }}
                          style={{ filter: `drop-shadow(0 0 8px rgba(${t.accentRgb},0.4))` }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-5xl sm:text-6xl font-mono font-black text-white tabular-nums">
                          {formatTime(timeLeft)}
                        </span>
                        <span className={`mt-2 text-xs ${t.pillText} font-bold capitalize flex items-center gap-1.5 ${t.pillBg} px-3 py-1 rounded-full border ${t.pillBorder}`}>
                          {mode === 'focus' ? `${customFocusMinutes} Min Focus` : TIMER_MODES[mode].label}
                        </span>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={resetTimer}
                        className={`w-12 h-12 rounded-2xl bg-white/10 text-white border ${t.borderColor} shadow-sm flex items-center justify-center hover:rotate-180 transition-all hover:bg-white/15`}
                        aria-label="Reset Timer"
                      >
                        <RotateCcw className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        onClick={toggleTimer}
                        className={`px-10 py-4 rounded-2xl ${t.btnBg} text-white font-black text-base flex items-center gap-2.5 shadow-lg hover:scale-105 active:scale-95 transition-all`}
                      >
                        {isRunning ? (
                          <><Pause className="w-5 h-5 fill-current" /> Pause</>
                        ) : (
                          <><Play className="w-5 h-5 fill-current" /> Start Focus</>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  // ── POPOVER MODE: pill button + floating popup ──
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

      {/* Popover Glass Timer Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 top-12 w-84 max-w-[92vw] glass-panel-morphism bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-5 z-50 shadow-2xl border border-slate-300 dark:border-white/15"
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
            {timerBody}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

