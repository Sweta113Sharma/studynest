import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, X, Settings2, BookOpen, AlertCircle, Sparkles } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function SyllabusManagerModal({ isOpen, onClose }) {
  const { customSubjects, addCustomSubject, deleteCustomSubject, branches } = useApp()

  // Form State
  const [title, setTitle] = useState('')
  const [code, setCode] = useState('')
  const [branch, setBranch] = useState('cse')
  const [semester, setSemester] = useState(1)
  const [unitCount, setUnitCount] = useState(5)
  const [unitDetails, setUnitDetails] = useState([
    { title: 'Unit 1: Introduction', aiSummary: 'Foundations and fundamental concepts.' },
    { title: 'Unit 2: Core Concepts', aiSummary: 'Intermediate methodologies and architectures.' },
    { title: 'Unit 3: Advanced Topics', aiSummary: 'Detailed study of specific configurations.' },
    { title: 'Unit 4: Applications', aiSummary: 'Real-world case studies and implementations.' },
    { title: 'Unit 5: Integration & Labs', aiSummary: 'Comprehensive overview and practical exercises.' }
  ])

  const [activeTab, setActiveTab] = useState('add') // 'add' or 'list'

  if (!isOpen) return null

  const handleUnitCountChange = (count) => {
    const val = Math.max(1, Math.min(10, count))
    setUnitCount(val)
    
    // adjust details array length
    const updated = [...unitDetails]
    if (val > updated.length) {
      for (let i = updated.length; i < val; i++) {
        updated.push({
          title: `Unit ${i + 1}`,
          aiSummary: `Topics for Unit ${i + 1}.`
        })
      }
    } else if (val < updated.length) {
      updated.splice(val)
    }
    setUnitDetails(updated)
  }

  const handleUnitChange = (index, field, value) => {
    const updated = [...unitDetails]
    updated[index][field] = value
    setUnitDetails(updated)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title || !code) return

    const subjectId = `${code.toLowerCase()}-${Date.now()}`
    const key = code.toLowerCase().replace(/[^a-z0-9]/g, '') || 'custom'

    const newSubject = {
      id: subjectId,
      key,
      title: title.trim(),
      code: code.trim().toUpperCase(),
      branch,
      semester: parseInt(semester, 10),
      units: unitDetails.map((unit, idx) => ({
        title: unit.title.trim() || `Unit ${idx + 1}`,
        aiSummary: unit.aiSummary.trim() || `Syllabus topics for Unit ${idx + 1}.`,
        ppts: [],
        notes: [],
        youtube: []
      }))
    }

    addCustomSubject(newSubject)
    
    // Reset Form
    setTitle('')
    setCode('')
    setBranch('cse')
    setSemester(1)
    setUnitCount(5)
    setUnitDetails([
      { title: 'Unit 1: Introduction', aiSummary: 'Foundations and fundamental concepts.' },
      { title: 'Unit 2: Core Concepts', aiSummary: 'Intermediate methodologies and architectures.' },
      { title: 'Unit 3: Advanced Topics', aiSummary: 'Detailed study of specific configurations.' },
      { title: 'Unit 4: Applications', aiSummary: 'Real-world case studies and implementations.' },
      { title: 'Unit 5: Integration & Labs', aiSummary: 'Comprehensive overview and practical exercises.' }
    ])
    
    setActiveTab('list') // Switch to list view to verify
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal Content */}
        <motion.div
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/10 rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[90vh] glass-panel-morphism text-slate-900 dark:text-white"
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30">
                <Settings2 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="font-display font-black text-lg">Syllabus Manager</h3>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold">Manually configure and edit custom courses and units</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-amber-500"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tabs Navigation */}
          <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl border border-slate-300 dark:border-white/10 mb-5 text-xs font-bold">
            <button
              onClick={() => setActiveTab('add')}
              className={`py-2 rounded-xl transition-all focus-visible:ring-2 focus-visible:ring-amber-500 ${
                activeTab === 'add'
                  ? 'bg-amber-600 text-white font-bold shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Add Custom Subject
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`py-2 rounded-xl transition-all focus-visible:ring-2 focus-visible:ring-amber-500 ${
                activeTab === 'list'
                  ? 'bg-amber-600 text-white font-bold shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              My Custom Subjects ({customSubjects.length})
            </button>
          </div>

          {activeTab === 'add' ? (
            /* Add Subject Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Target Branch</label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Semester</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(parseInt(e.target.value))}
                    className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                      <option key={s} value={s}>Semester {s}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Subject Name</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="e.g. Design and Analysis of Algorithms"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Subject Code</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="e.g. KCS-501"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Number of Units</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={unitCount}
                      onChange={(e) => handleUnitCountChange(parseInt(e.target.value) || 1)}
                      className="w-20 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-2 text-xs sm:text-sm font-semibold text-center focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold">(Max 10)</span>
                  </div>
                </div>
              </div>

              {/* Units Editor List */}
              <div className="space-y-3.5 pt-2">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" /> Configure Units Content
                </h4>
                <div className="max-h-56 overflow-y-auto border border-slate-200 dark:border-white/10 rounded-2xl p-3 bg-slate-50 dark:bg-slate-950/40 space-y-4">
                  {unitDetails.map((unit, idx) => (
                    <div key={idx} className="space-y-2 pb-3 border-b border-slate-200 dark:border-white/5 last:border-b-0">
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                        <div className="sm:col-span-1 flex items-center">
                          <span className="text-xs font-bold text-amber-600 dark:text-amber-400">Unit {idx + 1} Title</span>
                        </div>
                        <div className="sm:col-span-3">
                          <input
                            type="text"
                            required
                            value={unit.title}
                            onChange={(e) => handleUnitChange(idx, 'title', e.target.value)}
                            className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                            placeholder="Unit Title"
                          />
                        </div>
                        <div className="sm:col-span-1 flex items-start pt-1">
                          <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Topics & Syllabus</span>
                        </div>
                        <div className="sm:col-span-3">
                          <textarea
                            rows="2"
                            required
                            value={unit.aiSummary}
                            onChange={(e) => handleUnitChange(idx, 'aiSummary', e.target.value)}
                            className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 leading-normal"
                            placeholder="Syllabus descriptions, comma-separated topics, or notes summary"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 justify-end pt-3 border-t border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-white/15 hover:bg-slate-100 dark:hover:bg-white/10 text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Save Subject
                </button>
              </div>
            </form>
          ) : (
            /* Custom Subjects List */
            <div className="space-y-4">
              {customSubjects.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-white/5 rounded-2xl space-y-2">
                  <AlertCircle className="w-10 h-10 mx-auto text-slate-400 dark:text-slate-500" />
                  <p className="font-bold text-sm text-slate-700 dark:text-slate-300">No Custom Subjects Found</p>
                  <p className="text-xs text-slate-500">Go to "Add Custom Subject" or parse a PDF syllabus to get started.</p>
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto space-y-2.5">
                  {customSubjects.map((sub) => {
                    const branchName = branches.find(b => b.id === sub.branch)?.name || sub.branch
                    return (
                      <div
                        key={sub.id}
                        className="p-4 rounded-2xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-slate-950/25 flex items-center justify-between gap-4"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                              {sub.code}
                            </span>
                            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-white/10 px-2 py-0.5 rounded-full">
                              Sem {sub.semester} • {branchName.split(' ')[0]}
                            </span>
                          </div>
                          <h4 className="font-bold text-sm truncate">{sub.title}</h4>
                          <p className="text-[10px] text-slate-700 dark:text-slate-300 font-semibold">{sub.units?.length || 0} Units configured</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => deleteCustomSubject(sub.id)}
                          className="p-2 rounded-xl text-red-600 hover:bg-red-500/10 transition-colors focus-visible:ring-2 focus-visible:ring-amber-500"
                          aria-label={`Delete ${sub.title}`}
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
