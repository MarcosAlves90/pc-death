import { Skull } from "lucide-react";

export const Header = () => {
  return (
    <header className="border-b border-primary/30 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-3">
          <Skull className="h-10 w-10 text-primary animate-pulse" />
          <div>
            <h1 className="text-3xl font-bold text-primary text-glow">
              PC DEATH
            </h1>
            <p className="text-xs text-muted-foreground tracking-widest">
              SYSTEM RESURRECTION PROTOCOL
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
