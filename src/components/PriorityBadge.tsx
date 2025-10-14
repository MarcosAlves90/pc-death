import { Priority } from "@/types";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";
import { translations } from "@/lib/translations";

interface PriorityBadgeProps {
  priority: Priority;
}

export const PriorityBadge = ({ priority }: PriorityBadgeProps) => {
  const { language } = useLanguage();
  const t = translations[language];

  const getVariant = () => {
    switch (priority) {
      case "HIGH":
        return "default";
      case "MEDIUM":
        return "secondary";
      case "LOW":
        return "outline";
    }
  };

  const getColor = () => {
    switch (priority) {
      case "HIGH":
        return "text-priority-high border-priority-high";
      case "MEDIUM":
        return "text-priority-medium border-priority-medium";
      case "LOW":
        return "text-priority-low border-priority-low";
    }
  };

  return (
    <Badge variant={getVariant()} className={`${getColor()} text-xs font-bold`}>
      {t.redDeath.priorities[priority]}
    </Badge>
  );
};
