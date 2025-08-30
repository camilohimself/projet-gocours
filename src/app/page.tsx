'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Sparkles, Users, ChevronRight, Zap, Target, BookOpen, Star } from 'lucide-react'

export default function Home() {
  const [currentWord, setCurrentWord] = useState(0)
  const words = ['Apprentissage', 'Transmission', 'Connaissance', 'Excellence']

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden">
      {/* Neural Network Background */}
      <div className="fixed inset-0 opacity-20">
        <svg className="w-full h-full">
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <circle cx="25" cy="25" r="1" fill="currentColor" className="text-blue-500" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center px-6 sm:px-12 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto w-full"
        >
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="relative">
              <Brain className="w-12 h-12 text-blue-500" />
              <motion.div
                className="absolute inset-0"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-12 h-12 text-purple-500 opacity-50" />
              </motion.div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              TheGoCours
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            La Révolution de
            <br />
            <AnimatePresence mode="wait">
              <motion.span
                key={currentWord}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
              >
                l'{words[currentWord]}
              </motion.span>
            </AnimatePresence>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-3xl">
            L'intelligence artificielle au service de la transmission humaine.
            Une symbiose parfaite entre tuteurs experts et technologie de pointe.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full font-semibold text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
            >
              <Zap className="w-5 h-5" />
              Commencer l'Aventure
              <ChevronRight className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border border-gray-600 rounded-full font-semibold text-lg hover:bg-white/10 transition-colors"
            >
              Devenir Tuteur
            </motion.button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {[
              { value: '98%', label: 'Taux de Réussite' },
              { value: '500+', label: 'Tuteurs Experts' },
              { value: '10k+', label: 'Sessions IA' },
              { value: '4.9/5', label: 'Satisfaction' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-600 rounded-full mt-2" />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-6 sm:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16"
          >
            L'IA qui Amplifie l'Humain
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: 'Matching Quantique',
                description: 'Algorithme d\'IA qui analyse 50+ critères pour créer la synergie parfaite tuteur-élève.',
                color: 'from-blue-500 to-cyan-500',
              },
              {
                icon: Target,
                title: 'Knowledge Graph',
                description: 'Cartographie personnalisée de vos connaissances avec identification des lacunes.',
                color: 'from-purple-500 to-pink-500',
              },
              {
                icon: BookOpen,
                title: 'Assistant IA 24/7',
                description: 'Support continu avec génération de contenu pédagogique personnalisé.',
                color: 'from-green-500 to-emerald-500',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity" />
                <div className="relative p-8 border border-gray-800 rounded-2xl hover:border-gray-700 transition-colors">
                  <div className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-20 px-6 sm:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16"
          >
            Comment ça Marche?
          </motion.h2>

          <div className="space-y-12">
            {[
              { step: '01', title: 'Définissez vos Objectifs', desc: 'L\'IA analyse vos besoins et crée votre profil d\'apprentissage unique.' },
              { step: '02', title: 'Match Intelligent', desc: 'Notre algorithme quantique trouve le tuteur parfait parmi nos experts vérifiés.' },
              { step: '03', title: 'Session Augmentée', desc: 'L\'IA assiste la session en temps réel et génère des ressources personnalisées.' },
              { step: '04', title: 'Evolution Continue', desc: 'Votre knowledge graph évolue et s\'adapte à votre progression.' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-8"
              >
                <div className="text-5xl font-bold text-gray-800">{item.step}</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-6 sm:px-12 lg:px-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center p-12 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-3xl border border-gray-800"
        >
          <h2 className="text-4xl font-bold mb-6">
            Prêt à Transformer votre Apprentissage?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Rejoignez la révolution de l'éducation augmentée par l'IA.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-100 transition-colors"
          >
            Essai Gratuit - Sans Engagement
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-6 sm:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-blue-500" />
            <span className="font-semibold">TheGoCours</span>
            <span className="text-gray-500">© 2025 OSOM Agency</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-white transition-colors">Conditions</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
