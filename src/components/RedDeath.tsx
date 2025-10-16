import { useState, useEffect } from "react";
import { RedDeathData, ListItem, ItemStatus, Priority, ItemGroup, GroupIconType } from "@/types";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { ItemList } from "./ItemList";
import { Button } from "@/components/ui/button";
import { Download, Upload, Edit, Eye, Trash2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Monitor, HardDrive, Puzzle, Folder, Package, Wrench, Cpu } from "lucide-react";
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import { AddGroupDialog } from "./AddGroupDialog";

const getIconByType = (type: GroupIconType) => {
  const icons = {
    monitor: <Monitor className="h-6 w-6" />,
    "hard-drive": <HardDrive className="h-6 w-6" />,
    puzzle: <Puzzle className="h-6 w-6" />,
    folder: <Folder className="h-6 w-6" />,
    package: <Package className="h-6 w-6" />,
    wrench: <Wrench className="h-6 w-6" />,
    cpu: <Cpu className="h-6 w-6" />,
  };
  return icons[type];
};

export const RedDeath = () => {
  const { toast } = useToast();
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [data, setData] = useLocalStorage<RedDeathData>("redDeath", {
    groups: [],
  });
  const [statuses, setStatuses] = useLocalStorage<ItemStatus[]>("redDeathStatuses", []);

  // Migrate old data structure to new structure
  useEffect(() => {
    const oldData = localStorage.getItem("redDeath");
    if (oldData) {
      try {
        const parsed = JSON.parse(oldData);
        if (parsed.programs !== undefined || parsed.drivers !== undefined || parsed.extensions !== undefined) {
          const migratedData: RedDeathData = {
            groups: [
              {
                id: "programs",
                name: "Programas",
                iconType: "monitor",
                items: parsed.programs || [],
                isDefault: true,
              },
              {
                id: "drivers",
                name: "Drivers",
                iconType: "hard-drive",
                items: parsed.drivers || [],
                isDefault: true,
              },
              {
                id: "extensions",
                name: "Extensões",
                iconType: "puzzle",
                items: parsed.extensions || [],
                isDefault: true,
              },
            ],
          };
          setData(migratedData);
        }
      } catch (e) {
        console.error("Error migrating data:", e);
      }
    } else if (data.groups.length === 0) {
      // Initialize with default groups if no data exists
      setData({
        groups: [
          { id: "programs", name: "Programas", iconType: "monitor", items: [], isDefault: true },
          { id: "drivers", name: "Drivers", iconType: "hard-drive", items: [], isDefault: true },
          { id: "extensions", name: "Extensões", iconType: "puzzle", items: [], isDefault: true },
        ],
      });
    }
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleAddGroup = (name: string, iconType: GroupIconType) => {
    const newGroup: ItemGroup = {
      id: generateId(),
      name,
      iconType,
      items: [],
      isDefault: false,
    };
    setData({ groups: [...data.groups, newGroup] });
    toast({
      title: "Grupo criado",
      description: `O grupo "${name}" foi criado com sucesso`,
    });
  };

  const handleDeleteGroup = (groupId: string) => {
    const group = data.groups.find((g) => g.id === groupId);
    if (group?.isDefault) {
      toast({
        title: "Erro",
        description: "Grupos padrão não podem ser deletados",
        variant: "destructive",
      });
      return;
    }

    if (window.confirm(`Tem certeza que deseja deletar o grupo "${group?.name}"?`)) {
      setData({ groups: data.groups.filter((g) => g.id !== groupId) });
      // Remove statuses for items in deleted group
      const itemIds = group?.items.map((i) => i.id) || [];
      setStatuses(statuses.filter((s) => !itemIds.includes(s.id)));
      toast({
        title: "Grupo deletado",
        description: "O grupo foi removido com sucesso",
      });
    }
  };

  const handleAddItem = (groupId: string, item: Omit<ListItem, "id">) => {
    const newItem = { ...item, id: generateId() };
    setData({
      groups: data.groups.map((group) =>
        group.id === groupId ? { ...group, items: [...group.items, newItem] } : group
      ),
    });
  };

  const handleDeleteItem = (groupId: string, id: string) => {
    setData({
      groups: data.groups.map((group) =>
        group.id === groupId ? { ...group, items: group.items.filter((item) => item.id !== id) } : group
      ),
    });
    setStatuses(statuses.filter((s) => s.id !== id));
  };

  const handleEditItem = (groupId: string, id: string, updates: { name: string; link: string; priority: Priority }) => {
    setData({
      groups: data.groups.map((group) =>
        group.id === groupId
          ? { ...group, items: group.items.map((item) => (item.id === id ? { ...item, ...updates } : item)) }
          : group
      ),
    });
    toast({
      title: "Item atualizado",
      description: "As alterações foram salvas",
    });
  };

  const handleStatusChange = (id: string, status: "none" | "done" | "skip") => {
    const existing = statuses.find((s) => s.id === id);
    if (existing) {
      setStatuses(statuses.map((s) => (s.id === id ? { id, status } : s)));
    } else {
      setStatuses([...statuses, { id, status }]);
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "pc-death-red-death.json";
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Exportado com sucesso",
      description: "Seus dados foram salvos em um arquivo JSON",
    });
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        
        // Check if it's the old format and convert to new format
        if (imported.programs !== undefined || imported.drivers !== undefined || imported.extensions !== undefined) {
          const convertedData: RedDeathData = {
            groups: [
              {
                id: "programs",
                name: "Programas",
                iconType: "monitor",
                items: imported.programs || [],
                isDefault: true,
              },
              {
                id: "drivers",
                name: "Drivers",
                iconType: "hard-drive",
                items: imported.drivers || [],
                isDefault: true,
              },
              {
                id: "extensions",
                name: "Extensões",
                iconType: "puzzle",
                items: imported.extensions || [],
                isDefault: true,
              },
            ],
          };
          setData(convertedData);
        } else {
          // New format, use directly
          setData(imported);
        }
        
        toast({
          title: "Importado com sucesso",
          description: "Seus dados foram carregados",
        });
      } catch (error) {
        toast({
          title: "Erro ao importar",
          description: "Arquivo inválido",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  const handleClearAll = () => {
    if (window.confirm("Tem certeza que deseja limpar todas as listas?")) {
      setData({
        groups: data.groups.map((group) => ({ ...group, items: [] })),
      });
      setStatuses([]);
      toast({
        title: "Listas limpas",
        description: "Todas as listas foram removidas",
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || !isEditMode) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find which group the item is coming from
    let sourceGroup: ItemGroup | null = null;
    let item: ListItem | null = null;

    for (const group of data.groups) {
      const found = group.items.find((i) => i.id === activeId);
      if (found) {
        sourceGroup = group;
        item = found;
        break;
      }
    }

    if (!item || !sourceGroup) return;

    // Determine target group
    let targetGroup: ItemGroup | null = null;
    for (const group of data.groups) {
      if (overId === group.id || group.items.some((i) => i.id === overId)) {
        targetGroup = group;
        break;
      }
    }

    if (!targetGroup || sourceGroup.id === targetGroup.id) return;

    // Move item from source to target
    setData({
      groups: data.groups.map((group) => {
        if (group.id === sourceGroup.id) {
          return { ...group, items: group.items.filter((i) => i.id !== activeId) };
        }
        if (group.id === targetGroup.id) {
          return { ...group, items: [...group.items, item] };
        }
        return group;
      }),
    });

    toast({
      title: "Item movido",
      description: `Item movido para ${targetGroup.name}`,
    });
  };

  const totalItems = data.groups.reduce((sum, group) => sum + group.items.length, 0);

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Card className="p-6 mb-8 bg-card/50 border-primary/50 cyber-border">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-primary uppercase tracking-wider mb-2">
                RED DEATH PROTOCOL
              </h2>
              <p className="text-sm text-muted-foreground">
                {totalItems} {totalItems === 1 ? "item" : "itens"} cadastrados
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <AddGroupDialog onAddGroup={handleAddGroup} />

              <Button
                variant="outline"
                onClick={() => setIsEditMode(!isEditMode)}
                className={isEditMode ? "border-primary text-primary" : ""}
              >
                {isEditMode ? <Eye className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                {isEditMode ? "Visualizar" : "Editar"}
              </Button>

              <Button
                variant="outline"
                onClick={handleExport}
                className="border-secondary text-secondary hover:bg-secondary/10"
                disabled={totalItems === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>

              <label>
                <Button
                  variant="outline"
                  className="border-accent text-accent hover:bg-accent/10"
                  asChild
                >
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Importar
                  </span>
                </Button>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>

              <Button
                variant="outline"
                onClick={handleClearAll}
                className="border-destructive text-destructive hover:bg-destructive/10"
                disabled={totalItems === 0}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Limpar
              </Button>
            </div>
          </div>
        </Card>

        {!isEditMode && totalItems > 0 && (
          <div className="mb-8 p-4 bg-muted/20 rounded border border-muted flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-semibold mb-1">Modo de visualização ativo</p>
              <p>Clique nos itens para marcar como concluído (✓), ignorado (✗) ou limpar a marcação.</p>
            </div>
          </div>
        )}

        {isEditMode && totalItems > 0 && (
          <div className="mb-8 p-4 bg-muted/20 rounded border border-muted flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-semibold mb-1">Modo de edição ativo</p>
              <p>Arraste e solte itens entre grupos para movê-los.</p>
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {data.groups.map((group) => (
            <ItemList
              key={group.id}
              id={group.id}
              title={group.name}
              items={group.items}
              statuses={statuses}
              isEditMode={isEditMode}
              onAddItem={(item) => handleAddItem(group.id, item)}
              onDeleteItem={(id) => handleDeleteItem(group.id, id)}
              onEditItem={(id, updates) => handleEditItem(group.id, id, updates)}
              onStatusChange={handleStatusChange}
              onDeleteGroup={!group.isDefault ? () => handleDeleteGroup(group.id) : undefined}
              icon={getIconByType(group.iconType)}
            />
          ))}
        </div>
      </div>
    </DndContext>
  );
};
