-- 🔥 RESET COMPLET + SCHEMA SUISSE AUTHENTIQUE
-- Script pour reset et recréer avec structure 100% suisse

-- 1. DROP toutes les tables existantes (ordre important pour les foreign keys)
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS quests CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS student_profiles CASCADE;
DROP TABLE IF EXISTS tutor_profiles CASCADE;

-- 2. Drop les nouvelles tables si elles existent
DROP TABLE IF EXISTS swiss_cantons CASCADE;
DROP TABLE IF EXISTS swiss_school_levels CASCADE;
DROP TABLE IF EXISTS swiss_subjects CASCADE;

-- 3. CRÉATION COMPLÈTE SCHEMA SUISSE AUTHENTIQUE

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
('Anglais', 'Englisch', 'Inglese', 'languages', '{5,6,7,8,9,10,11}', true, 'Première langue étrangère', 'Erste Fremdsprache', '🇺🇸'),

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

-- Matières gymnasiales spécialisées
('Latin', 'Latein', 'Latino', 'languages', '{10,11}', false, 'Langue et culture latines', 'Lateinische Sprache und Kultur', '🏛️'),
('Économie et droit', 'Wirtschaft und Recht', 'Economia e diritto', 'economics', '{10,11}', false, 'Économie politique, droit suisse', 'Politische Ökonomie, Schweizer Recht', '⚖️'),

-- Matières techniques
('Informatique', 'Informatik', 'Informatica', 'technology', '{7,8,9,10,11}', false, 'Programmation, bureautique, TIC', 'Programmierung, Bürotechnik, IKT', '💻');

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
    
    -- Expérience
    experience_years INTEGER DEFAULT 0,
    
    -- Vérifications suisses
    verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    
    -- Subscription & Billing
    subscription_tier VARCHAR(20) DEFAULT 'free' CHECK (subscription_tier IN ('free', 'basic', 'pro', 'elite')),
    
    -- Stats
    total_hours_taught INTEGER DEFAULT 0,
    average_rating DECIMAL(2,1) DEFAULT 0.0 CHECK (average_rating >= 0 AND average_rating <= 6),
    review_count INTEGER DEFAULT 0,
    
    -- Gamification
    level INTEGER DEFAULT 1 CHECK (level >= 1 AND level <= 8),
    xp_points INTEGER DEFAULT 0,
    total_xp INTEGER DEFAULT 0,
    badges JSONB DEFAULT '[]',
    achievements JSONB DEFAULT '[]',
    
    -- Profile settings
    is_active BOOLEAN DEFAULT true,
    profile_image_url TEXT,
    
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
    harmos_level INTEGER,
    school_type VARCHAR(50), -- Gymnase, École de commerce, CFC, etc.
    canton_code VARCHAR(2) REFERENCES swiss_cantons(code),
    city VARCHAR(100),
    
    -- Matières et objectifs suisses
    subjects_learning UUID[] DEFAULT '{}', -- Référence vers swiss_subjects  
    learning_goals TEXT[] DEFAULT '{}',
    
    -- Langues parlées
    native_language VARCHAR(20) DEFAULT 'français',
    languages JSONB DEFAULT '["français"]',
    
    -- Gamification étudiante
    level INTEGER DEFAULT 1,
    xp_points INTEGER DEFAULT 0,
    total_xp INTEGER DEFAULT 0,
    badges JSONB DEFAULT '[]',
    achievements JSONB DEFAULT '[]',
    
    -- Profile settings
    profile_image_url TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX idx_tutor_profiles_canton ON tutor_profiles(canton_code);
CREATE INDEX idx_student_profiles_canton ON student_profiles(canton_code);
CREATE INDEX idx_tutor_profiles_subjects ON tutor_profiles USING GIN(subjects);
CREATE INDEX idx_swiss_subjects_levels ON swiss_subjects USING GIN(harmos_levels);