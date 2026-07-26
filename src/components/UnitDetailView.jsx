import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, FileText, Download, ExternalLink, Sparkles, Loader2, Copy, Check, RefreshCw, Bookmark, Layers } from 'lucide-react'
import { aiService } from '../services/aiService'

const tabVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
}

export default function UnitDetailView({ context }) {
  const { selectedUnit, navigateTo, goToSubjectDetail, goHome, goBack, selectedSubject, toggleBookmark, isBookmarked } = context

  const [activeTab, setActiveTab] = useState('ai')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiResult, setAiResult] = useState(null)
  const [activeAIFeature, setActiveAIFeature] = useState('notes-detailed')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (activeTab === 'ai' && !aiResult && !aiLoading && selectedUnit) {
      handleAIFeature('notes-detailed')
    }
  }, [selectedUnit, activeTab])

  if (!selectedUnit) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-xl font-bold">No Unit Selected</h2>
        <p className="text-muted-foreground text-sm">Please select a unit to view study materials and notes.</p>
        <button onClick={goToSubjectDetail || goHome} className="btn-primary">
          Back to Subject
        </button>
      </div>
    )
  }

  const bookmarkId = `unit_${selectedSubject?.id}_${selectedUnit.title}`
  const bookmarked = isBookmarked(bookmarkId)

  const tabs = [
    { id: 'ai', label: 'Detailed AI Notes', icon: Sparkles },
    { id: 'ppts', label: 'Materials', icon: FileText },
    { id: 'youtube', label: 'Videos', icon: ExternalLink }
  ]

  const aiFeatures = [
    { id: 'notes-detailed', label: 'Detailed Master Notes', description: 'Comprehensive textbook-grade notes' },
    { id: 'flashcards', label: 'Flashcards', description: 'Practice active recall' },
    { id: 'quiz', label: 'AI Quiz', description: 'Generate interactive MCQ quiz' }
  ]

  const handleAIFeature = async (featureId) => {
    if (featureId === 'flashcards') {
      navigateTo('flashcards')
      return
    }

    setActiveAIFeature(featureId)
    setAiLoading(true)
    setAiResult(null)

    try {
      const content = selectedUnit.aiSummary || selectedUnit.title
      let result
      switch (featureId) {
        case 'notes-detailed':
          result = await aiService.generateDetailedNotes(content, selectedUnit.title)
          break
        case 'notes':
          result = await aiService.generateNotes(content, selectedUnit.title)
          break
        case 'qa':
          result = await aiService.generateQA(content, 5)
          break
        case 'summary':
          result = await aiService.generateSummary(content)
          break
        case 'quiz':
          const mcqs = await aiService.generateQuiz(content, 5)
          context.setCurrentQuiz({
            id: `ai-${Date.now()}`,
            title: `AI Quiz: ${selectedUnit.title}`,
            questions: mcqs
          })
          context.setQuizState({ currentIndex: 0, score: 0, selectedOption: null, completed: false })
          navigateTo('quiz')
          return
        default:
          result = content
      }
      setAiResult(result)
    } catch (error) {
      setAiResult(`Error: ${error.message}`)
    } finally {
      setAiLoading(false)
    }
  }

  const copyToClipboard = async (text) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatAIResult = (text) => {
    if (!text) return null
    
    const lines = text.split('\n')
    const elements = []
    let currentList = []
    let inCodeBlock = false
    let codeBlockLines = []
    let codeBlockKey = 0
    let inTable = false
    let tableRows = []
    let tableKey = 0

    const renderInline = (str) => {
      const parts = str.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\$[^\$]+\$)/g)
      return parts.map((part, idx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={idx} className="font-bold text-foreground">{part.slice(2, -2)}</strong>
        }
        if (part.startsWith('*') && part.endsWith('*')) {
          return <em key={idx} className="italic text-foreground/90">{part.slice(1, -1)}</em>
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return <code key={idx} className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-950 dark:text-amber-200 border border-amber-300/60 dark:border-amber-800/40 font-mono text-xs">{part.slice(1, -1)}</code>
        }
        if (part.startsWith('$') && part.endsWith('$')) {
          return <span key={idx} className="font-mono text-amber-950 dark:text-amber-200 font-bold px-1.5 py-0.5 rounded bg-amber-200/60 dark:bg-amber-950/70 border border-amber-400/50 dark:border-amber-800/50">{part.slice(1, -1)}</span>
        }
        return part
      })
    }

    const flushList = (key) => {
      if (currentList.length > 0) {
        elements.push(<ul key={`list-${key}`} className="my-3 space-y-2 ml-2 list-disc list-inside">{currentList}</ul>)
        currentList = []
      }
    }

    const flushTable = (key) => {
      if (tableRows.length > 0) {
        const headerRow = tableRows[0]
        const dataRows = tableRows.slice(1).filter(r => !r.every(cell => cell.match(/^:?-+:?$/)))

        elements.push(
          <div key={`table-${key}`} className="my-5 overflow-x-auto rounded-2xl border border-white/10 glass-card shadow-xl">
            <table className="w-full text-left text-xs md:text-sm border-collapse">
              {headerRow && (
                <thead>
                  <tr className="bg-white/10 border-b border-white/15 text-primary font-bold">
                    {headerRow.map((cell, idx) => (
                      <th key={idx} className="p-3 font-bold">{renderInline(cell)}</th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody>
                {dataRows.map((row, rIdx) => (
                  <tr key={rIdx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="p-3 text-foreground/90">{renderInline(cell)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
        tableRows = []
        inTable = false
      }
    }

    lines.forEach((line, i) => {
      const trimmed = line.trim()
      
      if (trimmed.startsWith('```')) {
        flushList(i)
        flushTable(i)
        if (inCodeBlock) {
          elements.push(
            <div key={`code-${codeBlockKey}`} className="my-4 rounded-2xl bg-amber-950/95 dark:bg-black/95 p-4 border border-amber-800/50 shadow-2xl overflow-x-auto">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-amber-800/40 text-xs text-amber-300 font-mono">
                <span className="flex items-center gap-1.5">📐 Visual Diagram / Code Schematic</span>
              </div>
              <pre className="font-mono text-xs md:text-sm text-amber-200 dark:text-emerald-400 whitespace-pre leading-relaxed">
                {codeBlockLines.join('\n')}
              </pre>
            </div>
          )
          codeBlockLines = []
          inCodeBlock = false
        } else {
          inCodeBlock = true
          codeBlockKey = i
        }
        return
      }

      if (inCodeBlock) {
        codeBlockLines.push(line)
        return
      }

      // Check Table Row
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        flushList(i)
        if (!inTable) {
          inTable = true
          tableKey = i
        }
        const cells = trimmed.split('|').slice(1, -1).map(c => c.trim())
        tableRows.push(cells)
        return
      } else if (inTable) {
        flushTable(i)
      }

      if (!trimmed) {
        flushList(i)
        return
      }

      if (trimmed.startsWith('>')) {
        flushList(i)
        elements.push(
          <div key={i} className="my-3 p-4 rounded-2xl bg-amber-100/80 dark:bg-amber-950/40 border-l-4 border-amber-700 text-amber-950 dark:text-amber-100 shadow-md">
            <p className="font-medium text-xs md:text-sm flex items-start gap-2">
              <span className="text-base">🧠</span>
              <span>{renderInline(trimmed.replace(/^>\s*/, ''))}</span>
            </p>
          </div>
        )
      } else if (trimmed.startsWith('#### ')) {
        flushList(i)
        elements.push(<h4 key={i} className="text-base font-bold mt-5 mb-2 text-amber-900 dark:text-amber-300 flex items-center gap-2">{renderInline(trimmed.slice(5))}</h4>)
      } else if (trimmed.startsWith('### ')) {
        flushList(i)
        elements.push(<h3 key={i} className="text-lg md:text-xl font-extrabold mt-6 mb-3 text-amber-900 dark:text-amber-200 flex items-center gap-2 border-b border-amber-800/20 pb-1">{renderInline(trimmed.slice(4))}</h3>)
      } else if (trimmed.startsWith('## ')) {
        flushList(i)
        elements.push(<h2 key={i} className="text-xl md:text-2xl font-black mt-7 mb-4 text-amber-950 dark:text-amber-100 border-b border-amber-800/30 pb-1">{renderInline(trimmed.slice(3))}</h2>)
      } else if (trimmed.startsWith('# ')) {
        flushList(i)
        elements.push(<h1 key={i} className="text-2xl md:text-3xl font-black mt-8 mb-4 text-amber-950 dark:text-amber-100">{renderInline(trimmed.slice(2))}</h1>)
      } else if (trimmed.match(/^[-*•]/) || trimmed.match(/^\d+\./)) {
        const content = trimmed.replace(/^[-*•]\s*/, '').replace(/^\d+\.\s*/, '')
        currentList.push(<li key={i} className="text-foreground/90 text-sm md:text-base leading-relaxed">{renderInline(content)}</li>)
      } else if (trimmed.match(/^(Q\d+:|Answer:|Question:|Solution:)/i)) {
        flushList(i)
        elements.push(
          <div key={i} className="my-3 p-4 rounded-2xl bg-primary/10 border border-primary/20 shadow-sm">
            <p className="font-medium text-foreground text-sm md:text-base">{renderInline(trimmed)}</p>
          </div>
        )
      } else {
        flushList(i)
        elements.push(<p key={i} className="my-2.5 text-foreground/90 text-sm md:text-base leading-relaxed">{renderInline(trimmed)}</p>)
      }
    })

    flushList('end')
    flushTable('end')

    return elements
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.button
        onClick={goBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors py-1 px-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 w-fit"
        whileHover={{ x: -4 }}
        whileTap={{ scale: 0.92 }}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Units
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">
            {selectedUnit.title}
          </h1>
          <p className="text-muted-foreground">{selectedSubject?.title}</p>
        </div>
        <button
          onClick={() => toggleBookmark({
            id: bookmarkId,
            title: selectedUnit.title,
            subjectTitle: selectedSubject?.title,
            subject: selectedSubject,
            unit: selectedUnit
          })}
          className={`px-3.5 py-2.5 rounded-xl border flex items-center gap-2 text-xs font-semibold transition-all duration-200 active:scale-95 ${
            bookmarked
              ? 'bg-amber-500/20 border-amber-500 text-amber-800 dark:text-amber-300 shadow-md shadow-amber-500/10'
              : 'glass-card border-white/20 text-muted-foreground hover:text-foreground hover:bg-white/40 dark:hover:bg-white/10'
          }`}
          title={bookmarked ? 'Remove Bookmark' : 'Bookmark Unit'}
        >
          <Bookmark className={`w-4 h-4 transition-transform duration-200 ${bookmarked ? 'fill-amber-500 text-amber-500 scale-110' : ''}`} />
          <span>{bookmarked ? 'Bookmarked ✓' : 'Bookmark Unit'}</span>
        </button>
      </motion.div>

      <motion.div
        className="flex gap-2 flex-wrap"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-primary text-white shadow-glow'
                : 'glass-card border border-white/5 hover:border-primary/30'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        {activeTab === 'ai' && (
          <motion.div
            key="ai-tab"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="flex gap-2 flex-wrap">
              {aiFeatures.map((feature) => (
                <button
                  key={feature.id}
                  onClick={() => handleAIFeature(feature.id)}
                  disabled={aiLoading}
                  className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 group ${
                    activeAIFeature === feature.id
                      ? 'bg-gradient-to-r from-[#78350F] to-amber-900 text-white shadow-glow'
                      : 'glass-card border border-white/5 hover:border-primary/30'
                  }`}
                >
                  {feature.label}
                  <span className="absolute -top-2 -right-1 px-1.5 py-0.5 rounded-full bg-[#78350F] text-[8px] font-bold text-white scale-0 group-hover:scale-100 transition-transform origin-bottom-left border border-white/20">
                    AI POWERED
                  </span>
                </button>
              ))}
            </div>

            <div className="glass-card rounded-xl p-6 min-h-[300px]">
              {aiLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <span className="ml-3 text-muted-foreground">Generating...</span>
                </div>
              ) : aiResult ? (
                <div className="relative">
                  <div className="absolute top-0 right-0 flex gap-2">
                    <button
                      onClick={() => copyToClipboard(aiResult)}
                      className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                      title="Copy"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleAIFeature(activeAIFeature)}
                      className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                      title="Regenerate"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="prose prose-invert max-w-none">
                    {formatAIResult(aiResult)}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select an AI feature to generate content</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'ppts' && (
          <motion.div
            key="ppts-tab"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
          >
            <div className="space-y-3">
              {(!selectedUnit.ppts || selectedUnit.ppts.length === 0) && 
               (!selectedUnit.notes || selectedUnit.notes.length === 0) ? (
                <div className="text-center py-12 glass-card rounded-xl">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No materials available yet</p>
                </div>
              ) : (
                <>
                  {selectedUnit.ppts?.map((ppt, i) => (
                    <motion.div
                      key={i}
                      className="glass-card rounded-xl p-4 flex items-center gap-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{ppt.title}</h3>
                        <p className="text-sm text-muted-foreground">{ppt.size}</p>
                      </div>
                      <button 
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                        onClick={() => ppt.url && window.open(ppt.url, '_blank')}
                      >
                        <Download className={`w-5 h-5 ${ppt.url ? 'text-blue-400' : 'text-gray-600'}`} />
                      </button>
                    </motion.div>
                  ))}
                  {selectedUnit.notes?.map((note, i) => (
                    <motion.div
                      key={`note-${i}`}
                      className="glass-card rounded-xl p-4 flex items-center gap-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (selectedUnit.ppts?.length || 0) * 0.1 + i * 0.1 }}
                    >
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{note.title}</h3>
                        <p className="text-sm text-muted-foreground">{note.desc}</p>
                      </div>
                      <button 
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                        onClick={() => note.url && window.open(note.url, '_blank')}
                      >
                        <ExternalLink className={`w-5 h-5 ${note.url ? 'text-emerald-400' : 'text-gray-600'}`} />
                      </button>
                    </motion.div>
                  ))}
                </>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'youtube' && (
          <motion.div
            key="youtube-tab"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
          >
            <div className="space-y-3">
              {!selectedUnit.youtube || selectedUnit.youtube.length === 0 ? (
                <div className="text-center py-12 glass-card rounded-xl">
                  <ExternalLink className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No videos available yet</p>
                </div>
              ) : (
                selectedUnit.youtube.map((video, i) => (
                  <motion.a
                    key={i}
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-card rounded-xl p-4 flex items-center gap-4 hover:bg-white/10 transition-all group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center group-hover:bg-red-500/30 transition-colors">
                      <ExternalLink className="w-6 h-6 text-red-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{video.title}</h3>
                      <p className="text-sm text-muted-foreground">{video.channel}</p>
                    </div>
                    <span className="text-muted-foreground group-hover:text-red-400 transition-colors">↗</span>
                  </motion.a>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}