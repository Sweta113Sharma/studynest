import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, BookOpen, FileText, Download, ExternalLink, Search, X } from 'lucide-react'
import { useApp } from '../context/AppContext'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 }
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

export default function SubjectsView() {
  const { 
    selectedYear,
    selectedBranch,
    setSelectedSemester,
    selectedSemester,
    setSelectedSubject,
    semesters,
    subjectColors,
    getSubjectProgress,
    navigateTo,
    goBack
  } = useApp()

  const [availableSemesters, setAvailableSemesters] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  const activeBranch = selectedBranch || 'cse'
  const activeYear = selectedYear || 2

  useEffect(() => {
    const branchData = semesters[activeBranch]
    if (branchData) {
      const yearToSem = { 1: [1, 2], 2: [3, 4], 3: [5, 6], 4: [7, 8] }
      const possible = yearToSem[activeYear] || [1, 2, 3, 4]
      const available = Object.keys(branchData).map(Number)
      setAvailableSemesters(available.length > 0 ? available : [1, 2, 3, 4])
      
      if (selectedSemester && branchData[selectedSemester]) {
        // keep current
      } else if (available.length > 0) {
        setSelectedSemester(available[0])
      } else {
        setSelectedSemester(1)
      }
    }
  }, [activeYear, activeBranch, semesters, selectedSemester, setSelectedSemester])

  const branchData = semesters[activeBranch]
  const subjects = branchData?.[selectedSemester] || branchData?.[1] || branchData?.[3] || []

  const filteredSubjects = subjects.filter((s) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    const matchTitle = s.title.toLowerCase().includes(q)
    const matchUnits = s.units?.some((u) => u.title.toLowerCase().includes(q))
    return matchTitle || matchUnits
  })

  const branchNames = {
    cse: 'Computer Science',
    ece: 'Electronics',
    me: 'Mechanical',
    ce: 'Civil',
    ee: 'Electrical'
  }
  const branchTitle = branchNames[selectedBranch] || 'Engineering'

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.button
        type="button"
        onClick={goBack}
        className="flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 font-semibold text-sm transition-colors py-1.5 px-3 rounded-xl hover:bg-slate-200/60 dark:hover:bg-white/10 w-fit focus-visible:ring-2 focus-visible:ring-amber-500"
        variants={itemVariants}
        whileHover={{ x: -4 }}
        whileTap={{ scale: 0.92 }}
        aria-label="Back to Home"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </motion.button>

      <motion.header variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl md:text-4xl font-display font-black tracking-tight bg-gradient-to-r from-nest-navy via-nest-blue to-nest-green bg-clip-text text-transparent dark:from-white dark:via-nest-green dark:to-nest-gold leading-tight">
            {branchTitle === 'Engineering' ? 'Engineering' : `${branchTitle} Engineering`}
          </h1>
          <span className="inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full bg-nest-green/15 border border-nest-green/30 text-nest-navy dark:text-nest-green text-xs font-bold tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-nest-green inline-block"></span>
            Year {selectedYear}
          </span>
        </div>

        {/* Instant Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 dark:text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subjects or unit topics..."
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-white/15 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-medium"
            aria-label="Search subjects or topics"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white focus-visible:ring-2 focus-visible:ring-amber-500"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </motion.header>

      {/* Semester Tab Switcher */}
      <motion.nav variants={itemVariants} aria-label="Semester selection">
        <div className="flex gap-2 flex-wrap">
          {availableSemesters.map((sem) => (
            <button
              key={sem}
              type="button"
              onClick={() => setSelectedSemester(sem)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all focus-visible:ring-2 focus-visible:ring-amber-500 ${
                selectedSemester === sem
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'glass-card border border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-100 hover:border-amber-500/40'
              }`}
              aria-current={selectedSemester === sem ? 'page' : undefined}
            >
              Semester {sem}
            </button>
          ))}
        </div>
      </motion.nav>

      {/* Subjects Grid */}
      <section aria-label="Subjects list">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={containerVariants}
        >
          {filteredSubjects.length === 0 ? (
            <motion.div
              className="col-span-full text-center py-12 glass-card rounded-2xl border border-slate-300 dark:border-white/10"
              variants={itemVariants}
            >
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-slate-600 dark:text-slate-400" />
              <p className="text-slate-700 dark:text-slate-300 font-semibold text-sm">
                {searchQuery ? `No subjects match "${searchQuery}"` : 'No subjects available for this semester yet.'}
              </p>
            </motion.div>
          ) : (
            filteredSubjects.map((subject, i) => {
              const colors = subjectColors[subject.key] || subjectColors.default
              const progress = getSubjectProgress(subject.id)
              
              return (
                <motion.button
                  key={subject.id}
                  type="button"
                  onClick={() => {
                    setSelectedSubject(subject)
                    navigateTo('subject-detail')
                  }}
                  className="group relative p-5 rounded-2xl text-left transition-all duration-200 glass-card border border-slate-300 dark:border-white/10 hover:border-amber-500/40 focus-visible:ring-2 focus-visible:ring-amber-500"
                  style={{
                    borderLeft: `4px solid ${colors.border}`
                  }}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  aria-label={`Open ${subject.title}`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                      aria-hidden="true"
                    >
                      {colors.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 dark:text-white text-base truncate">{subject.title}</h3>
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
                        {subject.units.length} units
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-700 dark:text-slate-300 font-semibold">Progress</span>
                      <span className="font-bold" style={{ color: colors.border }}>{progress}%</span>
                    </div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: colors.border }}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, delay: i * 0.08 }}
                      />
                    </div>
                  </div>
                </motion.button>
              )
            })
          )}
        </motion.div>
      </section>

      {/* Official NIET Syllabus Section */}
      <section aria-labelledby="syllabus-heading" className="mt-12 pt-8 border-t border-slate-300 dark:border-white/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 id="syllabus-heading" className="text-xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              Official NIET Autonomous Syllabus
            </h2>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-1">
              Access official evaluation schemes directly from Noida Institute of Engineering & Technology.
            </p>
          </div>
          <a
            href="https://www.niet.co.in/academics/syllabus"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold px-3.5 py-2 rounded-xl glass-card border border-slate-300 dark:border-white/10 hover:border-amber-500/40 flex items-center gap-1.5 transition-all text-slate-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 w-fit focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            <span>All Branches Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              year: '1st Year',
              title: 'B.Tech CSE Syllabus',
              desc: 'Calculus, Semiconductor Physics, AI Fundamentals & Labs',
              url: 'https://www.niet.co.in/assets/frontend/pdf/syllabus/B.Tech-in-Computer-Science-and-Engineering-CSE-First-Year.pdf'
            },
            {
              year: '2nd Year',
              title: 'B.Tech CSE Syllabus',
              desc: 'Data Structures, DBMS, Discrete Mathematics & Labs',
              url: 'https://www.niet.co.in/assets/frontend/pdf/syllabus/2025-26/second-year/B.Tech%20in%20Computer%20Science%20%20Engineering%20(CSE)%20Second%20Year%202025-26.pdf'
            },
            {
              year: '3rd Year',
              title: 'B.Tech CSE Syllabus',
              desc: 'Operating Systems, Web Tech, Theory of Computation',
              url: 'https://www.niet.co.in/assets/frontend/pdf/syllabus/2025-26/third-year/B.Tech%20in%20Computer%20Science%20%20Engineering%20(CSE)%20Third%20Year%202025-26.pdf'
            },
            {
              year: '4th Year',
              title: 'B.Tech CSE Syllabus',
              desc: 'Cloud Computing, Machine Learning, Compiler Design',
              url: 'https://www.niet.co.in/assets/frontend/pdf/syllabus/2025-26/forth-year/B.Tech%20in%20Computer%20Science%20%20Engineering%20(CSE)%20Fourth%20Year%202025-26.pdf'
            }
          ].map((item, idx) => (
            <motion.a
              key={idx}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-2xl glass-card border border-slate-300 dark:border-white/10 hover:border-amber-500/40 transition-all flex flex-col justify-between group focus-visible:ring-2 focus-visible:ring-amber-500"
              whileHover={{ y: -3, scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              aria-label={`Download ${item.year} ${item.title}`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-300 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30">
                    {item.year}
                  </span>
                  <Download className="w-4 h-4 text-slate-600 dark:text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300 line-clamp-2">
                  {item.desc}
                </p>
              </div>
            </motion.a>
          ))}
        </div>
      </section>
    </motion.div>
  )
}