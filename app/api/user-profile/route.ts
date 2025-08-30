// app/api/user-profile/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
// MODIFIÉ: Nouveau chemin d'importation pour Prisma via l'alias
import prisma from '@/app/lib/prisma'; 

enum Role {
  STUDENT = 'student',
  TUTOR = 'tutor',
}

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user || !user.id) {
      return NextResponse.json({ error: 'Utilisateur non authentifié ou ID Clerk manquant.' }, { status: 401 });
    }
    const clerkId = user.id;
    const existingProfile = await prisma.userProfile.findUnique({
      where: { clerkId: clerkId },
    });
    if (existingProfile) {
      return NextResponse.json({
        message: 'Le profil utilisateur existe déjà.',
        userProfile: existingProfile,
      }, { status: 200 });
    }
    const newUserProfile = await prisma.userProfile.create({
      data: {
        clerkId: clerkId,
        role: Role.STUDENT,
      },
    });
    return NextResponse.json({
      message: 'Profil utilisateur créé avec succès.',
      userProfile: newUserProfile,
    }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création/vérification du profil utilisateur:', error);
    if (error instanceof Error) {
        return NextResponse.json({ error: `Erreur serveur: ${error.message}` }, { status: 500 });
    }
    return NextResponse.json({ error: 'Une erreur interne est survenue.' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user || !user.id) {
      return NextResponse.json({ error: 'Utilisateur non authentifié.' }, { status: 401 });
    }
    const clerkId = user.id;
    const userProfile = await prisma.userProfile.findUnique({
      where: { clerkId },
    });
    if (!userProfile) {
      return NextResponse.json({ error: 'Profil utilisateur non trouvé.' }, { status: 404 });
    }
    return NextResponse.json(userProfile, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération du profil utilisateur:', error);
    return NextResponse.json({ error: 'Une erreur interne est survenue lors de la récupération du profil.' }, { status: 500 });
  }
}
