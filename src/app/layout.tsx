import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "foundrr | Your website. Written and coded. Instantly.",
  description: "Generate a complete, professional website in seconds. Preview it. Unlock it when you're ready.",
  icons: {
    icon: "/vercel.svg",
  },
};

import { LanguageProvider } from "@/contexts/LanguageContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <body className={cn("min-h-screen bg-background font-sans text-foreground", inter.className)}>
        <LanguageProvider>
          <div className="relative flex min-h-screen flex-col">
            <main className="flex-1">{children}</main>
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
