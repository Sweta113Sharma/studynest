import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X, Send, Bot, User, Loader2, HelpCircle, BookOpen, Minimize2 } from 'lucide-react'
import { aiService } from '../services/aiService'

export default function AIAssistantDrawer({ context }) {
  const { selectedSubject, selectedUnit } = context || {}
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

  const handleSend = async (textToSend) => {
    const query = textToSend || input
    if (!query.trim() || loading) return

    const newMessages = [...messages, { role: 'user', content: query.trim() }]
    setMessages(newMessages)
    if (!textToSend) setInput('')
    setLoading(true)

    try {
      const reply = await aiService.chat(newMessages, contextSummary)
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
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
            <pre key={`code-${idx}`} className="my-2.5 p-3 rounded-xl bg-slate-950 border border-white/20 text-amber-300 font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner">
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
        elements.push(<h4 key={idx} className="text-sm font-bold text-amber-300 mt-3 mb-1.5 flex items-center gap-1.5">{renderInline(trimmed.slice(4))}</h4>)
      } else if (trimmed.startsWith('## ')) {
        elements.push(<h3 key={idx} className="text-base font-bold text-amber-300 mt-3.5 mb-2 flex items-center gap-1.5 border-b border-white/10 pb-1">{renderInline(trimmed.slice(3))}</h3>)
      } else if (trimmed.startsWith('# ')) {
        elements.push(<h2 key={idx} className="text-lg font-bold text-amber-300 mt-4 mb-2 flex items-center gap-1.5">{renderInline(trimmed.slice(2))}</h2>)
      } else if (trimmed.startsWith('> ')) {
        elements.push(
          <div key={idx} className="my-2 p-3 rounded-xl bg-amber-500/20 border-l-4 border-amber-400 text-amber-100 text-xs sm:text-sm font-medium shadow-sm">
            {renderInline(trimmed.replace(/^>\s*/, ''))}
          </div>
        )
      } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        elements.push(
          <div key={idx} className="flex items-start gap-2 my-1.5 text-xs sm:text-sm text-slate-100">
            <span className="text-amber-400 font-bold mt-0.5">•</span>
            <span className="flex-1 text-slate-100">{renderInline(trimmed.slice(2))}</span>
          </div>
        )
      } else {
        elements.push(<p key={idx} className="my-1.5 text-xs sm:text-sm leading-relaxed text-slate-100">{renderInline(trimmed)}</p>)
      }
    })

    if (inCodeBlock && codeContent.length > 0) {
      elements.push(
        <pre key="code-final" className="my-2.5 p-3 rounded-xl bg-slate-900/90 dark:bg-slate-950/90 border border-white/20 text-amber-400 dark:text-amber-300 font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner">
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
        return <strong key={idx} className="font-extrabold text-amber-700 dark:text-amber-300">{part.slice(2, -2)}</strong>
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={idx} className="italic text-foreground/80">{part.slice(1, -1)}</em>
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={idx} className="px-1.5 py-0.5 rounded bg-amber-500/10 font-mono text-[11px] text-amber-700 dark:text-amber-300 border border-amber-500/20 font-bold">{part.slice(1, -1)}</code>
      }
      return <span key={idx} className="text-foreground">{part}</span>
    })
  }

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <motion.button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-3.5 sm:p-4 rounded-full bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white shadow-2xl hover:scale-105 transition-transform flex items-center gap-2 group border border-white/30 backdrop-blur-md"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse text-amber-300" />
          </div>
          <span className="font-semibold text-sm pr-1 hidden sm:inline">AI Study Assistant</span>
        </motion.button>
      )}

      {/* Floating Glassmorphism Corner Widget Component */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[400px] md:w-[430px] h-[540px] max-h-[80vh] glass-ai-body text-foreground z-50 shadow-2xl flex flex-col rounded-3xl overflow-hidden border border-white/60 dark:border-white/20 backdrop-blur-3xl"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          >
              {/* Header */}
              <div className="p-4 border-b border-white/40 dark:border-white/10 flex items-center justify-between bg-white/40 dark:bg-white/5 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white shadow-lg border border-white/40">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm text-foreground">StudyNest AI Companion</h3>
                    <p className="text-[11px] text-muted-foreground truncate max-w-[220px]">
                      {contextSummary}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl glass-pill-badge hover:bg-amber-500/10 text-muted-foreground hover:text-foreground transition-colors"
                  title="Minimize AI Chat"
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
                      <div className="w-7 h-7 rounded-xl bg-amber-500/15 flex items-center justify-center flex-shrink-0 text-amber-600 dark:text-amber-400 mt-1 border border-amber-500/30 shadow-sm">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-tr-xs shadow-md font-medium border border-amber-500/30'
                          : 'glass-card border border-white/50 dark:border-white/10 rounded-tl-xs text-foreground shadow-md backdrop-blur-xl'
                      }`}
                    >
                      {msg.role === 'assistant' ? formatContent(msg.content) : msg.content}
                    </div>
                  </motion.div>
                ))}

                {loading && (
                  <div className="flex gap-3 items-center text-muted-foreground text-xs p-2">
                    <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                    <span>Thinking and generating answer...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts */}
              <div className="px-4 py-2.5 flex gap-1.5 overflow-x-auto no-scrollbar border-t border-white/30 dark:border-white/10 bg-white/30 dark:bg-white/5">
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(prompt)}
                    className="px-3 py-1 rounded-full glass-pill-badge text-[11px] font-semibold text-foreground/90 whitespace-nowrap hover:bg-amber-500/20 hover:text-amber-700 dark:hover:text-amber-300 hover:border-amber-500/40 transition-all shadow-sm"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Input Bar */}
              <div className="p-3.5 border-t border-white/40 dark:border-white/10 bg-white/40 dark:bg-slate-900/60 backdrop-blur-xl">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSend()
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask any question about this topic..."
                    className="flex-1 px-4 py-2.5 rounded-2xl glass-input-box text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="p-2.5 rounded-2xl bg-amber-600 text-white hover:bg-amber-500 disabled:opacity-50 transition-all shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
