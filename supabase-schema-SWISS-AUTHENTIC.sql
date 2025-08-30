-- 🇨🇭 TheGoCours Database Schema - SWISS AUTHENTIC VERSION
-- Système de tutorat gamifié spécialement adapté à la Suisse
-- Cantons, matières, système scolaire HarmoS authentiques

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- SWISS CANTONS TABLE - Authentique Suisse
CREATE TABLE swiss_cantons (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    code VARCHAR(2) NOT NULL UNIQUE, -- GE, VD, ZH, etc.
    name_fr VARCHAR(50) NOT NULL,
    name_de VARCHAR(50) NOT NULL,
    name_it VARCHAR(50),
    region VARCHAR(20) NOT NULL, -- Suisse romande, Suisse alémanique, Tessin
    main_language VARCHAR(10) NOT NULL, -- fr, de, it
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert Swiss cantons - DONNÉES AUTHENTIQUES
INSERT INTO swiss_cantons (code, name_fr, name_de, name_it, region, main_language) VALUES
-- Suisse romande
('GE', 'Genève', 'Genf', 'Ginevra', 'Suisse romande', 'fr'),
('VD', 'Vaud', 'Waadt', 'Vaud', 'Suisse romande', 'fr'),
('NE', 'Neuchâtel', 'Neuenburg', 'Neuchâtel', 'Suisse romande', 'fr'),
('JU', 'Jura', 'Jura', 'Giura', 'Suisse romande', 'fr'),
('FR', 'Fribourg', 'Freiburg', 'Friborgo', 'Suisse romande', 'fr'),
('VS', 'Valais', 'Wallis', 'Vallese', 'Suisse romande', 'fr'),

-- Suisse alémanique  
('ZH', 'Zurich', 'Zürich', 'Zurigo', 'Suisse alémanique', 'de'),
('BE', 'Berne', 'Bern', 'Berna', 'Suisse alémanique', 'de'),
('LU', 'Lucerne', 'Luzern', 'Lucerna', 'Suisse alémanique', 'de'),
('UR', 'Uri', 'Uri', 'Uri', 'Suisse alémanique', 'de'),
('SZ', 'Schwytz', 'Schwyz', 'Svitto', 'Suisse alémanique', 'de'),
('OW', 'Obwald', 'Obwalden', 'Obvaldo', 'Suisse alémanique', 'de'),
('NW', 'Nidwald', 'Nidwalden', 'Nidvaldo', 'Suisse alémanique', 'de'),
('GL', 'Glaris', 'Glarus', 'Glarona', 'Suisse alémanique', 'de'),
('ZG', 'Zoug', 'Zug', 'Zugo', 'Suisse alémanique', 'de'),
('SO', 'Soleure', 'Solothurn', 'Soletta', 'Suisse alémanique', 'de'),
('BS', 'Bâle-Ville', 'Basel-Stadt', 'Basilea Città', 'Suisse alémanique', 'de'),
('BL', 'Bâle-Campagne', 'Basel-Landschaft', 'Basilea Campagna', 'Suisse alémanique', 'de'),
('SH', 'Schaffhouse', 'Schaffhausen', 'Sciaffusa', 'Suisse alémanique', 'de'),
('AR', 'Appenzell Rhodes-Extérieures', 'Appenzell Ausserrhoden', 'Appenzello Esterno', 'Suisse alémanique', 'de'),
('AI', 'Appenzell Rhodes-Intérieures', 'Appenzell Innerrhoden', 'Appenzello Interno', 'Suisse alémanique', 'de'),
('SG', 'Saint-Gall', 'St. Gallen', 'San Gallo', 'Suisse alémanique', 'de'),
('GR', 'Grisons', 'Graubünden', 'Grigioni', 'Suisse alémanique', 'de'),
('AG', 'Argovie', 'Aargau', 'Argovia', 'Suisse alémanique', 'de'),
('TG', 'Thurgovie', 'Thurgau', 'Turgovia', 'Suisse alémanique', 'de'),

-- Tessin
('TI', 'Tessin', 'Tessin', 'Ticino', 'Tessin', 'it');

-- SWISS SCHOOL SYSTEM - Système HarmoS authentique
CREATE TABLE swiss_school_levels (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    harmos_level INTEGER, -- 1-11 selon HarmoS
    name_fr VARCHAR(100) NOT NULL,
    name_de VARCHAR(100) NOT NULL,
    name_it VARCHAR(100),
    age_min INTEGER,
    age_max INTEGER,
    description_fr TEXT,
    description_de TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert Swiss school levels - SYSTÈME HARMOS AUTHENTIQUE
INSERT INTO swiss_school_levels (harmos_level, name_fr, name_de, name_it, age_min, age_max, description_fr, description_de) VALUES
(1, '1ère année primaire', '1. Primarschule', '1ª elementare', 4, 5, 'Début scolarité obligatoire', 'Beginn der obligatorischen Schulzeit'),
(2, '2ème année primaire', '2. Primarschule', '2ª elementare', 5, 6, 'Apprentissage lecture/écriture', 'Lesen und Schreibenlernen'),
(3, '3ème année primaire', '3. Primarschule', '3ª elementare', 6, 7, 'Consolidation bases', 'Festigung der Grundlagen'),
(4, '4ème année primaire', '4. Primarschule', '4ª elementare', 7, 8, 'Mathématiques approfondies', 'Vertiefte Mathematik'),
(5, '5ème année primaire', '5. Primarschule', '5ª elementare', 8, 9, 'Préparation secondaire', 'Vorbereitung Sekundarstufe'),
(6, '6ème année primaire', '6. Primarschule', '6ª elementare', 9, 10, 'Dernière année primaire', 'Letztes Primarschuljahr'),
(7, '7ème année (1ère CO)', '7. Schuljahr (1. Sek)', '1ª media', 10, 11, 'Début cycle d''orientation', 'Beginn Sekundarstufe I'),
(8, '8ème année (2ème CO)', '8. Schuljahr (2. Sek)', '2ª media', 11, 12, 'Approfondissement matières', 'Vertiefung der Fächer'),
(9, '9ème année (3ème CO)', '9. Schuljahr (3. Sek)', '3ª media', 12, 13, 'Orientation professionnelle', 'Berufliche Orientierung'),
(10, 'Gymnase/CFC 1ère année', 'Gymnasium/Berufslehre 1. Jahr', 'Liceo/Tirocinio 1º anno', 13, 14, 'Formation post-obligatoire', 'Nachobligatorische Ausbildung'),
(11, 'Maturité/CFC final', 'Matura/Lehrabschluss', 'Maturità/Diploma', 17, 19, 'Diplôme final', 'Abschlussdiplom');

-- MATIÈRES AUTHENTIQUES SUISSES
CREATE TABLE swiss_subjects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name_fr VARCHAR(100) NOT NULL,
    name_de VARCHAR(100) NOT NULL,
    name_it VARCHAR(100),
    category VARCHAR(50) NOT NULL,
    harmos_levels INTEGER[] DEFAULT '{}', -- Niveaux HarmoS concernés
    is_mandatory BOOLEAN DEFAULT false,
    canton_specific VARCHAR(2)[], -- Spécifique à certains cantons
    description_fr TEXT,
    description_de TEXT,
    icon VARCHAR(10) DEFAULT '📚',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert matières suisses authentiques
INSERT INTO swiss_subjects (name_fr, name_de, name_it, category, harmos_levels, is_mandatory, description_fr, description_de, icon) VALUES

-- Langues nationales - OBLIGATOIRES
('Français', 'Französisch', 'Francese', 'languages', '{1,2,3,4,5,6,7,8,9,10,11}', true, 'Langue française, littérature, expression écrite et orale', 'Französische Sprache, Literatur, schriftlicher und mündlicher Ausdruck', '🇫🇷'),
('Allemand', 'Deutsch', 'Tedesco', 'languages', '{1,2,3,4,5,6,7,8,9,10,11}', true, 'Langue allemande, littérature, grammaire', 'Deutsche Sprache, Literatur, Grammatik', '🇩🇪'),
('Italien', 'Italienisch', 'Italiano', 'languages', '{7,8,9,10,11}', false, 'Troisième langue nationale', 'Dritte Landessprache', '🇮🇹'),
('Romanche', 'Rätoromanisch', 'Romancio', 'languages', '{1,2,3,4,5,6}', false, 'Langue régionale des Grisons', 'Regionalsprache Graubündens', '🏔️'),

-- Mathématiques et sciences - OBLIGATOIRES
('Mathématiques', 'Mathematik', 'Matematica', 'mathematics', '{1,2,3,4,5,6,7,8,9,10,11}', true, 'Arithmétique, algèbre, géométrie, analyse', 'Arithmetik, Algebra, Geometrie, Analysis', '🔢'),
('Sciences de la nature', 'Naturwissenschaften', 'Scienze naturali', 'sciences', '{3,4,5,6,7,8,9}', true, 'Biologie, chimie, physique intégrées', 'Integrierte Biologie, Chemie, Physik', '🔬'),
('Physique', 'Physik', 'Fisica', 'sciences', '{10,11}', false, 'Mécanique, thermodynamique, électricité', 'Mechanik, Thermodynamik, Elektrizität', '⚛️'),
('Chimie', 'Chemie', 'Chimica', 'sciences', '{10,11}', false, 'Chimie organique et inorganique', 'Organische und anorganische Chemie', '🧪'),
('Biologie', 'Biologie', 'Biologia', 'sciences', '{10,11}', false, 'Sciences du vivant', 'Lebenswissenschaften', '🧬'),

-- Sciences humaines - OBLIGATOIRES  
('Histoire', 'Geschichte', 'Storia', 'humanities', '{5,6,7,8,9,10,11}', true, 'Histoire suisse et mondiale', 'Schweizer und Weltgeschichte', '📜'),
('Géographie', 'Geografie', 'Geografia', 'humanities', '{5,6,7,8,9,10,11}', true, 'Géographie physique et humaine de la Suisse', 'Physische und Humangeografie der Schweiz', '🌍'),
('Éducation civique', 'Staatskunde', 'Educazione civica', 'humanities', '{8,9,10,11}', true, 'Institutions suisses, démocratie', 'Schweizerische Institutionen, Demokratie', '🏛️'),

-- Disciplines artistiques - OBLIGATOIRES
('Arts visuels', 'Bildnerisches Gestalten', 'Arti visive', 'arts', '{1,2,3,4,5,6,7,8,9}', true, 'Dessin, peinture, arts plastiques', 'Zeichnen, Malen, bildende Kunst', '🎨'),
('Musique', 'Musik', 'Musica', 'arts', '{1,2,3,4,5,6,7,8,9}', true, 'Chant, instruments, théorie musicale', 'Gesang, Instrumente, Musiktheorie', '🎵'),

-- Éducation physique - OBLIGATOIRE
('Éducation physique et sportive', 'Sport', 'Educazione fisica', 'sports', '{1,2,3,4,5,6,7,8,9,10,11}', true, 'Sport, mouvement, santé', 'Sport, Bewegung, Gesundheit', '⚽'),

-- Matières gymnasiales spécialisées
('Latin', 'Latein', 'Latino', 'languages', '{10,11}', false, 'Langue et culture latines', 'Lateinische Sprache und Kultur', '🏛️'),
('Grec ancien', 'Altgriechisch', 'Greco antico', 'languages', '{10,11}', false, 'Langue et civilisation grecques', 'Griechische Sprache und Zivilisation', '🏺'),
('Philosophie', 'Philosophie', 'Filosofia', 'humanities', '{10,11}', false, 'Réflexion philosophique', 'Philosophische Reflexion', '💭'),
('Économie et droit', 'Wirtschaft und Recht', 'Economia e diritto', 'economics', '{10,11}', false, 'Économie politique, droit suisse', 'Politische Ökonomie, Schweizer Recht', '⚖️'),

-- Matières techniques et professionnelles
('Informatique', 'Informatik', 'Informatica', 'technology', '{7,8,9,10,11}', false, 'Programmation, bureautique, TIC', 'Programmierung, Bürotechnik, IKT', '💻'),
('Travaux manuels', 'Werken', 'Lavori manuali', 'manual', '{1,2,3,4,5,6,7,8,9}', true, 'Travail du bois, textile, technique', 'Holzarbeit, Textil, Technik', '🔨'),

-- Matières spécifiques formation professionnelle
('Formation commerciale', 'Kaufmännische Ausbildung', 'Formazione commerciale', 'professional', '{10,11}', false, 'Commerce, administration', 'Handel, Verwaltung', '💼'),
('Formation technique', 'Technische Ausbildung', 'Formazione tecnica', 'professional', '{10,11}', false, 'Mécanique, électronique, construction', 'Mechanik, Elektronik, Bau', '⚙️'),
('Formation sanitaire et sociale', 'Gesundheit und Soziales', 'Salute e sociale', 'professional', '{10,11}', false, 'Soins, éducation, travail social', 'Pflege, Bildung, Sozialarbeit', '❤️');

-- Tutor profiles - ADAPTÉ POUR LA SUISSE
CREATE TABLE tutor_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    bio TEXT,
    
    -- LOCALISATION SUISSE
    canton_code VARCHAR(2) REFERENCES swiss_cantons(code),
    city VARCHAR(100),
    region VARCHAR(50), -- Suisse romande, alémanique, Tessin
    
    -- Tarification en CHF
    hourly_rate INTEGER NOT NULL CHECK (hourly_rate >= 15 AND hourly_rate <= 200),
    currency VARCHAR(3) DEFAULT 'CHF',
    
    -- Matières suisses
    subjects UUID[] DEFAULT '{}', -- Référence vers swiss_subjects
    teaching_levels INTEGER[] DEFAULT '{}', -- Niveaux HarmoS
    
    -- Langues parlées (authentique Suisse)
    languages JSONB NOT NULL DEFAULT '["français"]',
    native_language VARCHAR(20) DEFAULT 'français',
    
    -- Formation suisse
    education JSONB DEFAULT '[]', -- Maturité, CFC, Bachelor, Master, etc.
    swiss_qualifications JSONB DEFAULT '[]', -- Diplômes suisses spécifiques
    
    -- Expérience
    experience_years INTEGER DEFAULT 0,
    teaching_experience TEXT,
    professional_experience TEXT,
    
    -- Vérifications suisses
    verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    swiss_resident BOOLEAN DEFAULT true,
    work_permit VARCHAR(20), -- B, C, L, G permits
    
    -- Subscription & Billing
    subscription_tier VARCHAR(20) DEFAULT 'free' CHECK (subscription_tier IN ('free', 'basic', 'pro', 'elite')),
    subscription_expires TIMESTAMPTZ,
    stripe_customer_id VARCHAR(100),
    
    -- Stats
    total_hours_taught INTEGER DEFAULT 0,
    average_rating DECIMAL(2,1) DEFAULT 0.0 CHECK (average_rating >= 0 AND average_rating <= 5),
    review_count INTEGER DEFAULT 0,
    response_time_minutes INTEGER DEFAULT 60,
    
    -- Gamification - Système suisse
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
    swiss_students_helped INTEGER DEFAULT 0, -- Spécifique étudiants suisses
    
    -- Teaching preferences suisses
    teaching_style JSONB DEFAULT '{}',
    harmos_specialization INTEGER[], -- Niveaux HarmoS de spécialisation
    maturite_preparation BOOLEAN DEFAULT false, -- Préparation maturité
    cfc_support BOOLEAN DEFAULT false, -- Support formation professionnelle
    
    -- Disponibilité
    availability_schedule JSONB DEFAULT '{}',
    timezone VARCHAR(50) DEFAULT 'Europe/Zurich',
    
    -- Profile settings
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    profile_image_url TEXT,
    accepts_swiss_students_only BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Student profiles - ADAPTÉ POUR LA SUISSE  
CREATE TABLE student_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    
    -- SYSTÈME SCOLAIRE SUISSE
    harmos_level INTEGER REFERENCES swiss_school_levels(harmos_level),
    school_type VARCHAR(50), -- Gymnase, École de commerce, CFC, etc.
    canton_code VARCHAR(2) REFERENCES swiss_cantons(code),
    city VARCHAR(100),
    
    -- Matières et objectifs suisses
    subjects_learning UUID[] DEFAULT '{}', -- Référence vers swiss_subjects  
    learning_goals TEXT[] DEFAULT '{}',
    school_difficulties TEXT[] DEFAULT '{}',
    target_exams VARCHAR(100)[], -- Maturité, CFC, examens cantonaux
    
    -- Langues parlées
    native_language VARCHAR(20) DEFAULT 'français',
    languages JSONB DEFAULT '["français"]',
    
    -- Gamification étudiante
    level INTEGER DEFAULT 1,
    xp_points INTEGER DEFAULT 0,
    total_xp INTEGER DEFAULT 0,
    badges JSONB DEFAULT '[]',
    achievements JSONB DEFAULT '[]',
    
    -- Learning tracking
    learning_style JSONB DEFAULT '{}',
    preferred_teaching_method VARCHAR(50),
    study_schedule JSONB DEFAULT '{}',
    
    -- Activity tracking
    streak_current INTEGER DEFAULT 0,
    streak_longest INTEGER DEFAULT 0,
    last_activity TIMESTAMPTZ DEFAULT NOW(),
    subjects_mastered INTEGER DEFAULT 0,
    hours_studied INTEGER DEFAULT 0,
    
    -- Objectifs scolaires suisses
    target_grades JSONB DEFAULT '{}', -- Objectifs de notes par matière
    swiss_school_integration BOOLEAN DEFAULT true, -- Intégration système suisse
    needs_harmos_support BOOLEAN DEFAULT false, -- Besoin aide transition HarmoS
    
    -- Profile settings
    profile_image_url TEXT,
    parent_contact JSONB DEFAULT '{}', -- Contact parents si mineur
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings - ADAPTÉ POUR LA SUISSE
CREATE TABLE bookings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
    tutor_id UUID REFERENCES tutor_profiles(id) ON DELETE CASCADE,
    
    -- Matière suisse
    subject_id UUID REFERENCES swiss_subjects(id),
    harmos_level INTEGER,
    
    -- Scheduling suisse (timezone Zurich)
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration INTEGER NOT NULL DEFAULT 60, -- minutes
    timezone VARCHAR(50) DEFAULT 'Europe/Zurich',
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
    
    -- Pricing en CHF
    hourly_rate INTEGER NOT NULL,
    total_amount INTEGER NOT NULL, -- en centimes CHF
    currency VARCHAR(3) DEFAULT 'CHF',
    
    -- Payment suisse
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
    payment_method VARCHAR(50), -- TWINT, Postfinance, carte, etc.
    
    -- Session details
    session_type VARCHAR(20) DEFAULT 'online' CHECK (session_type IN ('online', 'in_person', 'hybrid')),
    meeting_link TEXT,
    location_address TEXT,
    canton_location VARCHAR(2) REFERENCES swiss_cantons(code),
    
    -- Notes et évaluation
    student_notes TEXT,
    tutor_notes TEXT,
    session_summary TEXT,
    homework_assigned TEXT,
    progress_notes TEXT,
    
    -- Gamification de session
    xp_earned_student INTEGER DEFAULT 0,
    xp_earned_tutor INTEGER DEFAULT 0,
    session_rating INTEGER CHECK (session_rating >= 1 AND session_rating <= 5),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews - SYSTÈME SUISSE
CREATE TABLE reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL, -- student ou tutor
    reviewee_id UUID NOT NULL, -- student ou tutor  
    tutor_id UUID REFERENCES tutor_profiles(id),
    
    -- Rating suisse (1-6 comme système scolaire suisse)
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 6),
    rating_system VARCHAR(20) DEFAULT 'swiss' CHECK (rating_system IN ('swiss', 'international')),
    
    -- Aspects détaillés
    teaching_quality INTEGER CHECK (teaching_quality >= 1 AND teaching_quality <= 6),
    communication INTEGER CHECK (communication >= 1 AND communication <= 6),
    punctuality INTEGER CHECK (punctuality >= 1 AND punctuality <= 6),
    subject_expertise INTEGER CHECK (subject_expertise >= 1 AND subject_expertise <= 6),
    swiss_system_knowledge INTEGER CHECK (swiss_system_knowledge >= 1 AND swiss_system_knowledge <= 6),
    
    -- Commentaires
    comment TEXT,
    pros TEXT,
    cons TEXT,
    recommendation TEXT,
    
    -- Vérifications
    is_verified BOOLEAN DEFAULT false,
    is_anonymous BOOLEAN DEFAULT false,
    language VARCHAR(10) DEFAULT 'fr',
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments - SYSTÈME SUISSE CHF
CREATE TABLE payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    tutor_id UUID REFERENCES tutor_profiles(id),
    student_id UUID REFERENCES student_profiles(id),
    
    -- Montants en CHF (centimes)
    amount INTEGER NOT NULL, -- en centimes
    currency VARCHAR(3) DEFAULT 'CHF',
    platform_fee INTEGER DEFAULT 0, -- 15% commission
    tutor_earnings INTEGER NOT NULL,
    
    -- Payment methods suisses
    payment_method VARCHAR(50) NOT NULL, -- twint, postfinance, visa, mastercard
    payment_provider VARCHAR(50) DEFAULT 'stripe',
    
    -- Swiss payment details
    stripe_payment_intent_id VARCHAR(100),
    twint_transaction_id VARCHAR(100),
    postfinance_reference VARCHAR(100),
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'succeeded', 'failed', 'refunded')),
    failure_reason TEXT,
    
    -- Swiss compliance
    vat_rate DECIMAL(4,2) DEFAULT 7.70, -- TVA suisse 7.7%
    vat_amount INTEGER DEFAULT 0,
    
    -- Timestamps
    processed_at TIMESTAMPTZ,
    refunded_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Achievements suisses authentiques
INSERT INTO achievements (name, description, icon, xp_reward, rarity, unlock_condition) VALUES 
-- Achievements tuteur
('🩸 Première Leçon', 'Donnez votre premier cours en Suisse', '🩸', 50, 'common', '{"sessions_taught": 1}'),
('🇨🇭 Expert Suisse', 'Aidez 10 étudiants suisses', '🇨🇭', 200, 'rare', '{"swiss_students_helped": 10}'),
('🏔️ Maître des Alpes', 'Enseignez dans 3 cantons différents', '🏔️', 300, 'epic', '{"cantons_taught": 3}'),
('📚 Polyglotte Helvète', 'Enseignez en français, allemand et italien', '📚', 500, 'legendary', '{"languages_taught": ["fr", "de", "it"]}'),
('⭐ 5 Étoiles Suisse', 'Obtenez 20 avis 6/6', '⭐', 400, 'epic', '{"rating_6_count": 20}'),
('🎓 Maturité Master', 'Préparez 5 étudiants à la maturité', '🎓', 300, 'rare', '{"maturite_students": 5}'),

-- Achievements étudiant  
('📖 Premier Cours', 'Suivez votre première leçon', '📖', 25, 'common', '{"sessions_attended": 1}'),
('🧠 Cerveau Suisse', 'Maîtrisez 3 matières du programme HarmoS', '🧠', 150, 'rare', '{"harmos_subjects_mastered": 3}'),
('🇫🇷 Romand Accompli', 'Excellez en français', '🇫🇷', 100, 'common', '{"french_excellence": true}'),
('🇩🇪 Alémanique Maître', 'Excellez en allemand', '🇩🇪', 100, 'common', '{"german_excellence": true}'),
('📐 Génie des Maths', 'Résolvez 100 problèmes mathématiques', '📐', 200, 'rare', '{"math_problems_solved": 100}'),
('🎯 Maturité en Vue', 'Préparez-vous à la maturité', '🎯', 500, 'legendary', '{"maturite_preparation": true}');

-- Index pour performance
CREATE INDEX idx_tutor_profiles_canton ON tutor_profiles(canton_code);
CREATE INDEX idx_student_profiles_canton ON student_profiles(canton_code);
CREATE INDEX idx_tutor_profiles_subjects ON tutor_profiles USING GIN(subjects);
CREATE INDEX idx_tutor_profiles_harmos ON tutor_profiles USING GIN(teaching_levels);
CREATE INDEX idx_swiss_subjects_levels ON swiss_subjects USING GIN(harmos_levels);
CREATE INDEX idx_bookings_canton ON bookings(canton_location);
CREATE INDEX idx_bookings_harmos ON bookings(harmos_level);

-- Triggers pour mise à jour automatique
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tutor_profiles_updated_at BEFORE UPDATE ON tutor_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_student_profiles_updated_at BEFORE UPDATE ON student_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();