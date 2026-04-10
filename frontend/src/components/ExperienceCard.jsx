import React from "react";
import { HiPlay } from "react-icons/hi";
import { panel, accentBadge } from "../theme/ui";

const FALLBACK_THUMB =
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80&auto=format&fit=crop";

function roundsLabel(n) {
  const x = Number(n);
  if (Number.isNaN(x) || x < 0) return null;
  return `${x} round${x === 1 ? "" : "s"}`;
}

/**
 * Playbook row: accent bar, optional video poster only when a recording exists.
 */
export default function ExperienceCard({
  exp,
  theme,
  onOpen,
  visibilityBadge,
  className = "",
}) {
  const hasVideo = Boolean((exp.videoUrl || exp.filePath || "").trim());
  const company = exp.company?.trim() || "Company not listed";
  const role = exp.role?.trim() || "";
  const level = exp.experienceLevel || "";
  const rounds = roundsLabel(exp.interviewRounds);
  const qs = (exp.questions || []).filter(Boolean);
  const q1 = qs[0];
  const q2 = qs[1];
  const helpfulCount = (exp.helpful && exp.helpful.length) || 0;

  const ringOffset =
    theme === "dark"
      ? "focus-visible:ring-offset-slate-950"
      : "focus-visible:ring-offset-white";

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
      className={`${panel(theme)} relative cursor-pointer overflow-hidden rounded-2xl transition-all duration-200
        hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/45 focus-visible:ring-offset-2 ${ringOffset}
        ${
          theme === "dark"
            ? "hover:border-slate-600 hover:bg-slate-900/55"
            : "hover:border-slate-300/90 hover:bg-white hover:shadow-sm"
        } ${className}`.trim()}
    >
      <span
        className="pointer-events-none absolute bottom-0 left-0 top-0 w-1 bg-gradient-to-b from-emerald-500 to-teal-600"
        aria-hidden
      />

      <div className="flex gap-4 py-4 pl-4 pr-4 sm:gap-5 sm:py-5 sm:pl-5 sm:pr-5">
        {hasVideo ? (
          <div className="relative w-28 shrink-0 sm:w-36">
            <div
              className={`relative aspect-video w-full overflow-hidden rounded-lg border shadow-sm ${
                theme === "dark"
                  ? "border-slate-600/80 bg-slate-800 ring-1 ring-white/5"
                  : "border-slate-200/90 bg-slate-100 ring-1 ring-slate-900/[0.04]"
              }`}
            >
              <img
                src={exp.thumbnail || FALLBACK_THUMB}
                alt=""
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = FALLBACK_THUMB;
                }}
              />
              <div
                className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-lg bg-slate-950/30"
                aria-hidden
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-emerald-800 shadow-md dark:bg-slate-900/90 dark:text-emerald-300">
                  <HiPlay className="ml-0.5 h-5 w-5" aria-hidden />
                </span>
              </div>
            </div>
          </div>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-x-2 sm:gap-y-0">
            <h2
              className={`text-base font-semibold leading-snug tracking-tight sm:text-lg ${
                theme === "dark" ? "text-slate-50" : "text-slate-900"
              }`}
            >
              {company}
            </h2>
            {role ? (
              <span
                className={`text-sm font-normal ${
                  theme === "dark" ? "text-slate-400" : "text-slate-500"
                }`}
              >
                {role}
              </span>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {level ? <span className={accentBadge(theme)}>{level}</span> : null}
            {rounds ? (
              <span
                className={`text-[13px] ${
                  theme === "dark" ? "text-slate-400" : "text-slate-500"
                }`}
              >
                {rounds}
              </span>
            ) : null}
            {visibilityBadge ? (
              <span
                className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium capitalize ${
                  visibilityBadge === "private"
                    ? theme === "dark"
                      ? "border-amber-500/35 bg-amber-950/35 text-amber-200/95"
                      : "border-amber-200 bg-amber-50 text-amber-900"
                    : theme === "dark"
                      ? "border-slate-600 bg-slate-800/80 text-slate-300"
                      : "border-slate-200 bg-slate-50 text-slate-600"
                }`}
              >
                {visibilityBadge}
              </span>
            ) : null}
          </div>

          {exp.title ? (
            <p
              className={`line-clamp-2 text-sm leading-relaxed ${
                theme === "dark" ? "text-slate-400" : "text-slate-600"
              }`}
            >
              {exp.title}
            </p>
          ) : null}

          <div
            className={`space-y-2 border-t pt-3 ${
              theme === "dark" ? "border-slate-700/80" : "border-slate-200"
            }`}
          >
            <p
              className={`text-[11px] font-medium ${
                theme === "dark" ? "text-slate-500" : "text-slate-500"
              }`}
            >
              Questions
            </p>
            {q1 ? (
              <p
                className={`line-clamp-2 text-sm leading-snug ${
                  theme === "dark" ? "text-slate-300" : "text-slate-700"
                }`}
              >
                {q1}
              </p>
            ) : null}
            {q2 ? (
              <p
                className={`line-clamp-2 text-sm leading-snug ${
                  theme === "dark" ? "text-slate-300" : "text-slate-700"
                }`}
              >
                {q2}
              </p>
            ) : null}
            {!q1 ? (
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-slate-500" : "text-slate-500"
                }`}
              >
                No questions yet.
              </p>
            ) : null}
          </div>

          <div
            className={`mt-auto flex flex-wrap items-center justify-between gap-2 pt-3 text-xs ${
              theme === "dark" ? "text-slate-500" : "text-slate-500"
            }`}
          >
            <span className="min-w-0 truncate">
              <span
                className={
                  theme === "dark"
                    ? "font-medium text-slate-300"
                    : "font-medium text-slate-700"
                }
              >
                {exp.candidate || "Anonymous"}
              </span>
            </span>
            <span className="shrink-0 tabular-nums">
              {helpfulCount === 1
                ? "1 found helpful"
                : `${helpfulCount} found helpful`}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
