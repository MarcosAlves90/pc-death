import { ListItem as ListItemType, ItemStatus, Priority } from "@/types";
import { ListItem } from "./ListItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";

interface ItemListProps {
  title: string;
  items: ListItemType[];
  statuses: ItemStatus[];
  isEditMode: boolean;
  onAddItem: (item: Omit<ListItemType, "id">) => void;
  onDeleteItem: (id: string) => void;
  onStatusChange: (id: string, status: "none" | "done" | "skip") => void;
  icon: React.ReactNode;
}

export const ItemList = ({
  title,
  items,
  statuses,
  isEditMode,
  onAddItem,
  onDeleteItem,
  onStatusChange,
  icon,
}: ItemListProps) => {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [priority, setPriority] = useState<Priority>("MEDIUM");

  const handleAdd = () => {
    if (!name.trim() || !link.trim()) return;
    
    onAddItem({ name: name.trim(), link: link.trim(), priority });
    setName("");
    setLink("");
    setPriority("MEDIUM");
  };

  return (
    <Card className="p-6 bg-card border-border cyber-border">
      <div className="flex items-center gap-3 mb-6">
        {icon}
        <h3 className="text-xl font-bold text-primary uppercase tracking-wider">{title}</h3>
      </div>

      {isEditMode && (
        <div className="mb-6 space-y-3 p-4 bg-muted/20 rounded border border-muted">
          <Input
            placeholder="Nome do item"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-input border-border"
          />
          <Input
            placeholder="Link para download"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="bg-input border-border"
          />
          <div className="flex gap-2">
            <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
              <SelectTrigger className="bg-input border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border z-50">
                <SelectItem value="HIGH">ALTO</SelectItem>
                <SelectItem value="MEDIUM">MÉDIO</SelectItem>
                <SelectItem value="LOW">BAIXO</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleAdd} className="bg-primary hover:bg-primary/80 glow-red">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {items.length === 0 ? (
          <p className="text-muted-foreground text-center py-8 italic">
            Nenhum item adicionado
          </p>
        ) : (
          items.map((item) => (
            <ListItem
              key={item.id}
              item={item}
              status={statuses.find((s) => s.id === item.id)}
              isEditMode={isEditMode}
              onStatusChange={onStatusChange}
              onDelete={onDeleteItem}
            />
          ))
        )}
      </div>
    </Card>
  );
};
