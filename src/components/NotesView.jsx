import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  Plus,
  Search,
  Pin,
  Trash2,
  Tag,
  BookOpen,
  Calendar,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import MascotOwl from './MascotOwl'

export default function NotesView({ onOpenAI }) {
  const { notes, addNote, deleteNote, togglePinNote } = useApp()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('All')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newSubject, setNewSubject] = useState('Java Programming')
  const [newContent, setNewContent] = useState('')
  const [newTags, setNewTags] = useState('')
  const [isPinned, setIsPinned] = useState(false)

  const subjectsList = ['All', ...new Set(notes.map(n => n.subject).filter(Boolean))]

  const filteredNotes = notes.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (n.tags && n.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())))
    const matchesSubject = selectedSubject === 'All' || n.subject === selectedSubject
    return matchesSearch && matchesSubject
  })

  const pinnedNotes = filteredNotes.filter(n => n.isPinned)
  const regularNotes = filteredNotes.filter(n => !n.isPinned)

  const handleCreateNote = (e) => {
    e.preventDefault()
    if (!newTitle.trim() || !newContent.trim()) return

    const tagArray = newTags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0)

    addNote({
      title: newTitle,
      subject: newSubject,
      content: newContent,
      tags: tagArray.length > 0 ? tagArray : ['Notes'],
      isPinned
    })

    setNewTitle('')
    setNewContent('')
    setNewTags('')
    setIsPinned(false)
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-nest-border dark:border-white/10 shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-xs font-bold text-nest-blue dark:text-blue-400 uppercase tracking-wider mb-1">
            <FileText className="w-4 h-4" />
            Study Workspace
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-nest-navy dark:text-white">
            Smart Study Notes
          </h1>
          <p className="text-xs sm:text-sm text-nest-gray dark:text-slate-300 mt-1 max-w-xl">
            Keep your revision summaries, lecture notes, and formula sheets organized in one cozy place.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-nest-navy hover:bg-nest-blue text-white text-xs sm:text-sm font-semibold transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Note
          </button>
        </div>

        {/* Decorative background owl */}
        <div className="absolute right-4 -bottom-6 opacity-15 pointer-events-none hidden md:block">
          <MascotOwl state="studying" size="lg" animate={false} />
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-nest-gray absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes by keyword, topic, or tag..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-nest-border dark:border-white/10 text-xs sm:text-sm text-nest-navy dark:text-white placeholder-nest-gray focus:outline-none focus:ring-2 focus:ring-nest-blue shadow-sm font-medium"
          />
        </div>

        {/* Subject Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {subjectsList.map((subj) => (
            <button
              key={subj}
              type="button"
              onClick={() => setSelectedSubject(subj)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedSubject === subj
                  ? 'bg-nest-navy text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-nest-border dark:border-white/10 text-nest-gray dark:text-slate-300 hover:border-nest-blue/40'
              }`}
            >
              {subj}
            </button>
          ))}
        </div>
      </div>

      {/* Pinned Notes Section */}
      {pinnedNotes.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-nest-navy dark:text-blue-300 uppercase tracking-wider">
            <Pin className="w-3.5 h-3.5 fill-current" />
            Pinned Notes ({pinnedNotes.length})
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pinnedNotes.map((note) => (
              <NoteCard key={note.id} note={note} onPin={togglePinNote} onDelete={deleteNote} onOpenAI={onOpenAI} />
            ))}
          </div>
        </section>
      )}

      {/* Regular Notes Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-nest-gray dark:text-slate-400 uppercase tracking-wider">
            {pinnedNotes.length > 0 ? `All Notes (${regularNotes.length})` : `Study Notes (${filteredNotes.length})`}
          </div>
        </div>

        {filteredNotes.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-nest-border dark:border-white/10 flex flex-col items-center justify-center">
            <MascotOwl state="empty" size="lg" />
            <h3 className="text-lg font-bold font-display text-nest-navy dark:text-white mt-4">
              Your nest is empty!
            </h3>
            <p className="text-xs sm:text-sm text-nest-gray dark:text-slate-400 max-w-sm mt-1">
              Create your first study note to organize your formulas, lecture summaries, and insights.
            </p>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="mt-5 flex items-center gap-2 px-5 py-2 rounded-xl bg-nest-gold text-nest-navy font-bold text-xs sm:text-sm shadow-md hover:bg-amber-400 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Create Note
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {regularNotes.map((note) => (
              <NoteCard key={note.id} note={note} onPin={togglePinNote} onDelete={deleteNote} onOpenAI={onOpenAI} />
            ))}
          </div>
        )}
      </section>

      {/* Create Note Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-nest-border dark:border-white/10 shadow-2xl p-6 relative overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between pb-4 border-b border-nest-border dark:border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-nest-light-blue dark:bg-blue-950/60 border border-nest-blue/20 flex items-center justify-center text-nest-blue">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-display font-bold text-nest-navy dark:text-white">
                      Create Study Note
                    </h2>
                    <p className="text-[11px] text-nest-gray dark:text-slate-400">Add key concepts, formula cheat-sheets & summaries</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 text-slate-600 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateNote} className="space-y-4 pt-4 overflow-y-auto custom-scrollbar flex-1 pr-1">
                <div>
                  <label className="block text-xs font-bold text-nest-navy dark:text-slate-200 mb-1">
                    Note Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Graph Traversal: BFS vs DFS"
                    className="w-full px-3.5 py-2 rounded-xl bg-nest-light-input dark:bg-slate-800 border border-nest-border dark:border-slate-700 text-xs sm:text-sm text-nest-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-nest-blue font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-nest-navy dark:text-slate-200 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      placeholder="e.g. Java Programming"
                      className="w-full px-3.5 py-2 rounded-xl bg-nest-light-input dark:bg-slate-800 border border-nest-border dark:border-slate-700 text-xs sm:text-sm text-nest-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-nest-blue font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-nest-navy dark:text-slate-200 mb-1">
                      Tags (Comma-separated)
                    </label>
                    <input
                      type="text"
                      value={newTags}
                      onChange={(e) => setNewTags(e.target.value)}
                      placeholder="e.g. OOP, Formulas, Unit 2"
                      className="w-full px-3.5 py-2 rounded-xl bg-nest-light-input dark:bg-slate-800 border border-nest-border dark:border-slate-700 text-xs sm:text-sm text-nest-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-nest-blue font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-nest-navy dark:text-slate-200 mb-1">
                    Note Content *
                  </label>
                  <textarea
                    rows={6}
                    required
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Write detailed notes, definitions, formulas, or bullet points here..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-nest-light-input dark:bg-slate-800 border border-nest-border dark:border-slate-700 text-xs sm:text-sm text-nest-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-nest-blue font-normal leading-relaxed custom-scrollbar"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="pin-note-chk"
                    checked={isPinned}
                    onChange={(e) => setIsPinned(e.target.checked)}
                    className="w-4 h-4 rounded text-nest-blue focus:ring-nest-blue cursor-pointer"
                  />
                  <label htmlFor="pin-note-chk" className="text-xs font-semibold text-nest-navy dark:text-slate-300 cursor-pointer">
                    Pin this note to the top of the workspace
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-nest-border dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-nest-border dark:border-white/10 text-xs font-bold text-nest-gray hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-nest-navy hover:bg-nest-blue text-white text-xs font-bold transition-all shadow-md"
                  >
                    Save Note (+15 XP)
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

function NoteCard({ note, onPin, onDelete, onOpenAI }) {
  const timeFormatted = new Date(note.updatedAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric'
  })

  return (
    <article className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-nest-border dark:border-white/10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-nest-light-blue dark:bg-blue-900/40 text-nest-blue dark:text-blue-300 border border-nest-blue/20 truncate max-w-[150px]">
            {note.subject}
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onPin(note.id)}
              title={note.isPinned ? 'Unpin note' : 'Pin note to top'}
              className={`p-1 rounded-lg transition-colors cursor-pointer ${
                note.isPinned
                  ? 'text-amber-500 bg-amber-500/10'
                  : 'text-slate-600 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <Pin className={`w-3.5 h-3.5 ${note.isPinned ? 'fill-current' : ''}`} />
            </button>

            <button
              type="button"
              onClick={() => onDelete(note.id)}
              title="Delete note"
              className="p-1 text-slate-600 hover:text-red-700 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <h3 className="font-display font-bold text-sm sm:text-base text-nest-navy dark:text-white leading-snug">
          {note.title}
        </h3>

        <p className="text-xs text-nest-gray dark:text-slate-300 mt-2 line-clamp-4 leading-relaxed font-normal whitespace-pre-line">
          {note.content}
        </p>
      </div>

      <div className="pt-4 mt-3 border-t border-nest-border dark:border-white/10 flex items-center justify-between text-[11px] text-nest-gray dark:text-slate-400">
        <div className="flex items-center gap-1.5 flex-wrap">
          {note.tags?.slice(0, 2).map((tag, idx) => (
            <span key={idx} className="text-[10px] font-semibold text-slate-700 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {onOpenAI && (
            <button
              type="button"
              onClick={onOpenAI}
              title="Ask AI about this note"
              className="text-[10px] font-bold text-nest-blue dark:text-blue-400 hover:underline flex items-center gap-0.5"
            >
              <Sparkles className="w-3 h-3" /> AI
            </button>
          )}
          <span>{timeFormatted}</span>
        </div>
      </div>
    </article>
  )
}
