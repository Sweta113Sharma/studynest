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
    focusHistory,
    logFocusSession,
    usersDb,
    registerUser
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
