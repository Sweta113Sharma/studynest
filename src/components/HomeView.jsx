import { motion } from 'framer-motion'
import { BookOpen, Video, Sparkles, Award, ArrowRight, Bookmark, Flame, CheckCircle2, Trash2 } from 'lucide-react'
import { useApp } from '../context/AppContext'

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

export default function HomeView() {
  const {
    user,
    navigateTo,
    selectedYear,
    setSelectedYear,
    setSelectedBranch,
    setSelectedSubject,
    setSelectedUnit,
    branches,
    getBookmarks,
    toggleBookmark
  } = useApp()

  const handleYearSelect = (year) => {
    setSelectedYear(year)
    setSelectedBranch(null)
  }

  const handleBranchSelect = (branch) => {
    setSelectedBranch(branch.id)
    navigateTo('subjects')
  }

  const bookmarks = getBookmarks()
  const sessionsCount = parseInt(localStorage.getItem('studynest_timer_sessions') || '0', 10)

  const features = [
    { icon: Sparkles, title: 'AI Study Guide', desc: 'Subject-wide AI overviews & custom quizzes', color: 'from-amber-500 to-orange-600' },
    { icon: Video, title: 'Video Lectures', desc: 'Curated YouTube from top educators', color: 'from-red-500 to-pink-600' },
    { icon: BookOpen, title: 'Study Materials', desc: 'PPTs, notes & resources per unit', color: 'from-emerald-500 to-teal-600' },
    { icon: Award, title: 'Adaptive Quizzes', desc: 'AI-generated MCQ practice tests', color: 'from-violet-500 to-purple-600' }
  ]

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome Banner */}
      <section className="text-center py-6" aria-label="Welcome banner">
        <motion.h1
          className="text-3xl md:text-5xl font-display font-black tracking-tight text-slate-900 dark:text-white mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          Welcome back,{' '}
          <span className="text-gradient">{user?.name?.split(' ')[0] || 'Student'}</span>
          <span className="inline-block ml-2" role="img" aria-label="Waving hand">👋</span>
        </motion.h1>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4" aria-label="Study Progress Stats">
        <div className="p-4 rounded-2xl glass-card border border-slate-300 dark:border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold font-display text-slate-900 dark:text-white">
              {sessionsCount > 0 ? `${sessionsCount}` : '1'}
            </span>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Focus Sessions ({sessionsCount * 25} mins)
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-slate-300 dark:border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-600/20 text-amber-700 dark:text-amber-400 flex items-center justify-center border border-amber-600/30">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold font-display text-slate-900 dark:text-white">{bookmarks.length}</span>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Bookmarked Units</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-slate-300 dark:border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold font-display text-slate-900 dark:text-white">100%</span>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Exam Coverage Ready</p>
          </div>
        </div>
      </section>

      {/* Bookmarked Resources Section */}
      {bookmarks.length > 0 && (
        <section aria-labelledby="bookmarks-heading">
          <h2 id="bookmarks-heading" className="text-xl font-display font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            Bookmarked Units & Resources
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {bookmarks.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  if (item.subject) setSelectedSubject(item.subject)
                  if (item.unit) setSelectedUnit(item.unit)
                  navigateTo('unit-detail')
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    if (item.subject) setSelectedSubject(item.subject)
                    if (item.unit) setSelectedUnit(item.unit)
                    navigateTo('unit-detail')
                  }
                }}
                className="p-4 rounded-2xl glass-card border border-slate-300 dark:border-white/10 hover:border-amber-500/50 cursor-pointer flex items-center justify-between group transition-all focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                <div className="min-w-0 flex-1 pr-2">
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-white truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5 truncate">
                    {item.subjectTitle || 'Unit'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleBookmark(item)
                  }}
                  className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors focus-visible:ring-2 focus-visible:ring-amber-500"
                  aria-label={`Remove bookmark for ${item.title}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Year Selection Section */}
      <section aria-labelledby="year-selection-heading">
        <h2 id="year-selection-heading" className="text-xl font-display font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="w-1.5 h-6 rounded-full bg-amber-600 dark:bg-amber-400" />
          Select Your Year
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((year) => (
            <motion.button
              key={year}
              type="button"
              onClick={() => handleYearSelect(year)}
              className={`group relative p-6 rounded-2xl border text-left transition-all duration-200 focus-visible:ring-2 focus-visible:ring-amber-500 ${
                selectedYear === year
                  ? 'border-amber-500 bg-amber-500/10 shadow-lg'
                  : 'border-slate-300 dark:border-white/10 glass-card hover:border-amber-500/40'
              }`}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              aria-label={`Select Year ${year}`}
            >
              <div className="text-3xl font-display font-black text-slate-900 dark:text-white mb-1">
                {year}<span className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                  {year === 1 ? 'st' : year === 2 ? 'nd' : year === 3 ? 'rd' : 'th'}
                </span>
              </div>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">Year</div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Branch Selection Section */}
      {selectedYear && (
        <section aria-labelledby="branch-selection-heading">
          <h2 id="branch-selection-heading" className="text-xl font-display font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="w-1.5 h-6 rounded-full bg-amber-600 dark:bg-amber-400" />
            Select Your Branch
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {branches.map((branch, i) => (
              <motion.button
                key={branch.id}
                type="button"
                onClick={() => handleBranchSelect(branch)}
                className="group relative p-5 rounded-2xl border border-slate-300 dark:border-white/10 glass-card hover:border-amber-500/50 transition-all duration-200 text-left focus-visible:ring-2 focus-visible:ring-amber-500"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.015, x: 3 }}
                whileTap={{ scale: 0.985 }}
                aria-label={`Select ${branch.name} for Year ${selectedYear}`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ background: `${branch.color}20`, border: `1px solid ${branch.color}40` }}
                    aria-hidden="true"
                  >
                    {branch.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">{branch.name}</h3>
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      Year {selectedYear} • Semester {(selectedYear - 1) * 2 + 1} & {(selectedYear - 1) * 2 + 2}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                </div>
              </motion.button>
            ))}
          </div>
        </section>
      )}

      {/* Features Overview */}
      <section aria-labelledby="features-heading">
        <h2 id="features-heading" className="text-xl font-display font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="w-1.5 h-6 rounded-full bg-amber-600 dark:bg-amber-400" />
          Key Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="p-5 rounded-2xl glass-card border border-slate-300 dark:border-white/10"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-md`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{feature.title}</h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{feature.desc}</p>
            </article>
          ))}
        </div>
      </section>
    </motion.div>
  )
}