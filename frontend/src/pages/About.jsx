import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { pageBg, panel } from "../theme/ui";

// const CORE_BLOCKS = [
//   {
//     title: "Capture & Share",
//     body: "Log your interview rounds, questions, and key takeaways in minutes — no friction.",
//     Icon: HiDocumentAdd,
//     ring: "ring-emerald-500/30",
//     iconBg: "bg-emerald-500/15 text-emerald-500 dark:text-emerald-400",
//     bar: "bg-emerald-500",
//   },
//   {
//     title: "Structured Insights",
//     body: "Every interview is broken down into structured, easy-to-scan insights — no clutter.",
//     Icon: HiViewGrid,
//     ring: "ring-amber-500/30",
//     iconBg: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
//     bar: "bg-amber-500",
//   },
//   {
//     title: "Learn & Prepare",
//     body: "Learn from real questions and recurring patterns across companies — not random prep.",
//     Icon: HiAcademicCap,
//     ring: "ring-sky-500/30",
//     iconBg: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
//     bar: "bg-sky-500",
//   },
//   {
//     title: "Private Control",
//     body: "Stay in control. Keep entries private or share publicly — your data, your rules.",
//     Icon: HiLockClosed,
//     ring: "ring-violet-500/30",
//     iconBg: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
//     bar: "bg-violet-500",
//   },
// ];

// const CoreBlock = ({ title, body, Icon, ring, iconBg, bar, theme }) => (
//   <div
//     className={`relative overflow-hidden rounded-2xl p-5 ${panel(theme)} ring-1 ${ring} ${
//       theme === "dark" ? "ring-white/5" : "ring-slate-200/80"
//     }`}
//   >
//     <span className={`absolute left-0 top-0 h-full w-1 ${bar}`} />
//     <div className="flex gap-4 pl-1">
//       <div
//         className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBg} ring-1 ${ring}`}
//       >
//         <Icon className="h-5 w-5" />
//       </div>
//       <div className="min-w-0">
//         <h3 className="text-base font-semibold tracking-tight">{title}</h3>
//         <p
//           className={`mt-2 text-sm leading-relaxed ${
//             theme === "dark" ? "text-slate-300" : "text-slate-600"
//           }`}
//         >
//           {body}
//         </p>
//       </div>
//     </div>
//   </div>
// );

const Step = ({ index, title, children, theme }) => (
  <div className={`rounded-2xl p-5 ${panel(theme)}`}>
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/25">
        <span className="text-sm font-bold">{index}</span>
      </div>
      <div className="min-w-0">
        <h3 className="text-base font-semibold">{title}</h3>
        <div
          className={`mt-1 text-sm leading-relaxed ${
            theme === "dark" ? "text-slate-300" : "text-slate-600"
          }`}
        >
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
      <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        {/* HERO */}
        <header className="max-w-3xl">
          <div className="flex flex-wrap gap-2">
            <Pill>Real Questions</Pill>
            <Pill>Proven Patterns</Pill>
            <Pill>Faster Preparation</Pill>
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Your Interview Advantage
          </h1>
          <p
            className={`mt-4 text-base leading-relaxed sm:text-lg ${
              theme === "dark" ? "text-slate-300" : "text-slate-600"
            }`}
          >
            InsightHire helps you prepare using real interview questions, real
            candidate strategies, and real outcomes — so you walk in ready —
            knowing what actually gets asked.
          </p>
        </header>

        {/* HOW IT WORKS */}

        {/* MAIN GRID */}
        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-10">
          <section className="lg:col-span-7">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">
              Built for Candidates Who Want an Edge
            </h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className={`rounded-2xl p-5 ${panel(theme)}`}>
                <p className="text-sm font-semibold">For candidates</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  See what companies actually ask. Spot patterns early and walk
                  into interviews prepared and confident.
                </p>
              </div>

              <div className={`rounded-2xl p-5 ${panel(theme)}`}>
                <p className="text-sm font-semibold">For the community</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  Turn real experiences into shared intelligence. Better prep,
                  fewer surprises, stronger outcomes.
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate("/share")}
                className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500"
              >
                Add Interview
              </button>

              <button
                onClick={() => navigate("/")}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold ring-1 text-slate-700 dark:text-slate-200"
              >
                Explore Feed
              </button>
            </div>

            {/* FINAL HOOK */}
            <div className={`mt-10 rounded-2xl p-6 ${panel(theme)}`}>
              <h2 className="text-lg font-semibold">
                Stop Guessing. Start Preparing.
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Interviews shouldn’t feel unpredictable. InsightHire gives you
                the clarity, patterns, and real questions you need to perform
                with confidence.
              </p>
            </div>
          </section>

          {/* RIGHT SIDE */}
          <aside className="lg:col-span-5">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-500">
              Your path
            </h2>

            <div className="space-y-4">
              <Step index={1} title="Capture Your Interview" theme={theme}>
                Add rounds, questions, and key takeaways. Keep it simple.
              </Step>

              <Step index={2} title="Add Proof (Optional)" theme={theme}>
                Attach screenshots or notes to increase credibility.
              </Step>

              <Step index={3} title="Help Others Prepare" theme={theme}>
                Your insights become searchable and help others crack interviews
                faster.
              </Step>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
