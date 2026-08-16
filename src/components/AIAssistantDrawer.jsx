import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Send, Bot, Loader2, Minimize2, Paperclip, File, X } from 'lucide-react'
import { aiService } from '../services/aiService'
import { pdfParserService } from '../services/PdfParserService'
import { useApp } from '../context/AppContext'
import MascotOwl from './MascotOwl'

export default function AIAssistantDrawer({ isOpen: controlledIsOpen, onClose }) {
  const { selectedSubject, selectedUnit, addXP } = useApp()
  const [internalIsOpen, setInternalIsOpen] = useState(false)

  const isDrawerOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen
  const handleClose = () => {
    if (onClose) onClose()
    setInternalIsOpen(false)
  }

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `👋 Hi! I'm your **StudyNest AI Tutor**. What engineering concepts are we learning today?`
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isDrawerOpen) {
      scrollToBottom()
    }
  }, [messages, isDrawerOpen])

  const contextSummary = selectedUnit
    ? `Unit: ${selectedUnit.title} • Subject: ${selectedSubject?.title}`
    : selectedSubject
    ? `Subject: ${selectedSubject.title}`
    : 'B.Tech Academic Curriculum'

  const quickPrompts = [
    'Explain this like I\'m 5 🐣',
    'Generate 3 practice questions 🎯',
    'List all key formulas 📐',
    'How should I prepare for exam? 📝'
  ]

  const [attachment, setAttachment] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setLoading(true)
    try {
      let text = ''
      if (file.type === 'application/pdf') {
        text = await pdfParserService.parseRawText(file)
      } else {
        text = await new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = (event) => resolve(event.target.result)
          reader.onerror = (err) => reject(err)
          reader.readAsText(file)
        })
      }
      setAttachment({ name: file.name, text })
    } catch (err) {
      alert('Failed to parse file: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSend = async (textToSend) => {
    const query = textToSend || input
    if (!query.trim() || loading) return

    const newMessages = [...messages, { role: 'user', content: query.trim() }]
    setMessages(newMessages)
    if (!textToSend) setInput('')
    setLoading(true)

    let finalContext = contextSummary
    if (attachment) {
      finalContext = `[Uploaded Document Context: ${attachment.name}]\n${attachment.text}\n\n${contextSummary}`
    }

    try {
      const reply = await aiService.chat(newMessages, finalContext)
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
      setAttachment(null)
      addXP(5, 'Engaged with AI Tutor')
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `Sorry, I ran into an issue: ${error.message}` }
      ])
    } finally {
      setLoading(false)
    }
  }

  const formatContent = (text) => {
    const lines = text.split('\n')
    let inCodeBlock = false
    let codeContent = []
    const elements = []

    lines.forEach((line, idx) => {
      let trimmed = line.trim()
      
      if (trimmed.startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <pre key={`code-${idx}`} className="my-2 p-3 rounded-xl bg-slate-950 border border-slate-700 text-amber-300 font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner">
              {codeContent.join('\n')}
            </pre>
          )
          codeContent = []
          inCodeBlock = false
        } else {
          inCodeBlock = true
        }
        return
      }

      if (inCodeBlock) {
        codeContent.push(line)
        return
      }

      if (!trimmed) {
        elements.push(<div key={idx} className="h-1.5" />)
        return
      }

      if (trimmed.startsWith('### ')) {
        elements.push(<h4 key={idx} className="text-xs font-bold text-[#123B70] dark:text-blue-300 mt-2.5 mb-1">{renderInline(trimmed.slice(4))}</h4>)
      } else if (trimmed.startsWith('## ')) {
        elements.push(<h3 key={idx} className="text-sm font-bold text-[#123B70] dark:text-blue-300 mt-3 mb-1.5 border-b border-[#E5EAF0] dark:border-white/10 pb-0.5">{renderInline(trimmed.slice(3))}</h3>)
      } else if (trimmed.startsWith('> ')) {
        elements.push(
          <div key={idx} className="my-2 p-2.5 rounded-xl bg-[#EAF4FF] dark:bg-blue-950/40 border-l-3 border-[#2878D4] text-xs font-medium">
            {renderInline(trimmed.replace(/^>\s*/, ''))}
          </div>
        )
      } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        elements.push(
          <div key={idx} className="flex items-start gap-2 my-1 text-xs leading-relaxed">
            <span className="text-[#2878D4] font-bold mt-0.5">•</span>
            <span className="flex-1 font-medium">{renderInline(trimmed.slice(2))}</span>
          </div>
        )
      } else {
        elements.push(<p key={idx} className="my-1 text-xs leading-relaxed font-medium">{renderInline(trimmed)}</p>)
      }
    })

    if (inCodeBlock && codeContent.length > 0) {
      elements.push(
        <pre key="code-final" className="my-2 p-3 rounded-xl bg-slate-950 border border-slate-700 text-amber-300 font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner">
          {codeContent.join('\n')}
        </pre>
      )
    }

    return elements
  }

  const renderInline = (str) => {
    const parts = str.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g)
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={idx} className="font-bold text-[#123B70] dark:text-blue-300">{part.slice(2, -2)}</strong>
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={idx} className="italic">{part.slice(1, -1)}</em>
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={idx} className="px-1.5 py-0.5 rounded bg-amber-500/10 font-mono text-[10px] text-amber-800 dark:text-amber-300 border border-amber-500/30 font-bold">{part.slice(1, -1)}</code>
      }
      return <span key={idx}>{part}</span>
    })
  }

  return (
    <aside aria-label="StudyNest AI Assistant">
      {/* Drawer Container */}
      <AnimatePresence>
        {isDrawerOpen && (
          <motion.div
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[410px] h-[550px] max-h-[85vh] bg-white dark:bg-slate-900 text-[#172033] dark:text-white z-50 shadow-2xl flex flex-col rounded-3xl overflow-hidden border border-[#E5EAF0] dark:border-white/15"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          >
            {/* Header */}
            <div className="p-4 border-b border-[#E5EAF0] dark:border-white/10 flex items-center justify-between bg-[#FFF9EE] dark:bg-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#EAF4FF] dark:bg-blue-950/60 border border-[#2878D4]/20 flex items-center justify-center p-1 shadow-sm">
                  <MascotOwl state="tutor" size="sm" animate={false} />
                </div>
                <div>
                  <h3 className="font-display font-black text-sm text-[#123B70] dark:text-white">
                    StudyNest AI Tutor
                  </h3>
                  <p className="text-[10px] font-semibold text-[#687386] dark:text-slate-400 truncate max-w-[210px]">
                    {contextSummary}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="p-1.5 rounded-xl text-[#687386] hover:text-[#172033] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Minimize AI Chat"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-xl bg-[#EAF4FF] dark:bg-blue-950/60 flex items-center justify-center shrink-0 border border-[#2878D4]/20 mt-1">
                      <MascotOwl state="default" size="xs" animate={false} />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#2878D4] text-white rounded-tr-xs shadow-sm font-semibold'
                        : 'bg-[#F6F9FD] dark:bg-slate-800/80 border border-[#E5EAF0] dark:border-white/10 rounded-tl-xs text-[#172033] dark:text-white shadow-xs'
                    }`}
                  >
                    {msg.role === 'assistant' ? formatContent(msg.content) : msg.content}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <div className="flex gap-2 items-center text-[#687386] dark:text-slate-400 text-xs font-semibold p-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#2878D4]" />
                  <span>The owl is thinking...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            <div className="px-3.5 py-2 flex gap-1.5 overflow-x-auto no-scrollbar border-t border-[#E5EAF0] dark:border-white/10 bg-[#F6F9FD] dark:bg-slate-800/40">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(prompt)}
                  className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 border border-[#E5EAF0] dark:border-white/10 text-[10px] font-bold text-[#123B70] dark:text-blue-300 whitespace-nowrap hover:border-[#2878D4] transition-all shadow-2xs"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Attachment Badge */}
            {attachment && (
              <div className="px-3.5 py-1.5 border-t border-[#E5EAF0] dark:border-white/10 bg-amber-50 dark:bg-amber-950/30 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300 min-w-0">
                  <File className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate max-w-[260px]">{attachment.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAttachment(null)}
                  className="p-1 rounded-md text-slate-500 hover:text-slate-900"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Input Form */}
            <div className="p-3 border-t border-[#E5EAF0] dark:border-white/10 bg-white dark:bg-slate-900">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSend()
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.txt,.md,.json"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded-xl bg-[#F6F9FD] dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#687386] border border-[#E5EAF0] dark:border-slate-700 transition-colors"
                  title="Attach study notes (PDF, TXT, MD, JSON)"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question or request a summary..."
                  className="flex-1 px-3.5 py-2 rounded-xl bg-[#F6F9FD] dark:bg-slate-800 border border-[#E5EAF0] dark:border-slate-700 text-xs text-[#172033] dark:text-white placeholder-[#687386] focus:outline-none focus:ring-2 focus:ring-[#2878D4] font-medium"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="p-2 rounded-xl bg-[#123B70] hover:bg-[#2878D4] text-white disabled:opacity-50 transition-all shadow-sm"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  )
}
