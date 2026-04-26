import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, FileText, Download, ExternalLink, Sparkles, Loader2, Copy, Check, RefreshCw } from 'lucide-react'
import { aiService } from '../services/aiService'

const tabVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
}

export default function UnitDetailView({ context }) {
  const { selectedUnit, navigateTo, goToSubjectDetail, selectedSubject } = context

  const [activeTab, setActiveTab] = useState('ai')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiResult, setAiResult] = useState(null)
  const [activeAIFeature, setActiveAIFeature] = useState('notes')
  const [copied, setCopied] = useState(false)

  if (!selectedUnit) return null

  const tabs = [
    { id: 'ai', label: '✨ AI Notes', icon: Sparkles },
    { id: 'ppts', label: '📄 Materials', icon: FileText },
    { id: 'youtube', label: '▶️ Videos', icon: ExternalLink }
  ]

  const aiFeatures = [
    { id: 'notes', label: '📝 Smart Notes', description: 'Generate detailed revision notes' },
    { id: 'qa', label: '❓ Q&A', description: 'Practice questions & answers' },
    { id: 'summary', label: '📋 Summary', description: 'Quick summary of the unit' },
    { id: 'quiz', label: '🎯 AI Quiz', description: 'Generate interactive MCQ quiz' }
  ]

  const handleAIFeature = async (featureId) => {
    setActiveAIFeature(featureId)
    setAiLoading(true)
    setAiResult(null)

    try {
      const content = selectedUnit.aiSummary || selectedUnit.title
      let result
      switch (featureId) {
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
          return // Exit early as we navigated away
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
    let inList = false

    const renderInline = (str) => {
      // Replace **bold** and *italic* with styled spans
      const parts = str.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
      return parts.map((part, idx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={idx}>{part.slice(2, -2)}</strong>
        }
        if (part.startsWith('*') && part.endsWith('*')) {
          return <em key={idx}>{part.slice(1, -1)}</em>
        }
        return part
      })
    }

    const flushList = (key) => {
      if (currentList.length > 0) {
        elements.push(<ul key={`list-${key}`} className="my-3 space-y-1 ml-4 list-disc list-inside">{currentList}</ul>)
        currentList = []
        inList = false
      }
    }

    lines.forEach((line, i) => {
      const trimmed = line.trim()
      if (!trimmed) {
        flushList(i)
        return
      }

      if (trimmed.startsWith('### ')) {
        flushList(i)
        elements.push(<h3 key={i} className="text-lg font-bold mt-4 mb-2 text-primary">{renderInline(trimmed.slice(4))}</h3>)
      } else if (trimmed.startsWith('## ')) {
        flushList(i)
        elements.push(<h2 key={i} className="text-xl font-bold mt-5 mb-2 text-primary">{renderInline(trimmed.slice(3))}</h2>)
      } else if (trimmed.startsWith('# ')) {
        flushList(i)
        elements.push(<h1 key={i} className="text-2xl font-bold mt-5 mb-2 text-primary">{renderInline(trimmed.slice(2))}</h1>)
      } else if (trimmed.match(/^[-*•]/) || trimmed.match(/^\d+\./)) {
        inList = true
        const content = trimmed.replace(/^[-*•]\s*/, '').replace(/^\d+\.\s*/, '')
        currentList.push(<li key={i} className="text-foreground/90">{renderInline(content)}</li>)
      } else if (trimmed.match(/^(Q\d+:|Answer:)/i)) {
        flushList(i)
        elements.push(
          <div key={i} className="my-3 p-3 rounded-lg bg-white/5">
            <p className="font-medium text-primary">{renderInline(trimmed)}</p>
          </div>
        )
      } else {
        flushList(i)
        elements.push(<p key={i} className="my-2 text-foreground/90">{renderInline(trimmed)}</p>)
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
        onClick={goToSubjectDetail}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        whileHover={{ x: -4 }}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Units
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">
          {selectedUnit.title}
        </h1>
        <p className="text-muted-foreground">{selectedSubject?.title}</p>
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
                      ? 'bg-gradient-to-r from-primary to-purple-500 text-white shadow-glow'
                      : 'glass-card border border-white/5 hover:border-primary/30'
                  }`}
                >
                  {feature.label}
                  <span className="absolute -top-2 -right-1 px-1.5 py-0.5 rounded-full bg-amber-500 text-[8px] font-bold text-black scale-0 group-hover:scale-100 transition-transform origin-bottom-left">
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