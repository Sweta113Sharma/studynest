import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Bell, Moon, Info, ExternalLink, Shield, Eye, EyeOff, Check } from 'lucide-react'
import { useState, useEffect } from 'react'
import { aiService } from '../services/aiService'

export default function SettingsModal({ isOpen, onClose, context }) {
  const { user, darkMode, setDarkMode } = context || {}

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

  const Toggle = ({ value, onChange }) => (
    <button
      onClick={() => onChange(!value)}
      className={`w-12 h-7 rounded-full transition-all relative ${value ? 'bg-primary' : 'bg-white/10'}`}
    >
      <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${value ? 'left-6' : 'left-1'}`} />
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-x-4 top-[10%] bottom-[10%] md:inset-x-auto md:left-1/2 md:top-1/2 md:bottom-auto md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl glass-card rounded-2xl z-50 overflow-hidden flex flex-col"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-xl font-display font-bold">Settings</h2>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-1 overflow-hidden">
              <div className="w-48 border-r border-white/5 p-4 hidden md:block">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all mb-1 ${
                      activeTab === tab.id
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="flex-1 p-6 overflow-y-auto">
                <div className="md:hidden flex gap-2 mb-6 overflow-x-auto pb-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                        activeTab === tab.id
                          ? 'bg-primary text-white'
                          : 'glass-card border border-white/5'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {activeTab === 'account' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-white/5 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl animated-gradient flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {user?.initials || 'ST'}
                      </div>
                      <div>
                        <p className="font-semibold">{user?.name || 'Student'}</p>
                        <p className="text-sm text-muted-foreground">{user?.email || '—'}</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider px-1 mb-2">OpenRouter API Key</p>
                      <div className="p-4 rounded-xl bg-white/5 space-y-3">
                        <p className="text-xs text-muted-foreground">
                          Enter your{' '}
                          <a href="https://openrouter.ai/keys" target="_blank" rel="noreferrer" className="text-primary hover:underline">
                            OpenRouter API key
                          </a>{' '}
                          to enable live AI features. Without it, built-in responses are used.
                        </p>
                        <div className="flex gap-2">
                          <div className="flex-1 relative">
                            <input
                              type={showKey ? 'text' : 'password'}
                              value={apiKey}
                              onChange={(e) => setApiKey(e.target.value)}
                              placeholder="sk-or-v1-..."
                              className="w-full px-4 py-2 pr-10 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                            <button
                              type="button"
                              onClick={() => setShowKey(!showKey)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                            >
                              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                          <button
                            onClick={handleSaveApiKey}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                              keySaved ? 'bg-emerald-500 text-white' : 'bg-primary text-white hover:brightness-110'
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
                      { label: 'Dark Mode', desc: 'Toggle dark/light theme', value: darkMode, onChange: setDarkMode },
                      { label: 'Animations', desc: 'Smooth transitions and motion effects', value: animations, onChange: setAnimations },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        className="flex items-center justify-between p-4 rounded-xl bg-white/5"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                        <Toggle value={item.value} onChange={item.onChange} />
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
                        className="flex items-center justify-between p-4 rounded-xl bg-white/5"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                        <Toggle value={item.value} onChange={item.onChange} />
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
                        className="flex items-center justify-between p-4 rounded-xl bg-white/5"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <p className="font-medium">{section.label}</p>
                        <p className="text-sm text-muted-foreground">{section.value}</p>
                      </motion.div>
                    ))}

                    <motion.div
                      className="p-6 rounded-xl glass-card border border-primary/20"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                          <Shield className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">StudyNest</h3>
                          <p className="text-xs text-muted-foreground">Your AI-Powered Study Companion</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Built for students everywhere. Features AI-generated notes, quizzes, and study
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