import { useLocalStorage } from "./useLocalStorage";

export type Language = "pt" | "en";

export function useLanguage() {
  const [language, setLanguage] = useLocalStorage<Language>("language", "pt");
  
  return { language, setLanguage };
}