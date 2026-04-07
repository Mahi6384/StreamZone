import React from "react";
import { panel } from "../theme/ui";

const FALLBACK_THUMB =
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&q=80&auto=format&fit=crop";

function roundsLabel(n) {
  const x = Number(n);
  if (Number.isNaN(x) || x < 0) return null;
  return `${x} round${x === 1 ? "" : "s"}`;
}

/**
 * Knowledge-first experience entry — information over thumbnail.
 */
export default function ExperienceCard({
  exp,
  theme,
  onOpen,
  visibilityBadge,
  className = "",
}) {
  const company = exp.company?.trim() || "Company not listed";
  const role = exp.role?.trim() || "";
  const level = exp.experienceLevel || "";
  const rounds = roundsLabel(exp.interviewRounds);
  const qs = (exp.questions || []).filter(Boolean);
  const q1 = qs[0];
  const q2 = qs[1];
  const helpfulCount = (exp.helpful && exp.helpful.length) || 0;

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      className={`${panel(
        theme
      )} rounded-xl p-4 cursor-pointer transition-colors hover:border-slate-500/60 ${
        theme === "dark" ? "hover:bg-slate-900/80" : "hover:bg-slate-50/90"
      } ${className}`.trim()}
    >
      <div className="flex gap-4">
        <div className="shrink-0 w-[5.5rem] sm:w-24">
          <div
            className={`relative aspect-video w-full overflow-hidden rounded-md border ${
              theme === "dark" ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-slate-100"
            }`}
          >
            <img
              src={exp.thumbnail || FALLBACK_THUMB}
              alt=""
              className="h-full w-full object-cover opacity-90"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = FALLBACK_THUMB;
              }}
            />
          </div>
        </div>

        <div className="min-w-0 flex-1 flex flex-col gap-2">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <h2
              className={`text-lg font-semibold leading-tight sm:text-xl ${
                theme === "dark" ? "text-slate-50" : "text-slate-900"
              }`}
            >
              {company}
            </h2>
            {role && (
              <span
                className={`text-sm font-normal ${
                  theme === "dark" ? "text-slate-400" : "text-slate-600"
                }`}
              >
                · {role}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {level && (
              <span
                className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${
                  theme === "dark"
                    ? "border-blue-500/30 bg-blue-950/50 text-blue-300"
                    : "border-blue-200 bg-blue-50 text-blue-800"
                }`}
              >
                {level}
              </span>
            )}
            {rounds && (
              <span
                className={`text-xs font-medium ${
                  theme === "dark" ? "text-slate-400" : "text-slate-500"
                }`}
              >
                {rounds}
              </span>
            )}
            {visibilityBadge && (
              <span
                className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                  visibilityBadge === "private"
                    ? theme === "dark"
                      ? "border-amber-500/40 text-amber-200 bg-amber-950/40"
                      : "border-amber-200 text-amber-900 bg-amber-50"
                    : theme === "dark"
                      ? "border-slate-600 text-slate-300 bg-slate-800/80"
                      : "border-slate-200 text-slate-600 bg-slate-100"
                }`}
              >
                {visibilityBadge}
              </span>
            )}
          </div>

          {exp.title && (
            <p
              className={`text-sm font-medium line-clamp-2 ${
                theme === "dark" ? "text-slate-300" : "text-slate-700"
              }`}
            >
              {exp.title}
            </p>
          )}

          <div
            className={`space-y-1 border-t pt-2 ${
              theme === "dark" ? "border-slate-700" : "border-slate-200"
            }`}
          >
            {q1 && (
              <p
                className={`text-xs leading-snug line-clamp-2 ${
                  theme === "dark" ? "text-slate-400" : "text-slate-600"
                }`}
              >
                <span className="font-medium text-slate-500">Q:</span> {q1}
              </p>
            )}
            {q2 && (
              <p
                className={`text-xs leading-snug line-clamp-2 ${
                  theme === "dark" ? "text-slate-400" : "text-slate-600"
                }`}
              >
                <span className="font-medium text-slate-500">Q:</span> {q2}
              </p>
            )}
            {!q1 && (
              <p className="text-xs text-slate-500 italic">No question preview available.</p>
            )}
          </div>

          <div
            className={`mt-auto flex flex-wrap items-center justify-between gap-2 pt-1 text-xs ${
              theme === "dark" ? "text-slate-500" : "text-slate-500"
            }`}
          >
            <span className="font-medium text-slate-500">
              Candidate:{" "}
              <span className={theme === "dark" ? "text-slate-300" : "text-slate-700"}>
                {exp.candidate || "Anonymous"}
              </span>
            </span>
            <span className="tabular-nums font-medium text-blue-500">{helpfulCount} helpful</span>
          </div>
        </div>
      </div>
    </article>
  );
}
