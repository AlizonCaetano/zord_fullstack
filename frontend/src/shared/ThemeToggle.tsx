import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/shared/useTheme";

export function ThemeToggle(): React.JSX.Element {
  const { theme, toggleTheme } = useTheme();
  const label: string =
    theme === "dark" ? "Ativar tema marinho" : "Ativar tema preto";

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </Button>
  );
}
