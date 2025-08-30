'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, Users, GraduationCap, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function SignupPage() {
  const [selectedRole, setSelectedRole] = useState<'student' | 'tutor' | null>(null)

  const roleOptions = [
    {
      id: 'student' as const,
      title: 'Élève',
      subtitle: 'Trouvez le tuteur parfait',
      description: 'Accédez à des centaines de tuteurs experts, progressez avec l\'IA et débloquez des achievements.',
      icon: GraduationCap,
      gradient: 'from-green-500 to-emerald-500',
      features: ['Accès gratuit à vie', 'IA d\'apprentissage personnalisée', 'Progression gamifiée', 'Tuteurs vérifiés'],
      price: 'Gratuit'
    },
    {
      id: 'tutor' as const,
      title: 'Tuteur',
      subtitle: 'Partagez vos connaissances',
      description: 'Enseignez en ligne, développez votre expertise et gagnez en montant de niveau comme dans un jeu.',
      icon: Users,
      gradient: 'from-blue-500 to-purple-500',
      features: ['Profil mis en avant', 'Outils IA avancés', 'Système de progression', 'Commission réduite 15%'],
      price: 'Dès 29 CHF/mois'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-10">
        <svg className="w-full h-full">
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <circle cx="25" cy="25" r="1" fill="currentColor" className="text-blue-500" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative min-h-screen flex flex-col justify-center p-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative">
              <Brain className="w-10 h-10 text-blue-500" />
              <motion.div
                className="absolute inset-0"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-10 h-10 text-purple-500 opacity-50" />
              </motion.div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              TheGoCours
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Rejoignez la Révolution
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Choisissez votre aventure dans l'écosystème éducatif le plus avancé de Suisse
          </p>
        </div>

        {/* Role Selection */}
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {roleOptions.map((role) => {
              const Icon = role.icon
              return (
                <motion.div
                  key={role.id}
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedRole(role.id)}
                  className={`relative p-8 rounded-3xl cursor-pointer transition-all duration-300 ${
                    selectedRole === role.id
                      ? `bg-gradient-to-br ${role.gradient} shadow-2xl ring-4 ring-white/20`
                      : 'bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/15'
                  }`}
                >
                  {/* Selection indicator */}
                  {selectedRole === role.id && (
                    <div className="absolute -top-2 -right-2">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                  )}

                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                    selectedRole === role.id 
                      ? 'bg-white/20' 
                      : `bg-gradient-to-br ${role.gradient}`
                  }`}>
                    <Icon className={`w-8 h-8 ${
                      selectedRole === role.id ? 'text-white' : 'text-white'
                    }`} />
                  </div>

                  {/* Content */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {role.title}
                    </h3>
                    <p className="text-lg text-white/80 mb-4">
                      {role.subtitle}
                    </p>
                    <p className="text-white/70 mb-4">
                      {role.description}
                    </p>
                    
                    {/* Price */}
                    <div className="text-2xl font-bold text-white mb-4">
                      {role.price}
                    </div>

                    {/* Features */}
                    <ul className="space-y-2">
                      {role.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-white/80">
                          <div className="w-2 h-2 bg-white/60 rounded-full mr-3"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* CTA Button */}
          {selectedRole && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <Link href={`/signup/${selectedRole}`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-12 py-4 rounded-full font-bold text-lg shadow-2xl transition-colors ${
                    selectedRole === 'student'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
                  }`}
                >
                  Continuer comme {selectedRole === 'student' ? 'Élève' : 'Tuteur'}
                </motion.button>
              </Link>
            </motion.div>
          )}

          {/* Login Link */}
          <div className="text-center mt-12">
            <p className="text-gray-400">
              Déjà inscrit ?{' '}
              <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}