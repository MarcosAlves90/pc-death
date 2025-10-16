import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { GroupIconType } from "@/types";

interface AddGroupDialogProps {
  onAddGroup: (name: string, iconType: GroupIconType) => void;
}

export const AddGroupDialog = ({ onAddGroup }: AddGroupDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [iconType, setIconType] = useState<GroupIconType>("folder");

  const handleAdd = () => {
    if (!name.trim()) return;
    onAddGroup(name.trim(), iconType);
    setName("");
    setIconType("folder");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-accent text-accent hover:bg-accent/10">
          <Plus className="h-4 w-4 mr-2" />
          Novo Grupo
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-primary">Criar Novo Grupo</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Nome do Grupo</label>
            <Input
              placeholder="Ex: Utilitários"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-input border-border"
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Ícone</label>
            <Select value={iconType} onValueChange={(v) => setIconType(v as GroupIconType)}>
              <SelectTrigger className="bg-input border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border z-50">
                <SelectItem value="folder">📁 Pasta</SelectItem>
                <SelectItem value="package">📦 Pacote</SelectItem>
                <SelectItem value="wrench">🔧 Ferramenta</SelectItem>
                <SelectItem value="cpu">💻 CPU</SelectItem>
                <SelectItem value="monitor">🖥️ Monitor</SelectItem>
                <SelectItem value="hard-drive">💾 Hard Drive</SelectItem>
                <SelectItem value="puzzle">🧩 Puzzle</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleAdd} className="w-full bg-primary hover:bg-primary/80">
            Criar Grupo
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
