# 🚀 VERCEL - CONFIGURATION COMPLÈTE VARIABLES D'ENVIRONNEMENT
**Date**: 30 août 2025  
**Projet**: TheGoCours Production Deploy  
**Status**: CRITIQUE - Variables manquantes = Erreurs guarantees

---

## ⚠️ VARIABLES OBLIGATOIRES DÉTECTÉES DANS LE CODE

### 1. **DATABASE (Prisma) - CRITIQUE**
```env
DATABASE_URL=postgresql://username:password@host:port/database
```
**Fichier**: `prisma/schema.prisma:7`  
**Erreur si manquant**: "DATABASE_URL is not defined"

### 2. **SUPABASE CLIENT - CRITIQUE** 
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```
**Fichiers**: 
- `src/lib/supabase/client.ts:5-6`
- `src/lib/supabase/server.ts:8-9`  
**Erreur si manquant**: "NEXT_PUBLIC_SUPABASE_URL is not defined"

### 3. **STRIPE PAYMENTS - CRITIQUE**
```env
STRIPE_SECRET_KEY=sk_live_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
```
**Fichier**: `src/lib/stripe/config.ts:4`  
**Note**: Fallback dummy key présent mais non-fonctionnel

### 4. **NODE ENVIRONMENT - STANDARD**
```env
NODE_ENV=production
```
**Fichier**: `app/lib/prisma.ts:11`

---

## 🎯 CONFIGURATION VERCEL COMPLÈTE

### **MÉTHODE 1: Via Interface Vercel**
1. Va dans **Project Settings** → **Environment Variables**
2. Ajoute TOUTES les variables ci-dessus
3. **Redeploy**

### **MÉTHODE 2: Via fichier .env.production (Recommandé)**
```env
# Database
DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Stripe
STRIPE_SECRET_KEY="sk_live_xxx"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_xxx"

# App Config
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://thegocours-production.vercel.app"
```

---

## 🔥 ERREURS PROBABLES SI NON CONFIGURÉ

### Build Time Errors:
- ❌ `Error: Environment variable "DATABASE_URL" is required`
- ❌ `Prisma: DATABASE_URL not found`
- ❌ `Supabase client initialization failed`

### Runtime Errors:
- ❌ `Cannot connect to database`
- ❌ `Supabase client not configured`
- ❌ `Stripe payments non-functional`

---

## ✅ SOLUTION IMMÉDIATE

### **ÉTAPE 1: Créer Supabase Project (5 min)**
1. Va sur https://supabase.com
2. **New Project** → `thegocours-production`
3. Récupère `URL` et `ANON KEY`
4. Import du schema: Upload `supabase-schema.sql`

### **ÉTAPE 2: Configurer Vercel Env Vars**
1. **Project Settings** → **Environment Variables**
2. Ajoute les 6 variables ci-dessus
3. **Redeploy**

### **ÉTAPE 3: Stripe (Optionnel pour MVP)**
- Utilise `sk_test_xxx` pour l'instant
- Configure vrai Stripe plus tard

---

## 💡 MÉMOIRE CLAUDE - CONFIGURATION FUTURE

```bash
# Commandes de setup automatique (à retenir)
npx supabase init
npx supabase db push
npx prisma migrate deploy
npm run build  # Test local avant deploy
```

**Next Actions:**
1. ✅ Setup Supabase (priorité 1)
2. ✅ Configure Vercel env vars 
3. ✅ Redeploy
4. 🔧 Test production URL
5. 🎯 Configure Stripe payments

---

*"Configuration incomplète = échec garantie. Mieux vaut 10 minutes de setup que 2h de debug."*