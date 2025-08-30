'use client'

import { motion } from 'framer-motion'
import { Achievement } from '../../types/gamification'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

interface AchievementCardProps {
  achievement: Achievement
  isUnlocked: boolean
  progress?: number
}

const rarityColors = {
  common: 'from-gray-400 to-gray-500',
  rare: 'from-blue-400 to-blue-500',
  epic: 'from-purple-400 to-purple-500',
  legendary: 'from-yellow-400 to-orange-500'
}

const rarityGlow = {
  common: 'shadow-gray-400/20',
  rare: 'shadow-blue-400/30',
  epic: 'shadow-purple-400/40',
  legendary: 'shadow-yellow-400/50'
}

export function AchievementCard({ achievement, isUnlocked, progress = 0 }: AchievementCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
        isUnlocked 
          ? `bg-gradient-to-br ${rarityColors[achievement.rarity]} text-white shadow-lg ${rarityGlow[achievement.rarity]}` 
          : 'bg-gray-100 border-gray-300 text-gray-500'
      }`}
    >
      {/* Rarity Corner */}
      <div className={`absolute top-0 right-0 w-0 h-0 border-l-[20px] border-b-[20px] ${
        isUnlocked ? 'border-l-transparent border-b-white/20' : 'border-l-transparent border-b-gray-300'
      }`} />
      
      {/* Achievement Icon */}
      <div className="text-center mb-3">
        <div className={`text-4xl mb-2 ${isUnlocked ? 'grayscale-0' : 'grayscale'}`}>
          {achievement.icon}
        </div>
        <h3 className={`font-bold text-lg ${isUnlocked ? 'text-white' : 'text-gray-700'}`}>
          {achievement.name}
        </h3>
        <p className={`text-sm ${isUnlocked ? 'text-white/80' : 'text-gray-500'}`}>
          {achievement.description}
        </p>
      </div>

      {/* XP Reward */}
      <div className={`flex justify-between items-center text-sm ${
        isUnlocked ? 'text-white/90' : 'text-gray-600'
      }`}>
        <span className="flex items-center gap-1">
          ⭐ {achievement.xpReward} XP
        </span>
        <span className={`px-2 py-1 rounded text-xs font-semibold ${
          isUnlocked 
            ? 'bg-white/20 text-white' 
            : 'bg-gray-300 text-gray-600'
        }`}>
          {achievement.rarity.toUpperCase()}
        </span>
      </div>

      {/* Progress Bar (if not unlocked and progress available) */}
      {!isUnlocked && progress > 0 && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progression</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-300 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Unlock Date */}
      {isUnlocked && achievement.unlockedAt && (
        <div className="mt-2 text-xs text-white/70">
          Débloqué {formatDistanceToNow(achievement.unlockedAt, { 
            addSuffix: true, 
            locale: fr 
          })}
        </div>
      )}

      {/* Lock Overlay */}
      {!isUnlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl">
          <div className="text-2xl text-gray-400">🔒</div>
        </div>
      )}
    </motion.div>
  )
}