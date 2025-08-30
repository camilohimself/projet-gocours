'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Crown, Zap, Star, Users, MessageCircle, BarChart3, Shield, Sparkles } from 'lucide-react'
import { SUBSCRIPTION_TIERS, ONE_TIME_PURCHASES, formatPrice } from '../../lib/stripe/config'

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')
  const [selectedTier, setSelectedTier] = useState<string | null>(null)

  const yearlyDiscount = 0.15 // 15% discount for yearly

  const PricingCard = ({ 
    tier, 
    tierKey, 
    isPopular = false, 
    isExclusive = false 
  }: { 
    tier: any, 
    tierKey: string, 
    isPopular?: boolean, 
    isExclusive?: boolean 
  }) => {
    const monthlyPrice = tier.price
    const yearlyPrice = Math.round(monthlyPrice * 12 * (1 - yearlyDiscount))
    const displayPrice = billingPeriod === 'yearly' ? yearlyPrice : monthlyPrice
    const pricePerMonth = billingPeriod === 'yearly' ? Math.round(yearlyPrice / 12) : monthlyPrice

    return (
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        className={`relative rounded-3xl p-8 shadow-lg transition-all duration-300 ${
          isPopular 
            ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-xl ring-4 ring-purple-200' 
            : isExclusive
            ? 'bg-gradient-to-br from-yellow-500 to-orange-500 text-white shadow-xl'
            : 'bg-white border border-gray-200 hover:shadow-xl'
        }`}
      >
        {/* Popular Badge */}
        {isPopular && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
              ⭐ Plus populaire
            </div>
          </div>
        )}

        {/* Exclusive Badge */}
        {isExclusive && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
              👑 Exclusif
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <div className={`text-6xl mb-4 ${isPopular || isExclusive ? 'text-white' : ''}`}>
            {tier.badge}
          </div>
          <h3 className={`text-2xl font-bold mb-2 ${isPopular || isExclusive ? 'text-white' : 'text-gray-900'}`}>
            {tier.name}
          </h3>
          
          {/* Price */}
          <div className="mb-4">
            <div className={`text-5xl font-bold ${isPopular || isExclusive ? 'text-white' : 'text-gray-900'}`}>
              {formatPrice(pricePerMonth)}
            </div>
            <div className={`text-sm ${isPopular || isExclusive ? 'text-white/80' : 'text-gray-600'}`}>
              par mois
            </div>
            {billingPeriod === 'yearly' && (
              <div className={`text-sm ${isPopular || isExclusive ? 'text-white/80' : 'text-gray-600'}`}>
                {formatPrice(displayPrice)} facturé annuellement
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="space-y-4 mb-8">
          {tier.features.map((feature: string, index: number) => (
            <div key={index} className="flex items-start gap-3">
              <Check className={`w-5 h-5 mt-0.5 ${
                isPopular || isExclusive ? 'text-white' : 'text-green-500'
              }`} />
              <span className={`text-sm ${
                isPopular || isExclusive ? 'text-white' : 'text-gray-700'
              }`}>
                {feature}
              </span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelectedTier(tierKey)}
          className={`w-full py-4 rounded-2xl font-semibold text-lg transition-colors ${
            isPopular || isExclusive
              ? 'bg-white text-gray-900 hover:bg-gray-100'
              : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
          }`}
        >
          {selectedTier === tierKey ? 'Sélectionné ✓' : 'Choisir ce plan'}
        </motion.button>

        {/* Additional Info */}
        <div className={`text-center mt-4 text-xs ${
          isPopular || isExclusive ? 'text-white/70' : 'text-gray-500'
        }`}>
          Annulation à tout moment
        </div>
      </motion.div>
    )
  }

  const OneTimePurchaseCard = ({ 
    purchase, 
    purchaseKey 
  }: { 
    purchase: any, 
    purchaseKey: string 
  }) => (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all\"
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-bold text-gray-900">{purchase.name}</h4>
        <div className="text-2xl font-bold text-blue-600">
          {formatPrice(purchase.price)}
        </div>
      </div>
      <p className="text-gray-600 text-sm mb-4">{purchase.description}</p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-colors\"
      >
        Acheter maintenant
      </motion.button>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 to-purple-900 text-white">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-bold mb-6\"
            >
              Choisissez Votre Plan
              <br />
              <span className="bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
                Gamifié
              </span>
            </motion.h1>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Débloquez votre potentiel avec nos plans premium conçus pour les tuteurs ambitieux
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className={`font-medium ${billingPeriod === 'monthly' ? 'text-white' : 'text-gray-300'}`}>
                Mensuel
              </span>
              <button
                onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
                className={`relative w-16 h-8 rounded-full transition-colors ${
                  billingPeriod === 'yearly' ? 'bg-yellow-400' : 'bg-gray-600'
                }`}
              >
                <div className={`absolute w-6 h-6 bg-white rounded-full top-1 transition-transform ${
                  billingPeriod === 'yearly' ? 'translate-x-9' : 'translate-x-1'
                }`} />
              </button>
              <span className={`font-medium ${billingPeriod === 'yearly' ? 'text-white' : 'text-gray-300'}`}>
                Annuel
              </span>
              {billingPeriod === 'yearly' && (
                <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">
                  -15% 🎉
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {Object.entries(SUBSCRIPTION_TIERS).map(([key, tier]) => (
            <PricingCard
              key={key}
              tier={tier}
              tierKey={key}
              isPopular={tier.popular}
              isExclusive={tier.exclusive}
            />
          ))}
        </div>

        {/* One-time purchases */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Boosts & Extras
            </h2>
            <p className="text-gray-600 text-lg">
              Amplifiez votre visibilité avec nos boosts ponctuels
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(ONE_TIME_PURCHASES).map(([key, purchase]) => (
              <OneTimePurchaseCard
                key={key}
                purchase={purchase}
                purchaseKey={key}
              />
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-3xl p-12 shadow-lg">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Questions Fréquentes
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                q: "Comment fonctionne le système de niveaux ?",
                a: "Vous gagnez de l'XP en donnant des cours, recevant de bonnes notes, et accomplissant des défis. Plus votre niveau est élevé, plus vous êtes visible !"
              },
              {
                q: "Puis-je changer de plan à tout moment ?",
                a: "Absolument ! Vous pouvez upgrader ou downgrader votre plan à tout moment. Les changements prennent effet immédiatement."
              },
              {
                q: "Comment fonctionnent les boosts ?",
                a: "Les boosts vous permettent d'apparaître en haut des résultats de recherche pendant la durée choisie, augmentant drastiquement votre visibilité."
              },
              {
                q: "Y a-t-il des frais cachés ?",
                a: "Aucun ! Nos prix sont transparents. Nous prenons seulement une commission de 15% sur les cours réservés via la plateforme."
              }
            ].map((faq, index) => (
              <div key={index} className="mb-6">
                <h4 className="font-bold text-gray-900 mb-2">{faq.q}</h4>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Prêt à Booster votre Carrière ?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Rejoignez les 1000+ tuteurs qui font déjà confiance à TheGoCours
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-gray-900 px-8 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-colors\"
              >
                Commencer l'essai gratuit
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white px-8 py-4 rounded-2xl font-bold hover:bg-white hover:text-gray-900 transition-colors\"
              >
                Parler à un conseiller
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}