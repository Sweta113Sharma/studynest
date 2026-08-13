import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X, ChevronRight, Settings } from 'lucide-react'
import { pdfParserService } from '../services/PdfParserService'
import { useApp } from '../context/AppContext'

export default function SyllabusImporterModal({ isOpen, onClose }) {
  const { addCustomSubject, branches } = useApp()
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [parsedData, setParsedData] = useState(null)
  
  // Custom categorization fields
  const [selectedBranch, setSelectedBranch] = useState('cse')
  const [selectedSemester, setSelectedSemester] = useState(1)
  const [subjectTitle, setSubjectTitle] = useState('')
  const [subjectCode, setSubjectCode] = useState('')

  const fileInputRef = useRef(null)

  if (!isOpen) return null

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type === 'application/pdf') {
      processFile(droppedFile)
    } else {
      setError('Please upload a valid PDF file.')
    }
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      processFile(selectedFile)
    }
  }

  const processFile = async (selectedFile) => {
    setFile(selectedFile)
    setLoading(true)
    setError(null)
    setParsedData(null)

    try {
      const data = await pdfParserService.parseSyllabusPdf(selectedFile)
      setParsedData(data)
      setSubjectTitle(data.title)
      setSubjectCode(data.code)
    } catch (err) {
      setError('Failed to extract text from PDF. Ensure it contains text syllabus content.')
    } finally {
      setLoading(false)
    }
  }

  const handleImport = () => {
    if (!parsedData || !subjectTitle || !subjectCode) return

    const subjectToImport = {
      ...parsedData,
      title: subjectTitle,
      code: subjectCode,
      branch: selectedBranch,
      semester: parseInt(selectedSemester, 10),
      // Set a key for colors / styles
      key: subjectCode.toLowerCase().replace(/[^a-z0-9]/g, '') || 'custom'
    }

    addCustomSubject(subjectToImport)
    resetState()
    onClose()
  }

  const resetState = () => {
    setFile(null)
    setLoading(false)
    setError(null)
    setParsedData(null)
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

        {/* Modal Body */}
        <motion.div
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/10 rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[90vh] glass-panel-morphism text-slate-900 dark:text-white"
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30">
                <UploadCloud className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="font-display font-black text-lg">Syllabus PDF Importer</h3>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold">Extract and generate course dashboard from official PDFs</p>
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

          {/* Content */}
          {!parsedData && !loading ? (
            /* Upload Screen */
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 dark:border-white/20 rounded-2xl p-10 text-center cursor-pointer hover:border-amber-500/50 hover:bg-amber-500/5 transition-all group flex flex-col items-center justify-center gap-3"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf"
                className="hidden"
              />
              <UploadCloud className="w-12 h-12 text-slate-400 dark:text-slate-500 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors" />
              <div>
                <p className="font-bold text-sm">Drag and drop syllabus PDF here</p>
                <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">or click to browse from files</p>
              </div>
              <span className="text-[10px] px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/5">
                PDF format only (up to 10MB)
              </span>
              {error && (
                <div className="flex items-center gap-1.5 mt-3 text-red-600 dark:text-red-400 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          ) : loading ? (
            /* Loading State */
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="w-12 h-12 rounded-full border-4 border-amber-600/30 border-t-amber-600 animate-spin" />
              <p className="font-bold text-sm text-slate-700 dark:text-slate-300">Extracting syllabus details...</p>
              <p className="text-xs text-slate-500">Reading PDF pages and structured unit patterns...</p>
            </div>
          ) : (
            /* Review & Edit Screen */
            <div className="space-y-5">
              {/* File Info pill */}
              <div className="flex items-center gap-2 p-3.5 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl">
                <FileText className="w-5 h-5 text-amber-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold truncate">{file?.name}</p>
                  <p className="text-[10px] text-slate-700 dark:text-slate-300 font-semibold">{(file?.size / 1024 / 1024).toFixed(2)} MB • Detected {parsedData?.units?.length || 0} Units</p>
                </div>
                <button
                  onClick={resetState}
                  className="text-xs font-bold text-red-600 dark:text-red-400 px-3 py-1.5 hover:bg-red-500/10 rounded-xl"
                >
                  Change File
                </button>
              </div>

              {/* Categorization & Metadata Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Target Branch</label>
                  <select
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
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
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(parseInt(e.target.value))}
                    className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                      <option key={s} value={s}>Semester {s}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Subject Title</label>
                  <input
                    type="text"
                    value={subjectTitle}
                    onChange={(e) => setSubjectTitle(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Enter Subject Name"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Subject Code</label>
                  <input
                    type="text"
                    value={subjectCode}
                    onChange={(e) => setSubjectCode(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Enter Subject Code"
                  />
                </div>
              </div>

              {/* Units Preview */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Settings className="w-3.5 h-3.5" /> Parsed Units Preview
                </h4>
                <div className="max-h-48 overflow-y-auto border border-slate-200 dark:border-white/10 rounded-2xl p-3 bg-slate-50 dark:bg-slate-950/40 space-y-3.5">
                  {parsedData?.units?.map((unit, uIdx) => (
                    <div key={uIdx} className="pb-3 border-b border-slate-200 dark:border-white/5 last:border-b-0">
                      <p className="text-xs font-bold text-amber-600 dark:text-amber-400">{unit.title}</p>
                      <p className="text-[10px] text-slate-700 dark:text-slate-300 leading-normal mt-0.5 line-clamp-2 font-medium">{unit.aiSummary}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end pt-4 border-t border-slate-200 dark:border-white/10">
                <button
                  onClick={resetState}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-white/15 hover:bg-slate-100 dark:hover:bg-white/10 text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImport}
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" /> Import Subject
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
