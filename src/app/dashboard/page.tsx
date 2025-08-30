'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Star, 
  Clock, 
  BookOpen, 
  Trophy,
  Zap,
  Crown,
  Target,
  Award,
  MessageCircle
} from 'lucide-react'
import { PrestigeDisplay } from '@/components/gamification/PrestigeDisplay'
import { AchievementCard } from '@/components/gamification/AchievementCard'
import { UserProgress, TUTOR_ACHIEVEMENTS } from '@/types/gamification'

// Mock data - à remplacer par Supabase
const mockProgress: UserProgress = {
  userId: '1',
  level: 6,
  xp: 2100,
  totalXP: 2100,
  achievements: [
    { ...TUTOR_ACHIEVEMENTS[0], id: '1', unlockedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    { ...TUTOR_ACHIEVEMENTS[1], id: '2', unlockedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) },
    { ...TUTOR_ACHIEVEMENTS[2], id: '3', unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
  ],
  badges: [],
  streak: { current: 15, longest: 25, lastActivity: new Date() },
  stats: {
    sessionsCompleted: 127,
    hoursSpent: 340,
    averageRating: 4.9,
    studentsHelped: 85
  }
}

const mockStats = {
  thisMonth: {
    sessions: 32,
    earnings: 2400,
    newStudents: 8,
    rating: 4.9
  },
  lastMonth: {
    sessions: 28,
    earnings: 2100,
    newStudents: 6,
    rating: 4.8
  }
}

const recentSessions = [
  { id: '1', student: 'Alice Martin', subject: 'Mathématiques', date: '2025-08-22', time: '14:00', status: 'completed', rating: 5 },
  { id: '2', student: 'Pierre Dubois', subject: 'Physique', date: '2025-08-22', time: '16:00', status: 'upcoming', rating: null },
  { id: '3', student: 'Sarah Wilson', subject: 'Mathématiques', date: '2025-08-21', time: '10:00', status: 'completed', rating: 5 },
  { id: '4', student: 'Marc Leroy', subject: 'Physique', date: '2025-08-21', time: '15:30', status: 'completed', rating: 4 }
]

const upcomingMissions = [
  {
    id: '1',
    title: 'Streak Master',
    description: 'Donnez 5 cours de plus pour maintenir votre série',
    progress: 80,
    reward: '100 XP + Badge Streak',
    icon: '🔥',
    daysLeft: 2
  },
  {
    id: '2',
    title: 'Student Whisperer',
    description: 'Aidez 3 nouveaux élèves ce mois',
    progress: 66,
    reward: '150 XP + Badge Social',
    icon: '👥',
    daysLeft: 8
  },
  {
    id: '3',
    title: 'Perfect Week',
    description: 'Obtenez que des 5⭐ cette semaine',
    progress: 60,
    reward: '200 XP + Badge Perfectionniste',
    icon: '⭐',
    daysLeft: 4
  }
]

export default function TutorDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('month')
  const [showAchievements, setShowAchievements] = useState(false)

  const StatCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    color = 'blue',
    suffix = '' 
  }: {
    title: string
    value: string | number
    change?: number
    icon: any
    color?: string
    suffix?: string
  }) => (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-${color}-100 rounded-xl flex items-center justify-center`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
        {change !== undefined && (
          <div className={`flex items-center text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className={`w-4 h-4 mr-1 ${change < 0 ? 'rotate-180' : ''}`} />
            {change >= 0 ? '+' : ''}{change}%
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
                Bonjour Marie ! 👋
              </h1>
              <p className="text-gray-600">
                Vous avez 3 cours aujourd'hui et 2 nouveaux messages
              </p>
            </div>

            {/* Prestige Display */}
            <div className="lg:w-80">
              <PrestigeDisplay progress={mockProgress} showDetails={false} />
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
                <h2 className="text-2xl font-bold text-gray-900">Vue d'ensemble</h2>
                <select
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500\"
                >
                  <option value="week">Cette semaine</option>
                  <option value="month">Ce mois</option>
                  <option value="year">Cette année</option>
                </select>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Sessions ce mois\"
                  value={mockStats.thisMonth.sessions}
                  change={14.3}
                  icon={Calendar}
                  color="blue\"
                />
                <StatCard
                  title="Revenus ce mois\"
                  value={mockStats.thisMonth.earnings.toLocaleString()}
                  change={14.3}
                  icon={DollarSign}
                  color="green\"
                  suffix=" CHF\"
                />
                <StatCard
                  title="Nouveaux élèves\"
                  value={mockStats.thisMonth.newStudents}
                  change={33.3}
                  icon={Users}
                  color="purple\"
                />
                <StatCard
                  title="Note moyenne\"
                  value={mockStats.thisMonth.rating}
                  change={2.1}
                  icon={Star}
                  color="yellow\"
                  suffix="⭐\"
                />
              </div>
            </div>

            {/* Recent Sessions */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Sessions récentes</h3>
                  <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                    Voir tout
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentSessions.map(session => (
                    <div key={session.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          {session.student.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{session.student}</div>
                          <div className="text-sm text-gray-600">{session.subject}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
                            {session.date} à {session.time}
                          </div>
                          <div className={`text-xs px-2 py-1 rounded-full ${
                            session.status === 'completed' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {session.status === 'completed' ? 'Terminé' : 'À venir'}
                          </div>
                        </div>
                        {session.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">{session.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 rounded-2xl shadow-lg\"
              >
                <Calendar className="w-8 h-8 mb-3" />
                <div className="font-semibold mb-1">Gérer mon planning</div>
                <div className="text-sm opacity-90">Disponibilités & créneaux</div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-2xl shadow-lg\"
              >
                <Users className="w-8 h-8 mb-3" />
                <div className="font-semibold mb-1">Mes élèves</div>
                <div className="text-sm opacity-90">Profils & progression</div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-2xl shadow-lg\"
              >
                <MessageCircle className="w-8 h-8 mb-3" />
                <div className="font-semibold mb-1">Messages</div>
                <div className="text-sm opacity-90">2 nouveaux</div>
              </motion.button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Missions/Quests */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-bold text-gray-900">Missions actives</h3>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {upcomingMissions.map(mission => (
                  <motion.div
                    key={mission.id}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-100\"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{mission.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{mission.title}</h4>
                        <p className="text-sm text-gray-600 mb-3">{mission.description}</p>
                        
                        <div className="mb-2">
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Progression</span>
                            <span>{mission.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full transition-all duration-500\"
                              style={{ width: `${mission.progress}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium text-blue-600">{mission.reward}</span>
                          <span className="text-xs text-gray-500">{mission.daysLeft}j restants</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Achievements Preview */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-600" />
                    <h3 className="text-lg font-bold text-gray-900">Achievements</h3>
                  </div>
                  <button
                    onClick={() => setShowAchievements(!showAchievements)}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm\"
                  >
                    {showAchievements ? 'Masquer' : 'Voir tout'}
                  </button>
                </div>
              </div>
              <div className="p-6">
                {!showAchievements ? (
                  <div className="grid grid-cols-3 gap-3">
                    {mockProgress.achievements.slice(0, 3).map(achievement => (
                      <div key={achievement.id} className="text-center">
                        <div className="text-2xl mb-1">{achievement.icon}</div>
                        <div className="text-xs text-gray-600">{achievement.name}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {TUTOR_ACHIEVEMENTS.map((achievement, index) => (
                      <AchievementCard
                        key={index}
                        achievement={{ ...achievement, id: index.toString() }}
                        isUnlocked={index < 3}
                        progress={index === 3 ? 75 : index === 4 ? 45 : 0}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Subscription Status */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border-2 border-yellow-200">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Crown className="w-5 h-5 text-yellow-600" />
                  <span className="font-bold text-yellow-800">Plan Pro</span>
                  <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                    Actif
                  </span>
                </div>
                <p className="text-sm text-yellow-700 mb-4">
                  Profil mis en avant jusqu'au 22 septembre 2025
                </p>
                <button className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-yellow-700 transition-colors">
                  Gérer l'abonnement
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}