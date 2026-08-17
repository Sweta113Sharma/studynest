import React from 'react'
import { motion } from 'framer-motion'
import {
  Trophy,
  Award,
  Flame,
  Zap,
  Brain,
  Target,
  Moon,
  Lock,
  CheckCircle2,
  Sparkles
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import MascotOwl from './MascotOwl'

export default function AchievementsView() {
  const { xp, level, levelTitle, unlockedBadges, unlockBadge } = useApp()

  const allBadges = [
    {
      id: 'bookworm',
      title: 'Scholarly Bookworm',
      icon: '🦉',
      desc: 'Create study notes and explore curriculum units.',
      xpReward: 50,
      category: 'Reading'
    },
    {
      id: 'streak-7',
      title: '7-Day Focus Flame',
      icon: '🔥',
      desc: 'Maintain a 7-day consecutive study streak.',
      xpReward: 100,
      category: 'Consistency'
    },
    {
      id: 'speed-learner',
      title: 'Speed Learner',
      icon: '⚡',
      desc: 'Complete 3 focus pomodoro sessions in one day.',
      xpReward: 50,
      category: 'Focus'
    },
    {
      id: 'quiz-master',
      title: 'Quiz Master',
      icon: '🧠',
      desc: 'Achieve 90%+ score on an adaptive subject quiz.',
      xpReward: 75,
      category: 'Assessment'
    },
    {
      id: 'goal-crusher',
      title: 'Goal Crusher',
      icon: '🎯',
      desc: 'Complete 5 scheduled study planner tasks.',
      xpReward: 50,
      category: 'Productivity'
    },
    {
      id: 'night-owl',
      title: 'Night Owl',
      icon: '🌙',
      desc: 'Conduct a focus session with ambient soundscapes.',
      xpReward: 60,
      category: 'Immersion'
    }
  ]

  const unlockedCount = allBadges.filter(b => unlockedBadges.includes(b.id)).length

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-[#E5EAF0] dark:border-white/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0fcee] dark:bg-amber-950/50 border border-[#f6e6a5]/30 text-xs font-bold text-amber-700 dark:text-amber-300">
            <Trophy className="w-3.5 h-3.5 text-[#f6e6a5]" />
            Academic Badges & Honors
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-[#343b1b] dark:text-white">
            StudyNest Achievements
          </h1>
          <p className="text-xs sm:text-sm text-[#687386] dark:text-slate-300 max-w-xl">
            Collect special recognition badges as you study, finish unit milestones, and keep your focus flame burning.
          </p>

          <div className="pt-2 flex items-center gap-4 text-xs font-bold text-[#343b1b] dark:text-white">
            <span className="bg-[#e8f1fc] dark:bg-blue-950/60 text-[#3971b8] dark:text-blue-300 px-3 py-1.5 rounded-xl border border-[#3971b8]/20">
              🏆 {unlockedCount} of {allBadges.length} Badges Unlocked
            </span>
            <span className="bg-[#f0fcee] dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 px-3 py-1.5 rounded-xl border border-[#f6e6a5]/30">
              ⭐ Total XP: {xp}
            </span>
          </div>
        </div>

        <div className="z-10 flex items-center justify-center shrink-0">
          <MascotOwl state="achievement" size="lg" />
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allBadges.map((badge) => {
          const isUnlocked = unlockedBadges.includes(badge.id)
          return (
            <motion.article
              key={badge.id}
              whileHover={{ y: -3 }}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                isUnlocked
                  ? 'bg-white dark:bg-slate-900 border-[#f6e6a5]/40 shadow-sm'
                  : 'bg-slate-50/60 dark:bg-slate-900/40 border-[#E5EAF0] dark:border-white/5 opacity-70'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner ${
                    isUnlocked
                      ? 'bg-gradient-to-br from-amber-300/30 to-amber-500/10 border border-amber-500/30'
                      : 'bg-slate-200/60 dark:bg-slate-800 border border-slate-300 dark:border-slate-700'
                  }`}>
                    {badge.icon}
                  </div>

                  <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                    isUnlocked
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-200 dark:bg-slate-800 text-[#687386]'
                  }`}>
                    {isUnlocked ? '✓ Unlocked' : '🔒 Locked'}
                  </span>
                </div>

                <h3 className="font-display font-bold text-base text-[#343b1b] dark:text-white">
                  {badge.title}
                </h3>
                <p className="text-xs text-[#687386] dark:text-slate-400 mt-1.5 leading-relaxed">
                  {badge.desc}
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-[#E5EAF0] dark:border-white/10 flex items-center justify-between text-xs">
                <span className="text-[11px] font-semibold text-[#687386] dark:text-slate-400">
                  Category: {badge.category}
                </span>

                <span className="font-bold text-[#f6e6a5] flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> +{badge.xpReward} XP
                </span>
              </div>
            </motion.article>
          )
        })}
      </div>
    </div>
  )
}
