import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDarkMode } from "@/contexts/DarkModeContext";

interface DarkModeToggleProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  showLabel?: boolean;
}

export const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ 
  variant = "ghost", 
  size = "sm",
  showLabel = false 
}) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleDarkMode}
      className="flex items-center gap-2 transition-colors"
      title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? (
        <>
          <Sun className="w-4 h-4" />
          {showLabel && <span>Light</span>}
        </>
      ) : (
        <>
          <Moon className="w-4 h-4" />
          {showLabel && <span>Dark</span>}
        </>
      )}
    </Button>
  );
};
