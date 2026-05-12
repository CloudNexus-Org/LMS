import { useTheme } from "../context/ThemeProvider";

/**
 * Convenience hook: returns `true` when the active theme is `"dark"`.
 * Reads from the single source of truth (`ThemeProvider`) — no DOM mutation
 * observer needed.
 *
 * @returns {boolean}
 */
export default function useIsDarkTheme() {
  const { theme } = useTheme();
  return theme === "dark";
}
