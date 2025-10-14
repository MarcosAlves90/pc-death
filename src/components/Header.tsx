import { Skull, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "./LanguageSelector";
import { useLanguage } from "@/hooks/useLanguage";
import { translations } from "@/lib/translations";

interface HeaderProps {
  onBack?: () => void;
  showBack?: boolean;
}

export const Header = ({ onBack, showBack }: HeaderProps) => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <header className="border-b border-primary/30 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skull className="h-10 w-10 text-primary animate-pulse" />
            <div>
              <h1 className="text-3xl font-bold text-primary text-glow">
                {t.header.title}
              </h1>
              <p className="text-xs text-muted-foreground tracking-widest">
                {t.header.subtitle}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <LanguageSelector />
            
            {showBack && onBack && (
              <Button
                variant="outline"
                onClick={onBack}
                className="border-secondary text-secondary hover:bg-secondary/10 glow-cyan"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t.header.back}
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
