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

function TwinkleStar({ className, style }) {
  return (
    <svg className={`absolute text-white/40 fill-current pointer-events-none ${className}`} style={style} viewBox="0 0 24 24">
      <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4L12 0Z" />
    </svg>
  )
}

const STARS = [
  { top: '8%', left: '12%', size: 2.5, delay: 0.2 },
  { top: '18%', left: '72%', size: 2, delay: 0.8 },
  { top: '28%', left: '88%', size: 1.5, delay: 1.5 },
  { top: '48%', left: '8%', size: 3, delay: 1.2 },
  { top: '62%', left: '92%', size: 1.8, delay: 0.4 },
  { top: '78%', left: '18%', size: 2.2, delay: 2.1 },
  { top: '88%', left: '78%', size: 1.5, delay: 0.9 },
]

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
    <div className="min-h-screen relative flex flex-col justify-between p-4 md:p-6 lg:p-8 selection:bg-[#E52A7B]/20 bg-[#0C0518] text-slate-100 font-sans overflow-x-hidden">
      {/* Outer Starry Nebulae */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#482D7E]/20 blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#E52A7B]/10 blur-[120px]" />
      </div>

      {/* Navigation Header */}
      <header className="w-full max-w-7xl mx-auto relative flex items-center justify-center z-20 mb-6">
        <div className="flex items-center justify-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white dark:bg-slate-900 border-2 border-purple-500/20 p-1 flex items-center justify-center shadow-[0_0_20px_rgba(229,42,123,0.15)] overflow-hidden ring-4 ring-[#E52A7B]/10">
            <img src={logo} alt="StudyNest Logo" className="w-full h-full object-cover rounded-full" />
          </div>
        </div>

        {/* Dark Mode Toggle */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2">
          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className="backdrop-blur-md bg-white/5 dark:bg-white/5 border border-white/10 hover:border-purple-500/30 p-2.5 rounded-full text-slate-300 hover:text-[#E52A7B] transition-all duration-200 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-[#E52A7B] shadow-md cursor-pointer"
            aria-label={darkMode ? "Switch to Light Theme" : "Switch to Dark Theme"}
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-300" />
            )}
          </button>
        </div>
      </header>

      {/* Main Hero & Demo Section */}
      <main className="w-full max-w-5xl mx-auto flex-1 flex flex-col justify-center items-center z-10 py-4">
        {/* Outer Mockup Display Card representing the screenshot frame */}
        <div className="w-full max-w-4xl mx-auto min-h-[580px] md:aspect-[16/9.5] rounded-[24px] md:rounded-[36px] bg-gradient-to-br from-[#2D1B54] via-[#1D0F3C] to-[#12072B] border-4 md:border-8 border-[#170E30] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] relative flex items-center justify-center p-4 md:p-10 overflow-hidden">
          {/* Inner space container elements mimicking stars/dots */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {STARS.map((star, idx) => (
              <motion.div
                key={idx}
                className="absolute rounded-full bg-white"
                style={{
                  top: star.top,
                  left: star.left,
                  width: star.size,
                  height: star.size,
                }}
                animate={{
                  opacity: [0.15, 0.9, 0.15],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 4 + Math.random() * 3,
                  repeat: Infinity,
                  delay: star.delay,
                  ease: "easeInOut"
                }}
              />
            ))}
            <TwinkleStar className="w-4 h-4 top-[15%] left-[82%] animate-pulse" style={{ animationDuration: '4s' }} />
            <TwinkleStar className="w-5 h-5 top-[65%] left-[10%] animate-pulse" style={{ animationDuration: '6s' }} />
            <TwinkleStar className="w-3 h-3 top-[78%] left-[88%] animate-pulse" style={{ animationDuration: '5s' }} />
            <TwinkleStar className="w-4 h-4 top-[35%] left-[90%] animate-pulse" style={{ animationDuration: '7s' }} />
          </div>

          {/* Centralized Login Card Container */}
          <motion.div 
            className="w-full max-w-[370px] relative z-10 my-4"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="bg-white dark:bg-slate-950 rounded-[28px] shadow-[0_15px_35px_rgba(0,0,0,0.6)] overflow-hidden border border-white/5">
              
              {/* Top Space / Rocket Header Graphic */}
              <div className="relative w-full h-[180px] bg-gradient-to-b from-[#25134A] to-[#3B256C] overflow-hidden select-none">
                {/* Space Stars SVG & Planet/Moon */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  {/* Moon / Planet */}
                  <g transform="translate(140, 65)">
                    <circle cx="0" cy="0" r="32" fill="#583C8B" opacity="0.6" />
                    {/* Craters */}
                    <circle cx="-12" cy="-8" r="6" fill="#422B6B" opacity="0.8" />
                    <circle cx="8" cy="12" r="5" fill="#422B6B" opacity="0.8" />
                    <circle cx="-4" cy="16" r="3" fill="#422B6B" opacity="0.8" />
                    <circle cx="12" cy="-12" r="4" fill="#422B6B" opacity="0.8" />
                  </g>

                  {/* Sparkles */}
                  <path d="M80 30 L82 33 L85 34 L82 35 L80 38 L78 35 L75 34 L78 33 Z" fill="#ffffff" opacity="0.7" className="animate-pulse" />
                  <path d="M220 100 L222 103 L225 104 L222 105 L220 108 L218 105 L215 104 L218 103 Z" fill="#ffffff" opacity="0.6" className="animate-pulse" />
                  <path d="M50 80 L51 82 L53 83 L51 84 L50 86 L49 84 L47 83 L49 82 Z" fill="#ffffff" opacity="0.8" className="animate-pulse" />
                </svg>

                {/* Rocket SVG element (animated launch position) */}
                <div className="absolute right-[45px] top-[25px] w-[80px] h-[80px] pointer-events-none">
                  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_8px_12px_rgba(229,42,123,0.4)]">
                    {/* Fire Flame Trail */}
                    <path
                      d="M25,75 C20,80 10,95 20,95 C30,95 25,85 25,75 Z"
                      fill="url(#fireGrad)"
                    />
                    <path
                      d="M28,72 C25,76 17,85 24,85 C31,85 29,78 28,72 Z"
                      fill="#FFD700"
                    />
                    
                    {/* Rocket Fins */}
                    <path d="M25,60 L12,68 C10,70 12,74 16,72 L32,64 Z" fill="#E52A7B" />
                    <path d="M40,52 L48,36 C50,32 54,34 52,38 L44,56 Z" fill="#E52A7B" />
                    <path d="M28,68 L20,82 C18,85 22,87 25,84 L36,71 Z" fill="#E52A7B" />

                    {/* Rocket Body */}
                    <path
                      d="M20,65 C25,50 45,25 60,20 C55,35 30,55 20,65 Z"
                      fill="#FFFFFF"
                    />

                    {/* Nose Cone */}
                    <path
                      d="M50,30 C53,27 57,23 60,20 C57,27 53,37 50,30 Z"
                      fill="#E52A7B"
                    />

                    {/* Port Window */}
                    <circle cx="38" cy="42" r="4.5" fill="#A5F3FC" stroke="#E2E8F0" strokeWidth="1" />
                    
                    <defs>
                      <linearGradient id="fireGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFD700" />
                        <stop offset="50%" stopColor="#FF7F50" />
                        <stop offset="100%" stopColor="#E52A7B" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                {/* Rocket Exhaust Smoke Clouds */}
                <div className="absolute bottom-[-15px] left-[-20px] right-[-20px] h-[45px] flex items-end justify-between pointer-events-none z-10 opacity-95">
                  <div className="w-[100px] h-[65px] rounded-full bg-white dark:bg-slate-900 blur-[2px] transform translate-y-6 -rotate-12" />
                  <div className="w-[120px] h-[75px] rounded-full bg-white dark:bg-slate-900 blur-[1px] transform translate-y-4" />
                  <div className="w-[110px] h-[70px] rounded-full bg-white dark:bg-slate-900 blur-[3px] transform translate-y-6 rotate-12" />
                </div>
                
                {/* Wavy transition boundary */}
                <svg
                  className="absolute -bottom-[1px] left-0 w-full h-[65px] text-white dark:text-slate-900 fill-current z-20 pointer-events-none"
                  viewBox="0 0 400 100"
                  preserveAspectRatio="none"
                >
                  <path d="M0,25 C120,-10 200,90 400,70 L400,100 L0,100 Z" />
                </svg>
              </div>

              {/* Lower Form Fields Panel */}
              <div className="px-6 py-8 sm:px-8 space-y-6">
                {authMode === 'login' ? (
                  /* SIGN IN / LOGIN VIEW */
                  <div className="space-y-5">
                    <div className="text-center">
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-[#3B256C] dark:text-purple-300 tracking-tight">LOGIN</h2>
                      <p className="text-[10px] sm:text-xs font-bold text-[#E52A7B] tracking-[0.2em] mt-1">LANDING PAGE</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5 text-left">
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. rahul.cse@college.edu"
                          className="w-full bg-transparent border-b-2 border-slate-200 dark:border-slate-800 py-1.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400/60 focus:outline-none focus:border-[#E52A7B] dark:focus:border-[#E52A7B] transition-colors font-semibold"
                          required
                        />
                      </div>

                      {/* Visual Fields to Match screenshot (Remember & Forgot Password) */}
                      <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 font-semibold pt-1">
                        <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-600 dark:hover:text-slate-300 select-none">
                          <input 
                            type="checkbox" 
                            className="rounded text-[#E52A7B] focus:ring-[#E52A7B] border-slate-300 dark:border-slate-700 bg-transparent" 
                          />
                          <span>Remember</span>
                        </label>
                        <button 
                          type="button" 
                          onClick={() => alert("Please sign in with a demo email profile or create a new account!")}
                          className="hover:text-[#E52A7B] transition-colors cursor-pointer"
                        >
                          Forget Password ?
                        </button>
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
                        className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#E52A7B] to-[#F43F5E] hover:from-[#F43F5E] hover:to-[#E52A7B] text-white font-bold text-xs sm:text-sm tracking-wider uppercase shadow-lg shadow-pink-500/20 hover:shadow-pink-500/35 active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-50"
                      >
                        {isLoading ? "Signing In..." : "LOGIN"}
                      </button>
                    </form>

                    {/* Preset Profile Options */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-900 text-center">
                      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                        Or select a demo profile:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                        {PRESET_USERS.map((preset) => (
                          <button
                            key={preset.email}
                            type="button"
                            onClick={() => handleQuickDemo(preset)}
                            className="px-2.5 py-1.5 rounded-xl text-[11px] font-semibold bg-slate-50 dark:bg-slate-900/40 hover:bg-[#E52A7B]/10 text-slate-600 dark:text-slate-300 hover:text-[#E52A7B] border border-slate-200 dark:border-slate-800 transition-colors flex items-center justify-center gap-0.5 focus-visible:ring-2 focus-visible:ring-[#E52A7B] cursor-pointer"
                          >
                            <GraduationCap className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate">{preset.name.split(' ')[0]}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 text-center border-t border-slate-100 dark:border-slate-900">
                      <button
                        type="button"
                        onClick={() => { setAuthMode('signup'); setLoginError(''); }}
                        className="text-xs font-bold text-[#E52A7B] hover:text-[#F43F5E] hover:underline focus-visible:outline-none cursor-pointer transition-colors"
                      >
                        Create Account ?
                      </button>
                    </div>
                  </div>
                ) : (
                  /* SIGN UP / REGISTER VIEW (DEFAULT) */
                  <form onSubmit={handleSignup} className="space-y-4 text-left">
                    <div className="text-center">
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-[#3B256C] dark:text-purple-300 tracking-tight uppercase">Sign Up</h2>
                      <p className="text-[10px] sm:text-xs font-bold text-[#E52A7B] tracking-[0.2em] mt-1">CREATE ACCOUNT</p>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        placeholder="e.g. Sweta Sharma"
                        className="w-full bg-transparent border-b-2 border-slate-200 dark:border-slate-800 py-1.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400/60 focus:outline-none focus:border-[#E52A7B] dark:focus:border-[#E52A7B] transition-colors font-semibold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        placeholder="e.g. sweta@college.edu"
                        className="w-full bg-transparent border-b-2 border-slate-200 dark:border-slate-800 py-1.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400/60 focus:outline-none focus:border-[#E52A7B] dark:focus:border-[#E52A7B] transition-colors font-semibold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        Access Level / Role
                      </label>
                      <select
                        value={signupRole}
                        onChange={(e) => setSignupRole(e.target.value)}
                        className="w-full bg-transparent border-b-2 border-slate-200 dark:border-slate-800 py-1.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#E52A7B] transition-colors font-semibold cursor-pointer"
                      >
                        <option value="student" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Student / Learner</option>
                        <option value="admin" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Syllabus Admin</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={!signupName || !signupEmail || isLoading}
                      className="w-full mt-4 py-3.5 rounded-full bg-gradient-to-r from-[#E52A7B] to-[#F43F5E] hover:from-[#F43F5E] hover:to-[#E52A7B] text-white font-bold text-xs sm:text-sm tracking-wider uppercase shadow-lg shadow-pink-500/20 hover:shadow-pink-500/35 active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-pink-200 fill-current" />
                          <span>Register & Launch</span>
                        </>
                      )}
                    </button>

                    <div className="pt-2 text-center border-t border-slate-100 dark:border-slate-900">
                      <button
                        type="button"
                        onClick={() => { setAuthMode('login'); setLoginError(''); }}
                        className="text-xs font-bold text-[#E52A7B] hover:text-[#F43F5E] hover:underline focus-visible:outline-none cursor-pointer transition-colors"
                      >
                        Already have an account? Sign In
                      </button>
                    </div>
                  </form>
                )}
              </div>

            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto text-center z-20 pt-4">
        <p className="text-xs text-purple-400/60 font-medium">
          StudyNest B.Tech Hub &copy; {new Date().getFullYear()} • Engineered for Academic Excellence
        </p>
      </footer>
    </div>
  )
}