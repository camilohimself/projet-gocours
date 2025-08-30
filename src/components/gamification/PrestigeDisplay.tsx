'use client'

import { motion } from 'framer-motion'
import { UserProgress, getLevelFromXP, getXPToNextLevel } from '../../types/gamification'

interface PrestigeDisplayProps {
  progress: UserProgress
  showDetails?: boolean
}

export function PrestigeDisplay({ progress, showDetails = false }: PrestigeDisplayProps) {
  const currentLevel = getLevelFromXP(progress.xp)
  const xpToNext = getXPToNextLevel(progress.xp)
  const progressPercentage = ((progress.xp - currentLevel.minXP) / (currentLevel.maxXP - currentLevel.minXP)) * 100

  return (
    <div className="relative">
      {/* Level Badge */}
      <div className="flex items-center gap-4">
        <div 
          className="relative w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg"
          style={{ backgroundColor: currentLevel.color }}
        >
          <span className="text-lg">{currentLevel.icon}</span>
          <div className="absolute -bottom-1 -right-1 bg-gray-900 text-white text-xs px-2 py-1 rounded-full font-bold">
            {progress.level}
          </div>
        </div>

        <div className="flex-1">
          <h3 className="font-bold text-lg" style={{ color: currentLevel.color }}>
            {currentLevel.name}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            {progress.xp.toLocaleString()} XP
            {currentLevel.maxXP !== Infinity && (
              <span className="text-gray-400">
                {' '}/{' '}{currentLevel.maxXP.toLocaleString()}
              </span>
            )}
          </p>
          
          {/* Progress Bar */}
          {currentLevel.maxXP !== Infinity && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div 
                className="h-2 rounded-full"
                style={{ backgroundColor: currentLevel.color }}
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          )}
          
          {xpToNext > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              {xpToNext.toLocaleString()} XP jusqu'au niveau suivant
            </p>
          )}
        </div>
      </div>

      {/* Details */}
      {showDetails && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 p-4 bg-gray-50 rounded-lg"
        >
          <h4 className="font-semibold mb-2">Avantages du niveau {currentLevel.name}</h4>
          <ul className="text-sm space-y-1">
            {currentLevel.benefits.map((benefit, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                {benefit}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  )
}