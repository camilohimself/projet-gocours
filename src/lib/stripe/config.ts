import Stripe from 'stripe'

// Use a dummy key for build time if environment variable is not set
const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_build'

export const stripe = new Stripe(stripeKey, {
  apiVersion: '2025-07-30.basil',
  typescript: true,
})

// Subscription tiers and pricing
export const SUBSCRIPTION_TIERS = {
  basic: {
    name: 'Basic',
    price: 2900, // 29 CHF in cents
    priceId: 'price_basic_monthly_chf', // À créer dans Stripe Dashboard
    features: [
      'Profil tuteur visible',
      'Jusqu\'à 10 élèves par mois',
      'Messagerie de base',
      'Support par email'
    ],
    color: 'blue',
    badge: '📘',
    popular: false,
    exclusive: false
  },
  pro: {
    name: 'Pro',
    price: 5900, // 59 CHF in cents
    priceId: 'price_pro_monthly_chf',
    features: [
      'Profil mis en avant',
      'Élèves illimités',
      'Messagerie prioritaire',
      'Analytics avancés',
      'Badge Pro',
      'Support prioritaire'
    ],
    color: 'purple',
    badge: '👑',
    popular: true,
    exclusive: false
  },
  elite: {
    name: 'Elite',
    price: 9900, // 99 CHF in cents
    priceId: 'price_elite_monthly_chf',
    features: [
      'Top des résultats',
      'Profil ultra-premium',
      'IA personnalisée',
      'Manager de compte dédié',
      'Badge Elite exclusif',
      'Accès VIP aux nouveautés'
    ],
    color: 'gold',
    badge: '🔱',
    popular: false,
    exclusive: true
  }
}

// One-time purchases
export const ONE_TIME_PURCHASES = {
  boost_24h: {
    name: 'Boost 24h',
    price: 1500, // 15 CHF
    priceId: 'price_boost_24h_chf',
    description: 'Apparaître en top pendant 24h'
  },
  boost_weekend: {
    name: 'Boost Week-end',
    price: 2500, // 25 CHF
    priceId: 'price_boost_weekend_chf',
    description: 'Visibilité maximale le week-end'
  },
  verification: {
    name: 'Vérification Express',
    price: 3000, // 30 CHF
    priceId: 'price_verification_chf',
    description: 'Vérification de profil en 24h'
  },
  badge_certified: {
    name: 'Badge Certifié',
    price: 2000, // 20 CHF
    priceId: 'price_badge_certified_chf',
    description: 'Badge "Tuteur Certifié" exclusif'
  }
}

export function formatPrice(price: number, currency = 'CHF'): string {
  return new Intl.NumberFormat('fr-CH', {
    style: 'currency',
    currency: currency,
  }).format(price / 100)
}

export function getSubscriptionTier(tierName: string) {
  return SUBSCRIPTION_TIERS[tierName as keyof typeof SUBSCRIPTION_TIERS]
}

export type SubscriptionTier = keyof typeof SUBSCRIPTION_TIERS
export type PurchaseType = keyof typeof ONE_TIME_PURCHASES