import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });

const SITE_TITLE = "Mustafa Bobaki — AI Command Center";
const SITE_DESCRIPTION =
  "6 AI agents for content creators. Generate voiceovers, scripts, carousels, hashtags, email sequences, and thumbnail concepts. Try free.";
const SITE_URL = "https://ai-voice-app-eta.vercel.app";

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  keywords: [
    "AI voiceover",
    "AI script generator",
    "carousel generator",
    "hashtag generator",
    "email sequence AI",
    "thumbnail concepts",
    "content creator tools",
    "AI agents",
  ],
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: "website",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} antialiased`}>
      <head>
        <script src="https://gumroad.com/js/gumroad.js" defer />
      </head>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
