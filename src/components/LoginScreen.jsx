import { useState } from 'react'
import { motion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 15 }
  }
}

const glowVariants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 1.5,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut'
    }
  }
}

export default function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !name) return
    
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 800))
    
    const userData = {
      email,
      name,
      initials: name.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2)
    }
    onLogin(userData)
  }

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="glass-card rounded-2xl p-8 md:p-10 relative overflow-hidden"
          variants={itemVariants}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5" />
          
          <motion.div 
            className="relative z-10 text-center mb-8"
            variants={itemVariants}
          >
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
              style={{
                background: 'linear-gradient(135deg, oklch(0.6 0.15 250), oklch(0.7 0.18 280))',
                boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)'
              }}
              variants={glowVariants}
              initial="initial"
              animate="animate"
            >
              <span className="text-3xl">⚡</span>
            </motion.div>
            
            <h1 className="text-3xl font-display font-bold mb-2">
              Study<span className="text-gradient">Nest</span>
            </h1>
            <p className="text-muted-foreground text-sm">
              Your personalized engineering study companion
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-foreground/80 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.name@college.edu"
                className="input-field"
                required
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-foreground/80 mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="input-field"
                required
              />
            </motion.div>

            <motion.button
              type="submit"
              className="w-full btn-primary py-3.5 text-base font-semibold relative overflow-hidden group"
              variants={itemVariants}
              disabled={isLoading}
            >
              <span className={`transition-all duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                Sign In →
              </span>
              {isLoading && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </motion.div>
              )}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ zIndex: -1 }}
              />
            </motion.button>
          </form>

          <motion.p 
            className="text-center text-xs text-muted-foreground mt-6"
            variants={itemVariants}
          >
            No account needed — just enter your info to get started
          </motion.p>
        </motion.div>

        <motion.div 
          className="mt-8 flex justify-center gap-6"
          variants={itemVariants}
        >
          {[
            { icon: '✨', label: 'AI Notes' },
            { icon: '📚', label: 'Quizzes' },
            { icon: '📺', label: 'Videos' }
          ].map((feature, i) => (
            <motion.div
              key={feature.label}
              className="flex flex-col items-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              <div className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-lg">
                {feature.icon}
              </div>
              <span className="text-xs text-muted-foreground">{feature.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}