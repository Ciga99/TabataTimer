import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";

export const SettingRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <ThemedView lightColor="transparent" darkColor="transparent">
    <ThemedText>{label}</ThemedText>
    {children}
  </ThemedView>
);