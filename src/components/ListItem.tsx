import { ListItem as ListItemType, ItemStatus, Priority } from "@/types";
import { Check, X, ExternalLink, Trash2, Edit, Save, GripVertical } from "lucide-react";
import { PriorityBadge } from "./PriorityBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

interface ListItemProps {
  item: ListItemType;
  status: ItemStatus | undefined;
  isEditMode: boolean;
  onStatusChange: (id: string, status: "none" | "done" | "skip") => void;
  onDelete: (id: string) => void;
  onEdit?: (id: string, updates: { name: string; link: string; priority: Priority }) => void;
}

export const ListItem = ({ item, status, isEditMode, onStatusChange, onDelete, onEdit }: ListItemProps) => {
  const currentStatus = status?.status || "none";
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(item.name);
  const [editLink, setEditLink] = useState(item.link);
  const [editPriority, setEditPriority] = useState<Priority>(item.priority);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
    disabled: !isEditMode || isEditing,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSaveEdit = () => {
    if (onEdit && editName.trim()) {
      onEdit(item.id, { 
        name: editName.trim(), 
        link: editLink.trim(), 
        priority: editPriority 
      });
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditName(item.name);
    setEditLink(item.link);
    setEditPriority(item.priority);
    setIsEditing(false);
  };

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

  if (isEditing && isEditMode) {
    return (
      <div className={`p-5 rounded-lg border-2 ${getStatusColor()} transition-all duration-300 cyber-border bg-muted/10`}>
        <div className="space-y-3">
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Nome do item"
            className="bg-input border-border"
          />
          <Input
            value={editLink}
            onChange={(e) => setEditLink(e.target.value)}
            placeholder="Link (opcional)"
            className="bg-input border-border"
          />
          <Select value={editPriority} onValueChange={(v) => setEditPriority(v as Priority)}>
            <SelectTrigger className="bg-input border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border z-50">
              <SelectItem value="HIGH">ALTO</SelectItem>
              <SelectItem value="MEDIUM">MÉDIO</SelectItem>
              <SelectItem value="LOW">BAIXO</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button onClick={handleSaveEdit} className="bg-primary hover:bg-primary/80 flex-1">
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
            <Button onClick={handleCancelEdit} variant="outline" className="flex-1">
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={`p-5 rounded-lg border-2 ${getStatusColor()} transition-all duration-300 cyber-border group hover:shadow-lg hover:-translate-y-0.5 ${
        isDragging ? "cursor-grabbing" : ""
      }`}
    >
      <div className="flex items-start gap-4">
        {isEditMode && !isEditing && (
          <button
            {...listeners}
            {...attributes}
            className="mt-0.5 flex-shrink-0 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing transition-colors"
          >
            <GripVertical className="h-5 w-5" />
          </button>
        )}

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
            <h4 className="font-semibold text-foreground text-base break-words">{item.name}</h4>
            <PriorityBadge priority={item.priority} />
          </div>
          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-secondary hover:text-primary flex items-center gap-1.5 transition-all hover:underline max-w-full"
            >
              <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate block">{item.link}</span>
            </a>
          )}
        </div>

        {isEditMode && (
          <div className="flex gap-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(true)}
              className="text-primary hover:text-primary hover:bg-primary/10 transition-all"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(item.id)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-all"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
