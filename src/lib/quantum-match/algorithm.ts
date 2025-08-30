import { TutorProfile, StudentProfile, AIMatchScore, Subject } from '@/types';
import { knowledgeEngine } from '@/lib/ai/knowledge-transmission';

/**
 * Quantum Matching Algorithm
 * Utilise des principes d'IA avancés pour créer des matches parfaits
 */
export class QuantumMatchingAlgorithm {
  private weights = {
    styleCompatibility: 0.25,
    subjectExpertise: 0.20,
    availabilityMatch: 0.15,
    priceMatch: 0.10,
    personalityFit: 0.20,
    predictedSuccess: 0.10,
  };

  /**
   * Calcule le score de match entre un tuteur et un élève
   */
  async calculateMatchScore(
    tutor: TutorProfile,
    student: StudentProfile,
    requestedSubject: Subject
  ): Promise<AIMatchScore> {
    // Calcul des différentes dimensions
    const styleCompatibility = await this.calculateStyleCompatibility(tutor, student);
    const subjectExpertise = this.calculateSubjectExpertise(tutor, requestedSubject);
    const availabilityMatch = this.calculateAvailabilityMatch(tutor, student);
    const priceMatch = this.calculatePriceMatch(tutor, student);
    const personalityFit = await this.calculatePersonalityFit(tutor, student);
    const predictedSuccess = await this.calculatePredictedSuccess(tutor, student, requestedSubject);

    // Calcul du score global pondéré
    const overall = Math.round(
      styleCompatibility * this.weights.styleCompatibility +
      subjectExpertise * this.weights.subjectExpertise +
      availabilityMatch * this.weights.availabilityMatch +
      priceMatch * this.weights.priceMatch +
      personalityFit * this.weights.personalityFit +
      predictedSuccess * this.weights.predictedSuccess
    );

    const reasoning = this.generateReasoning({
      styleCompatibility,
      subjectExpertise,
      availabilityMatch,
      priceMatch,
      personalityFit,
      predictedSuccess,
    });

    return {
      overall,
      styleCompatibility,
      subjectExpertise,
      availabilityMatch,
      priceMatch,
      personalityFit,
      predictedSuccess,
      reasoning,
    };
  }

  /**
   * Trouve les meilleurs tuteurs pour un élève
   */
  async findBestMatches(
    student: StudentProfile,
    tutors: TutorProfile[],
    subject: Subject,
    topN: number = 5
  ): Promise<Array<{ tutor: TutorProfile; score: AIMatchScore }>> {
    const matches = await Promise.all(
      tutors.map(async (tutor) => ({
        tutor,
        score: await this.calculateMatchScore(tutor, student, subject),
      }))
    );

    // Tri par score décroissant
    matches.sort((a, b) => b.score.overall - a.score.overall);

    // Retourner les top N matches
    return matches.slice(0, topN);
  }

  /**
   * Calcule la compatibilité des styles d'apprentissage
   */
  private async calculateStyleCompatibility(
    tutor: TutorProfile,
    student: StudentProfile
  ): Promise<number> {
    if (!tutor.teachingStyle || !student.learningStyle) {
      return 50; // Score neutre si pas d'info
    }

    // Utilise l'engine d'IA pour une analyse approfondie
    const compatibility = await knowledgeEngine.analyzeCognitiveCompatibility(
      tutor.teachingStyle,
      student.learningStyle
    );

    return compatibility;
  }

  /**
   * Calcule l'expertise du tuteur dans le sujet
   */
  private calculateSubjectExpertise(
    tutor: TutorProfile,
    subject: Subject
  ): number {
    const hasSubject = tutor.subjects.some(s => s.id === subject.id);
    if (!hasSubject) return 0;

    // Facteurs d'expertise
    let score = 60; // Score de base si le tuteur enseigne le sujet

    // Bonus pour l'expérience
    score += Math.min(tutor.experience * 5, 20);

    // Bonus pour la note
    if (tutor.rating >= 4.5) score += 15;
    else if (tutor.rating >= 4.0) score += 10;
    else if (tutor.rating >= 3.5) score += 5;

    // Bonus pour le statut vérifié
    if (tutor.verificationStatus === 'verified') score += 5;

    return Math.min(score, 100);
  }

  /**
   * Calcule la compatibilité des disponibilités
   */
  private calculateAvailabilityMatch(
    tutor: TutorProfile,
    student: StudentProfile
  ): number {
    // Simplified pour le MVP - à améliorer avec les vraies disponibilités
    if (!tutor.availability || tutor.availability.length === 0) return 25;
    
    // Plus le tuteur a de créneaux, mieux c'est
    const availabilityScore = Math.min(tutor.availability.length * 10, 100);
    
    return availabilityScore;
  }

  /**
   * Calcule la correspondance de prix
   */
  private calculatePriceMatch(
    tutor: TutorProfile,
    student: StudentProfile
  ): number {
    // Pour le MVP, on suppose que tous les prix conviennent
    // À améliorer avec le budget réel de l'étudiant
    const averageRate = 80; // CHF/heure moyenne en Suisse
    const difference = Math.abs(tutor.hourlyRate - averageRate);
    
    if (difference <= 10) return 100;
    if (difference <= 20) return 80;
    if (difference <= 30) return 60;
    if (difference <= 40) return 40;
    return 20;
  }

  /**
   * Calcule la compatibilité de personnalité (basée sur l'IA)
   */
  private async calculatePersonalityFit(
    tutor: TutorProfile,
    student: StudentProfile
  ): Promise<number> {
    // Analyse basée sur les profils et préférences
    let score = 70; // Score de base

    // Ajustements basés sur les styles
    if (tutor.teachingStyle?.pace === 'adaptive') {
      score += 15; // Bonus pour adaptabilité
    }

    if (student.learningStyle?.interaction === 'high' && 
        tutor.teachingStyle?.structure === 'flexible') {
      score += 10;
    }

    // Compatibilité linguistique
    const commonLanguages = tutor.languages?.filter(tl => 
      student.preferredSubjects?.some(ps => ps.name.includes(tl.name))
    );
    
    if (commonLanguages && commonLanguages.length > 0) {
      score += 5;
    }

    return Math.min(score, 100);
  }

  /**
   * Prédit le succès de l'apprentissage
   */
  private async calculatePredictedSuccess(
    tutor: TutorProfile,
    student: StudentProfile,
    subject: Subject
  ): Promise<number> {
    // Facteurs de succès
    let successScore = 50; // Base

    // Expertise du tuteur
    if (tutor.experience > 3) successScore += 15;
    if (tutor.rating > 4.5) successScore += 15;
    
    // Motivation de l'élève (basée sur les objectifs)
    if (student.learningGoals && student.learningGoals.length > 0) {
      successScore += 10;
    }

    // Correspondance niveau/sujet
    const subjectMatch = student.preferredSubjects?.some(s => s.id === subject.id);
    if (subjectMatch) successScore += 10;

    return Math.min(successScore, 100);
  }

  /**
   * Génère des explications pour le score
   */
  private generateReasoning(scores: Record<string, number>): string[] {
    const reasoning: string[] = [];

    if (scores.styleCompatibility >= 80) {
      reasoning.push("Excellente compatibilité des styles d'apprentissage et d'enseignement");
    } else if (scores.styleCompatibility >= 60) {
      reasoning.push("Bonne compatibilité des approches pédagogiques");
    }

    if (scores.subjectExpertise >= 80) {
      reasoning.push("Expertise confirmée dans la matière demandée");
    }

    if (scores.availabilityMatch >= 70) {
      reasoning.push("Disponibilités très flexibles et compatibles");
    }

    if (scores.personalityFit >= 75) {
      reasoning.push("Profils de personnalité complémentaires");
    }

    if (scores.predictedSuccess >= 70) {
      reasoning.push("Forte probabilité de succès dans l'apprentissage");
    }

    if (scores.priceMatch >= 80) {
      reasoning.push("Tarif parfaitement adapté au budget");
    }

    // Ajouter des points d'amélioration si nécessaire
    if (scores.overall < 60) {
      reasoning.push("Match possible mais d'autres options pourraient mieux convenir");
    }

    return reasoning;
  }

  /**
   * Optimise les matches pour un groupe d'élèves (pour les classes)
   */
  async optimizeGroupMatching(
    students: StudentProfile[],
    tutors: TutorProfile[],
    subject: Subject
  ): Promise<Map<string, string>> {
    const matching = new Map<string, string>();
    const assignedTutors = new Set<string>();

    // Algorithme glouton optimisé
    for (const student of students) {
      const availableTutors = tutors.filter(t => !assignedTutors.has(t.id));
      
      if (availableTutors.length === 0) break;

      const matches = await this.findBestMatches(student, availableTutors, subject, 1);
      
      if (matches.length > 0) {
        const bestMatch = matches[0];
        matching.set(student.id, bestMatch.tutor.id);
        assignedTutors.add(bestMatch.tutor.id);
      }
    }

    return matching;
  }
}

export const quantumMatcher = new QuantumMatchingAlgorithm();