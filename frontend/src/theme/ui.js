/** Shared Tailwind class fragments for dark/light — slate neutrals, blue accent */

export const pageBg = (theme) =>
  theme === "dark" ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900";

export const navBg = (theme, scrolled) =>
  scrolled
    ? theme === "dark"
      ? "bg-slate-950/95 border-b border-slate-800"
      : "bg-white/95 border-b border-slate-200"
    : theme === "dark"
      ? "bg-slate-950/80"
      : "bg-slate-50/80";

export const panel = (theme) =>
  theme === "dark"
    ? "border border-slate-700/80 bg-slate-900/60"
    : "border border-slate-200 bg-white";

export const panelMuted = (theme) =>
  theme === "dark"
    ? "border border-slate-800 bg-slate-900/40"
    : "border border-slate-200 bg-slate-100/80";

/** Softer empty-state panel */
export const panelEmpty = (theme) =>
  theme === "dark"
    ? "border border-slate-800 bg-slate-900/30"
    : "border border-slate-200 bg-white";

export const labelCls =
  "block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5";

export const inputCls = (theme) =>
  `w-full rounded-lg border py-2 px-3 text-sm outline-none transition-colors ${
    theme === "dark"
      ? "border-slate-600 bg-slate-900 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
      : "border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-500/30"
  }`;

export const selectCls = (theme) => inputCls(theme);

export const textareaCls = (theme) => `${inputCls(theme)} resize-y min-h-[4.5rem]`;

export const primaryButton =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-500 active:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 border border-transparent";

export const secondaryButton = (theme) =>
  theme === "dark"
    ? "inline-flex items-center justify-center rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700/80 transition-colors"
    : "inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 transition-colors";

export const ghostButton = (theme) =>
  theme === "dark"
    ? "text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg px-3 py-2 text-sm font-medium transition-colors";

export const headingPage = (theme) =>
  theme === "dark" ? "text-slate-100" : "text-slate-900";

export const subheading = "text-sm text-slate-500";

export const linkButton =
  "text-sm font-medium text-blue-500 hover:text-blue-400 underline-offset-2 hover:underline";
