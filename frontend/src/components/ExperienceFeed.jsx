import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { HiX, HiCollection, HiSearch, HiCheck } from "react-icons/hi";
import { EXPERIENCES_API } from "../config/api";
import ExperienceCard from "./ExperienceCard";
import { Button } from "./ui/Button";
import {
  pageBg,
  panel,
  panelEmpty,
  inputCls,
  headingPage,
  linkButton,
} from "../theme/ui";
import { useTheme } from "../context/ThemeContext";

const PRESET_COMPANIES = ["Google", "Uber", "LinkedIn", "Adobe", "Oracle"];

const PRESET_ROLES = [
  "Software Engineer",
  "Product Engineer",
  "Security Engineer",
  "Engineering Manager",
];

/** Matches ShareExperiencePage LEVELS for API $in filter */
// const EXPERIENCE_LEVELS = [
//   "Intern",
//   "SDE1",
//   "SDE2",
//   "SDE3",
//   "Senior",
//   "Staff",
//   "Other",
// ];

function toggleInList(list, item) {
  if (list.includes(item)) return list.filter((x) => x !== item);
  return [...list, item];
}

function serializeFeedParams({ companies, roles, experienceLevel, search }) {
  const p = new URLSearchParams();
  companies.forEach((c) => p.append("companies", c));
  roles.forEach((r) => p.append("roles", r));
  if (experienceLevel) p.append("experienceLevels", experienceLevel);
  const q = (search || "").trim();
  if (q) p.set("search", q);
  return p.toString();
}

function SidebarSection({ theme, title, icon, children }) {
  return (
    <div
      className={`space-y-3 border-t pt-5 first:border-t-0 first:pt-0 ${
        theme === "dark" ? "border-slate-700/80" : "border-slate-200"
      }`}
    >
      <h3
        className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest ${
          theme === "dark" ? "text-slate-500" : "text-slate-500"
        }`}
      >
        {icon}
        {title}
      </h3>
      {children}
    </div>
  );
}

const ExperienceFeed = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const locationRef = useRef(location);
  locationRef.current = location;
  const { theme } = useTheme();

  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );

  const [draftCompanies, setDraftCompanies] = useState([]);
  const [draftRoles, setDraftRoles] = useState([]);
  const [draftLevel, setDraftLevel] = useState("");
  const [draftSearch, setDraftSearch] = useState("");
  const [customCompany, setCustomCompany] = useState("");
  const [customRole, setCustomRole] = useState("");

  useEffect(() => {
    const sp = new URLSearchParams(location.search);
    setDraftCompanies(sp.getAll("companies"));
    setDraftRoles(sp.getAll("roles"));
    const levels = sp.getAll("experienceLevels");
    setDraftLevel(levels[0] || "");
    setDraftSearch(sp.get("search") || "");
  }, [location.search]);

  const fetchUrl = useMemo(() => {
    const q = location.search.replace(/^\?/, "");
    return q ? `${EXPERIENCES_API}?${q}` : EXPERIENCES_API;
  }, [location.search]);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(fetchUrl);
        setExperiences(res.data);
      } catch (err) {
        console.error(err);
        setError(
          "We could not load the feed. Check your connection and try again.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchExperiences();
  }, [fetchUrl]);

  /** Keep search in sync with the URL without requiring Apply (preserves other query params). */
  useEffect(() => {
    const t = setTimeout(() => {
      const sp = new URLSearchParams(locationRef.current.search);
      const next = draftSearch.trim();
      const cur = (sp.get("search") || "").trim();
      if (next === cur) return;
      if (next) sp.set("search", next);
      else sp.delete("search");
      const qs = sp.toString();
      navigate(qs ? `/?${qs}` : "/", { replace: true });
    }, 380);
    return () => clearTimeout(t);
  }, [draftSearch, navigate]);

  const commitSearchNow = useCallback(() => {
    const sp = new URLSearchParams(locationRef.current.search);
    const next = draftSearch.trim();
    if (next) sp.set("search", next);
    else sp.delete("search");
    const qs = sp.toString();
    navigate(qs ? `/?${qs}` : "/", { replace: true });
  }, [draftSearch, navigate]);

  const applyFilters = useCallback(
    (e) => {
      e?.preventDefault();
      const qs = serializeFeedParams({
        companies: draftCompanies,
        roles: draftRoles,
        experienceLevel: draftLevel,
        search: draftSearch,
      });
      navigate(qs ? `/?${qs}` : "/");
    },
    [draftCompanies, draftRoles, draftLevel, draftSearch, navigate],
  );

  const clearFilters = useCallback(() => {
    setDraftCompanies([]);
    setDraftRoles([]);
    setDraftLevel("");
    setDraftSearch("");
    setCustomCompany("");
    setCustomRole("");
    navigate("/");
  }, [navigate]);

  const addCustomCompany = () => {
    const v = customCompany.trim();
    if (!v) return;
    if (!draftCompanies.includes(v)) setDraftCompanies([...draftCompanies, v]);
    setCustomCompany("");
  };

  const addCustomRole = () => {
    const v = customRole.trim();
    if (!v) return;
    if (!draftRoles.includes(v)) setDraftRoles([...draftRoles, v]);
    setCustomRole("");
  };

  const hasActiveUrlFilters =
    searchParams.getAll("companies").length > 0 ||
    searchParams.getAll("roles").length > 0 ||
    searchParams.getAll("experienceLevels").length > 0 ||
    Boolean((searchParams.get("search") || "").trim());

  const hasDraftSelection =
    draftCompanies.length > 0 ||
    draftRoles.length > 0 ||
    Boolean(draftLevel) ||
    Boolean(draftSearch.trim());

  const showFiltersSidebar = true;

  const chipBase = (active) =>
    `inline-flex cursor-pointer items-center rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
      active
        ? theme === "dark"
          ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/20"
          : "border-emerald-300 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-500/15"
        : theme === "dark"
          ? "border-slate-600 bg-slate-800/50 text-slate-300 hover:border-emerald-500/40 hover:text-emerald-300"
          : "border-slate-200 bg-slate-100 text-slate-700 hover:border-emerald-200 hover:bg-emerald-50/60"
    }`;

  const companyRow = (name) => {
    const checked = draftCompanies.includes(name);
    return (
      <label
        key={name}
        className={`group flex cursor-pointer items-center gap-3 ${
          theme === "dark" ? "text-slate-300" : "text-slate-700"
        }`}
      >
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={() => setDraftCompanies((prev) => toggleInList(prev, name))}
        />
        <span
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
            checked
              ? "border-emerald-600 bg-emerald-600 dark:border-emerald-500 dark:bg-emerald-500"
              : theme === "dark"
                ? "border-slate-600 group-hover:border-emerald-500/50"
                : "border-slate-300 group-hover:border-emerald-400"
          }`}
          aria-hidden
        >
          {checked ? (
            <HiCheck className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
          ) : null}
        </span>
        <span
          className={`text-sm ${checked ? "font-semibold text-emerald-700 dark:text-emerald-300" : "font-medium"}`}
        >
          {name}
        </span>
      </label>
    );
  };

  const sidebar = (
    <aside className="w-full shrink-0 space-y-6 lg:w-72 xl:w-80">
      <div
        className={`${panel(theme)} rounded-2xl p-5 shadow-sm ring-1 ${
          theme === "dark" ? "ring-white/5" : "ring-slate-200/80"
        }`}
      >
        <div className="mb-5 flex items-start justify-between gap-2">
          <div>
            {/* <h2
              className={`flex items-center gap-2 font-display text-lg font-bold tracking-tight ${headingPage(theme)}`}
            >
              <MdFilterList
                className="h-5 w-5 text-emerald-600 dark:text-emerald-400"
                aria-hidden
              />
              Refine
            </h2> */}
            <p className="mt-1 text-xs leading-snug text-slate-500">
              Narrow by company, role, and level. Use Refine Results when ready.
            </p>
          </div>
          {hasDraftSelection ? (
            <button
              type="button"
              onClick={clearFilters}
              className={`${linkButton} shrink-0 text-[11px]`}
            >
              Clear
            </button>
          ) : null}
        </div>

        <form onSubmit={applyFilters} className="flex flex-col gap-0">
          <div
            className={`mb-5 flex flex-col gap-2 border-b pb-5 ${
              theme === "dark" ? "border-slate-700/80" : "border-slate-200"
            }`}
          >
            <Button
              theme={theme}
              variant="primary"
              type="submit"
              className="w-full !py-2.5 !text-sm font-semibold"
            >
              Refine Results
            </Button>
            <Button
              theme={theme}
              variant="secondary"
              type="button"
              onClick={clearFilters}
              className="w-full !py-2 !text-xs"
            >
              Reset all
            </Button>
          </div>

          <SidebarSection
            theme={theme}
            title="Companies"
            icon={
              <span
                className="h-1 w-1 rounded-full bg-emerald-500"
                aria-hidden
              />
            }
          >
            <div className="flex flex-col gap-2.5">
              {PRESET_COMPANIES.map((name) => companyRow(name))}
            </div>
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={customCompany}
                onChange={(e) => setCustomCompany(e.target.value)}
                placeholder="Custom company"
                className={`${inputCls(theme)} !py-2 text-sm`}
                aria-label="Custom company name"
              />
              <Button
                theme={theme}
                variant="secondary"
                type="button"
                onClick={addCustomCompany}
                className="!shrink-0 !px-3 !py-2 text-xs"
              >
                Add
              </Button>
            </div>
            {draftCompanies.filter((c) => !PRESET_COMPANIES.includes(c))
              .length > 0 && (
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {draftCompanies
                  .filter((c) => !PRESET_COMPANIES.includes(c))
                  .map((c) => (
                    <li
                      key={c}
                      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs ${
                        theme === "dark"
                          ? "border-slate-600 bg-slate-800 text-slate-200"
                          : "border-slate-200 bg-slate-100 text-slate-800"
                      }`}
                    >
                      <span>{c}</span>
                      <button
                        type="button"
                        className="rounded p-0.5 hover:bg-slate-600/30"
                        onClick={() =>
                          setDraftCompanies((prev) =>
                            prev.filter((x) => x !== c),
                          )
                        }
                        aria-label={`Remove ${c}`}
                      >
                        <HiX className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
              </ul>
            )}
          </SidebarSection>

          <SidebarSection
            theme={theme}
            title="Roles"
            icon={
              <span
                className="h-1 w-1 rounded-full bg-emerald-500"
                aria-hidden
              />
            }
          >
            <div className="flex flex-wrap gap-2">
              {PRESET_ROLES.map((name) => {
                const active = draftRoles.includes(name);
                return (
                  <button
                    key={name}
                    type="button"
                    className={chipBase(active)}
                    onClick={() =>
                      setDraftRoles((prev) => toggleInList(prev, name))
                    }
                  >
                    {name}
                  </button>
                );
              })}
            </div>
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                placeholder="Custom role"
                className={`${inputCls(theme)} !py-2 text-sm`}
                aria-label="Custom role"
              />
              <Button
                theme={theme}
                variant="secondary"
                type="button"
                onClick={addCustomRole}
                className="!shrink-0 !px-3 !py-2 text-xs"
              >
                Add
              </Button>
            </div>
            {draftRoles.filter((r) => !PRESET_ROLES.includes(r)).length > 0 && (
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {draftRoles
                  .filter((r) => !PRESET_ROLES.includes(r))
                  .map((r) => (
                    <li
                      key={r}
                      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs ${
                        theme === "dark"
                          ? "border-slate-600 bg-slate-800 text-slate-200"
                          : "border-slate-200 bg-slate-100 text-slate-800"
                      }`}
                    >
                      <span>{r}</span>
                      <button
                        type="button"
                        className="rounded p-0.5 hover:bg-slate-600/30"
                        onClick={() =>
                          setDraftRoles((prev) => prev.filter((x) => x !== r))
                        }
                        aria-label={`Remove ${r}`}
                      >
                        <HiX className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
              </ul>
            )}
          </SidebarSection>

          <SidebarSection
            theme={theme}
            title="Level"
            icon={
              <span
                className="h-1 w-1 rounded-full bg-emerald-500"
                aria-hidden
              />
            }
          >
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={customCompany}
                onChange={(e) => setCustomCompany(e.target.value)}
                placeholder="Level "
                className={`${inputCls(theme)} !py-2 text-sm`}
                aria-label="Level"
              />
              <Button
                theme={theme}
                variant="secondary"
                type="button"
                onClick={addCustomCompany}
                className="!shrink-0 !px-3 !py-2 text-xs"
              >
                Add
              </Button>
            </div>
          </SidebarSection>
        </form>
      </div>

      <div
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 p-6 text-white shadow-lg shadow-emerald-900/20 ring-1 ring-emerald-500/30`}
      >
        <div className="relative z-10">
          <p className="font-display text-lg font-bold leading-tight">
            Add your interview experience
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-emerald-50/90">
            Structured rounds, questions, and takeaways—video optional. Help
            others prep faster.
          </p>
          <button
            type="button"
            onClick={() => navigate("/share")}
            className="mt-4 rounded-lg bg-white px-4 py-2 text-xs font-bold text-emerald-800 transition hover:scale-[1.02] active:scale-[0.98]"
          >
            Add
          </button>
        </div>
        <div
          className="pointer-events-none absolute -bottom-10 -right-6 h-28 w-28 rounded-full bg-white/15 blur-2xl"
          aria-hidden
        />
      </div>
    </aside>
  );

  const mainHeader = useMemo(() => {
    const panelBorder =
      theme === "dark" ? "border-emerald-500/20" : "border-emerald-200/80";
    const panelBg = theme === "dark" ? "bg-slate-900/55" : "bg-white/95";
    return (
      <header
        className={`relative mb-8 overflow-hidden rounded-2xl border p-6 sm:p-8 ${panelBorder} ${panelBg} shadow-sm backdrop-blur-md`}
      >
        <div
          className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-emerald-500/[0.14] blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-teal-500/[0.1] blur-3xl"
          aria-hidden
        />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              {hasActiveUrlFilters ? (
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${
                    theme === "dark"
                      ? "border-slate-600 text-slate-400"
                      : "border-slate-200 text-slate-600"
                  }`}
                >
                  Filters active
                </span>
              ) : null}
            </div>
            <h1
              className={`mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl ${headingPage(
                theme,
              )}`}
            >
              Crack Interviews with Real Questions, Not Guesswork.{" "}
            </h1>
            <p
              className={`mt-2 max-w-xl text-sm leading-relaxed sm:text-[15px] ${
                theme === "dark" ? "text-slate-400" : "text-slate-600"
              }`}
            >
              See what companies actually ask, learn proven patterns, and walk
              into interviews prepared.
            </p>
          </div>
          <div className="w-full shrink-0 lg:max-w-sm">
            <label className="sr-only" htmlFor="feed-search">
              Search feed
            </label>
            <div className="relative">
              <HiSearch
                className={`pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 ${
                  theme === "dark" ? "text-slate-500" : "text-slate-400"
                }`}
                aria-hidden
              />
              <input
                id="feed-search"
                type="search"
                value={draftSearch}
                onChange={(e) => setDraftSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    commitSearchNow();
                  }
                }}
                placeholder="Search companies, roles, or interview questions..."
                className={`${inputCls(theme)} !border-slate-200/90 !py-2.5 !pl-10 dark:!border-slate-600`}
              />
            </div>
          </div>
        </div>
      </header>
    );
  }, [theme, hasActiveUrlFilters, draftSearch, commitSearchNow]);

  const shell = (innerMain) => (
    <div className={`min-h-screen pt-20 pb-16 ${pageBg(theme)}`}>
      <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-8 px-4 sm:px-6 lg:flex-row lg:items-start">
        {showFiltersSidebar && sidebar}
        <div className="min-w-0 flex-1">{innerMain}</div>
      </div>
    </div>
  );

  if (loading && experiences.length === 0 && !error) {
    return shell(
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <span className="loading loading-spinner loading-lg text-emerald-500" />
        <p className="text-sm text-slate-500">Loading feed…</p>
      </div>,
    );
  }

  if (error) {
    return shell(
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p
          className={`max-w-md text-lg font-semibold ${
            theme === "dark" ? "text-slate-200" : "text-slate-800"
          }`}
        >
          {error}
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className={`mt-6 ${linkButton}`}
        >
          Reload page
        </button>
      </div>,
    );
  }

  return shell(
    <>
      {mainHeader}

      {!experiences || experiences.length === 0 ? (
        <div
          className={`rounded-2xl p-8 text-center sm:p-10 ${panelEmpty(theme)}`}
        >
          <div
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            aria-hidden
          >
            <HiCollection className="h-7 w-7" />
          </div>
          <p
            className={`mt-6 text-base font-semibold sm:text-lg ${headingPage(theme)}`}
          >
            {hasActiveUrlFilters
              ? "Nothing matches these filters."
              : "Nothing here yet."}
          </p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-500">
            {hasActiveUrlFilters
              ? "Try removing a filter or broadening search."
              : "New interview breakdowns land here as candidates add them. Be the first to help others crack interviews faster."}
          </p>
          <Button
            theme={theme}
            variant="primary"
            className="mt-8"
            onClick={() => navigate("/share")}
          >
            Add Interview
          </Button>
        </div>
      ) : (
        <>
          {loading && experiences.length > 0 && (
            <p className="mb-4 text-center text-sm text-slate-500">
              Updating results…
            </p>
          )}
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-4">
            {experiences.map((exp) => (
              <ExperienceCard
                key={exp._id}
                exp={exp}
                theme={theme}
                layout="feed"
                onOpen={() => navigate(`/experience/${exp._id}`)}
              />
            ))}
          </div>
        </>
      )}
    </>,
  );
};

export default ExperienceFeed;
