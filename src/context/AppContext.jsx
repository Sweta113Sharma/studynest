import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import { branches, semesters, yearToSemesters, subjectColors, quizzes } from '../data/studyData'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('studynest_user')
      return savedUser ? JSON.parse(savedUser) : null
    } catch (e) {
      console.error('Failed to parse user from localStorage:', e)
      return null
    }
  })

  const [selectedYear, setSelectedYear] = useState(null)
  const [selectedBranch, setSelectedBranch] = useState(null)
  const [selectedSemester, setSelectedSemester] = useState(null)
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [selectedUnit, setSelectedUnit] = useState(null)
  const [currentQuiz, setCurrentQuiz] = useState(null)
  const [quizState, setQuizState] = useState({ currentIndex: 0, score: 0, selectedOption: null, completed: false })
  const [currentView, setCurrentView] = useState(user ? 'home' : 'login')

  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem('studynest_darkmode') === 'true'
    } catch {
      return false
    }
  })



  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const raw = localStorage.getItem('studynest_bookmarks')
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  const [customSubjects, setCustomSubjects] = useState(() => {
    try {
      const saved = localStorage.getItem('studynest_custom_subjects')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [mergedSemesters, setMergedSemesters] = useState(semesters)

  useEffect(() => {
    const base = JSON.parse(JSON.stringify(semesters))
    customSubjects.forEach(sub => {
      const { branch, semester } = sub
      if (!base[branch]) base[branch] = {}
      if (!base[branch][semester]) base[branch][semester] = []
      
      const existingIdx = base[branch][semester].findIndex(s => s.id === sub.id)
      if (existingIdx >= 0) {
        base[branch][semester][existingIdx] = sub
      } else {
        base[branch][semester].push(sub)
      }
    })
    setMergedSemesters(base)
  }, [customSubjects])

  useEffect(() => {
    if (selectedSubject) {
      let latest = null
      Object.keys(mergedSemesters).forEach(branch => {
        Object.keys(mergedSemesters[branch]).forEach(sem => {
          const found = mergedSemesters[branch][sem].find(s => s.id === selectedSubject.id)
          if (found) latest = found
        })
      })
      if (latest && JSON.stringify(latest) !== JSON.stringify(selectedSubject)) {
        setSelectedSubject(latest)
      }
    }
  }, [mergedSemesters, selectedSubject])

  const [focusHistory, setFocusHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('studynest_focus_history')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const logFocusSession = () => {
    const today = new Date().toISOString().split('T')[0]
    setFocusHistory(prev => {
      if (prev.includes(today)) return prev
      const updated = [...prev, today]
      try {
        localStorage.setItem('studynest_focus_history', JSON.stringify(updated))
      } catch (e) {
        console.warn('Failed to save focus history', e)
      }
      return updated
    })
  }

  const [usersDb, setUsersDb] = useState(() => {
    try {
      const saved = localStorage.getItem('studynest_users_db')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const registerUser = (newProfile) => {
    setUsersDb(prev => {
      const exists = prev.some(u => u.email.toLowerCase() === newProfile.email.toLowerCase())
      if (exists) return prev
      const updated = [...prev, newProfile]
      try {
        localStorage.setItem('studynest_users_db', JSON.stringify(updated))
      } catch (e) {
        console.warn('Failed to save user database', e)
      }
      return updated
    })
  }

  // --- STUDY NOTES WORKSPACE ---
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem('studynest_study_notes')
      if (saved) return JSON.parse(saved)
    } catch {}
    return [
      {
        id: 'note-1',
        title: 'OOP Principles & Polymorphism',
        subject: 'Java Programming',
        category: 'Programming',
        content: 'Object-Oriented Programming revolves around Encapsulation, Abstraction, Inheritance, and Polymorphism.\n• Dynamic Binding: Method overriding resolved at runtime.\n• Static Binding: Method overloading resolved at compile time.',
        tags: ['OOP', 'Core Java', 'Exam Prep'],
        isPinned: true,
        updatedAt: new Date(Date.now() - 3600000 * 2).toISOString()
      },
      {
        id: 'note-2',
        title: 'Binary Search Tree & Balancing',
        subject: 'Data Structures & Algorithms',
        category: 'Core CS',
        content: 'BST Invariant: Left child < Node < Right child.\nAVL Trees maintain balance factor in {-1, 0, 1} via LL, RR, LR, and RL rotations. Search complexity guaranteed O(log N).',
        tags: ['Trees', 'Algorithms', 'Complexities'],
        isPinned: true,
        updatedAt: new Date(Date.now() - 3600000 * 24).toISOString()
      },
      {
        id: 'note-3',
        title: 'Eigenvalues & Characteristic Equation',
        subject: 'Engineering Mathematics',
        category: 'Mathematics',
        content: 'Solve |A - λI| = 0 to obtain characteristic roots (eigenvalues). Sum of eigenvalues equals trace(A), and product equals determinant |A|.',
        tags: ['Linear Algebra', 'Formulas'],
        isPinned: false,
        updatedAt: new Date(Date.now() - 3600000 * 48).toISOString()
      }
    ]
  })

  useEffect(() => {
    try {
      localStorage.setItem('studynest_study_notes', JSON.stringify(notes))
    } catch (e) {
      console.warn('Failed to persist notes:', e)
    }
  }, [notes])

  const addNote = (note) => {
    const newNote = {
      id: `note-${Date.now()}`,
      title: note.title || 'Untitled Note',
      subject: note.subject || 'General Study',
      category: note.category || 'Study',
      content: note.content || '',
      tags: note.tags || [],
      isPinned: !!note.isPinned,
      updatedAt: new Date().toISOString()
    }
    setNotes(prev => [newNote, ...prev])
    addXP(15, 'Created a new study note')
    return newNote
  }

  const updateNote = (id, updatedFields) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updatedFields, updatedAt: new Date().toISOString() } : n))
  }

  const deleteNote = (id) => {
    setNotes(prev => prev.filter(n => n.id !== id))
  }

  const togglePinNote = (id) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, isPinned: !n.isPinned } : n))
  }

  // --- STUDY PLANNER & TASKS ---
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('studynest_study_tasks')
      if (saved) return JSON.parse(saved)
    } catch {}
    return [
      { id: 'task-1', text: 'Complete Java OOP notes revision', subject: 'Java Programming', priority: 'high', completed: false, dueDate: 'Today' },
      { id: 'task-2', text: 'Practice DSA Tree Traversal quiz', subject: 'Data Structures', priority: 'medium', completed: false, dueDate: 'Tomorrow' },
      { id: 'task-3', text: 'Solve Math Characteristic Equations unit 2', subject: 'Mathematics', priority: 'low', completed: true, dueDate: 'Completed' },
      { id: 'task-4', text: 'Prepare DBMS Normalization cheat-sheet', subject: 'DBMS', priority: 'medium', completed: false, dueDate: 'In 2 days' }
    ]
  })

  useEffect(() => {
    try {
      localStorage.setItem('studynest_study_tasks', JSON.stringify(tasks))
    } catch (e) {
      console.warn('Failed to persist tasks:', e)
    }
  }, [tasks])

  const addTask = (task) => {
    const newTask = {
      id: `task-${Date.now()}`,
      text: task.text,
      subject: task.subject || 'General Study',
      priority: task.priority || 'medium',
      completed: false,
      dueDate: task.dueDate || 'Today'
    }
    setTasks(prev => [newTask, ...prev])
    addXP(10, 'Scheduled study goal')
    return newTask
  }

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextState = !t.completed
        if (nextState) addXP(20, 'Completed daily study task')
        return { ...t, completed: nextState }
      }
      return t
    }))
  }

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  // --- EXAM COUNTDOWN PLANNER ---
  const [exams, setExams] = useState(() => {
    try {
      const saved = localStorage.getItem('studynest_study_exams')
      if (saved) return JSON.parse(saved)
    } catch {}
    return [
      { id: 'exam-1', name: 'Java OOP Midterm Exam', subject: 'Java Programming', daysLeft: 12, prepProgress: 72, date: 'Oct 28' },
      { id: 'exam-2', name: 'Data Structures & Algorithms Final', subject: 'DSA', daysLeft: 24, prepProgress: 45, date: 'Nov 09' },
      { id: 'exam-3', name: 'Engineering Mathematics II', subject: 'Mathematics', daysLeft: 31, prepProgress: 60, date: 'Nov 16' }
    ]
  })

  useEffect(() => {
    try {
      localStorage.setItem('studynest_study_exams', JSON.stringify(exams))
    } catch (e) {
      console.warn('Failed to persist exams:', e)
    }
  }, [exams])

  const addExam = (exam) => {
    const newExam = {
      id: `exam-${Date.now()}`,
      name: exam.name,
      subject: exam.subject,
      daysLeft: parseInt(exam.daysLeft) || 10,
      prepProgress: parseInt(exam.prepProgress) || 0,
      date: exam.date || 'TBD'
    }
    setExams(prev => [...prev, newExam])
    return newExam
  }

  const deleteExam = (id) => {
    setExams(prev => prev.filter(e => e.id !== id))
  }

  // --- GAMIFICATION: XP, LEVELS & BADGES ---
  const [xp, setXp] = useState(() => {
    try {
      const saved = localStorage.getItem('studynest_user_xp')
      return saved ? parseInt(saved) : 420
    } catch {
      return 420
    }
  })

  const [lastXpGain, setLastXpGain] = useState(null)

  const addXP = (amount, reason = '') => {
    setXp(prev => {
      const updated = prev + amount
      try {
        localStorage.setItem('studynest_user_xp', updated.toString())
      } catch (e) {
        console.warn('Failed to persist XP:', e)
      }
      return updated
    })
    setLastXpGain({ amount, reason, timestamp: Date.now() })
    setTimeout(() => setLastXpGain(null), 3500)
  }

  const level = Math.floor(xp / 100) + 1
  const xpInCurrentLevel = xp % 100
  const getLevelTitle = (lvl) => {
    if (lvl <= 3) return 'Study Explorer'
    if (lvl <= 6) return 'Knowledge Seeker'
    if (lvl <= 10) return 'Nest Scholar'
    if (lvl <= 15) return 'Academic Master'
    return 'Grand Owl Mentor'
  }
  const levelTitle = getLevelTitle(level)

  const [unlockedBadges, setUnlockedBadges] = useState(() => {
    try {
      const saved = localStorage.getItem('studynest_user_badges')
      return saved ? JSON.parse(saved) : ['bookworm', 'streak-7', 'speed-learner']
    } catch {
      return ['bookworm', 'streak-7', 'speed-learner']
    }
  })

  const unlockBadge = (badgeId) => {
    setUnlockedBadges(prev => {
      if (prev.includes(badgeId)) return prev
      const updated = [...prev, badgeId]
      try {
        localStorage.setItem('studynest_user_badges', JSON.stringify(updated))
      } catch {}
      addXP(50, `Unlocked badge: ${badgeId}`)
      return updated
    })
  }

  const isPoppingState = useRef(false)

  // Handle dark mode class application
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    try {
      localStorage.setItem('studynest_darkmode', darkMode.toString())
    } catch (e) {
      console.warn('Unable to write darkmode to localStorage', e)
    }
  }, [darkMode])



  // History / PopState router handling
  useEffect(() => {
    const handlePopState = (event) => {
      isPoppingState.current = true
      if (event.state) {
        const { view, year, branch, sem, subject, unit } = event.state
        setCurrentView(view || 'home')
        setSelectedYear(year ?? null)
        setSelectedBranch(branch ?? null)
        setSelectedSemester(sem ?? null)
        setSelectedSubject(subject ?? null)
        setSelectedUnit(unit ?? null)
      } else {
        if (user) {
          setCurrentView(user?.role === 'admin' ? 'admin-portal' : 'home')
          setSelectedYear(null)
          setSelectedBranch(null)
          setSelectedSemester(null)
          setSelectedSubject(null)
          setSelectedUnit(null)
        } else {
          setCurrentView('login')
        }
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [user])

  useEffect(() => {
    if (currentView === 'login') return
    if (isPoppingState.current) {
      isPoppingState.current = false
      return
    }
    const currentState = window.history.state
    const newState = {
      view: currentView,
      year: selectedYear,
      branch: selectedBranch,
      sem: selectedSemester,
      subject: selectedSubject,
      unit: selectedUnit
    }
    if (!currentState) {
      window.history.pushState(newState, '', '')
    } else if (currentState.view !== currentView) {
      window.history.pushState(newState, '', '')
    } else if (JSON.stringify(currentState) !== JSON.stringify(newState)) {
      window.history.replaceState(newState, '', '')
    }
  }, [currentView, selectedYear, selectedBranch, selectedSemester, selectedSubject, selectedUnit])

  const navigateTo = (view) => {
    setCurrentView(view)
  }

  const goHome = () => {
    setSelectedYear(null)
    setSelectedBranch(null)
    setSelectedSemester(null)
    setSelectedSubject(null)
    setSelectedUnit(null)
    navigateTo('home')
  }

  const goToSubjects = () => {
    setSelectedSubject(null)
    setSelectedUnit(null)
    navigateTo('subjects')
  }

  const goToSubjectDetail = (subject) => {
    if (subject) setSelectedSubject(subject)
    setSelectedUnit(null)
    navigateTo('subject-detail')
  }

  const goToUnitDetail = (unit) => {
    if (unit) setSelectedUnit(unit)
    navigateTo('unit-detail')
  }

  const goBack = () => {
    if (currentView === 'unit-detail') {
      setSelectedUnit(null)
      setCurrentView(selectedSubject ? 'subject-detail' : 'subjects')
    } else if (currentView === 'subject-detail') {
      setSelectedUnit(null)
      setSelectedSubject(null)
      setCurrentView(selectedBranch && selectedYear ? 'subjects' : 'home')
    } else if (currentView === 'quiz' || currentView === 'flashcards') {
      if (selectedUnit) {
        setCurrentView('unit-detail')
      } else if (selectedSubject) {
        setCurrentView('subject-detail')
      } else {
        setCurrentView('subjects')
      }
    } else if (currentView === 'subjects') {
      setSelectedUnit(null)
      setSelectedSubject(null)
      setSelectedSemester(null)
      setSelectedBranch(null)
      setSelectedYear(null)
      setCurrentView(user?.role === 'admin' ? 'admin-portal' : 'home')
    } else {
      setCurrentView(user?.role === 'admin' ? 'admin-portal' : 'home')
    }
  }

  const handleLogin = (userData) => {
    setUser(userData)
    try {
      localStorage.setItem('studynest_user', JSON.stringify(userData))
    } catch (e) {
      console.warn('Unable to store user profile', e)
    }
    setCurrentView(userData.role === 'admin' ? 'admin-portal' : 'home')
  }

  const handleLogout = () => {
    try {
      localStorage.removeItem('studynest_user')
    } catch (e) {
      console.warn('Unable to clear user session', e)
    }
    setUser(null)
    setSelectedYear(null)
    setSelectedBranch(null)
    setSelectedSemester(null)
    setSelectedSubject(null)
    setSelectedUnit(null)
    setCurrentView('login')
  }

  const getGreeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const getInitials = (name) => {
    if (!name) return 'ST'
    return name.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2)
  }

  const getSubjectProgress = (subjectId) => {
    try {
      const key = `studynest_progress_${subjectId}`
      return parseInt(localStorage.getItem(key) || '0', 10)
    } catch {
      return 0
    }
  }

  const setSubjectProgress = (subjectId, progress) => {
    try {
      const key = `studynest_progress_${subjectId}`
      localStorage.setItem(key, progress.toString())
    } catch (e) {
      console.warn('Unable to set subject progress', e)
    }
  }

  const getUnitProgress = (subjectId, unitTitle) => {
    try {
      const key = `studynest_progress_${subjectId}_${unitTitle}`
      return localStorage.getItem(key) === 'true'
    } catch {
      return false
    }
  }

  const setUnitProgress = (subjectId, unitTitle, done) => {
    try {
      const key = `studynest_progress_${subjectId}_${unitTitle}`
      localStorage.setItem(key, done.toString())
      if (selectedSubject && selectedSubject.id === subjectId) {
        const completed = selectedSubject.units.filter(u => 
          u.title === unitTitle ? done : getUnitProgress(subjectId, u.title)
        ).length
        const progress = Math.round((completed / selectedSubject.units.length) * 100)
        setSubjectProgress(subjectId, progress)
      }
    } catch (e) {
      console.warn('Unable to write unit progress', e)
    }
  }

  const getTodos = (subjectId) => {
    try {
      const key = `studynest_todos_${subjectId}`
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  }

  const saveTodos = (subjectId, todos) => {
    try {
      const key = `studynest_todos_${subjectId}`
      localStorage.setItem(key, JSON.stringify(todos))
    } catch (e) {
      console.warn('Unable to save todos', e)
    }
  }

  const getQuizzes = (subjectId) => {
    return quizzes[subjectId] || []
  }

  const getBookmarks = () => bookmarks

  const toggleBookmark = (item) => {
    setBookmarks((prev) => {
      const exists = prev.some(b => b.id === item.id)
      const updated = exists ? prev.filter(b => b.id !== item.id) : [item, ...prev]
      try {
        localStorage.setItem('studynest_bookmarks', JSON.stringify(updated))
      } catch (e) {
        console.warn('Unable to save bookmarks', e)
      }
      return updated
    })
  }

  const isBookmarked = (itemId) => {
    return bookmarks.some(b => b.id === itemId)
  }

  const addCustomSubject = (subject) => {
    const updated = [...customSubjects.filter(s => s.id !== subject.id), subject]
    setCustomSubjects(updated)
    localStorage.setItem('studynest_custom_subjects', JSON.stringify(updated))
  }

  const deleteCustomSubject = (subjectId) => {
    const updated = customSubjects.filter(s => s.id !== subjectId)
    setCustomSubjects(updated)
    localStorage.setItem('studynest_custom_subjects', JSON.stringify(updated))
  }

  const addCustomUnit = (subjectId, unit) => {
    const existing = customSubjects.find(s => s.id === subjectId)
    let updatedSubjects
    if (existing) {
      updatedSubjects = customSubjects.map(s => {
        if (s.id === subjectId) {
          return { ...s, units: [...s.units, unit] }
        }
        return s
      })
    } else {
      let staticSubject = null
      Object.keys(semesters).forEach(branch => {
        Object.keys(semesters[branch]).forEach(sem => {
          const found = semesters[branch][sem].find(s => s.id === subjectId)
          if (found) {
            staticSubject = { ...found, branch, semester: parseInt(sem, 10) }
          }
        })
      })
      if (staticSubject) {
        updatedSubjects = [...customSubjects, { ...staticSubject, units: [...staticSubject.units, unit] }]
      } else {
        console.warn("Subject not found:", subjectId)
        return
      }
    }
    setCustomSubjects(updatedSubjects)
    localStorage.setItem('studynest_custom_subjects', JSON.stringify(updatedSubjects))
  }

  const deleteCustomUnit = (subjectId, unitTitle) => {
    const existing = customSubjects.find(s => s.id === subjectId)
    let updatedSubjects
    if (existing) {
      updatedSubjects = customSubjects.map(s => {
        if (s.id === subjectId) {
          return { ...s, units: s.units.filter(u => u.title !== unitTitle) }
        }
        return s
      })
    } else {
      let staticSubject = null
      Object.keys(semesters).forEach(branch => {
        Object.keys(semesters[branch]).forEach(sem => {
          const found = semesters[branch][sem].find(s => s.id === subjectId)
          if (found) {
            staticSubject = { ...found, branch, semester: parseInt(sem, 10) }
          }
        })
      })
      if (staticSubject) {
        updatedSubjects = [...customSubjects, { ...staticSubject, units: staticSubject.units.filter(u => u.title !== unitTitle) }]
      } else {
        return
      }
    }
    setCustomSubjects(updatedSubjects)
    localStorage.setItem('studynest_custom_subjects', JSON.stringify(updatedSubjects))
  }

  const addYoutubeLinkToUnit = (subjectId, unitTitle, video) => {
    const existing = customSubjects.find(s => s.id === subjectId)
    let updatedSubjects
    if (existing) {
      updatedSubjects = customSubjects.map(s => {
        if (s.id === subjectId) {
          return {
            ...s,
            units: s.units.map(u => {
              if (u.title === unitTitle) {
                return { ...u, youtube: [...(u.youtube || []), video] }
              }
              return u
            })
          }
        }
        return s
      })
    } else {
      let staticSubject = null
      Object.keys(semesters).forEach(branch => {
        Object.keys(semesters[branch]).forEach(sem => {
          const found = semesters[branch][sem].find(s => s.id === subjectId)
          if (found) {
            staticSubject = { ...found, branch, semester: parseInt(sem, 10) }
          }
        })
      })
      if (staticSubject) {
        updatedSubjects = [
          ...customSubjects,
          {
            ...staticSubject,
            units: staticSubject.units.map(u => {
              if (u.title === unitTitle) {
                return { ...u, youtube: [...(u.youtube || []), video] }
              }
              return u
            })
          }
        ]
      } else {
        console.warn("Subject not found for YouTube update:", subjectId)
        return
      }
    }
    setCustomSubjects(updatedSubjects)
    localStorage.setItem('studynest_custom_subjects', JSON.stringify(updatedSubjects))
    addXP(10, `Added video resource to ${unitTitle}`)
  }

  const deleteYoutubeLinkFromUnit = (subjectId, unitTitle, videoUrl) => {
    const existing = customSubjects.find(s => s.id === subjectId)
    let updatedSubjects
    if (existing) {
      updatedSubjects = customSubjects.map(s => {
        if (s.id === subjectId) {
          return {
            ...s,
            units: s.units.map(u => {
              if (u.title === unitTitle) {
                return { ...u, youtube: (u.youtube || []).filter(v => v.url !== videoUrl) }
              }
              return u
            })
          }
        }
        return s
      })
    } else {
      let staticSubject = null
      Object.keys(semesters).forEach(branch => {
        Object.keys(semesters[branch]).forEach(sem => {
          const found = semesters[branch][sem].find(s => s.id === subjectId)
          if (found) {
            staticSubject = { ...found, branch, semester: parseInt(sem, 10) }
          }
        })
      })
      if (staticSubject) {
        updatedSubjects = [
          ...customSubjects,
          {
            ...staticSubject,
            units: staticSubject.units.map(u => {
              if (u.title === unitTitle) {
                return { ...u, youtube: (u.youtube || []).filter(v => v.url !== videoUrl) }
              }
              return u
            })
          }
        ]
      } else {
        return
      }
    }
    setCustomSubjects(updatedSubjects)
    localStorage.setItem('studynest_custom_subjects', JSON.stringify(updatedSubjects))
  }

  // --- HOME/DASHBOARD ACTIVE SUBJECTS TRACKING ---
  const [homeSubjects, setHomeSubjects] = useState(() => {
    try {
      const saved = localStorage.getItem('studynest_home_subjects')
      if (saved) return JSON.parse(saved)
    } catch {}
    return [
      {
        id: 'sub-java',
        name: 'Java Programming',
        nextTopic: 'OOP Concepts & Polymorphism',
        progress: 68,
        color: '#3971b8'
      },
      {
        id: 'sub-dbms',
        name: 'DBMS',
        nextTopic: 'Normalization',
        progress: 45,
        color: '#c8a415'
      },
      {
        id: 'sub-dsa',
        name: 'Data Structures',
        nextTopic: 'Arrays & Linked Lists',
        progress: 32,
        color: '#5b6b2f'
      }
    ]
  })

  useEffect(() => {
    try {
      localStorage.setItem('studynest_home_subjects', JSON.stringify(homeSubjects))
    } catch (e) {
      console.warn('Failed to persist home subjects:', e)
    }
  }, [homeSubjects])

  const addHomeSubject = (subject) => {
    const newSub = {
      id: `home-sub-${Date.now()}`,
      name: subject.name,
      nextTopic: subject.nextTopic || 'General Study',
      progress: parseInt(subject.progress) || 0,
      color: subject.color || '#3971b8'
    }
    setHomeSubjects(prev => [...prev, newSub])
    addXP(10, 'Tracked a new learning subject')
  }

  const deleteHomeSubject = (id) => {
    setHomeSubjects(prev => prev.filter(s => s.id !== id))
  }

  const updateHomeSubjectProgress = (id, progress) => {
    setHomeSubjects(prev => prev.map(s => s.id === id ? { ...s, progress: Math.min(100, Math.max(0, parseInt(progress) || 0)) } : s))
  }

  const updateHomeSubjectTopic = (id, nextTopic) => {
    setHomeSubjects(prev => prev.map(s => s.id === id ? { ...s, nextTopic: nextTopic || 'General Study' } : s))
  }

  const value = {
    user,
    setUser,
    selectedYear,
    setSelectedYear,
    selectedBranch,
    setSelectedBranch,
    selectedSemester,
    setSelectedSemester,
    selectedSubject,
    setSelectedSubject,
    selectedUnit,
    setSelectedUnit,
    currentQuiz,
    setCurrentQuiz,
    quizState,
    setQuizState,
    currentView,
    setCurrentView,
    darkMode,
    setDarkMode,

    branches,
    semesters: mergedSemesters,
    yearToSemesters,
    subjectColors,
    getGreeting,
    getInitials,
    goBack,
    handleLogin,
    handleLogout,
    getSubjectProgress,
    setSubjectProgress,
    getUnitProgress,
    setUnitProgress,
    getTodos,
    saveTodos,
    getQuizzes,
    bookmarks,
    getBookmarks,
    toggleBookmark,
    isBookmarked,
    navigateTo,
    goHome,
    goToSubjects,
    goToSubjectDetail,
    goToUnitDetail,
    customSubjects,
    addCustomSubject,
    deleteCustomSubject,
    addCustomUnit,
    deleteCustomUnit,
    addYoutubeLinkToUnit,
    deleteYoutubeLinkFromUnit,
    focusHistory,
    logFocusSession,
    usersDb,
    registerUser,
    // Home Active Subjects Tracking
    homeSubjects,
    addHomeSubject,
    deleteHomeSubject,
    updateHomeSubjectProgress,
    updateHomeSubjectTopic,
    // Notes Workspace
    notes,
    addNote,
    updateNote,
    deleteNote,
    togglePinNote,
    // Planner & Tasks
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    // Exams
    exams,
    addExam,
    deleteExam,
    // Gamification & XP
    xp,
    addXP,
    lastXpGain,
    level,
    xpInCurrentLevel,
    levelTitle,
    unlockedBadges,
    unlockBadge
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

export default AppContext
