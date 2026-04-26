import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import LoginScreen from './components/LoginScreen'
import AppShell from './components/AppShell'
import { branches, semesters, yearToSemesters, subjectColors, quizzes } from './data/studyData'

function App() {
  const [user, setUser] = useState(null)
  const [selectedYear, setSelectedYear] = useState(null)
  const [selectedBranch, setSelectedBranch] = useState(null)
  const [selectedSemester, setSelectedSemester] = useState(null)
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [selectedUnit, setSelectedUnit] = useState(null)
  const [currentQuiz, setCurrentQuiz] = useState(null)
  const [quizState, setQuizState] = useState({ currentIndex: 0, score: 0, selectedOption: null, completed: false })
  const [currentView, setCurrentView] = useState('login')
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const savedUser = localStorage.getItem('studynest_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
      setCurrentView('home')
    }
    const savedDarkMode = localStorage.getItem('studynest_darkmode')
    if (savedDarkMode === 'true') {
      setDarkMode(true)
    }
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('studynest_darkmode', darkMode)
  }, [darkMode])

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('studynest_user', JSON.stringify(userData))
    setCurrentView('home')
  }

  const handleLogout = () => {
    localStorage.removeItem('studynest_user')
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
    return name.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2)
  }

  const getSubjectProgress = (subjectId) => {
    const key = `studynest_progress_${subjectId}`
    return parseInt(localStorage.getItem(key) || '0')
  }

  const setSubjectProgress = (subjectId, progress) => {
    const key = `studynest_progress_${subjectId}`
    localStorage.setItem(key, progress.toString())
  }

  const getUnitProgress = (subjectId, unitTitle) => {
    const key = `studynest_progress_${subjectId}_${unitTitle}`
    return localStorage.getItem(key) === 'true'
  }

  const setUnitProgress = (subjectId, unitTitle, done) => {
    const key = `studynest_progress_${subjectId}_${unitTitle}`
    localStorage.setItem(key, done.toString())
    if (selectedSubject && selectedSubject.id === subjectId) {
      const completed = selectedSubject.units.filter(u => 
        u.title === unitTitle ? done : getUnitProgress(subjectId, u.title)
      ).length
      const progress = Math.round((completed / selectedSubject.units.length) * 100)
      setSubjectProgress(subjectId, progress)
    }
  }

  const getTodos = (subjectId) => {
    const key = `studynest_todos_${subjectId}`
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  }

  const saveTodos = (subjectId, todos) => {
    const key = `studynest_todos_${subjectId}`
    localStorage.setItem(key, JSON.stringify(todos))
  }

  const getQuizzes = (subjectId) => {
    return quizzes[subjectId] || []
  }

  const context = {
    user,
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
    handleLogin,
    handleLogout,
    getSubjectProgress,
    setSubjectProgress,
    getUnitProgress,
    setUnitProgress,
    getTodos,
    saveTodos,
    getQuizzes
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="noise-overlay" />
      
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      
      <div className="grid-bg fixed inset-0 opacity-30" />
      
      <AnimatePresence mode="wait">
        {!user ? (
          <LoginScreen key="login" onLogin={handleLogin} />
        ) : (
          <AppShell key="app" context={context} />
        )}
      </AnimatePresence>
    </div>
  )
}

export default App