import { ListItem as ListItemType, ItemStatus } from "@/types";
import { Check, X, ExternalLink, Trash2 } from "lucide-react";
import { PriorityBadge } from "./PriorityBadge";
import { Button } from "@/components/ui/button";

interface ListItemProps {
  item: ListItemType;
  status: ItemStatus | undefined;
  isEditMode: boolean;
  onStatusChange: (id: string, status: "none" | "done" | "skip") => void;
  onDelete: (id: string) => void;
}

export const ListItem = ({ item, status, isEditMode, onStatusChange, onDelete }: ListItemProps) => {
  const currentStatus = status?.status || "none";

  const getStatusColor = () => {
    switch (currentStatus) {
      case "done":
        return "border-status-done bg-status-done/10";
      case "skip":
        return "border-status-skip bg-status-skip/10";
      default:
        return "border-border bg-card/50";
    }
  };

  const handleStatusClick = () => {
    if (isEditMode) return;
    
    const nextStatus = {
      none: "done",
      done: "skip",
      skip: "none",
    }[currentStatus] as "none" | "done" | "skip";

    onStatusChange(item.id, nextStatus);
  };

  return (
    <div className={`p-5 rounded-lg border-2 ${getStatusColor()} transition-all duration-300 cyber-border group hover:shadow-lg hover:-translate-y-0.5`}>
      <div className="flex items-start gap-4">
        {!isEditMode && (
          <button
            onClick={handleStatusClick}
            className="mt-0.5 flex-shrink-0 w-7 h-7 border-2 rounded-md flex items-center justify-center transition-all hover:scale-110 hover:shadow-md bg-background/50"
          >
            {currentStatus === "done" && <Check className="h-4 w-4 text-status-done" />}
            {currentStatus === "skip" && <X className="h-4 w-4 text-status-skip" />}
          </button>
        )}
        
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold text-foreground text-base">{item.name}</h4>
            <PriorityBadge priority={item.priority} />
          </div>
          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-secondary hover:text-primary flex items-center gap-1.5 w-fit transition-all hover:underline"
            >
              <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate">{item.link}</span>
            </a>
          )}
        </div>

        {isEditMode && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(item.id)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0 transition-all"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
