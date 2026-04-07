import React from "react";
import { primaryButton, secondaryButton } from "../../theme/ui";

export function Button({ theme, variant = "primary", className = "", children, type = "button", ...rest }) {
  const base =
    variant === "primary"
      ? primaryButton
      : variant === "secondary"
        ? secondaryButton(theme)
        : primaryButton;
  return (
    <button type={type} className={`${base} ${className}`.trim()} {...rest}>
      {children}
    </button>
  );
}
