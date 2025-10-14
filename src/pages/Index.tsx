import { useState } from "react";
import { Header } from "@/components/Header";
import { DeathSelector } from "@/components/DeathSelector";
import { RedDeath } from "@/components/RedDeath";

const Index = () => {
  const [selectedDeath, setSelectedDeath] = useState<string | null>(null);

  const handleBack = () => {
    setSelectedDeath(null);
  };

  return (
    <div className="min-h-screen">
      <Header onBack={handleBack} showBack={!!selectedDeath} />
      
      {!selectedDeath ? (
        <DeathSelector onSelectDeath={setSelectedDeath} />
      ) : selectedDeath === "red" ? (
        <RedDeath />
      ) : null}
    </div>
  );
};

export default Index;
