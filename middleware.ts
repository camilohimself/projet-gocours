// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Définissez les routes qui doivent être protégées.
// Toutes les autres routes seront publiques par défaut.
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)', // Protège toutes les sous-routes de /dashboard
  // Ajoutez ici d'autres routes que vous souhaitez protéger, par exemple :
  // '/settings(.*)',
  // '/profile(.*)',
]);

export default clerkMiddleware((auth, req) => {
  // Si la route est une route protégée, appliquez la protection.
  if (isProtectedRoute(req)) {
    auth().protect(); // Si l'utilisateur n'est pas authentifié, il sera redirigé vers la page de connexion.
  }

  // Vous pouvez ajouter d'autres logiques ici si nécessaire pour des routes spécifiques.
  // Par exemple, si vous aviez une route API que vous ne voulez pas passer par la protection standard :
  // if (req.url.includes('/api/unprotected-route')) {
  //   return NextResponse.next();
  // }
});

export const config = {
  matcher: [
    // Exclut les fichiers statiques et les chemins spéciaux de _next
    '/((?!.*\\..*|_next).*)',
    // Inclut la racine
    '/',
    // Inclut les chemins API et TRPC
    '/(api|trpc)(.*)',
  ],
};