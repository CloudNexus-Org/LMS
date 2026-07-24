import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "@/app/providers/ThemeProvider.jsx";
import { initTelemetry } from "@/lib/posthog";

createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);

// Never block first paint on analytics
initTelemetry();
