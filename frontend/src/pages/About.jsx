import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { pageBg, panel } from "../theme/ui";

const Step = ({ index, title, children, theme }) => (
  <div className={`rounded-2xl p-5 ${panel(theme)}`}>
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/25">
        <span className="text-sm font-bold">{index}</span>
      </div>
      <div className="min-w-0">
        <h3 className="text-base font-semibold">{title}</h3>
        <div className={`mt-1 text-sm leading-relaxed ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
          {children}
        </div>
      </div>
    </div>
  </div>
);

const Pill = ({ children }) => (
  <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 ring-1 ring-emerald-500/20">
    {children}
  </span>
);

export default function About() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  return (
    <main className={`${pageBg(theme)} min-h-screen pt-20`}>
      <div className="mx-auto max-w-6xl px-4 pb-14 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <section className="lg:col-span-7">
            <div className="flex flex-wrap gap-2">
              <Pill>Community-powered interview prep</Pill>
              <Pill>Share once, help thousands</Pill>
              <Pill>Green = growth</Pill>
            </div>

            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              What is <span className="text-emerald-400">InsightHire</span>?
            </h1>
            <p className={`mt-4 text-base leading-relaxed ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
              InsightHire is where candidates turn interview experiences into a clean, structured story — so others can
              prepare with confidence. No fluff: rounds, questions, notes, and optional media, all in one place.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className={`rounded-2xl p-5 ${panel(theme)}`}>
                <p className="text-sm font-semibold">For candidates</p>
                <p className={`mt-1 text-sm ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
                  Learn what actually gets asked. Spot patterns. Walk into interviews calmer and sharper.
                </p>
              </div>
              <div className={`rounded-2xl p-5 ${panel(theme)}`}>
                <p className="text-sm font-semibold">For the community</p>
                <p className={`mt-1 text-sm ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
                  More transparency means better prep, fewer surprises, and a fairer process for everyone.
                </p>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => navigate("/share")}
                className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-500 active:bg-emerald-700"
              >
                Share an experience
              </button>
              <button
                type="button"
                onClick={() => navigate("/")}
                className={`inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold ring-1 transition-colors ${
                  theme === "dark"
                    ? "text-slate-200 ring-slate-700 hover:bg-slate-900"
                    : "text-slate-700 ring-slate-200 hover:bg-white"
                }`}
              >
                Browse experiences
              </button>
            </div>

            <div className={`mt-8 rounded-2xl p-5 ${panel(theme)}`}>
              <h2 className="text-base font-semibold">What we’ll ask when you share</h2>
              <p className={`mt-2 text-sm ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
                You stay in control. Share only what you’re comfortable with. The goal is clarity, not oversharing.
              </p>
              <ul className={`mt-4 grid gap-2 text-sm ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
                <li>
                  <span className="font-semibold text-emerald-400">Required</span>: company, role, experience level,
                  title, and at least one question.
                </li>
                <li>
                  <span className="font-semibold text-emerald-400">Optional</span>: notes (what helped, what surprised
                  you), tips, outcome, images, and video.
                </li>
                <li>
                  <span className="font-semibold text-emerald-400">Visibility</span>: choose Public or Private.
                </li>
              </ul>
            </div>
          </section>

          <aside className="lg:col-span-5">
            <div className="sticky top-24 space-y-4">
              <Step index={1} title="Write the story in 2 minutes" theme={theme}>
                Add the rounds, the questions asked, and quick notes. Don’t worry about perfect formatting.
              </Step>
              <Step index={2} title="Attach proof (optional)" theme={theme}>
                Upload a short clip or screenshots of prep notes. If you skip media, your post is still valuable.
              </Step>
              <Step index={3} title="Help others, instantly" theme={theme}>
                Your experience becomes searchable — by company, role, and level — so others can learn fast.
              </Step>

              <div className={`rounded-2xl p-5 ${panel(theme)}`}>
                <h3 className="text-base font-semibold">Privacy & safety</h3>
                <ul className={`mt-3 space-y-2 text-sm ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
                  <li>
                    - Avoid sharing confidential documents, internal links, or private candidate info.
                  </li>
                  <li>
                    - Keep it about the process: rounds, questions, what worked, what didn’t.
                  </li>
                  <li>
                    - You can choose <span className="font-semibold text-emerald-400">Private</span> visibility anytime.
                  </li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

