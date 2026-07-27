import React, { Component } from 'react'
import { AnimatePresence } from 'framer-motion'
import { AppProvider, useApp } from './context/AppContext'
import LoginScreen from './components/LoginScreen'
import AppShell from './components/AppShell'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('StudyNest ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    localStorage.clear()
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-900 text-white text-center">
          <div className="max-w-md p-8 rounded-3xl bg-slate-800 border border-slate-700 shadow-2xl space-y-4">
            <h1 className="text-2xl font-bold text-amber-400">Something went wrong</h1>
            <p className="text-sm text-slate-300">
              An unexpected error occurred in StudyNest. You can refresh or reset your local session.
            </p>
            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 rounded-xl bg-amber-600 font-bold text-sm text-white hover:bg-amber-700"
              >
                Reload Page
              </button>
              <button
                onClick={this.handleReset}
                className="px-4 py-2 rounded-xl bg-slate-700 font-bold text-sm text-slate-200 hover:bg-slate-600"
              >
                Reset Session
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

function MainContent() {
  const { user } = useApp()

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="noise-overlay" />
      
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      
      <div className="grid-bg fixed inset-0 opacity-30" />
      
      <AnimatePresence mode="wait">
        {!user ? (
          <LoginScreen key="login" />
        ) : (
          <AppShell key="app" />
        )}
      </AnimatePresence>
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <MainContent />
      </AppProvider>
    </ErrorBoundary>
  )
}