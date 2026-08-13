import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ShieldCheck, 
  Users, 
  BookOpen, 
  UploadCloud, 
  Settings2, 
  Trash2, 
  ExternalLink, 
  Search, 
  UserCheck, 
  FolderPlus,
  BookMarked
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import SyllabusImporterModal from './SyllabusImporterModal'
import SyllabusManagerModal from './SyllabusManagerModal'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 120, damping: 14 }
  }
}

export default function AdminPortalView() {
  const { 
    semesters, 
    customSubjects, 
    deleteCustomSubject, 
    usersDb, 
    goToSubjectDetail,
    branches
  } = useApp()

  const [searchQuery, setSearchQuery] = useState('')
  const [showImporter, setShowImporter] = useState(false)
  const [showManager, setShowManager] = useState(false)

  // 1. Compute all subjects from merged semesters
  const allSubjects = []
  Object.keys(semesters).forEach(branchId => {
    Object.keys(semesters[branchId]).forEach(semNum => {
      semesters[branchId][semNum].forEach(sub => {
        allSubjects.push({
          ...sub,
          branchId,
          semester: parseInt(semNum, 10),
          isCustom: customSubjects.some(cs => cs.id === sub.id)
        })
      })
    })
  })

  // 2. Filter subjects by search query
  const filteredSubjects = allSubjects.filter(sub => {
    const q = searchQuery.toLowerCase()
    return (
      sub.title.toLowerCase().includes(q) ||
      sub.code.toLowerCase().includes(q) ||
      sub.branchId.toLowerCase().includes(q)
    )
  })

  // 3. Compute users
  const presets = [
    { name: 'Rahul Sharma', email: 'rahul.cse@college.edu', branch: 'CSE', role: 'student' },
    { name: 'Priya Verma', email: 'priya.ece@college.edu', branch: 'ECE', role: 'student' },
    { name: 'Prof. S. Sharma', email: 'sweta.admin@college.edu', branch: 'CSE', role: 'admin' }
  ]
  const allUsers = [...presets, ...usersDb]

  const branchNames = {
    cse: 'Computer Science (CSE)',
    ece: 'Electronics (ECE)',
    me: 'Mechanical (ME)',
    ce: 'Civil (CE)',
    ee: 'Electrical (EE)',
    it: 'Information Tech (IT)'
  }

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome Banner */}
      <motion.header variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3.5xl font-display font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <ShieldCheck className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            Syllabus Administration Panel
          </h1>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-1">
            Manage course curriculums, register subjects, and review portal diagnostics.
          </p>
        </div>
      </motion.header>

      {/* Stats grid */}
      <motion.section variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4" aria-label="Portal statistics">
        <div className="p-5 rounded-2xl glass-card border border-slate-300 dark:border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center border border-amber-500/30">
            <BookMarked className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold font-display text-slate-900 dark:text-white">{allSubjects.length}</span>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Total Subjects Active</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-slate-300 dark:border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <FolderPlus className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold font-display text-slate-900 dark:text-white">{customSubjects.length}</span>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Custom/Imported Subjects</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-slate-300 dark:border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-violet-500/20 text-violet-750 dark:text-violet-400 flex items-center justify-center border border-violet-500/30">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold font-display text-slate-900 dark:text-white">{allUsers.length}</span>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Registered Users</p>
          </div>
        </div>
      </motion.section>

      {/* Admin Action Cards */}
      <motion.section variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-5" aria-label="Administrative controls">
        <div className="p-6 rounded-3xl glass-card border border-slate-300 dark:border-white/10 relative overflow-hidden flex flex-col justify-between h-48 hover:border-amber-500/40 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-600 mb-4 border border-amber-500/30">
              <UploadCloud className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">PDF Syllabus Importer</h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 font-semibold">Drop Noida Institute of Engineering & Technology official B.Tech PDFs to auto-extract units.</p>
          </div>
          <button
            onClick={() => setShowImporter(true)}
            className="w-fit px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            Launch PDF Parser
          </button>
        </div>

        <div className="p-6 rounded-3xl glass-card border border-slate-300 dark:border-white/10 relative overflow-hidden flex flex-col justify-between h-48 hover:border-amber-500/40 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-600 mb-4 border border-amber-500/30">
              <Settings2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Manual Syllabus Manager</h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 font-semibold">Manually configure branch, semester, subject codes, and custom unit syllabi details.</p>
          </div>
          <button
            onClick={() => setShowManager(true)}
            className="w-fit px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            Open Manager
          </button>
        </div>
      </motion.section>

      {/* Main Administrative Subject list */}
      <motion.section variants={itemVariants} className="space-y-4" aria-labelledby="registry-heading">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-white/10 pb-4">
          <div>
            <h2 id="registry-heading" className="text-lg font-display font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-600" /> Subject Curriculum Registry
            </h2>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">Filter, review, delete, or manage unit structures of active subjects.</p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by code or title..."
              className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-white/10 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold"
            />
          </div>
        </div>

        {/* Subjects Registry Table */}
        <div className="border border-slate-300 dark:border-white/10 rounded-2xl overflow-hidden glass-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs md:text-sm font-semibold">
              <thead>
                <tr className="bg-slate-100/60 dark:bg-white/5 border-b border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-3">Code</th>
                  <th className="p-3">Subject Name</th>
                  <th className="p-3">Branch</th>
                  <th className="p-3">Semester</th>
                  <th className="p-3">Source</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                {filteredSubjects.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-500 font-bold">No matching subjects found in registry.</td>
                  </tr>
                ) : (
                  filteredSubjects.map(sub => {
                    const branchName = branchNames[sub.branchId] || sub.branchId.toUpperCase()
                    return (
                      <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                        <td className="p-3 font-mono font-bold text-amber-700 dark:text-amber-400">{sub.code}</td>
                        <td className="p-3 font-bold text-slate-900 dark:text-white max-w-[200px] truncate">{sub.title}</td>
                        <td className="p-3 text-slate-700 dark:text-slate-300 font-semibold truncate max-w-[120px]">{branchName.split(' ')[0]}</td>
                        <td className="p-3 text-slate-700 dark:text-slate-300 font-semibold">Sem {sub.semester}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                            sub.isCustom
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                              : 'bg-slate-100 dark:bg-white/10 border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300'
                          }`}>
                            {sub.isCustom ? 'Custom' : 'System'}
                          </span>
                        </td>
                        <td className="p-3 text-right flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => goToSubjectDetail(sub)}
                            className="p-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 hover:bg-amber-500/25 text-amber-700 dark:text-amber-400 flex items-center gap-1 cursor-pointer text-[10px] font-bold"
                            title="Manage Units in Subject Detail View"
                          >
                            <span>Manage Units</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                          {sub.isCustom && (
                            <button
                              onClick={() => deleteCustomSubject(sub.id)}
                              className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-650 dark:text-red-400 cursor-pointer"
                              title="Delete Subject"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.section>

      {/* User database Table */}
      <motion.section variants={itemVariants} className="space-y-4" aria-labelledby="users-heading">
        <div className="border-b border-slate-200 dark:border-white/10 pb-4">
          <h2 id="users-heading" className="text-lg font-display font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-amber-600" /> Registered Users Directory
          </h2>
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">List of students and administrators loaded in this workspace.</p>
        </div>

        <div className="border border-slate-300 dark:border-white/10 rounded-2xl overflow-hidden glass-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs md:text-sm font-semibold">
              <thead>
                <tr className="bg-slate-100/60 dark:bg-white/5 border-b border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-3">User</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Branch</th>
                  <th className="p-3">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/5 text-slate-950 dark:text-white">
                {allUsers.map((usr, uIdx) => {
                  const initials = usr.name.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2)
                  return (
                    <tr key={uIdx} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                      <td className="p-3 flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-500 text-white font-bold flex items-center justify-center text-[10px]">
                          {initials}
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white">{usr.name}</span>
                      </td>
                      <td className="p-3 text-slate-700 dark:text-slate-300 font-mono">{usr.email}</td>
                      <td className="p-3 text-slate-750 dark:text-slate-300">{usr.branch}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase ${
                          usr.role === 'admin'
                            ? 'bg-amber-600/10 border-amber-600/30 text-amber-700 dark:text-amber-400'
                            : 'bg-slate-100 dark:bg-white/10 border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300'
                        }`}>
                          {usr.role || 'student'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </motion.section>

      {/* Modals rendering */}
      <SyllabusImporterModal isOpen={showImporter} onClose={() => setShowImporter(false)} />
      <SyllabusManagerModal isOpen={showManager} onClose={() => setShowManager(false)} />
    </motion.div>
  )
}
