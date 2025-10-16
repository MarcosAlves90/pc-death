export type Priority = "HIGH" | "MEDIUM" | "LOW";

export interface ListItem {
  id: string;
  name: string;
  link: string;
  priority: Priority;
}

export interface ItemStatus {
  id: string;
  status: "none" | "done" | "skip";
}

export type GroupIconType = "monitor" | "hard-drive" | "puzzle" | "folder" | "package" | "wrench" | "cpu";

export interface ItemGroup {
  id: string;
  name: string;
  iconType: GroupIconType;
  items: ListItem[];
  isDefault?: boolean;
}

export interface RedDeathData {
  groups: ItemGroup[];
}
