'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Star, Clock, BookOpen, Users, ChevronDown, MapPin, Zap } from 'lucide-react'
import { PrestigeDisplay } from '@/components/gamification/PrestigeDisplay'
import { TutorProfile, Subject } from '@/types'
import { PRESTIGE_LEVELS, UserProgress } from '@/types/gamification'

// Mock data - à remplacer par les vraies données Supabase
const mockTutors: (TutorProfile & { progress: UserProgress })[] = [
  {
    id: '1',
    email: 'marie@example.com',
    role: 'tutor',
    firstName: 'Marie',
    lastName: 'Dubois',
    bio: 'Professeure de mathématiques avec 8 ans d\'expérience. Spécialisée dans la préparation aux examens.',
    subjects: [
      { id: '1', name: 'Mathématiques', category: 'mathematics', level: 'high-school' },
      { id: '2', name: 'Physique', category: 'sciences', level: 'high-school' }
    ],
    languages: [
      { code: 'fr', name: 'Français', proficiency: 'native' },
      { code: 'en', name: 'Anglais', proficiency: 'fluent' }
    ],
    hourlyRate: 75,
    experience: 8,
    education: [
      { degree: 'Master', institution: 'EPFL', year: 2015, field: 'Mathématiques' }
    ],
    availability: [],
    rating: 4.9,
    reviewCount: 127,
    verificationStatus: 'verified',
    teachingStyle: {
      approach: 'visual',
      pace: 'adaptive',
      structure: 'structured'
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    progress: {
      userId: '1',
      level: 6,
      xp: 2100,
      totalXP: 2100,
      achievements: [],
      badges: [],
      streak: { current: 15, longest: 25, lastActivity: new Date() },
      stats: {
        sessionsCompleted: 127,
        hoursSpent: 340,
        averageRating: 4.9,
        studentsHelped: 85
      }
    }
  },
  {
    id: '2',
    email: 'lucas@example.com',
    role: 'tutor',
    firstName: 'Lucas',
    lastName: 'Martin',
    bio: 'Développeur full-stack et formateur en informatique. Passionné par l\'enseignement de la programmation.',
    subjects: [
      { id: '3', name: 'Programmation', category: 'technology', level: 'university' },
      { id: '4', name: 'JavaScript', category: 'technology', level: 'professional' }
    ],
    languages: [
      { code: 'fr', name: 'Français', proficiency: 'native' },
      { code: 'en', name: 'Anglais', proficiency: 'fluent' }
    ],
    hourlyRate: 90,
    experience: 5,
    education: [
      { degree: 'Bachelor', institution: 'HES-SO', year: 2018, field: 'Informatique' }
    ],
    availability: [],
    rating: 4.8,
    reviewCount: 89,
    verificationStatus: 'verified',
    teachingStyle: {
      approach: 'kinesthetic',
      pace: 'fast',
      structure: 'flexible'
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    progress: {
      userId: '2',
      level: 4,
      xp: 850,
      totalXP: 850,
      achievements: [],
      badges: [],
      streak: { current: 8, longest: 15, lastActivity: new Date() },
      stats: {
        sessionsCompleted: 89,
        hoursSpent: 210,
        averageRating: 4.8,
        studentsHelped: 67
      }
    }
  },
  {
    id: '3',
    email: 'sophie@example.com',
    role: 'tutor',
    firstName: 'Sophie',
    lastName: 'Leroy',
    bio: 'Traductrice et professeure de langues. Expert en français, anglais et allemand.',
    subjects: [
      { id: '5', name: 'Français', category: 'languages', level: 'secondary' },
      { id: '6', name: 'Anglais', category: 'languages', level: 'university' },
      { id: '7', name: 'Allemand', category: 'languages', level: 'high-school' }
    ],
    languages: [
      { code: 'fr', name: 'Français', proficiency: 'native' },
      { code: 'en', name: 'Anglais', proficiency: 'native' },
      { code: 'de', name: 'Allemand', proficiency: 'fluent' }
    ],
    hourlyRate: 65,
    experience: 12,
    education: [
      { degree: 'Master', institution: 'Université de Genève', year: 2012, field: 'Linguistique' }
    ],
    availability: [],
    rating: 4.9,
    reviewCount: 203,
    verificationStatus: 'verified',
    teachingStyle: {
      approach: 'auditory',
      pace: 'moderate',
      structure: 'structured'
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    progress: {
      userId: '3',
      level: 7,
      xp: 3200,
      totalXP: 3200,
      achievements: [],
      badges: [],
      streak: { current: 22, longest: 35, lastActivity: new Date() },
      stats: {
        sessionsCompleted: 203,
        hoursSpent: 580,
        averageRating: 4.9,
        studentsHelped: 156
      }
    }
  }
]

const subjects = [
  'Tous',
  'Mathématiques',
  'Physique',
  'Chimie',
  'Français',
  'Anglais',
  'Allemand',
  'Histoire',
  'Géographie',
  'Programmation',
  'Économie'
]

const sortOptions = [
  { label: 'Pertinence', value: 'relevance' },
  { label: 'Note la plus élevée', value: 'rating' },
  { label: 'Prix croissant', value: 'price_asc' },
  { label: 'Prix décroissant', value: 'price_desc' },
  { label: 'Niveau le plus élevé', value: 'level' },
  { label: 'Plus d\'expérience', value: 'experience' }
]

export default function TutorsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('Tous')
  const [sortBy, setSortBy] = useState('relevance')
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 150])
  const [tutors, setTutors] = useState(mockTutors)

  const TutorCard = ({ tutor }: { tutor: TutorProfile & { progress: UserProgress } }) => {
    const prestigeLevel = PRESTIGE_LEVELS[tutor.progress.level - 1]

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300\"
      >
        {/* Header with Prestige */}
        <div className="relative p-6 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                {tutor.firstName[0]}{tutor.lastName[0]}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {tutor.firstName} {tutor.lastName}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-semibold">{tutor.rating}</span>
                  <span>({tutor.reviewCount} avis)</span>
                  {tutor.verificationStatus === 'verified' && (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      Vérifié
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Prestige Badge */}
            <div className="flex flex-col items-end">
              <div 
                className="px-3 py-1 rounded-full text-white text-xs font-bold flex items-center gap-1\"
                style={{ backgroundColor: prestigeLevel?.color }}
              >
                <span>{prestigeLevel?.icon}</span>
                {prestigeLevel?.name}
              </div>
              <span className="text-xs text-gray-500 mt-1">
                Level {tutor.progress.level}
              </span>
            </div>
          </div>

          <p className="text-gray-700 text-sm mb-4 line-clamp-2">{tutor.bio}</p>
          
          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-gray-900">{tutor.experience}</div>
              <div className="text-xs text-gray-500">ans d\'exp.</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">{tutor.progress.stats.studentsHelped}</div>
              <div className="text-xs text-gray-500">élèves</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">{tutor.progress.stats.hoursSpent}h</div>
              <div className="text-xs text-gray-500">enseignées</div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Subjects */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Matières enseignées</h4>
            <div className="flex flex-wrap gap-2">
              {tutor.subjects.slice(0, 3).map(subject => (
                <span
                  key={subject.id}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium\"
                >
                  {subject.name}
                </span>
              ))}
              {tutor.subjects.length > 3 && (
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                  +{tutor.subjects.length - 3}
                </span>
              )}
            </div>
          </div>

          {/* Languages */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Langues</h4>
            <div className="flex flex-wrap gap-2">
              {tutor.languages.map(lang => (
                <span
                  key={lang.code}
                  className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs\"
                >
                  {lang.name}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Répond en ~1h</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{tutor.hourlyRate} CHF</div>
                <div className="text-sm text-gray-500">par heure</div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-shadow\"
              >
                Contacter
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Nos Tuteurs <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Experts</span>
            </h1>
            <p className="text-gray-600">
              Découvrez nos {tutors.length} tuteurs gamifiés et trouvez votre mentor parfait
            </p>
          </div>

          {/* Search & Filters */}
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text\"
                placeholder="Rechercher par nom, matière, ville...\"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent\"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex items-center gap-4 flex-wrap">
              {/* Subject Filter */}
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500\"
              >
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500\"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50\"
              >
                <Filter className="w-4 h-4" />
                Filtres
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Advanced Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white rounded-xl border border-gray-200 p-6\"
                >
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prix par heure (CHF)
                      </label>
                      <input
                        type="range\"
                        min="0\"
                        max="150\"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full\"
                      />
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>0 CHF</span>
                        <span>{priceRange[1]} CHF</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Niveau minimum
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-200 rounded-lg">
                        <option>Tous niveaux</option>
                        <option>Novice</option>
                        <option>Expert</option>
                        <option>Maître</option>
                        <option>Sage+</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Disponibilité
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-200 rounded-lg">
                        <option>Toute la semaine</option>
                        <option>Week-ends</option>
                        <option>Soirs</option>
                        <option>Matins</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {tutors.length} tuteurs trouvés
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>Mise à jour temps réel</span>
          </div>
        </div>

        {/* Tutors Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {tutors.map(tutor => (
            <TutorCard key={tutor.id} tutor={tutor} />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors\"
          >
            Charger plus de tuteurs
          </motion.button>
        </div>
      </div>
    </div>
  )
}