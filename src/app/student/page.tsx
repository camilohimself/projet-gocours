'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Target, 
  TrendingUp, 
  Clock, 
  Star, 
  Award, 
  Brain,
  Users,
  Calendar,
  MessageCircle,
  Heart,
  Zap,
  Trophy,
  Flame
} from 'lucide-react'
import { PrestigeDisplay } from '../../components/gamification/PrestigeDisplay'
import { AchievementCard } from '../../components/gamification/AchievementCard'
import { UserProgress, PRESTIGE_LEVELS } from '../../types/gamification'

// Mock data pour l'élève
const mockStudentProgress: UserProgress = {
  userId: 'student1',
  level: 3,
  xp: 450,
  totalXP: 450,
  achievements: [
    {
      id: '1',
      name: 'First Step',
      description: 'Suivez votre premier cours',
      icon: '👶',
      xpReward: 25,
      rarity: 'common',
      unlockCondition: { type: 'sessions_completed', value: 1, comparison: 'gte' },
      unlockedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
    },
    {
      id: '2',
      name: 'Eager Learner',
      description: 'Suivez 10 cours',
      icon: '📚',
      xpReward: 100,
      rarity: 'common',
      unlockCondition: { type: 'sessions_completed', value: 10, comparison: 'gte' },
      unlockedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
    }
  ],
  badges: [],
  streak: { current: 5, longest: 12, lastActivity: new Date() },
  stats: {
    sessionsCompleted: 15,
    hoursSpent: 22,
    averageRating: 4.8,
    subjectsMastered: 2
  }
}

const mockTutors = [
  {
    id: '1',
    name: 'Marie Dubois',
    subject: 'Mathématiques',
    rating: 4.9,
    level: 6,
    avatar: 'MD',
    nextSession: '2025-08-23T14:00:00Z',
    totalSessions: 8
  },
  {
    id: '2',
    name: 'Lucas Martin',
    subject: 'Programmation',
    rating: 4.8,
    level: 4,
    avatar: 'LM',
    lastSession: '2025-08-20T16:00:00Z',
    totalSessions: 5
  }
]

const learningGoals = [
  {
    id: '1',
    title: 'Maîtriser les équations du second degré',
    subject: 'Mathématiques',
    progress: 75,
    targetDate: '2025-09-15',
    sessions: 6,
    totalSessions: 8
  },
  {
    id: '2',
    title: 'Créer ma première app React',
    subject: 'Programmation',
    progress: 60,
    targetDate: '2025-10-01',
    sessions: 3,
    totalSessions: 5
  }
]

const weeklyQuests = [
  {
    id: '1',
    title: 'Studieux Apprenant',
    description: 'Suivez 3 cours cette semaine',
    progress: 66,
    current: 2,
    target: 3,
    reward: '75 XP + Badge Studieux',
    icon: '📖',
    daysLeft: 3
  },
  {
    id: '2',
    title: 'Feedback Master',
    description: 'Laissez 2 avis détaillés',
    progress: 50,
    current: 1,
    target: 2,
    reward: '50 XP + Badge Social',
    icon: '⭐',
    daysLeft: 5
  }
]

export default function StudentDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('week')

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color = 'blue',
    suffix = '',
    trend
  }: {
    title: string
    value: string | number
    icon: any
    color?: string
    suffix?: string
    trend?: { value: number, label: string }
  }) => (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-${color}-100 rounded-xl flex items-center justify-center`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
        {trend && (
          <div className="text-right">
            <div className={`text-sm font-medium ${trend.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend.value >= 0 ? '+' : ''}{trend.value}%
            </div>
            <div className="text-xs text-gray-500">{trend.label}</div>
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">
        {value}{suffix}
      </div>
      <div className="text-sm text-gray-600">{title}</div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Welcome */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Salut Alex ! 🎓
              </h1>
              <p className="text-gray-600">
                Ton prochain cours avec Marie est dans 2h. Continue comme ça !
              </p>
            </div>

            {/* Prestige Display */}
            <div className="lg:w-80">
              <PrestigeDisplay progress={mockStudentProgress} showDetails={false} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Overview */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Mes progrès</h2>
                <select
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500\"
                >
                  <option value="week">Cette semaine</option>
                  <option value="month">Ce mois</option>
                  <option value="all">Depuis le début</option>
                </select>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Cours suivis\"
                  value={mockStudentProgress.stats.sessionsCompleted}
                  icon={BookOpen}
                  color="blue\"
                  trend={{ value: 25, label: 'vs semaine passée' }}
                />
                <StatCard
                  title="Heures d'apprentissage\"
                  value={mockStudentProgress.stats.hoursSpent}
                  icon={Clock}
                  color="green\"
                  suffix="h\"
                  trend={{ value: 15, label: 'vs mois passé' }}
                />
                <StatCard
                  title="Note moyenne donnée\"
                  value={mockStudentProgress.stats.averageRating}
                  icon={Star}
                  color="yellow\"
                  suffix="⭐\"
                  trend={{ value: 2, label: 'amélioration' }}
                />
                <StatCard
                  title="Série actuelle\"
                  value={mockStudentProgress.streak.current}
                  icon={Flame}
                  color="orange\"
                  suffix=" jours\"
                />
              </div>
            </div>

            {/* Learning Goals */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    <h3 className="text-xl font-bold text-gray-900">Mes objectifs d'apprentissage</h3>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                    + Nouvel objectif
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-6">
                {learningGoals.map(goal => (
                  <div key={goal.id} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{goal.title}</h4>
                        <span className="text-sm text-blue-600 font-medium">{goal.subject}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">{goal.progress}%</div>
                        <div className="text-xs text-gray-500">Objectif: {new Date(goal.targetDate).toLocaleDateString('fr')}</div>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="w-full bg-blue-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500\"
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">
                        {goal.sessions}/{goal.totalSessions} sessions complétées
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors\"
                      >
                        Réserver un cours
                      </motion.button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* My Tutors */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Mes tuteurs</h3>
                  <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                    Trouver un nouveau tuteur
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {mockTutors.map(tutor => (
                  <div key={tutor.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold">
                        {tutor.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="font-semibold text-gray-900">{tutor.name}</div>
                          <div 
                            className="px-2 py-1 rounded-full text-xs font-bold text-white\"
                            style={{ backgroundColor: PRESTIGE_LEVELS[tutor.level - 1]?.color }}
                          >
                            Lvl {tutor.level}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">{tutor.subject}</div>
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="font-medium">{tutor.rating}</span>
                          <span className="text-gray-500">• {tutor.totalSessions} cours ensemble</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                        <Heart className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                        <MessageCircle className="w-5 h-5" />
                      </button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors\"
                      >
                        Réserver
                      </motion.button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Next Session */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5" />
                <span className="font-semibold">Prochain cours</span>
              </div>
              <div className="mb-4">
                <div className="text-2xl font-bold mb-1">Dans 2h 15min</div>
                <div className="opacity-90">Mathématiques avec Marie</div>
                <div className="text-sm opacity-75">Aujourd'hui à 14:00</div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-white bg-opacity-20 backdrop-blur text-white py-3 rounded-xl font-semibold hover:bg-opacity-30 transition-colors\"
              >
                Rejoindre le cours
              </motion.button>
            </div>

            {/* Weekly Quests */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-bold text-gray-900">Défis de la semaine</h3>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {weeklyQuests.map(quest => (
                  <motion.div
                    key={quest.id}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100\"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{quest.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{quest.title}</h4>
                        <p className="text-sm text-gray-600 mb-3">{quest.description}</p>
                        
                        <div className="mb-2">
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>{quest.current}/{quest.target}</span>
                            <span>{quest.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-purple-500 h-2 rounded-full transition-all duration-500\"
                              style={{ width: `${quest.progress}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium text-purple-600">{quest.reward}</span>
                          <span className="text-xs text-gray-500">{quest.daysLeft}j restants</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-green-500 hover:bg-green-600 text-white p-4 rounded-2xl font-semibold flex items-center gap-3 transition-colors\"
              >
                <BookOpen className="w-6 h-6" />
                <div className="text-left">
                  <div>Trouver un tuteur</div>
                  <div className="text-sm opacity-90">Nouvelle matière</div>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-2xl font-semibold flex items-center gap-3 transition-colors\"
              >
                <MessageCircle className="w-6 h-6" />
                <div className="text-left">
                  <div>Messages</div>
                  <div className="text-sm opacity-90">2 non lus</div>
                </div>
              </motion.button>
            </div>

            {/* Study Streak */}
            <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl border-2 border-orange-200 p-6">
              <div className="flex items-center gap-2 mb-3">
                <Flame className="w-5 h-5 text-orange-600" />
                <span className="font-bold text-orange-800">Série d'étude</span>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {mockStudentProgress.streak.current} jours 🔥
                </div>
                <p className="text-sm text-orange-700 mb-4">
                  Record personnel: {mockStudentProgress.streak.longest} jours
                </p>
                <div className="text-xs text-orange-600">
                  Garde ta série ! Prends un cours aujourd'hui
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}