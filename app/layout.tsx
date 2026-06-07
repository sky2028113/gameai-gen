import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GameAI Generator - AI Game Assets in Seconds",
  description: "Generate game icons, characters, scenes, and items with AI. No sign-up required.",
  manifest: "/manifest.json",
  themeColor: "#0071e3",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "GameAI Generator",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#f5f5f7] text-[#1d1d1f] font-sans min-h-screen">
        {children}
      </body>
    </html>
  );
}
