import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TheGoCours - L'IA au Service de l'Apprentissage",
  description: "Plateforme révolutionnaire de tutorat où l'intelligence artificielle amplifie la transmission de connaissance entre tuteurs experts et élèves motivés.",
  keywords: "tutorat, IA, apprentissage, éducation, Suisse, tuteur, cours particuliers, intelligence artificielle",
  authors: [{ name: "OSOM Agency" }],
  creator: "OSOM Agency",
  openGraph: {
    title: "TheGoCours - Révolutionnez votre Apprentissage",
    description: "L'IA au service de la transmission humaine de connaissance",
    type: "website",
    locale: "fr_CH",
    url: "https://thegocours.ch",
    siteName: "TheGoCours",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
