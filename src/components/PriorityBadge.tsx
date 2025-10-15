import { Priority } from "@/types";
import { Badge } from "@/components/ui/badge";

interface PriorityBadgeProps {
  priority: Priority;
}

export const PriorityBadge = ({ priority }: PriorityBadgeProps) => {
  const getStyles = () => {
    switch (priority) {
      case "HIGH":
        return "bg-priority-high/20 text-priority-high border-priority-high/50 font-bold";
      case "MEDIUM":
        return "bg-priority-medium/20 text-priority-medium border-priority-medium/50 font-semibold";
      case "LOW":
        return "bg-priority-low/20 text-priority-low border-priority-low/50";
    }
  };

  return (
    <Badge variant="outline" className={`${getStyles()} text-xs`}>
      {priority}
    </Badge>
  );
};
