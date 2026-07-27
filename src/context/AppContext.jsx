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
          setCurrentView('home')
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
      setCurrentView('home')
    } else {
      setCurrentView('home')
    }
  }

  const handleLogin = (userData) => {
    setUser(userData)
    try {
      localStorage.setItem('studynest_user', JSON.stringify(userData))
    } catch (e) {
      console.warn('Unable to store user profile', e)
    }
    setCurrentView('home')
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
    semesters,
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
    goToUnitDetail
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
