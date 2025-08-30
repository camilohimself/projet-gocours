-- ThéGoCours Database Schema
-- Système complet de tutorat gamifié avec IA

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Users table (handled by Supabase Auth)
-- We'll extend it with profiles

-- Tutor profiles
CREATE TABLE tutor_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    bio TEXT,
    hourly_rate INTEGER NOT NULL CHECK (hourly_rate >= 10 AND hourly_rate <= 500),
    subjects TEXT[] NOT NULL,
    languages JSONB NOT NULL DEFAULT '[]',
    experience_years INTEGER DEFAULT 0,
    education JSONB DEFAULT '[]',
    verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    
    -- Subscription & Billing
    subscription_tier VARCHAR(20) DEFAULT 'free' CHECK (subscription_tier IN ('free', 'basic', 'pro', 'elite')),
    subscription_expires TIMESTAMPTZ,
    stripe_customer_id VARCHAR(100),
    
    -- Stats
    total_hours_taught INTEGER DEFAULT 0,
    average_rating DECIMAL(2,1) DEFAULT 0.0 CHECK (average_rating >= 0 AND average_rating <= 5),
    review_count INTEGER DEFAULT 0,
    response_time_minutes INTEGER DEFAULT 60,
    
    -- Gamification
    level INTEGER DEFAULT 1 CHECK (level >= 1 AND level <= 8),
    xp_points INTEGER DEFAULT 0,
    total_xp INTEGER DEFAULT 0,
    badges JSONB DEFAULT '[]',
    achievements JSONB DEFAULT '[]',
    
    -- Activity tracking
    streak_current INTEGER DEFAULT 0,
    streak_longest INTEGER DEFAULT 0,
    last_activity TIMESTAMPTZ DEFAULT NOW(),
    students_helped INTEGER DEFAULT 0,
    
    -- Teaching style
    teaching_style JSONB DEFAULT '{}',
    
    -- Profile settings
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    profile_image_url TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Student profiles
CREATE TABLE student_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    grade_level VARCHAR(20),
    subjects_learning TEXT[] DEFAULT '{}',
    learning_goals TEXT[] DEFAULT '{}',
    
    -- Gamification
    level INTEGER DEFAULT 1,
    xp_points INTEGER DEFAULT 0,
    total_xp INTEGER DEFAULT 0,
    badges JSONB DEFAULT '[]',
    achievements JSONB DEFAULT '[]',
    
    -- Learning style
    learning_style JSONB DEFAULT '{}',
    
    -- Activity tracking
    streak_current INTEGER DEFAULT 0,
    streak_longest INTEGER DEFAULT 0,
    last_activity TIMESTAMPTZ DEFAULT NOW(),
    subjects_mastered INTEGER DEFAULT 0,
    
    -- Profile settings
    profile_image_url TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subjects
CREATE TABLE subjects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    level VARCHAR(20) NOT NULL,
    description TEXT,
    icon VARCHAR(10),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sessions
CREATE TABLE sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tutor_id UUID REFERENCES tutor_profiles(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE NOT NULL,
    subject VARCHAR(100) NOT NULL,
    
    -- Scheduling
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 60,
    timezone VARCHAR(50) DEFAULT 'Europe/Zurich',
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
    
    -- Meeting info
    meeting_url TEXT,
    meeting_notes TEXT,
    
    -- Pricing
    price_per_hour INTEGER NOT NULL,
    total_price INTEGER NOT NULL,
    
    -- AI insights
    ai_insights JSONB DEFAULT '{}',
    
    -- Gamification rewards
    tutor_xp_earned INTEGER DEFAULT 0,
    student_xp_earned INTEGER DEFAULT 0,
    badges_earned JSONB DEFAULT '[]',
    
    -- Timestamps
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews
CREATE TABLE reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID REFERENCES sessions(id) ON DELETE CASCADE NOT NULL,
    reviewer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    reviewed_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    
    -- Badges awarded for this review
    badges_awarded TEXT[] DEFAULT '{}',
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Achievements definitions
CREATE TABLE achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(10) NOT NULL,
    xp_reward INTEGER NOT NULL DEFAULT 0,
    rarity VARCHAR(20) DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
    unlock_condition JSONB NOT NULL,
    target_role VARCHAR(20) CHECK (target_role IN ('tutor', 'student', 'both')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User achievements (junction table)
CREATE TABLE user_achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE NOT NULL,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- Messages
CREATE TABLE messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'image', 'session_request')),
    file_url TEXT,
    
    -- Threading
    thread_id UUID,
    reply_to UUID REFERENCES messages(id),
    
    -- Status
    read_at TIMESTAMPTZ,
    is_important BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions (for tutors)
CREATE TABLE subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    tier VARCHAR(20) NOT NULL CHECK (tier IN ('basic', 'pro', 'elite')),
    
    -- Stripe integration
    stripe_subscription_id VARCHAR(100) UNIQUE,
    stripe_customer_id VARCHAR(100),
    
    -- Billing
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'incomplete')),
    current_period_start TIMESTAMPTZ NOT NULL,
    current_period_end TIMESTAMPTZ NOT NULL,
    cancel_at TIMESTAMPTZ,
    canceled_at TIMESTAMPTZ,
    
    -- Pricing
    price_per_month INTEGER NOT NULL,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment transactions
CREATE TABLE transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
    
    -- Stripe
    stripe_payment_intent_id VARCHAR(100),
    
    -- Transaction details
    amount INTEGER NOT NULL, -- in cents/centimes
    currency VARCHAR(3) DEFAULT 'CHF',
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('session_payment', 'subscription', 'boost', 'verification')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
    
    -- Metadata
    description TEXT,
    metadata JSONB DEFAULT '{}',
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Availability slots for tutors
CREATE TABLE availability (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tutor_id UUID REFERENCES tutor_profiles(id) ON DELETE CASCADE NOT NULL,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    timezone VARCHAR(50) DEFAULT 'Europe/Zurich',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Favorites (students can favorite tutors)
CREATE TABLE favorites (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE NOT NULL,
    tutor_id UUID REFERENCES tutor_profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, tutor_id)
);

-- Knowledge graph nodes
CREATE TABLE knowledge_nodes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    subject VARCHAR(100) NOT NULL,
    concept VARCHAR(200) NOT NULL,
    mastery INTEGER DEFAULT 0 CHECK (mastery >= 0 AND mastery <= 100),
    connections UUID[] DEFAULT '{}', -- Array of connected node IDs
    ai_generated BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Learning paths (AI-generated progression paths)
CREATE TABLE learning_paths (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE NOT NULL,
    goal TEXT NOT NULL,
    milestones JSONB NOT NULL DEFAULT '[]',
    current_progress INTEGER DEFAULT 0 CHECK (current_progress >= 0 AND current_progress <= 100),
    estimated_completion TIMESTAMPTZ,
    recommended_tutors UUID[] DEFAULT '{}',
    ai_generated BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quests/Missions for gamification
CREATE TABLE quests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    quest_type VARCHAR(20) NOT NULL CHECK (quest_type IN ('daily', 'weekly', 'monthly', 'seasonal', 'special')),
    target_role VARCHAR(20) CHECK (target_role IN ('tutor', 'student', 'both')),
    
    -- Requirements
    requirements JSONB NOT NULL DEFAULT '[]',
    
    -- Rewards
    xp_reward INTEGER DEFAULT 0,
    badge_rewards TEXT[] DEFAULT '{}',
    special_reward TEXT,
    
    -- Timing
    start_date TIMESTAMPTZ DEFAULT NOW(),
    end_date TIMESTAMPTZ,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    max_completions INTEGER DEFAULT 1, -- How many times can be completed
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User quest progress
CREATE TABLE user_quests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    quest_id UUID REFERENCES quests(id) ON DELETE CASCADE NOT NULL,
    progress JSONB DEFAULT '{}',
    completed_at TIMESTAMPTZ,
    rewards_claimed BOOLEAN DEFAULT false,
    completion_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_tutor_profiles_user_id ON tutor_profiles(user_id);
CREATE INDEX idx_tutor_profiles_subscription ON tutor_profiles(subscription_tier, subscription_expires);
CREATE INDEX idx_tutor_profiles_level ON tutor_profiles(level DESC, xp_points DESC);
CREATE INDEX idx_student_profiles_user_id ON student_profiles(user_id);
CREATE INDEX idx_sessions_tutor ON sessions(tutor_id, scheduled_at);
CREATE INDEX idx_sessions_student ON sessions(student_id, scheduled_at);
CREATE INDEX idx_sessions_status ON sessions(status, scheduled_at);
CREATE INDEX idx_messages_conversation ON messages(sender_id, receiver_id, created_at);
CREATE INDEX idx_reviews_reviewed ON reviews(reviewed_id, created_at);
CREATE INDEX idx_availability_tutor ON availability(tutor_id, day_of_week);

-- Row Level Security (RLS)
ALTER TABLE tutor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quests ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Basic - à étendre)
CREATE POLICY "Users can view all tutor profiles" ON tutor_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own tutor profile" ON tutor_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can view own student profile" ON student_profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view sessions they're part of" ON sessions FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM tutor_profiles WHERE id = sessions.tutor_id AND user_id = auth.uid()
    ) OR EXISTS (
        SELECT 1 FROM student_profiles WHERE id = sessions.student_id AND user_id = auth.uid()
    )
);

-- Functions for XP and level calculations
CREATE OR REPLACE FUNCTION calculate_level_from_xp(xp_points INTEGER)
RETURNS INTEGER AS $$
BEGIN
    CASE 
        WHEN xp_points < 100 THEN RETURN 1;
        WHEN xp_points < 300 THEN RETURN 2;
        WHEN xp_points < 600 THEN RETURN 3;
        WHEN xp_points < 1000 THEN RETURN 4;
        WHEN xp_points < 1500 THEN RETURN 5;
        WHEN xp_points < 2500 THEN RETURN 6;
        WHEN xp_points < 5000 THEN RETURN 7;
        ELSE RETURN 8;
    END CASE;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update levels
CREATE OR REPLACE FUNCTION update_level_on_xp_change()
RETURNS TRIGGER AS $$
BEGIN
    NEW.level = calculate_level_from_xp(NEW.xp_points);
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tutor_level_update BEFORE UPDATE ON tutor_profiles
    FOR EACH ROW WHEN (OLD.xp_points != NEW.xp_points)
    EXECUTE FUNCTION update_level_on_xp_change();

CREATE TRIGGER student_level_update BEFORE UPDATE ON student_profiles
    FOR EACH ROW WHEN (OLD.xp_points != NEW.xp_points)
    EXECUTE FUNCTION update_level_on_xp_change();

-- Insert default achievements
INSERT INTO achievements (name, description, icon, xp_reward, rarity, unlock_condition, target_role) VALUES
('First Blood', 'Donnez votre premier cours', '🩸', 50, 'common', '{"type": "sessions_completed", "value": 1, "comparison": "gte"}', 'tutor'),
('Rising Star', 'Obtenez 10 avis 5 étoiles', '⭐', 200, 'rare', '{"type": "rating", "value": 5, "comparison": "gte"}', 'tutor'),
('On Fire', '10 cours donnés consécutivement', '🔥', 300, 'rare', '{"type": "streak", "value": 10, "comparison": "gte"}', 'tutor'),
('Diamond Teacher', 'Enseignez pendant 100 heures', '💎', 500, 'epic', '{"type": "hours_taught", "value": 100, "comparison": "gte"}', 'tutor'),
('Unicorn', 'Aidez 1000 élèves différents', '🦄', 1000, 'legendary', '{"type": "students_helped", "value": 1000, "comparison": "gte"}', 'tutor'),
('First Step', 'Suivez votre premier cours', '👶', 25, 'common', '{"type": "sessions_completed", "value": 1, "comparison": "gte"}', 'student'),
('Eager Learner', 'Suivez 10 cours', '📚', 100, 'common', '{"type": "sessions_completed", "value": 10, "comparison": "gte"}', 'student'),
('Dedicated Student', 'Maintenez une série de 7 jours', '🎯', 150, 'rare', '{"type": "streak", "value": 7, "comparison": "gte"}', 'student');

-- Insert default subjects
INSERT INTO subjects (name, category, level, description, icon) VALUES
('Mathématiques', 'mathematics', 'high-school', 'Algèbre, géométrie, statistiques', '📐'),
('Physique', 'sciences', 'high-school', 'Mécanique, thermodynamique, électricité', '⚛️'),
('Chimie', 'sciences', 'high-school', 'Chimie organique et inorganique', '🧪'),
('Français', 'languages', 'secondary', 'Grammaire, littérature, expression', '🇫🇷'),
('Anglais', 'languages', 'university', 'Conversation, business english', '🇺🇸'),
('Allemand', 'languages', 'high-school', 'Grammaire, vocabulaire, culture', '🇩🇪'),
('Programmation', 'technology', 'university', 'JavaScript, Python, web development', '💻'),
('Économie', 'other', 'university', 'Micro et macroéconomie', '📊');

-- Insert sample quests
INSERT INTO quests (title, description, quest_type, target_role, requirements, xp_reward, start_date, end_date) VALUES
('Streak Master', 'Maintenez une série de 5 jours d''activité', 'weekly', 'both', '[{"type": "streak", "target": 5}]', 100, NOW(), NOW() + INTERVAL '7 days'),
('Social Butterfly', 'Envoyez 10 messages cette semaine', 'weekly', 'both', '[{"type": "messages_sent", "target": 10}]', 50, NOW(), NOW() + INTERVAL '7 days'),
('Perfect Rating', 'Obtenez que des 5⭐ cette semaine', 'weekly', 'tutor', '[{"type": "perfect_rating_week", "target": 1}]', 200, NOW(), NOW() + INTERVAL '7 days');