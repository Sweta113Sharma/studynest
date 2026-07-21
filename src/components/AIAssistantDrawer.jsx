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
    return lines.map((line, idx) => {
      let trimmed = line.trim()
      if (!trimmed) return <div key={idx} className="h-2" />

      if (trimmed.startsWith('### ')) {
        return <h4 key={idx} className="text-sm font-bold text-primary mt-3 mb-1">{trimmed.slice(4)}</h4>
      }
      if (trimmed.startsWith('## ')) {
        return <h3 key={idx} className="text-base font-bold text-primary mt-3 mb-1">{trimmed.slice(3)}</h3>
      }
      if (trimmed.startsWith('# ')) {
        return <h2 key={idx} className="text-lg font-bold text-primary mt-4 mb-2">{trimmed.slice(2)}</h2>
      }
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        return (
          <div key={idx} className="flex items-start gap-2 my-1 text-xs sm:text-sm">
            <span className="text-primary mt-1">•</span>
            <span>{renderInline(trimmed.slice(2))}</span>
          </div>
        )
      }
      return <p key={idx} className="my-1 text-xs sm:text-sm leading-relaxed">{renderInline(trimmed)}</p>
    })
  }

  const renderInline = (str) => {
    const parts = str.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g)
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={idx} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={idx}>{part.slice(1, -1)}</em>
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={idx} className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-[11px] text-amber-300">{part.slice(1, -1)}</code>
      }
      return part
    })
  }

  return (
    <>
      {/* Floating Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-gradient-to-r from-primary to-amber-500 text-white shadow-2xl hover:scale-105 transition-transform flex items-center gap-2 group border border-white/20"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="relative">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
        <span className="font-semibold text-sm pr-1 hidden sm:inline">AI Study Assistant</span>
      </motion.button>

      {/* Drawer Component */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for mobile */}
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              className="fixed bottom-0 right-0 top-0 w-full sm:w-[420px] glass-card z-50 shadow-2xl flex flex-col border-l border-white/10"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {/* Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center text-white shadow-glow">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm">StudyNest AI Companion</h3>
                    <p className="text-[11px] text-muted-foreground truncate max-w-[220px]">
                      {contextSummary}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
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
                      <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary mt-1">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] p-3.5 rounded-2xl ${
                        msg.role === 'user'
                          ? 'bg-primary text-white rounded-tr-xs'
                          : 'glass-card border border-white/10 rounded-tl-xs text-foreground/90'
                      }`}
                    >
                      {msg.role === 'assistant' ? formatContent(msg.content) : msg.content}
                    </div>
                  </motion.div>
                ))}

                {loading && (
                  <div className="flex gap-3 items-center text-muted-foreground text-xs p-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span>Thinking and generating answer...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts */}
              <div className="px-4 py-2 flex gap-1.5 overflow-x-auto no-scrollbar border-t border-white/5">
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(prompt)}
                    className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-medium whitespace-nowrap hover:bg-primary/20 hover:border-primary/40 transition-all"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Input Bar */}
              <div className="p-4 border-t border-white/10 bg-white/5">
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
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="p-2.5 rounded-xl bg-primary text-white hover:brightness-110 disabled:opacity-50 transition-all"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
