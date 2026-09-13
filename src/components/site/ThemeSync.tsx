import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { settingsQuery } from "@/lib/store";

/** Applies the festive/seasonal colour theme saved in the dashboard. */
export function ThemeSync() {
  const { data } = useQuery(settingsQuery);

  useEffect(() => {
    if (!data) return;
    const root = document.documentElement;
    root.style.setProperty("--primary", data.theme_primary);
    root.style.setProperty("--gold", data.theme_primary);
    root.style.setProperty("--ring", data.theme_primary);
    root.style.setProperty("--accent", data.theme_accent);
    root.style.setProperty("--background", data.theme_background);
  }, [data]);

  return null;
}
