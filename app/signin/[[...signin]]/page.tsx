// app/signin/[[...signin]]/page.tsx
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return <SignIn path="/signin" />;
  // Ou, si vous préférez que Clerk gère le routing en se basant sur le chemin du fichier:
  // return <SignIn />;
  // L'option avec `path` est souvent plus explicite.
}