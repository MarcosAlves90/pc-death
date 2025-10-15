import { ListItem as ListItemType, ItemStatus, Priority } from "@/types";
import { ListItem } from "./ListItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useDroppable } from "@dnd-kit/core";

interface ItemListProps {
  id: string;
  title: string;
  items: ListItemType[];
  statuses: ItemStatus[];
  isEditMode: boolean;
  onAddItem: (item: Omit<ListItemType, "id">) => void;
  onDeleteItem: (id: string) => void;
  onEditItem?: (id: string, updates: { name: string; link: string; priority: Priority }) => void;
  onStatusChange: (id: string, status: "none" | "done" | "skip") => void;
  icon: React.ReactNode;
}

export const ItemList = ({
  id,
  title,
  items,
  statuses,
  isEditMode,
  onAddItem,
  onDeleteItem,
  onEditItem,
  onStatusChange,
  icon,
}: ItemListProps) => {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [priority, setPriority] = useState<Priority>("MEDIUM");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState<Priority | "ALL">("ALL");

  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  const handleAdd = () => {
    if (!name.trim()) return;
    
    onAddItem({ name: name.trim(), link: link.trim() || "", priority });
    setName("");
    setLink("");
    setPriority("MEDIUM");
  };

  const filteredItems = items
    .filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority = filterPriority === "ALL" || item.priority === filterPriority;
      return matchesSearch && matchesPriority;
    })
    .sort((a, b) => {
      const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

  return (
    <Card 
      ref={setNodeRef}
      className={`p-6 bg-card border-border cyber-border transition-all ${
        isOver && isEditMode ? "ring-2 ring-primary bg-primary/5" : ""
      }`}
    >
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
            placeholder="Link para download (opcional)"
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

      <div className="mb-4 space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-input border-border"
          />
        </div>
        <Select value={filterPriority} onValueChange={(v) => setFilterPriority(v as Priority | "ALL")}>
          <SelectTrigger className="bg-input border-border">
            <SelectValue placeholder="Filtrar por prioridade" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border z-50">
            <SelectItem value="ALL">TODAS</SelectItem>
            <SelectItem value="HIGH">ALTO</SelectItem>
            <SelectItem value="MEDIUM">MÉDIO</SelectItem>
            <SelectItem value="LOW">BAIXO</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {items.length === 0 ? (
          <p className="text-muted-foreground text-center py-8 italic">
            Nenhum item adicionado
          </p>
        ) : filteredItems.length === 0 ? (
          <p className="text-muted-foreground text-center py-8 italic">
            Nenhum item encontrado
          </p>
        ) : (
          filteredItems.map((item) => (
            <ListItem
              key={item.id}
              item={item}
              status={statuses.find((s) => s.id === item.id)}
              isEditMode={isEditMode}
              onStatusChange={onStatusChange}
              onDelete={onDeleteItem}
              onEdit={onEditItem}
            />
          ))
        )}
      </div>
    </Card>
  );
};
