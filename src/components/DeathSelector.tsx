import { HardDrive } from "lucide-react";
import { Card } from "@/components/ui/card";

interface DeathSelectorProps {
  onSelectDeath: (death: string) => void;
}

export const DeathSelector = ({ onSelectDeath }: DeathSelectorProps) => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-center mb-8 text-foreground">
        SELECT DEATH PROTOCOL
      </h2>
      
      <div className="max-w-md mx-auto">
        <Card 
          className="p-6 bg-card hover:bg-card/80 border-primary/50 cyber-border cursor-pointer transition-all hover:glow-red group"
          onClick={() => onSelectDeath("red")}
        >
          <div className="flex items-center gap-4">
            <HardDrive className="h-12 w-12 text-primary group-hover:animate-pulse" />
            <div>
              <h3 className="text-xl font-bold text-primary">RED DEATH</h3>
              <p className="text-sm text-muted-foreground">Format & Reinstall Protocol</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
