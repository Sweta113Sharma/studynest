import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Sprout,
  Award,
  BookOpen,
  Clock,
  Flame,
  Star,
  ChevronRight,
  TrendingUp,
  Sparkles,
  CheckCircle2
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import MascotOwl from './MascotOwl'

export default function GrowthView() {
  const {
    user,
    xp,
    level,
    xpInCurrentLevel,
    levelTitle,
    focusHistory = [],
    bookmarks = [],
    getBookmarks,
    getSubjectProgress,
    semesters
  } = useApp()

  const safeBookmarks = bookmarks?.length !== undefined ? bookmarks : (getBookmarks ? getBookmarks() : [])
  const safeFocusHistory = focusHistory || []

  const [selectedBranch, setSelectedBranch] = useState('Java Programming')

  // Derive Growth Stage based on Level
  const getGrowthStage = (lvl) => {
    if (lvl <= 3) return { name: 'Beginner Nestling', stage: '🌱 Beginner', icon: '🌱', desc: 'Building core foundation and exploring basic concepts.' }
    if (lvl <= 6) return { name: 'Learning Scholar', stage: '🌿 Learning', icon: '🌿', desc: 'Expanding knowledge branches and consistent daily revision.' }
    if (lvl <= 10) return { name: 'Growing Master', stage: '🌳 Growing', icon: '🌳', desc: 'Solving advanced engineering problems & high quiz mastery.' }
    return { name: 'Advanced Academic Owl', stage: '🌲 Advanced', icon: '🌲', desc: 'Syllabus mastery achieved across all subjects!' }
  }

  const growthStage = getGrowthStage(level)

  // Subject branches data
  const subjectBranches = [
    { name: 'Java Programming', category: 'Programming', mastery: 68, completedUnits: 3, totalUnits: 5, color: '#2878D4', icon: '💻' },
    { name: 'Data Structures & Algorithms', category: 'Core CS', mastery: 55, completedUnits: 2, totalUnits: 5, color: '#55A85A', icon: '🌲' },
    { name: 'Engineering Mathematics', category: 'Mathematics', mastery: 40, completedUnits: 2, totalUnits: 5, color: '#F5B72C', icon: '📐' },
    { name: 'Database Management (DBMS)', category: 'Systems', mastery: 80, completedUnits: 4, totalUnits: 5, color: '#123B70', icon: '🗄️' },
  ]

  const activeBranchData = subjectBranches.find(b => b.name === selectedBranch) || subjectBranches[0]

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#123B70] to-[#1C4B82] text-white p-6 sm:p-8 rounded-3xl border border-white/10 shadow-lg relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative z-10 max-w-xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-amber-300">
            <Sprout className="w-3.5 h-3.5 text-emerald-400" />
            Knowledge Growth Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black tracking-tight">
            My Knowledge Tree
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
            Every study note, completed unit, and quiz answer nourishes your knowledge tree from a small seed into a flourishing academic canopy.
          </p>

          {/* XP & Level Progress Pill */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs font-bold text-blue-100 mb-1.5">
              <span>Level {level} • {levelTitle}</span>
              <span className="text-amber-300">{xpInCurrentLevel} / 100 XP to Lvl {level + 1}</span>
            </div>
            <div className="w-full h-3 bg-black/25 rounded-full overflow-hidden p-0.5 border border-white/20">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpInCurrentLevel}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-amber-400 to-[#F5B72C] rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Mascot on Tree Branch */}
        <div className="relative z-10 flex flex-col items-center justify-center shrink-0">
          <div className="p-3 bg-white/10 rounded-3xl border border-white/15 backdrop-blur-sm">
            <MascotOwl state="tree" size="lg" />
          </div>
          <span className="mt-2 text-xs font-bold text-amber-300">
            Stage: {growthStage.stage}
          </span>
        </div>

        {/* Decorative background stars */}
        <div className="absolute top-0 right-1/3 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Main Growth Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Tree Visualizer (7 Columns) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-[#E5EAF0] dark:border-white/10 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-lg text-[#172033] dark:text-white flex items-center gap-2">
                <Sprout className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                Growth Canopy & Subject Branches
              </h2>
              <span className="text-xs font-semibold text-[#687386] dark:text-slate-400">
                Click a branch to view
              </span>
            </div>

            {/* Tree Branch Diagram Card */}
            <div className="relative p-6 rounded-2xl bg-[#FFF9EE] dark:bg-slate-800/50 border border-[#E5EAF0] dark:border-slate-700/60 overflow-hidden flex flex-col items-center justify-center min-h-[300px]">
              {/* Branch Node Buttons */}
              <div className="grid grid-cols-2 gap-4 w-full max-w-md z-10">
                {subjectBranches.map((branch) => {
                  const isSelected = selectedBranch === branch.name
                  return (
                    <motion.button
                      key={branch.name}
                      type="button"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedBranch(branch.name)}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#123B70] text-white border-[#123B70] shadow-md'
                          : 'bg-white dark:bg-slate-900 border-[#E5EAF0] dark:border-white/10 text-[#172033] dark:text-white hover:border-[#2878D4]/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-lg">{branch.icon}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                          isSelected
                            ? 'bg-amber-400 text-[#123B70]'
                            : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                        }`}>
                          {branch.mastery}%
                        </span>
                      </div>
                      <p className="text-xs font-bold truncate">{branch.name}</p>
                      <p className={`text-[10px] mt-0.5 ${isSelected ? 'text-blue-200' : 'text-[#687386] dark:text-slate-400'}`}>
                        {branch.completedUnits}/{branch.totalUnits} Units Mastered
                      </p>
                    </motion.button>
                  )
                })}
              </div>

              {/* Tree Trunk Base */}
              <div className="mt-6 flex flex-col items-center text-center z-10">
                <div className="w-12 h-14 bg-gradient-to-b from-[#8B5A2B] to-[#5C381E] rounded-t-lg border-2 border-[#4A2A14]" />
                <div className="px-5 py-2 rounded-2xl bg-[#EAF7E8] dark:bg-emerald-950/60 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-extrabold shadow-sm -mt-2">
                  🌱 Root: StudyNest Academic Foundation
                </div>
              </div>
            </div>
          </div>

          {/* Growth Milestone Steps */}
          <div className="grid grid-cols-4 gap-2 pt-6 mt-4 border-t border-[#E5EAF0] dark:border-white/10 text-center">
            {[
              { stage: 'Beginner', lvl: 'Lvl 1-3', emoji: '🌱', active: level >= 1 },
              { stage: 'Learning', lvl: 'Lvl 4-6', emoji: '🌿', active: level >= 4 },
              { stage: 'Growing', lvl: 'Lvl 7-10', emoji: '🌳', active: level >= 7 },
              { stage: 'Advanced', lvl: 'Lvl 11+', emoji: '🌲', active: level >= 11 },
            ].map((step, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-xl border text-xs font-semibold ${
                  step.active
                    ? 'bg-[#EAF4FF] dark:bg-blue-950/40 border-[#2878D4]/30 text-[#123B70] dark:text-blue-300'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-white/5 text-[#687386] opacity-60'
                }`}
              >
                <div className="text-base">{step.emoji}</div>
                <div className="font-bold text-[11px] mt-0.5">{step.stage}</div>
                <div className="text-[9px] text-[#687386] dark:text-slate-400">{step.lvl}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Selected Branch Detail & Mastery Card (5 Columns) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-[#E5EAF0] dark:border-white/10 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF0] dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#EAF4FF] dark:bg-blue-900/30 text-2xl flex items-center justify-center">
                  {activeBranchData.icon}
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-[#172033] dark:text-white">
                    {activeBranchData.name}
                  </h3>
                  <p className="text-xs text-[#687386] dark:text-slate-400">
                    Category: {activeBranchData.category}
                  </p>
                </div>
              </div>

              <span className="text-sm font-extrabold text-[#2878D4] dark:text-blue-400">
                {activeBranchData.mastery}%
              </span>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-[#687386] dark:text-slate-300 mb-1.5">
                <span>Subject Mastery Progress</span>
                <span className="text-[#172033] dark:text-white font-bold">{activeBranchData.completedUnits} of {activeBranchData.totalUnits} Units</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#55A85A] rounded-full transition-all duration-500"
                  style={{ width: `${activeBranchData.mastery}%` }}
                />
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-[#FFF9EE] dark:bg-slate-800/60 border border-[#F5B72C]/20">
                <span className="text-[10px] font-bold text-[#687386] dark:text-slate-400 uppercase">Focus Time</span>
                <p className="text-lg font-bold text-[#172033] dark:text-white mt-0.5">
                  {safeFocusHistory.length * 25} mins
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-[#EAF4FF] dark:bg-slate-800/60 border border-[#2878D4]/20">
                <span className="text-[10px] font-bold text-[#687386] dark:text-slate-400 uppercase">Saved Notes</span>
                <p className="text-lg font-bold text-[#172033] dark:text-white mt-0.5">
                  {safeBookmarks.length + 3} Topics
                </p>
              </div>
            </div>

            {/* Growth Tips from Owl */}
            <div className="p-4 rounded-2xl bg-[#EAF7E8] dark:bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-xs text-emerald-950 dark:text-emerald-200">
                <p className="font-bold">Next Recommended Action:</p>
                <p className="mt-0.5 font-normal">
                  Take the Unit 3 Adaptive Practice Quiz to earn +30 XP and boost this branch to 85% mastery!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
