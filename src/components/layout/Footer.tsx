'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export function Footer() {
  const { t } = useLanguage()
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row max-w-screen-xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col items-center">
          <p className="text-center text-sm leading-loose text-muted-foreground">
            &copy; {new Date().getFullYear()} foundrr. {t.footer.copyright}
          </p>
      {/* GULUZADA Studio Signature */}
      <div 
        className="guluzada-credit" 
        style={{
          textAlign: "center",
          padding: "2rem 0",
          fontSize: "14px",
          fontFamily: "'Space Grotesk', sans-serif",
          color: "currentColor",
          opacity: 0.8,
        }}
      >
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;700&display=swap" rel="stylesheet" />
        
        <span style={{ fontWeight: 400, opacity: 0.7 }}>by </span> 
        <a 
          href="https://guluzada.dev" 
          target="_blank" 
          rel="noreferrer"
          style={{
            textDecoration: "none",
            color: "inherit",
            display: "inline-block",
            transition: "opacity 0.3s ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.opacity = "0.6")}
          onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
        >
          <span style={{ fontWeight: 700, letterSpacing: "-0.02em" }}>GULUZADA</span> <span style={{ fontWeight: 300 }}>Studio</span>
        </a>
      </div>
        </div>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <a href="/terms" className="hover:text-foreground transition-colors">Terms</a>
          <a href="/privacy" className="hover:text-foreground transition-colors">Privacy</a>
        </div>
      </div>
    </footer>
  );
}
