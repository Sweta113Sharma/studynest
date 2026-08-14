import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Mail, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Sun, 
  Moon, 
  GraduationCap, 
  BookOpen, 
  Cpu,
  Clock,
  HelpCircle,
  PlayCircle,
  AlertCircle
} from 'lucide-react'
import logo from '../assets/logo.png'
import { useApp } from '../context/AppContext'

const PRESET_USERS = [
  { name: 'Rahul Sharma', email: 'rahul.cse@college.edu', branch: 'CSE', role: 'student' },
  { name: 'Priya Verma', email: 'priya.ece@college.edu', branch: 'ECE', role: 'student' },
  { name: 'Prof. S. Sharma', email: 'sweta.admin@college.edu', branch: 'CSE', role: 'admin' }
]

export default function LoginScreen() {
  const { handleLogin, darkMode, setDarkMode, usersDb, registerUser } = useApp()
  const [authMode, setAuthMode] = useState('signup') // 'signup' or 'login'
  
  // Custom Login States
  const [email, setEmail] = useState('')
  const [loginError, setLoginError] = useState('')

  // Sign Up / Create Account States
  const [signupName, setSignupName] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupBranch, setSignupBranch] = useState('CSE')
  const [signupRole, setSignupRole] = useState('student')

  const [isLoading, setIsLoading] = useState(false)

  const handleQuickDemo = async (preset = PRESET_USERS[0]) => {
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 400))
    const userData = {
      email: preset.email,
      name: preset.name,
      branch: preset.branch,
      role: preset.role,
      initials: preset.name.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2)
    }
    handleLogin(userData)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return
    setLoginError('')

    const presetUser = PRESET_USERS.find(u => u.email.toLowerCase() === email.trim().toLowerCase())
    if (presetUser) {
      setIsLoading(true)
      await new Promise(r => setTimeout(r, 500))
      handleLogin({
        email: presetUser.email,
        name: presetUser.name,
        branch: presetUser.branch,
        role: presetUser.role,
        initials: presetUser.name.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2)
      })
      return
    }

    const customUser = usersDb.find(u => u.email.toLowerCase() === email.trim().toLowerCase())
    if (customUser) {
      setIsLoading(true)
      await new Promise(r => setTimeout(r, 500))
      handleLogin({
        email: customUser.email,
        name: customUser.name,
        branch: customUser.branch,
        role: customUser.role,
        initials: customUser.name.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2)
      })
      return
    }

    setLoginError("Account not found. Please click 'Create Account' at the bottom to register!")
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    if (!signupName || !signupEmail) return

    const emailExists = PRESET_USERS.some(u => u.email.toLowerCase() === signupEmail.trim().toLowerCase()) ||
                        usersDb.some(u => u.email.toLowerCase() === signupEmail.trim().toLowerCase())
    if (emailExists) {
      alert("This email is already registered. Please sign in instead!")
      setAuthMode('login')
      setEmail(signupEmail)
      return
    }

    setIsLoading(true)
    await new Promise(r => setTimeout(r, 600))

    const newProfile = {
      name: signupName.trim(),
      email: signupEmail.trim().toLowerCase(),
      branch: signupBranch,
      role: signupRole,
      initials: signupName.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2)
    }

    registerUser(newProfile)
    handleLogin(newProfile)
  }

  return (
    <div className="min-h-screen relative flex flex-col justify-between p-4 md:p-8 lg:p-12 selection:bg-amber-500/20">
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-tr from-amber-600/25 to-amber-400/15 rounded-full blur-[100px]" />
        <div className="absolute top-1/3 -right-40 w-[30rem] h-[30rem] bg-gradient-to-br from-amber-700/15 via-orange-500/10 to-yellow-400/10 rounded-full blur-[120px]" />
      </div>

      {/* Navigation Header */}
      <header className="w-full max-w-7xl mx-auto flex items-center justify-between z-20 mb-8">
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="w-11 h-11 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/20 p-0.5 flex items-center justify-center shadow-lg overflow-hidden">
              <img src={logo} alt="StudyNest Logo" className="w-full h-full object-cover rounded-xl" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
              Study<span className="text-amber-600 dark:text-amber-400">Nest</span>
            </span>
            <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
              B.Tech Engineering Hub
            </span>
          </div>
        </div>

        {/* Dark Mode Toggle */}
        <button
          type="button"
          onClick={() => setDarkMode(!darkMode)}
          className="glass-pill-badge p-2.5 rounded-full text-slate-900 dark:text-white hover:text-amber-600 transition-all duration-200 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-amber-500 shadow-md cursor-pointer"
          aria-label={darkMode ? "Switch to Light Theme" : "Switch to Dark Theme"}
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5 text-slate-700" />
          )}
        </button>
      </header>

      {/* Main Hero & Demo Section */}
      <main className="w-full max-w-5xl mx-auto flex-1 flex flex-col justify-center items-center z-10 py-6">
        {/* Hero Interactive Card Container */}
        <motion.div 
          className="w-full max-w-xl mx-auto"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="glass-panel-morphism rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-300 dark:border-white/20">
            {authMode === 'login' ? (
              /* SIGN IN / LOGIN VIEW */
              <div className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                  <div className="text-center">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Sign In to Your Workspace</h3>
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold">Enter your registered email address to access your portal</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. rahul.cse@college.edu"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold"
                      required
                    />
                  </div>
                  {loginError && (
                    <p className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{loginError}</span>
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={!email || isLoading}
                    className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </button>
                </form>

                {/* Preset Profile Options */}
                <div className="pt-4 border-t border-slate-200 dark:border-white/10 text-center">
                  <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-3">
                    Or select a demo profile:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {PRESET_USERS.map((preset) => (
                      <button
                        key={preset.email}
                        type="button"
                        onClick={() => handleQuickDemo(preset)}
                        className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800/80 hover:bg-amber-500/10 text-slate-900 dark:text-slate-100 hover:text-amber-600 border border-slate-300 dark:border-slate-700 transition-colors flex items-center justify-center gap-1 focus-visible:ring-2 focus-visible:ring-amber-500 cursor-pointer"
                      >
                        <GraduationCap className="w-3.5 h-3.5 font-bold" />
                        <span className="truncate">{preset.name.split(' ')[0]} ({preset.role === 'admin' ? 'Admin' : preset.branch})</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 text-center border-t border-slate-200 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => { setAuthMode('signup'); setLoginError(''); }}
                    className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline focus-visible:outline-none cursor-pointer"
                  >
                    New to StudyNest? Create a new account
                  </button>
                </div>
              </div>
            ) : (
              /* SIGN UP / REGISTER VIEW (DEFAULT) */
              <form onSubmit={handleSignup} className="space-y-4 text-left">
                <div className="text-center">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Create a New Account</h3>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold font-sans">Get instant B.Tech notes, Pomodoro ambient timers & AI quizzes</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="e.g. Sweta Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="e.g. sweta@college.edu"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Primary Branch
                    </label>
                    <select
                      value={signupBranch}
                      onChange={(e) => setSignupBranch(e.target.value)}
                      className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="CSE">CSE (Computer Science)</option>
                      <option value="ECE">ECE (Electronics)</option>
                      <option value="IT">IT (Information Tech)</option>
                      <option value="ME">ME (Mechanical)</option>
                      <option value="CE">CE (Civil)</option>
                      <option value="EE">EE (Electrical)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Access Level / Role
                    </label>
                    <select
                      value={signupRole}
                      onChange={(e) => setSignupRole(e.target.value)}
                      className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="student">Student / Learner</option>
                      <option value="admin">Syllabus Admin</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!signupName || !signupEmail || isLoading}
                  className="w-full mt-4 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-1.5 focus-visible:ring-2 focus-visible:ring-amber-500 cursor-pointer"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300 fill-current" />
                      <span>Register & Launch Suite</span>
                    </>
                  )}
                </button>

                <div className="pt-2 text-center border-t border-slate-200 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => { setAuthMode('login'); setLoginError(''); }}
                    className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline focus-visible:outline-none cursor-pointer"
                  >
                    Already have an account? Sign In
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>

        {/* Core Pillars Feature Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 w-full max-w-4xl">
          <article className="p-5 rounded-2xl glass-card border border-slate-300 dark:border-white/10 flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Smart Unit Notes</h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">
                Structured B.Tech engineering syllabus with detailed unit summaries and topics.
              </p>
            </div>
          </article>

          <article className="p-5 rounded-2xl glass-card border border-slate-300 dark:border-white/10 flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Focus Pomodoro</h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">
                Built-in study timer with alarm sounds and progress tracking to keep focus.
              </p>
            </div>
          </article>

          <article className="p-5 rounded-2xl glass-card border border-slate-300 dark:border-white/10 flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">AI & Quizzes</h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">
                Interactive self-assessment quizzes and AI assistant support for engineering concepts.
              </p>
            </div>
          </article>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto text-center z-20 pt-6">
        <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
          StudyNest B.Tech Hub &copy; {new Date().getFullYear()} • Engineered for Academic Excellence
        </p>
      </footer>
    </div>
  )
}