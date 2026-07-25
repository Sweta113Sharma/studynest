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
  Zap
} from 'lucide-react'
import logo from '../assets/logo.png'

const containerVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.08,
      delayChildren: 0.15
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 120, damping: 14 }
  }
}

const floatingBadgeVariants = {
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut'
    }
  }
}

const PRESET_USERS = [
  { name: 'Rahul Sharma', email: 'rahul.cse@college.edu', branch: 'CSE' },
  { name: 'Priya Verma', email: 'priya.ece@college.edu', branch: 'ECE' },
  { name: 'Ananya Gupta', email: 'ananya.it@college.edu', branch: 'IT' }
]

export default function LoginScreen({ onLogin, darkMode, setDarkMode }) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [selectedBranch, setSelectedBranch] = useState('CSE')
  const [isLoading, setIsLoading] = useState(false)

  const handleSelectPreset = (preset) => {
    setName(preset.name)
    setEmail(preset.email)
    setSelectedBranch(preset.branch)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !name) return
    
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 700))
    
    const userData = {
      email,
      name,
      branch: selectedBranch,
      initials: name.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2)
    }
    onLogin(userData)
  }

  return (
    <div className="min-h-screen relative flex flex-col justify-between p-4 md:p-8 lg:p-12 overflow-hidden selection:bg-amber-500/20">
      {/* Background Glass Orbs & Ambient Glow Mesh */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-tr from-amber-600/30 to-amber-400/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-[30rem] h-[30rem] bg-gradient-to-br from-amber-700/20 via-orange-500/15 to-yellow-400/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute -bottom-40 left-1/4 w-[28rem] h-[28rem] bg-gradient-to-t from-yellow-600/25 to-amber-500/10 rounded-full blur-[110px]" />
      </div>

      {/* Top Header Navigation Bar */}
      <motion.header 
        className="w-full max-w-7xl mx-auto flex items-center justify-between z-20 mb-6 lg:mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-amber-700 rounded-2xl blur opacity-40 group-hover:opacity-80 transition duration-300" />
            <div className="relative w-11 h-11 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-white/40 dark:border-white/10 p-0.5 flex items-center justify-center shadow-lg overflow-hidden">
              <img src={logo} alt="StudyNest Logo" className="w-full h-full object-cover rounded-xl" />
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full glass-pill-badge text-amber-700 dark:text-amber-300 border border-amber-500/20">
            <Sparkles className="w-3.5 h-3.5" /> B.Tech Academic Suite
          </span>
        </div>

        {/* Theme Toggle Button */}
        {setDarkMode && (
          <motion.button
            onClick={() => setDarkMode(!darkMode)}
            className="glass-pill-badge p-2.5 rounded-full text-foreground hover:text-amber-500 transition-all duration-300 flex items-center justify-center hover:scale-105 active:scale-95 shadow-md"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            title={darkMode ? "Switch to Light Glass Theme" : "Switch to Dark Glass Theme"}
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-amber-400 animate-spin-slow" />
            ) : (
              <Moon className="w-5 h-5 text-slate-700" />
            )}
          </motion.button>
        )}
      </motion.header>

      {/* Main Content Split Layout */}
      <main className="w-full max-w-7xl mx-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center z-10 my-auto py-4">
        
        {/* Left Side: Hero Feature Showcase (Glass Cards & Visual Highlights) */}
        <motion.div 
          className="lg:col-span-6 space-y-6 text-left hidden lg:block"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-pill-badge border border-white/40 dark:border-white/10 shadow-sm">
            <GraduationCap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="text-xs font-semibold tracking-wide uppercase text-foreground/80">
              Complete Engineering Portal
            </span>
          </motion.div>

          <motion.h1 
            variants={itemVariants} 
            className="text-4xl lg:text-5xl font-display font-extrabold tracking-tight leading-[1.15] text-foreground"
          >
            Master your syllabus with <br />
            <span className="text-gradient">Glass-Smooth Precision</span>
          </motion.h1>

          <motion.p 
            variants={itemVariants} 
            className="text-base text-muted-foreground max-w-lg leading-relaxed font-normal"
          >
            Instant access to syllabus units, curated lecture notes, interactive flashcards, AI doubt assistance, and semester progress tracking.
          </motion.p>

          {/* Glass Feature Cards Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 pt-2">
            <motion.div 
              className="glass-panel-morphism p-4 rounded-2xl border border-white/40 dark:border-white/10 space-y-2 hover:border-amber-500/40 transition-all duration-300"
              whileHover={{ y: -4 }}
            >
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 dark:bg-amber-400/15 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-sm text-foreground">100+ Detailed Units</h3>
              <p className="text-xs text-muted-foreground">Comprehensive notes & previous year questions</p>
            </motion.div>

            <motion.div 
              className="glass-panel-morphism p-4 rounded-2xl border border-white/40 dark:border-white/10 space-y-2 hover:border-amber-500/40 transition-all duration-300"
              whileHover={{ y: -4 }}
            >
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 dark:bg-amber-400/15 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-sm text-foreground">AI Study Partner</h3>
              <p className="text-xs text-muted-foreground">Real-time smart summaries & quiz generation</p>
            </motion.div>
          </motion.div>

          {/* Floating Stat Badge */}
          <motion.div 
            variants={floatingBadgeVariants} 
            animate="animate" 
            className="pt-2 flex items-center gap-4"
          >
            <div className="px-5 py-3 rounded-2xl glass-pill-badge border border-white/40 dark:border-white/10 flex items-center gap-3 shadow-lg">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs border-2 border-white dark:border-slate-900">CS</div>
                <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-xs border-2 border-white dark:border-slate-900">EC</div>
                <div className="w-8 h-8 rounded-full bg-yellow-600 text-white flex items-center justify-center font-bold text-xs border-2 border-white dark:border-slate-900">IT</div>
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">Multi-Branch Support</p>
                <p className="text-[11px] text-muted-foreground">CSE, ECE, EE, ME, CE & IT</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Side: Ultra-Premium Glassmorphism Login Card */}
        <motion.div 
          className="lg:col-span-6 w-full max-w-md mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="relative group">
            {/* Outer Specular Glow Ring */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/40 via-orange-500/30 to-amber-600/40 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-glow" />

            <div className="relative glass-panel-morphism rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl overflow-hidden backdrop-blur-3xl border border-white/50 dark:border-white/15">
              {/* Inner Light Reflection Beam */}
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-white/20 dark:bg-white/5 rounded-full blur-2xl pointer-events-none" />
              
              {/* Card Header & Logo */}
              <motion.div variants={itemVariants} className="text-center mb-6">
                <div className="relative inline-block mb-4">
                  <motion.div 
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-white/90 to-amber-50/80 dark:from-slate-800/90 dark:to-slate-900/90 p-1 shadow-2xl border border-white/60 dark:border-white/20 mx-auto flex items-center justify-center relative overflow-hidden"
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <img src={logo} alt="StudyNest Logo" className="w-full h-full object-cover rounded-2xl drop-shadow-md" />
                  </motion.div>
                  <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-md">
                    <Zap className="w-3.5 h-3.5 fill-current" />
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-foreground">
                  Sign In to <span className="text-gradient">StudyNest</span>
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 font-normal">
                  Enter your info or select a sample student profile below
                </p>
              </motion.div>

              {/* Quick Demo Profiles Selection */}
              <motion.div variants={itemVariants} className="mb-6">
                <label className="block text-[11px] font-semibold tracking-wider uppercase text-muted-foreground mb-2">
                  ⚡ Quick Preset Login
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {PRESET_USERS.map((preset) => {
                    const isSelected = name === preset.name
                    return (
                      <motion.button
                        key={preset.name}
                        type="button"
                        onClick={() => handleSelectPreset(preset)}
                        className={`p-2.5 rounded-xl text-left transition-all duration-200 border flex flex-col justify-between ${
                          isSelected
                            ? 'bg-amber-500/15 border-amber-500 dark:bg-amber-400/20 text-amber-900 dark:text-amber-200 shadow-sm'
                            : 'glass-pill-badge hover:bg-white/40 dark:hover:bg-white/10 text-foreground border-white/40 dark:border-white/10'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-xs font-bold truncate">{preset.name.split(' ')[0]}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 font-mono font-semibold text-amber-700 dark:text-amber-300">
                            {preset.branch}
                          </span>
                        </div>
                        <span className="text-[10px] text-muted-foreground truncate mt-1">
                          {isSelected ? '✓ Selected' : 'Tap to fill'}
                        </span>
                      </motion.button>
                    )
                  })}
                </div>
              </motion.div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Input */}
                <motion.div variants={itemVariants}>
                  <label className="block text-xs font-medium text-foreground/90 mb-1.5 flex items-center justify-between">
                    <span>Full Name</span>
                    <span className="text-[10px] text-muted-foreground">Required</span>
                  </label>
                  <div className="relative glass-input-box rounded-2xl">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full pl-10 pr-4 py-3 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none rounded-2xl font-medium"
                      required
                    />
                  </div>
                </motion.div>

                {/* Email Input */}
                <motion.div variants={itemVariants}>
                  <label className="block text-xs font-medium text-foreground/90 mb-1.5 flex items-center justify-between">
                    <span>Email Address</span>
                    <span className="text-[10px] text-muted-foreground">College / Personal</span>
                  </label>
                  <div className="relative glass-input-box rounded-2xl">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="rahul.cse@college.edu"
                      className="w-full pl-10 pr-4 py-3 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none rounded-2xl font-medium"
                      required
                    />
                  </div>
                </motion.div>

                {/* Branch Selection Chips */}
                <motion.div variants={itemVariants}>
                  <label className="block text-xs font-medium text-foreground/90 mb-1.5">
                    Engineering Branch
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {['CSE', 'ECE', 'EE', 'ME', 'CE', 'IT'].map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setSelectedBranch(b)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 border ${
                          selectedBranch === b
                            ? 'bg-amber-600 text-white border-amber-600 shadow-md scale-105'
                            : 'glass-pill-badge text-foreground/80 hover:text-foreground border-white/40 dark:border-white/10'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </motion.div>

                {/* Submit Glass Button */}
                <motion.div variants={itemVariants} className="pt-2">
                  <motion.button
                    type="submit"
                    disabled={isLoading || !name || !email}
                    className="w-full relative group overflow-hidden rounded-2xl p-0.5 font-semibold text-white shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: isLoading ? 1 : 1.015 }}
                    whileTap={{ scale: isLoading ? 1 : 0.985 }}
                  >
                    {/* Glowing Animated Gradient Border Background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 rounded-2xl transition-all duration-300 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Inner Glass Button Content */}
                    <div className="relative px-6 py-3.5 rounded-[0.9rem] bg-gradient-to-r from-amber-700/90 via-amber-800/90 to-amber-900/90 dark:from-amber-600/90 dark:via-amber-700/90 dark:to-amber-800/90 backdrop-blur-md flex items-center justify-center gap-2 glass-reflection">
                      {isLoading ? (
                        <div className="flex items-center gap-2 text-white">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span className="text-sm font-semibold">Setting up your nest...</span>
                        </div>
                      ) : (
                        <>
                          <span className="text-sm tracking-wide font-bold">Launch Study Dashboard</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                        </>
                      )}
                    </div>
                  </motion.button>
                </motion.div>
              </form>

              {/* Card Footer Security Tag */}
              <motion.div 
                variants={itemVariants}
                className="mt-6 pt-4 border-t border-white/30 dark:border-white/10 flex items-center justify-center gap-2 text-[11px] text-muted-foreground"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Instant local access • No password or signup required</span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer copyright / info */}
      <motion.footer 
        className="w-full max-w-7xl mx-auto text-center z-20 pt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <p className="text-xs text-muted-foreground/80 font-medium">
          StudyNest B.Tech Hub &copy; {new Date().getFullYear()} • Crafted for Engineering Excellence
        </p>
      </motion.footer>
    </div>
  )
}