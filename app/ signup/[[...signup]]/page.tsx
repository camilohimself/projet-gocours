// app/signup/page.tsx  (NOUVEAU fichier simplifié)
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return <SignUp />; 
  // Pas besoin de la prop "path" ici car la structure est directe.
}