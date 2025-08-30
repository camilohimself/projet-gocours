import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { clerkId } = await req.json();

  // Vérifier si le profil existe déjà
  const existing = await prisma.userProfile.findUnique({ where: { clerkId } });

  if (existing) {
    return Response.json({ message: 'Profil déjà existant' });
  }

  // Créer un nouveau profil avec rôle par défaut 'student'
  const profile = await prisma.userProfile.create({
    data: {
      clerkId,
      role: 'student',
    },
  });

  return Response.json(profile);
}
