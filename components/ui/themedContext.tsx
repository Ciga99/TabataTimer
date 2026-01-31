import { createContext } from "react";

interface ThemedContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  toggle : () => void;
}

export const ThemedContext = createContext<ThemedContextType | undefined>(undefined);

