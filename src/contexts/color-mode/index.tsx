import { RefineThemes } from "@refinedev/antd";
import { ConfigProvider, theme } from "antd";
import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

// Define allowed color modes
export type ColorMode = "light" | "dark";

// Define context type
export type ColorModeContextType = {
  mode: ColorMode;
  toggleMode: () => void;
};

// Create context with default values
export const ColorModeContext = createContext<ColorModeContextType>({
  mode: "light",
  toggleMode: () => {},
});

export const ColorModeContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  // Initialize mode state with lazy initializer
  const [mode, setMode] = useState<ColorMode>(() => {
    if (typeof window === "undefined") {
      return "light"; // Default to light mode in SSR
    }

    // Try to get mode from localStorage
    const storedMode = localStorage.getItem("colorMode") as ColorMode | null;
    if (storedMode === "light" || storedMode === "dark") {
      return storedMode;
    }

    // Fallback to system preference
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  });

  // Save mode to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("colorMode", mode);
    }
  }, [mode]);

  // Toggle color mode
  const toggleMode = useCallback(() => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  }, []);

  // Memoize theme configuration to avoid unnecessary recalculations
  const themeConfig = useMemo(() => ({
    ...RefineThemes.Blue,
    algorithm: mode === "light" ? theme.defaultAlgorithm : theme.darkAlgorithm,
  }), [mode]);

  return (
    <ColorModeContext.Provider value={{ mode, toggleMode }}>
      <ConfigProvider theme={themeConfig}>
        {children}
      </ConfigProvider>
    </ColorModeContext.Provider>
  );
};