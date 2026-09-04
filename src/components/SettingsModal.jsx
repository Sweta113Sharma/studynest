import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Bell, Moon, Info, Eye, EyeOff, Check, Shield } from 'lucide-react'
import { useState, useEffect } from 'react'
import { aiService } from '../services/aiService'
import { useApp } from '../context/AppContext'

export default function SettingsModal({ isOpen, onClose }) {
  const { user } = useApp()


  const [activeTab, setActiveTab] = useState('account')
  const [apiKey, setApiKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [keySaved, setKeySaved] = useState(false)
  const [animations, setAnimations] = useState(true)
  const [studyReminders, setStudyReminders] = useState(true)
  const [quizAlerts, setQuizAlerts] = useState(true)
  const [weeklyProgress, setWeeklyProgress] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setApiKey(localStorage.getItem('studynest_openrouter_key') || '')
    }
  }, [isOpen])

  const handleSaveApiKey = () => {
    aiService.setApiKey(apiKey.trim())
    setKeySaved(true)
    setTimeout(() => setKeySaved(false), 2000)
  }

  const Toggle = ({ value, onChange, label }) => (
    <button
      type="button"
      onClick={() => onChange(!value)}
      aria-label={`Toggle ${label}`}
      className={`w-12 h-7 rounded-full transition-all relative focus-visible:ring-2 focus-visible:ring-amber-500 ${value ? 'bg-amber-600' : 'bg-slate-300 dark:bg-slate-800'}`}
    >
      <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all shadow-md ${value ? 'left-6' : 'left-1'}`} />
    </button>
  )

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Moon },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'about', label: 'About', icon: Info }
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-x-4 top-[10%] bottom-[10%] md:inset-x-auto md:left-1/2 md:top-1/2 md:bottom-auto md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl glass-card bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl z-50 overflow-hidden flex flex-col border border-slate-300 dark:border-white/15"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            role="dialog"
            aria-labelledby="settings-title"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-300 dark:border-white/10">
              <h2 id="settings-title" className="text-xl font-display font-black">Settings</h2>
              <button
                type="button"
                onClick={onClose}
                className="w-10 h-10 rounded-xl hover:bg-slate-200 dark:hover:bg-white/10 flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-amber-500 text-slate-700 dark:text-slate-300"
                aria-label="Close Settings"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-1 overflow-hidden">
              <div className="w-48 border-r border-slate-300 dark:border-white/10 p-4 hidden md:block">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all mb-1 font-bold text-sm focus-visible:ring-2 focus-visible:ring-amber-500 ${
                      activeTab === tab.id
                        ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              <div className="flex-1 p-6 overflow-y-auto">
                <div className="md:hidden flex gap-2 mb-6 overflow-x-auto pb-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-amber-500 ${
                        activeTab === tab.id
                          ? 'bg-amber-600 text-white'
                          : 'glass-card border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {activeTab === 'account' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center gap-3 border border-slate-300 dark:border-slate-700">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-base">{user?.name || 'Student'}</p>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{user?.email || '—'}</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider px-1 mb-2">OpenRouter API Key</p>
                      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 space-y-3">
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Enter your{' '}
                          <a href="https://openrouter.ai/keys" target="_blank" rel="noreferrer" className="text-amber-700 dark:text-amber-400 font-bold hover:underline">
                            OpenRouter API key
                          </a>{' '}
                          to enable live AI features. Without it, built-in study notes are used.
                        </p>
                        <div className="flex gap-2">
                          <div className="flex-1 relative">
                            <input
                              type={showKey ? 'text' : 'password'}
                              value={apiKey}
                              onChange={(e) => setApiKey(e.target.value)}
                              placeholder="sk-or-v1-..."
                              className="w-full px-4 py-2 pr-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                              aria-label="OpenRouter API Key"
                            />
                            <button
                              type="button"
                              onClick={() => setShowKey(!showKey)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg"
                              aria-label={showKey ? "Hide API key" : "Show API key"}
                            >
                              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={handleSaveApiKey}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-amber-500 ${
                              keySaved ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white hover:bg-amber-700'
                            }`}
                          >
                            {keySaved ? <><Check className="w-4 h-4" /> Saved!</> : 'Save'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'appearance' && (
                  <div className="space-y-4">
                    {[
                      { label: 'Animations', desc: 'Smooth transitions and motion effects', value: animations, onChange: setAnimations },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        className="flex items-center justify-between p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white text-sm">{item.label}</p>
                          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{item.desc}</p>
                        </div>
                        <Toggle value={item.value} onChange={item.onChange} label={item.label} />
                      </motion.div>
                    ))}
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="space-y-4">
                    {[
                      { label: 'Study Reminders', desc: 'Daily study session prompts', value: studyReminders, onChange: setStudyReminders },
                      { label: 'Quiz Alerts', desc: 'Reminders to practice quizzes', value: quizAlerts, onChange: setQuizAlerts },
                      { label: 'Weekly Progress', desc: 'Weekly summary of your progress', value: weeklyProgress, onChange: setWeeklyProgress },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        className="flex items-center justify-between p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white text-sm">{item.label}</p>
                          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{item.desc}</p>
                        </div>
                        <Toggle value={item.value} onChange={item.onChange} label={item.label} />
                      </motion.div>
                    ))}
                  </div>
                )}

                {activeTab === 'about' && (
                  <div className="space-y-4">
                    {[
                      { label: 'Version', value: '1.0.0' },
                      { label: 'Built with', value: 'React + Vite + Tailwind' },
                      { label: 'AI Provider', value: 'OpenRouter' },
                    ].map((section, i) => (
                      <motion.div
                        key={i}
                        className="flex items-center justify-between p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <p className="font-bold text-slate-900 dark:text-white text-sm">{section.label}</p>
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{section.value}</p>
                      </motion.div>
                    ))}

                    <motion.div
                      className="p-6 rounded-xl glass-card border border-amber-500/30"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                          <Shield className="w-5 h-5 text-amber-700 dark:text-amber-400" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 dark:text-white">StudyNest</h3>
                          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Your AI-Powered Study Companion</p>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                        Built for engineering students. Features AI-generated notes, quizzes, and study
                        materials to help you ace your exams.
                      </p>
                    </motion.div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}