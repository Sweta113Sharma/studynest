import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Send, Bot, Loader2, Minimize2, Paperclip, File, X } from 'lucide-react'
import { aiService } from '../services/aiService'
import { pdfParserService } from '../services/PdfParserService'
import { useApp } from '../context/AppContext'

export default function AIAssistantDrawer() {
  const { selectedSubject, selectedUnit } = useApp()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `👋 Hi! I'm **StudyNest AI**, your personal engineering study companion. How can I help you excel today?`
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen])

  const contextSummary = selectedUnit
    ? `Unit: ${selectedUnit.title} in Subject: ${selectedSubject?.title}`
    : selectedSubject
    ? `Subject: ${selectedSubject.title}`
    : 'General Engineering Studies'

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
            <pre key={`code-${idx}`} className="my-2.5 p-3 rounded-xl bg-slate-950 border border-slate-700 text-amber-300 font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner">
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
        elements.push(<div key={idx} className="h-2" />)
        return
      }

      if (trimmed.startsWith('### ')) {
        elements.push(<h4 key={idx} className="text-sm font-bold text-[#78350F] dark:text-amber-300 mt-3 mb-1.5 flex items-center gap-1.5">{renderInline(trimmed.slice(4))}</h4>)
      } else if (trimmed.startsWith('## ')) {
        elements.push(<h3 key={idx} className="text-base font-bold text-[#78350F] dark:text-amber-300 mt-3.5 mb-2 flex items-center gap-1.5 border-b border-slate-300 dark:border-white/10 pb-1">{renderInline(trimmed.slice(3))}</h3>)
      } else if (trimmed.startsWith('# ')) {
        elements.push(<h2 key={idx} className="text-lg font-bold text-[#78350F] dark:text-amber-300 mt-4 mb-2 flex items-center gap-1.5">{renderInline(trimmed.slice(2))}</h2>)
      } else if (trimmed.startsWith('> ')) {
        elements.push(
          <div key={idx} className="my-2 p-3 rounded-xl bg-amber-500/15 border-l-4 border-amber-600 text-slate-900 dark:text-amber-100 text-xs sm:text-sm font-semibold shadow-sm">
            {renderInline(trimmed.replace(/^>\s*/, ''))}
          </div>
        )
      } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        elements.push(
          <div key={idx} className="flex items-start gap-2 my-1.5 text-xs sm:text-sm text-slate-900 dark:text-slate-100">
            <span className="text-amber-600 font-bold mt-0.5">•</span>
            <span className="flex-1 text-slate-900 dark:text-slate-100 font-medium">{renderInline(trimmed.slice(2))}</span>
          </div>
        )
      } else {
        elements.push(<p key={idx} className="my-1.5 text-xs sm:text-sm leading-relaxed text-slate-900 dark:text-slate-100 font-medium">{renderInline(trimmed)}</p>)
      }
    })

    if (inCodeBlock && codeContent.length > 0) {
      elements.push(
        <pre key="code-final" className="my-2.5 p-3 rounded-xl bg-slate-950 border border-slate-700 text-amber-300 font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner">
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
        return <strong key={idx} className="font-extrabold text-[#78350F] dark:text-amber-300">{part.slice(2, -2)}</strong>
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={idx} className="italic text-slate-900 dark:text-slate-200">{part.slice(1, -1)}</em>
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={idx} className="px-1.5 py-0.5 rounded bg-amber-500/10 font-mono text-[11px] text-[#78350F] dark:text-amber-300 border border-amber-500/30 font-bold">{part.slice(1, -1)}</code>
      }
      return <span key={idx} className="text-slate-900 dark:text-slate-100">{part}</span>
    })
  }

  return (
    <aside aria-label="AI Assistant Panel">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <motion.button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-3.5 sm:p-4 rounded-full bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white shadow-2xl hover:scale-105 transition-transform flex items-center gap-2 group border border-white/30 backdrop-blur-md focus-visible:ring-2 focus-visible:ring-amber-500"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          aria-label="Open AI Study Assistant"
        >
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300" />
          <span className="font-bold text-sm pr-1 hidden sm:inline">AI Study Assistant</span>
        </motion.button>
      )}

      {/* Drawer Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[400px] md:w-[430px] h-[540px] max-h-[80vh] bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white z-50 shadow-2xl flex flex-col rounded-3xl overflow-hidden border border-slate-300 dark:border-white/20 backdrop-blur-3xl"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-300 dark:border-white/10 flex items-center justify-between bg-slate-100/60 dark:bg-white/5 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-600 flex items-center justify-center text-white shadow-md">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-sm text-slate-900 dark:text-white">StudyNest AI Companion</h3>
                  <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[220px]">
                    {contextSummary}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl glass-pill-badge hover:bg-amber-500/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-amber-500"
                aria-label="Minimize AI Chat"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-xl bg-amber-500/15 flex items-center justify-center flex-shrink-0 text-amber-700 dark:text-amber-400 mt-1 border border-amber-500/30">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-amber-600 text-white rounded-tr-xs shadow-md font-bold'
                        : 'glass-card border border-slate-300 dark:border-white/10 rounded-tl-xs text-slate-900 dark:text-white shadow-md'
                    }`}
                  >
                    {msg.role === 'assistant' ? formatContent(msg.content) : msg.content}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <div className="flex gap-3 items-center text-slate-700 dark:text-slate-300 text-xs font-semibold p-2">
                  <Loader2 className="w-4 h-4 animate-spin text-amber-600 dark:text-amber-400" />
                  <span>Thinking and generating answer...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            <div className="px-4 py-2.5 flex gap-1.5 overflow-x-auto no-scrollbar border-t border-slate-300 dark:border-white/10 bg-slate-100/60 dark:bg-white/5">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(prompt)}
                  className="px-3 py-1 rounded-full glass-pill-badge text-[11px] font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap hover:bg-amber-500/20 hover:text-amber-700 dark:hover:text-amber-300 transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-amber-500"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Attachment Badge */}
            {attachment && (
              <div className="px-4 py-2 border-t border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-slate-950 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400 min-w-0">
                  <File className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate max-w-[280px]">{attachment.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAttachment(null)}
                  className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 hover:text-slate-950"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Input Form */}
            <div className="p-3.5 border-t border-slate-300 dark:border-white/10 bg-white dark:bg-slate-900">
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
                  className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-500/10 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 transition-colors flex items-center justify-center focus-visible:ring-2 focus-visible:ring-amber-500"
                  title="Attach study material (PDF, TXT, MD, JSON)"
                >
                  <Paperclip className="w-4.5 h-4.5" />
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask any question about this topic..."
                  className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                  aria-label="AI prompt input"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="p-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white disabled:opacity-50 transition-all shadow-md flex items-center justify-center focus-visible:ring-2 focus-visible:ring-amber-500"
                  aria-label="Send message"
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
