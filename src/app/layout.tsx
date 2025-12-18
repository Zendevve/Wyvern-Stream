import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Wyvern Stream",
    template: "%s | Wyvern Stream",
  },
  description: "A premium streaming experience with movies and TV shows.",
  keywords: ["streaming", "movies", "tv shows", "watch online"],
  openGraph: {
    title: "Wyvern Stream",
    description: "A premium streaming experience with movies and TV shows.",
    type: "website",
    locale: "en_US",
    siteName: "Wyvern Stream",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wyvern Stream",
    description: "A premium streaming experience with movies and TV shows.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} data-scroll-behavior="smooth">
      <body className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] antialiased">
        <Sidebar />
        <main className="md:pl-20 pb-20 md:pb-0 transition-all duration-300">
          {children}
        </main>
      </body>
    </html>
  );
}
