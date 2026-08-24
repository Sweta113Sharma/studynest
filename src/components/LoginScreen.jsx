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
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react'
import { useApp } from '../context/AppContext'

const PRESET_USERS = [
  { name: 'Rahul Sharma', email: 'rahul.cse@college.edu', branch: 'CSE', role: 'student' },
  { name: 'Priya Verma', email: 'priya.ece@college.edu', branch: 'ECE', role: 'student' },
  { name: 'Prof. S. Sharma', email: 'sweta.admin@college.edu', branch: 'CSE', role: 'admin' }
]

export default function LoginScreen() {
  const { handleLogin, darkMode, setDarkMode, usersDb, registerUser } = useApp()

  // Custom Login States
  const [email, setEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [loginError, setLoginError] = useState('')

  // Custom Signup States
  const [signupError, setSignupError] = useState('')

  // Sign Up / Create Account States
  const [signupName, setSignupName] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('')
  const [showSignupPassword, setShowSignupPassword] = useState(false)
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false)
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
    if (!email || !loginPassword) return
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
      if (customUser.password && customUser.password !== loginPassword) {
        setLoginError("Incorrect password. Please try again!")
        return
      }
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
    if (!signupName || !signupEmail || !signupPassword || !signupConfirmPassword) return
    setSignupError('')

    if (signupPassword !== signupConfirmPassword) {
      setSignupError("Passwords do not match!")
      return
    }

    const emailExists = PRESET_USERS.some(u => u.email.toLowerCase() === signupEmail.trim().toLowerCase()) ||
                        usersDb.some(u => u.email.toLowerCase() === signupEmail.trim().toLowerCase())
    if (emailExists) {
      setSignupError("This email is already registered. Try signing in directly!")
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
      password: signupPassword,
      initials: signupName.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2)
    }

    registerUser(newProfile)
    handleLogin(newProfile)
  }

  return (
    <div className="min-h-screen relative flex flex-col justify-between p-4 md:p-8 lg:p-12 selection:bg-nest-green/20">

      {/* Navigation Header with Dark Mode Toggle */}
      <header className="w-full max-w-7xl mx-auto flex items-center justify-end z-20 mb-6 sm:mb-8">
        {/* Dark Mode Toggle */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className="glass-pill-badge p-2.5 rounded-full text-nest-navy hover:text-nest-blue dark:hover:text-nest-gold transition-all duration-200 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-nest-blue shadow-md cursor-pointer"
            aria-label={darkMode ? "Switch to Light Theme" : "Switch to Dark Theme"}
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-nest-gold" />
            ) : (
              <Moon className="w-5 h-5 text-nest-navy" />
            )}
          </button>
        </div>
      </header>

      {/* Main Hero & Demo Section */}
      <main className="w-full max-w-5xl mx-auto flex-1 flex flex-col justify-center items-center z-10 py-6">
        {/* Hero Interactive Card Container */}
        <motion.div 
          className="w-full max-w-5xl mx-auto px-4 sm:px-0"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="glass-panel-morphism rounded-[24px] p-8 sm:p-10 shadow-[0_8px_30px_rgb(7,59,58,0.04)] border border-nest-border/60 dark:border-white/10 relative overflow-hidden">
            
            {/* StudyNest Branding */}
            <div className="flex flex-col items-center gap-1.5 mb-8 select-none">
              <div className="w-10 h-10 rounded-full bg-nest-light-blue dark:bg-nest-light-blue/20 border border-nest-border flex items-center justify-center p-0.5 shadow-sm">
                <GraduationCap className="w-5 h-5 text-nest-green" />
              </div>
              <span className="font-display font-semibold text-sm text-nest-navy dark:text-white tracking-tight">
                Study<span className="text-nest-green font-bold">Nest</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 divide-y md:divide-y-0 md:divide-x divide-nest-border/30 dark:divide-white/10">
              
              {/* LEFT COLUMN: SIGN IN / LOGIN */}
              <div className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-nest-navy dark:text-white mb-1.5">Sign in to your workspace</h3>
                    <p className="text-xs text-nest-gray dark:text-[#a0af8c] font-medium">Your personalized academic workspace starts here.</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-nest-navy mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. rahul.cse@college.edu"
                        className="input-field text-sm font-semibold"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-nest-navy mb-1.5">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showLoginPassword ? 'text' : 'password'}
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="Enter your password"
                          className="input-field text-sm font-semibold pr-12"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-nest-gray hover:text-nest-navy transition-colors focus:outline-none cursor-pointer"
                        >
                          {showLoginPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {loginError && (
                    <p className="text-xs font-bold text-red-650 dark:text-red-400 flex items-center gap-1 mt-3">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{loginError}</span>
                    </p>
                  )}
                  
                  <button
                    type="submit"
                    disabled={!email || !loginPassword || isLoading}
                    className="w-full btn-primary flex items-center justify-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50 mt-2"
                  >
                    {isLoading ? "Signing In..." : "Sign In →"}
                  </button>
                </form>

                {/* Preset Profile Options */}
                <div className="pt-4 border-t border-nest-border dark:border-white/10 text-center">
                  <p className="text-[11px] font-bold text-nest-gray dark:text-[#a0af8c] mb-3">
                    Or select a demo profile:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {PRESET_USERS.map((preset) => (
                      <button
                        key={preset.email}
                        type="button"
                        onClick={() => handleQuickDemo(preset)}
                        className="px-3 py-2 rounded-xl text-xs font-semibold bg-nest-light-input hover:bg-nest-green/15 text-nest-navy hover:text-nest-blue border border-nest-border transition-colors flex items-center justify-center gap-1 focus-visible:ring-2 focus-visible:ring-nest-blue cursor-pointer"
                      >
                        <GraduationCap className="w-3.5 h-3.5 font-bold" />
                        <span className="truncate">{preset.name.split(' ')[0]} ({preset.role === 'admin' ? 'Admin' : preset.branch})</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: SIGN UP / REGISTER */}
              <div className="space-y-6 md:pl-16 pt-10 md:pt-0">
                <form onSubmit={handleSignup} className="space-y-4 text-left">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-nest-navy dark:text-white mb-1.5">Create your account</h3>
                    <p className="text-xs text-nest-gray dark:text-[#a0af8c] font-medium">Your personalized academic workspace starts here.</p>
                  </div>

                  <div className="space-y-4 text-left">
                    <div>
                      <label className="block text-xs font-bold text-nest-navy mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        placeholder="e.g. Sweta Sharma"
                        className="input-field text-sm font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-nest-navy mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        placeholder="e.g. sweta@college.edu"
                        className="input-field text-sm font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-nest-navy mb-1.5">
                        Access Level / Role
                      </label>
                      <select
                        value={signupRole}
                        onChange={(e) => setSignupRole(e.target.value)}
                        className="input-field text-sm font-semibold cursor-pointer"
                      >
                        <option value="student">Student / Learner</option>
                        <option value="faculty">Faculty / Mentor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-nest-navy mb-1.5">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showSignupPassword ? 'text' : 'password'}
                          required
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          placeholder="Enter your password"
                          className="input-field text-sm font-semibold pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowSignupPassword(!showSignupPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-nest-gray hover:text-nest-navy transition-colors focus:outline-none cursor-pointer"
                        >
                          {showSignupPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-nest-navy mb-1.5">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          type={showSignupConfirmPassword ? 'text' : 'password'}
                          required
                          value={signupConfirmPassword}
                          onChange={(e) => setSignupConfirmPassword(e.target.value)}
                          placeholder="Re-enter your password"
                          className="input-field text-sm font-semibold pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowSignupConfirmPassword(!showSignupConfirmPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-nest-gray hover:text-nest-navy transition-colors focus:outline-none cursor-pointer"
                        >
                          {showSignupConfirmPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {signupError && (
                    <p className="text-xs font-bold text-red-650 dark:text-red-400 flex items-center gap-1 mt-3">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{signupError}</span>
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={!signupName || !signupEmail || !signupPassword || !signupConfirmPassword || isLoading}
                    className="w-full mt-4 btn-primary flex items-center justify-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
                  >
                    {isLoading ? "Creating Account..." : "Create Account →"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto text-center z-20 pt-6">
        <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
          StudyNest B.Tech Hub · &copy; {new Date().getFullYear()}
        </p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
          Built for better learning.
        </p>
      </footer>
    </div>
  )
}