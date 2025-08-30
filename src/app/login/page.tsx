'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Brain, Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        // Check if user is tutor or student
        const { data: tutorProfile } = await supabase
          .from('tutor_profiles')
          .select('id')
          .eq('user_id', data.user.id)
          .single()

        if (tutorProfile) {
          router.push('/dashboard')
        } else {
          router.push('/student')
        }
      }
    } catch (error: any) {
      setError(error.message || 'Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-6">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-10">
        <svg className="w-full h-full">
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <circle cx="25" cy="25" r="1" fill="currentColor" className="text-blue-500" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
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
          <h1 className="text-3xl font-bold text-white mb-2">
            Bon retour !
          </h1>
          <p className="text-gray-400">
            Connectez-vous à votre compte pour continuer votre aventure
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-500/20 text-red-300 p-4 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="votre@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Votre mot de passe"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                />
                <span className="ml-2 text-sm text-gray-300">Se souvenir de moi</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                Mot de passe oublié ?
              </Link>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </motion.button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/20 text-center">
            <p className="text-gray-400 text-sm">
              Pas encore de compte ?{' '}
              <Link href="/signup" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Inscription gratuite
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}