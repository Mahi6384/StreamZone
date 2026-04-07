import React from "react";
import { Toaster } from "react-hot-toast";
import { useTheme } from "../context/ThemeContext";

export default function ThemedToaster() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      toastOptions={{
        duration: 4000,
        style: isDark
          ? {
              background: "#0f172a",
              color: "#e2e8f0",
              border: "1px solid #334155",
              fontSize: "14px",
            }
          : {
              background: "#ffffff",
              color: "#0f172a",
              border: "1px solid #e2e8f0",
              fontSize: "14px",
            },
        success: { iconTheme: { primary: "#3b82f6", secondary: "#fff" } },
        error: { iconTheme: { primary: "#94a3b8", secondary: "#fff" } },
      }}
    />
  );
}
