import { motion } from 'framer-motion'
import { BookOpen, Video, Sparkles, Award, ArrowRight } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 120, damping: 14 }
  }
}

export default function HomeView({ context }) {
  const { user, navigateTo, selectedYear, setSelectedYear, setSelectedBranch, branches } = context

  const handleYearSelect = (year) => {
    setSelectedYear(year)
    setSelectedBranch(null)
  }

  const handleBranchSelect = (branch) => {
    setSelectedBranch(branch.id)
    navigateTo('subjects')
  }

  const features = [
    { icon: Sparkles, title: 'AI Study Guide', desc: 'Subject-wide AI overviews & custom quizzes', color: 'from-amber-400 to-orange-500' },
    { icon: Video, title: 'Video Lectures', desc: 'Curated YouTube from top educators', color: 'from-red-400 to-pink-500' },
    { icon: BookOpen, title: 'Study Materials', desc: 'PPTs, notes & resources per unit', color: 'from-emerald-400 to-teal-500' },
    { icon: Award, title: 'Adaptive Quizzes', desc: 'AI-generated MCQ practice tests', color: 'from-violet-400 to-purple-500' }
  ]

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="text-center py-8" variants={itemVariants}>
        <motion.h1
          className="text-4xl md:text-5xl font-display font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Welcome back,{' '}
          <span className="text-gradient">{user?.name?.split(' ')[0] || 'Student'}</span>
          <span className="inline-block ml-2">👋</span>
        </motion.h1>
        <motion.p
          className="text-lg text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          "Study smarter, not longer."
        </motion.p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <h2 className="text-xl font-display font-semibold mb-4 flex items-center gap-2">
          <span className="w-1 h-6 rounded-full bg-primary" />
          Select Your Year
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((year, i) => (
            <motion.button
              key={year}
              onClick={() => handleYearSelect(year)}
              className={`group relative p-6 rounded-2xl border transition-all duration-300 ${
                selectedYear === year
                  ? 'border-primary bg-primary/10 shadow-glow'
                  : 'border-white/5 glass-card hover:border-primary/30 hover:shadow-glow'
              }`}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-3xl font-display font-bold mb-1">
                {year}<span className="text-sm font-normal text-muted-foreground ml-1">
                  {year === 1 ? 'st' : year === 2 ? 'nd' : year === 3 ? 'rd' : 'th'}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">Year</div>
              <motion.div
                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </motion.button>
          ))}
        </div>
      </motion.div>

      {selectedYear && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <h2 className="text-xl font-display font-semibold mb-4 flex items-center gap-2">
            <span className="w-1 h-6 rounded-full bg-purple-500" />
            Select Your Branch
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {branches.map((branch, i) => (
              <motion.button
                key={branch.id}
                onClick={() => handleBranchSelect(branch)}
                className="group relative p-5 rounded-2xl border border-white/5 glass-card hover:border-white/10 transition-all duration-300 text-left"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ background: `${branch.color}20`, border: `1px solid ${branch.color}30` }}
                  >
                    {branch.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{branch.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      Year {selectedYear} • Semester {(selectedYear - 1) * 2 + 1} & {(selectedYear - 1) * 2 + 2}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div variants={itemVariants}>
        <h2 className="text-xl font-display font-semibold mb-4 flex items-center gap-2">
          <span className="w-1 h-6 rounded-full bg-emerald-500" />
          Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              className="group p-5 rounded-2xl glass-card border border-white/5 hover:border-white/10 transition-all duration-300"
              variants={itemVariants}
              whileHover={{ y: -4, scale: 1.01 }}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}