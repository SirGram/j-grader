import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
} from "react";

type Theme = string;

interface ThemeContextType {
  currentTheme: Theme;
  setCurrentTheme: React.Dispatch<React.SetStateAction<Theme>>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || "halloween"; // Return saved theme or default
  });

  const observerRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    const applyTheme = (theme: Theme) => {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
    };

    applyTheme(currentTheme);

    // Set up MutationObserver
    observerRef.current = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "data-theme"
        ) {
          const newTheme = document.documentElement.getAttribute(
            "data-theme"
          ) as Theme;
          if (newTheme !== currentTheme) {
            console.log(
              "Theme changed externally, reverting to:",
              currentTheme
            );
            applyTheme(currentTheme);
          }
        }
      });
    });

    observerRef.current.observe(document.documentElement, { attributes: true });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ currentTheme, setCurrentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
