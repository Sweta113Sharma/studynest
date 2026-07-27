import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, FileText, Download, ExternalLink, Sparkles, Loader2, Copy, Check, RefreshCw, Bookmark } from 'lucide-react'
import { aiService } from '../services/aiService'
import { useApp } from '../context/AppContext'

const tabVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
}

export default function UnitDetailView() {
  const {
    selectedUnit,
    navigateTo,
    goToSubjectDetail,
    goHome,
    goBack,
    selectedSubject,
    toggleBookmark,
    isBookmarked,
    setCurrentQuiz,
    setQuizState
  } = useApp()

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
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">No Unit Selected</h2>
        <p className="text-slate-700 dark:text-slate-300 text-sm font-medium">Please select a unit to view study materials and notes.</p>
        <button onClick={goToSubjectDetail || goHome} className="btn-primary focus-visible:ring-2 focus-visible:ring-amber-500">
          Back to Subject
        </button>
      </div>
    )
  }

  const bookmarkId = `unit_${selectedSubject?.id}_${selectedUnit.title}`
  const bookmarked = isBookmarked(bookmarkId)

  const tabs = [
    { id: 'ai', label: 'Detailed AI Notes', icon: Sparkles },
    { id: 'ppts', label: 'Materials & PPTs', icon: FileText },
    { id: 'youtube', label: 'Video Lectures', icon: ExternalLink }
  ]

  const aiFeatures = [
    { id: 'notes-detailed', label: 'Detailed Master Notes' },
    { id: 'flashcards', label: 'Flashcards' },
    { id: 'quiz', label: 'AI Quiz' }
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
          setCurrentQuiz({
            id: `ai-${Date.now()}`,
            title: `AI Quiz: ${selectedUnit.title}`,
            questions: mcqs
          })
          setQuizState({ currentIndex: 0, score: 0, selectedOption: null, completed: false })
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

    const renderInline = (str) => {
      const parts = str.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\$[^\$]+\$)/g)
      return parts.map((part, idx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={idx} className="font-bold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>
        }
        if (part.startsWith('*') && part.endsWith('*')) {
          return <em key={idx} className="italic text-slate-800 dark:text-slate-200">{part.slice(1, -1)}</em>
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return <code key={idx} className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-900 dark:text-amber-200 border border-amber-500/30 font-mono text-xs">{part.slice(1, -1)}</code>
        }
        if (part.startsWith('$') && part.endsWith('$')) {
          return <span key={idx} className="font-mono text-amber-900 dark:text-amber-200 font-bold px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/40">{part.slice(1, -1)}</span>
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

    lines.forEach((line, i) => {
      const trimmed = line.trim()
      
      if (trimmed.startsWith('```')) {
        flushList(i)
        if (inCodeBlock) {
          elements.push(
            <div key={`code-${codeBlockKey}`} className="my-4 rounded-2xl bg-slate-900 p-4 border border-amber-500/30 shadow-xl overflow-x-auto">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-700 text-xs text-amber-400 font-mono">
                <span>Visual Diagram / Code Schematic</span>
              </div>
              <pre className="font-mono text-xs md:text-sm text-amber-200 whitespace-pre leading-relaxed">
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

      if (!trimmed) {
        flushList(i)
        return
      }

      if (trimmed.startsWith('>')) {
        flushList(i)
        elements.push(
          <div key={i} className="my-3 p-4 rounded-2xl bg-amber-500/10 border-l-4 border-amber-600 text-slate-900 dark:text-slate-100 shadow-sm">
            <p className="font-semibold text-xs md:text-sm flex items-start gap-2">
              <span className="text-base">🧠</span>
              <span>{renderInline(trimmed.replace(/^>\s*/, ''))}</span>
            </p>
          </div>
        )
      } else if (trimmed.startsWith('#### ')) {
        flushList(i)
        elements.push(<h4 key={i} className="text-base font-bold mt-5 mb-2 text-slate-900 dark:text-white flex items-center gap-2">{renderInline(trimmed.slice(5))}</h4>)
      } else if (trimmed.startsWith('### ')) {
        flushList(i)
        elements.push(<h3 key={i} className="text-lg md:text-xl font-extrabold mt-6 mb-3 text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-300 dark:border-white/10 pb-1">{renderInline(trimmed.slice(4))}</h3>)
      } else if (trimmed.startsWith('## ')) {
        flushList(i)
        elements.push(<h2 key={i} className="text-xl md:text-2xl font-black mt-7 mb-4 text-slate-900 dark:text-white border-b border-slate-300 dark:border-white/15 pb-1">{renderInline(trimmed.slice(3))}</h2>)
      } else if (trimmed.startsWith('# ')) {
        flushList(i)
        elements.push(<h1 key={i} className="text-2xl md:text-3xl font-black mt-8 mb-4 text-slate-900 dark:text-white">{renderInline(trimmed.slice(2))}</h1>)
      } else if (trimmed.match(/^[-*•]/) || trimmed.match(/^\d+\./)) {
        const content = trimmed.replace(/^[-*•]\s*/, '').replace(/^\d+\.\s*/, '')
        currentList.push(<li key={i} className="text-slate-800 dark:text-slate-200 text-sm md:text-base font-medium leading-relaxed">{renderInline(content)}</li>)
      } else {
        flushList(i)
        elements.push(<p key={i} className="my-2.5 text-slate-800 dark:text-slate-200 text-sm md:text-base font-medium leading-relaxed">{renderInline(trimmed)}</p>)
      }
    })

    flushList('end')
    return elements
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.button
        type="button"
        onClick={goBack}
        className="flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 font-semibold text-sm transition-colors py-1.5 px-3 rounded-xl hover:bg-slate-200/60 dark:hover:bg-white/10 w-fit focus-visible:ring-2 focus-visible:ring-amber-500"
        whileHover={{ x: -4 }}
        whileTap={{ scale: 0.92 }}
        aria-label="Back to Units"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Units</span>
      </motion.button>

      <motion.header
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-black text-slate-900 dark:text-white mb-2">
            {selectedUnit.title}
          </h1>
          <p className="text-slate-700 dark:text-slate-300 font-semibold text-sm">{selectedSubject?.title}</p>
        </div>
        <button
          type="button"
          onClick={() => toggleBookmark({
            id: bookmarkId,
            title: selectedUnit.title,
            subjectTitle: selectedSubject?.title,
            subject: selectedSubject,
            unit: selectedUnit
          })}
          className={`px-3.5 py-2 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all focus-visible:ring-2 focus-visible:ring-amber-500 ${
            bookmarked
              ? 'bg-amber-500/20 border-amber-500 text-amber-800 dark:text-amber-300 shadow-sm'
              : 'glass-card border-slate-300 dark:border-white/15 text-slate-700 dark:text-slate-300 hover:border-amber-500/40'
          }`}
          aria-label={bookmarked ? `Remove bookmark for ${selectedUnit.title}` : `Bookmark ${selectedUnit.title}`}
        >
          <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
          <span>{bookmarked ? 'Bookmarked ✓' : 'Bookmark Unit'}</span>
        </button>
      </motion.header>

      {/* Main Tab Navigation */}
      <nav className="flex gap-2 flex-wrap" aria-label="Unit Content Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-amber-500 ${
              activeTab === tab.id
                ? 'bg-amber-600 text-white shadow-md'
                : 'glass-card border border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-100 hover:border-amber-500/40'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

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
                  type="button"
                  onClick={() => handleAIFeature(feature.id)}
                  disabled={aiLoading}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-amber-500 ${
                    activeAIFeature === feature.id
                      ? 'bg-amber-700 text-white shadow-md'
                      : 'glass-card border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white hover:border-amber-500/40'
                  }`}
                >
                  <span>{feature.label}</span>
                </button>
              ))}
            </div>

            <article className="glass-card rounded-2xl p-6 border border-slate-300 dark:border-white/10 min-h-[300px]">
              {aiLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-amber-600 dark:text-amber-400" />
                  <span className="ml-3 font-semibold text-slate-700 dark:text-slate-300 text-sm">Generating AI Notes...</span>
                </div>
              ) : aiResult ? (
                <div className="relative">
                  <div className="absolute top-0 right-0 flex gap-2">
                    <button
                      type="button"
                      onClick={() => copyToClipboard(aiResult)}
                      className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-amber-500"
                      aria-label="Copy to Clipboard"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-700 dark:text-slate-300" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAIFeature(activeAIFeature)}
                      className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-amber-500"
                      aria-label="Regenerate Content"
                    >
                      <RefreshCw className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                    </button>
                  </div>
                  <div className="prose dark:prose-invert max-w-none">
                    {formatAIResult(aiResult)}
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 text-slate-700 dark:text-slate-300">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50 text-amber-600 dark:text-amber-400" />
                  <p className="font-semibold text-sm">Select an AI feature above to generate textbook-grade notes</p>
                </div>
              )}
            </article>
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
                <div className="text-center py-12 glass-card rounded-2xl border border-slate-300 dark:border-white/10">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-slate-500 dark:text-slate-400" />
                  <p className="text-slate-700 dark:text-slate-300 font-semibold text-sm">No materials available yet</p>
                </div>
              ) : (
                <>
                  {selectedUnit.ppts?.map((ppt, i) => (
                    <motion.div
                      key={i}
                      className="glass-card rounded-2xl p-4 border border-slate-300 dark:border-white/10 flex items-center gap-4"
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-amber-700 dark:text-amber-300" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 dark:text-white text-base">{ppt.title}</h3>
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{ppt.size}</p>
                      </div>
                      <button 
                        type="button"
                        className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-amber-500"
                        onClick={() => ppt.url && window.open(ppt.url, '_blank')}
                        aria-label={`Download ${ppt.title}`}
                      >
                        <Download className="w-5 h-5 text-amber-700 dark:text-amber-300" />
                      </button>
                    </motion.div>
                  ))}
                  {selectedUnit.notes?.map((note, i) => (
                    <motion.div
                      key={`note-${i}`}
                      className="glass-card rounded-2xl p-4 border border-slate-300 dark:border-white/10 flex items-center gap-4"
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (selectedUnit.ppts?.length || 0) * 0.08 + i * 0.08 }}
                    >
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-emerald-700 dark:text-emerald-300" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 dark:text-white text-base">{note.title}</h3>
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{note.desc}</p>
                      </div>
                      <button 
                        type="button"
                        className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-amber-500"
                        onClick={() => note.url && window.open(note.url, '_blank')}
                        aria-label={`Open link for ${note.title}`}
                      >
                        <ExternalLink className="w-5 h-5 text-emerald-700 dark:text-emerald-300" />
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
                <div className="text-center py-12 glass-card rounded-2xl border border-slate-300 dark:border-white/10">
                  <ExternalLink className="w-12 h-12 mx-auto mb-4 text-slate-500 dark:text-slate-400" />
                  <p className="text-slate-700 dark:text-slate-300 font-semibold text-sm">No videos available yet</p>
                </div>
              ) : (
                selectedUnit.youtube.map((video, i) => (
                  <motion.a
                    key={i}
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-card rounded-2xl p-4 border border-slate-300 dark:border-white/10 flex items-center gap-4 hover:border-amber-500/40 transition-all group focus-visible:ring-2 focus-visible:ring-amber-500"
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={{ scale: 1.01 }}
                    aria-label={`Watch ${video.title} on YouTube`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                      <ExternalLink className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 dark:text-white text-base">{video.title}</h3>
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{video.channel}</p>
                    </div>
                    <span className="text-slate-500 dark:text-slate-400 group-hover:text-red-600 font-bold">↗</span>
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