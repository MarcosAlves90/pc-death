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

export interface RedDeathData {
  programs: ListItem[];
  drivers: ListItem[];
  extensions: ListItem[];
}
