import { useState } from "react";
import { RedDeathData, ListItem, ItemStatus } from "@/types";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { ItemList } from "./ItemList";
import { Button } from "@/components/ui/button";
import { Download, Upload, Edit, Eye, Trash2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Monitor, HardDrive, Puzzle } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { translations } from "@/lib/translations";

export const RedDeath = () => {
  const { toast } = useToast();
  const { language } = useLanguage();
  const t = translations[language];
  const [isEditMode, setIsEditMode] = useState(false);
  const [data, setData] = useLocalStorage<RedDeathData>("redDeath", {
    programs: [],
    drivers: [],
    extensions: [],
  });
  const [statuses, setStatuses] = useLocalStorage<ItemStatus[]>("redDeathStatuses", []);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleAddItem = (type: keyof RedDeathData, item: Omit<ListItem, "id">) => {
    const newItem = { ...item, id: generateId() };
    setData({ ...data, [type]: [...data[type], newItem] });
  };

  const handleDeleteItem = (type: keyof RedDeathData, id: string) => {
    setData({ ...data, [type]: data[type].filter((item) => item.id !== id) });
    setStatuses(statuses.filter((s) => s.id !== id));
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
      title: t.redDeath.toast.exportSuccess,
      description: t.redDeath.toast.exportDescription,
    });
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        setData(imported);
        toast({
          title: t.redDeath.toast.importSuccess,
          description: t.redDeath.toast.importDescription,
        });
      } catch (error) {
        toast({
          title: t.redDeath.toast.importError,
          description: t.redDeath.toast.importErrorDescription,
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  const handleClearAll = () => {
    if (window.confirm(t.redDeath.clearConfirm)) {
      setData({ programs: [], drivers: [], extensions: [] });
      setStatuses([]);
      toast({
        title: t.redDeath.toast.clearTitle,
        description: t.redDeath.toast.clearDescription,
      });
    }
  };

  const totalItems = data.programs.length + data.drivers.length + data.extensions.length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Card className="p-6 mb-8 bg-card/50 border-primary/50 cyber-border">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-primary uppercase tracking-wider mb-2">
              {t.redDeath.title}
            </h2>
            <p className="text-sm text-muted-foreground">
              {totalItems} {totalItems === 1 ? t.redDeath.itemsCount.singular : t.redDeath.itemsCount.plural}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditMode(!isEditMode)}
              className={isEditMode ? "border-primary text-primary" : ""}
            >
              {isEditMode ? <Eye className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
              {isEditMode ? t.redDeath.buttons.view : t.redDeath.buttons.edit}
            </Button>

            <Button
              variant="outline"
              onClick={handleExport}
              className="border-secondary text-secondary hover:bg-secondary/10"
              disabled={totalItems === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              {t.redDeath.buttons.export}
            </Button>

            <label>
              <Button
                variant="outline"
                className="border-accent text-accent hover:bg-accent/10"
                asChild
              >
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  {t.redDeath.buttons.import}
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
              {t.redDeath.buttons.clear}
            </Button>
          </div>
        </div>
      </Card>

      {!isEditMode && totalItems > 0 && (
        <div className="mb-8 p-4 bg-muted/20 rounded border border-muted flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-semibold mb-1">{t.redDeath.viewModeAlert.title}</p>
            <p>{t.redDeath.viewModeAlert.description}</p>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <ItemList
          title={t.redDeath.lists.programs}
          items={data.programs}
          statuses={statuses}
          isEditMode={isEditMode}
          onAddItem={(item) => handleAddItem("programs", item)}
          onDeleteItem={(id) => handleDeleteItem("programs", id)}
          onStatusChange={handleStatusChange}
          icon={<Monitor className="h-6 w-6 text-primary" />}
        />

        <ItemList
          title={t.redDeath.lists.drivers}
          items={data.drivers}
          statuses={statuses}
          isEditMode={isEditMode}
          onAddItem={(item) => handleAddItem("drivers", item)}
          onDeleteItem={(id) => handleDeleteItem("drivers", id)}
          onStatusChange={handleStatusChange}
          icon={<HardDrive className="h-6 w-6 text-secondary" />}
        />

        <ItemList
          title={t.redDeath.lists.extensions}
          items={data.extensions}
          statuses={statuses}
          isEditMode={isEditMode}
          onAddItem={(item) => handleAddItem("extensions", item)}
          onDeleteItem={(id) => handleDeleteItem("extensions", id)}
          onStatusChange={handleStatusChange}
          icon={<Puzzle className="h-6 w-6 text-accent" />}
        />
      </div>
    </div>
  );
};
