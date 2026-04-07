import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { HiX } from "react-icons/hi";
import { EXPERIENCES_API } from "../config/api";
import ExperienceCard from "./ExperienceCard";
import { Button } from "./ui/Button";
import {
  pageBg,
  panel,
  panelEmpty,
  labelCls,
  inputCls,
  headingPage,
  subheading,
  linkButton,
} from "../theme/ui";

const EXPERIENCE_LEVELS = ["Intern", "SDE1", "SDE2", "SDE3", "Senior", "Staff", "Other"];

const PRESET_COMPANIES = [
  "Google",
  "Meta",
  "Amazon",
  "Microsoft",
  "Apple",
  "Netflix",
  "Stripe",
  "Uber",
  "Airbnb",
  "LinkedIn",
  "Adobe",
  "Oracle",
];

const PRESET_ROLES = [
  "Software Engineer",
  "Backend Engineer",
  "Frontend Engineer",
  "Full Stack Engineer",
  "ML Engineer",
  "Data Engineer",
  "DevOps Engineer",
  "SRE",
  "Mobile Engineer",
  "Product Engineer",
  "Security Engineer",
  "Engineering Manager",
];

function toggleInList(list, item) {
  if (list.includes(item)) return list.filter((x) => x !== item);
  return [...list, item];
}

function buildFilterQuery(params) {
  const p = new URLSearchParams();
  params.companies.forEach((c) => p.append("companies", c));
  params.roles.forEach((r) => p.append("roles", r));
  params.levels.forEach((l) => p.append("experienceLevels", l));
  return p.toString();
}

function FilterSection({ theme, title, children }) {
  return (
    <div
      className={`border-t pt-4 first:border-t-0 first:pt-0 ${
        theme === "dark" ? "border-slate-700" : "border-slate-200"
      }`}
    >
      <h3 className={`${labelCls} mb-3`}>{title}</h3>
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
  const theme = localStorage.getItem("theme") || "dark";

  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const [draftCompanies, setDraftCompanies] = useState([]);
  const [draftRoles, setDraftRoles] = useState([]);
  const [draftLevels, setDraftLevels] = useState([]);
  const [customCompany, setCustomCompany] = useState("");
  const [customRole, setCustomRole] = useState("");

  useEffect(() => {
    const sp = new URLSearchParams(location.search);
    setDraftCompanies(sp.getAll("companies"));
    setDraftRoles(sp.getAll("roles"));
    setDraftLevels(sp.getAll("experienceLevels"));
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
        setError("We could not load the experience feed. Check your connection and try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchExperiences();
  }, [fetchUrl]);

  const applyFilters = useCallback(
    (e) => {
      e?.preventDefault();
      const qs = buildFilterQuery({
        companies: draftCompanies,
        roles: draftRoles,
        levels: draftLevels,
      });
      navigate(qs ? `/?${qs}` : "/");
    },
    [draftCompanies, draftRoles, draftLevels, navigate]
  );

  const clearFilters = useCallback(() => {
    setDraftCompanies([]);
    setDraftRoles([]);
    setDraftLevels([]);
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
    searchParams.getAll("experienceLevels").length > 0;

  const hasDraftSelection =
    draftCompanies.length > 0 || draftRoles.length > 0 || draftLevels.length > 0;

  const checkboxClass =
    "h-4 w-4 shrink-0 rounded border-slate-500 text-blue-600 focus:ring-blue-500/40";

  const sidebar = (
    <aside
      className={`w-full shrink-0 lg:w-72 xl:w-80 lg:sticky lg:top-24 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto ${panel(
        theme
      )} rounded-xl p-4 sm:p-5`}
    >
      <div className="mb-4 flex items-start justify-between gap-2">
        <div>
          <h2 className={`text-sm font-semibold ${headingPage(theme)}`}>Filters</h2>
          <p className="mt-1 text-xs leading-snug text-slate-500">
            Select one or more companies, roles, and levels. Add custom names below the lists.
          </p>
        </div>
        {hasDraftSelection && (
          <button type="button" onClick={clearFilters} className={`${linkButton} text-xs`}>
            Clear all
          </button>
        )}
      </div>

      <form onSubmit={applyFilters} className="flex flex-col gap-0">
        <FilterSection theme={theme} title="Companies">
          <div className="mb-3 flex max-h-40 flex-col gap-2 overflow-y-auto pr-1">
            {PRESET_COMPANIES.map((name) => (
              <label
                key={name}
                className={`flex cursor-pointer items-center gap-2 text-sm ${
                  theme === "dark" ? "text-slate-300" : "text-slate-700"
                }`}
              >
                <input
                  type="checkbox"
                  className={checkboxClass}
                  checked={draftCompanies.includes(name)}
                  onChange={() => setDraftCompanies((prev) => toggleInList(prev, name))}
                />
                {name}
              </label>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={customCompany}
              onChange={(e) => setCustomCompany(e.target.value)}
              placeholder="Custom company"
              className={`${inputCls(theme)} !py-2 text-sm`}
              aria-label="Custom company name"
            />
            <Button theme={theme} variant="secondary" type="button" onClick={addCustomCompany} className="!px-3 !py-2 text-xs">
              Add
            </Button>
          </div>
          {draftCompanies.filter((c) => !PRESET_COMPANIES.includes(c)).length > 0 && (
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
                    {c}
                    <button
                      type="button"
                      className="rounded p-0.5 hover:bg-slate-600/30"
                      onClick={() => setDraftCompanies((prev) => prev.filter((x) => x !== c))}
                      aria-label={`Remove ${c}`}
                    >
                      <HiX className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
            </ul>
          )}
        </FilterSection>

        <FilterSection theme={theme} title="Roles">
          <div className="mb-3 flex max-h-40 flex-col gap-2 overflow-y-auto pr-1">
            {PRESET_ROLES.map((name) => (
              <label
                key={name}
                className={`flex cursor-pointer items-center gap-2 text-sm ${
                  theme === "dark" ? "text-slate-300" : "text-slate-700"
                }`}
              >
                <input
                  type="checkbox"
                  className={checkboxClass}
                  checked={draftRoles.includes(name)}
                  onChange={() => setDraftRoles((prev) => toggleInList(prev, name))}
                />
                {name}
              </label>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={customRole}
              onChange={(e) => setCustomRole(e.target.value)}
              placeholder="Custom role"
              className={`${inputCls(theme)} !py-2 text-sm`}
              aria-label="Custom role"
            />
            <Button theme={theme} variant="secondary" type="button" onClick={addCustomRole} className="!px-3 !py-2 text-xs">
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
                    {r}
                    <button
                      type="button"
                      className="rounded p-0.5 hover:bg-slate-600/30"
                      onClick={() => setDraftRoles((prev) => prev.filter((x) => x !== r))}
                      aria-label={`Remove ${r}`}
                    >
                      <HiX className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
            </ul>
          )}
        </FilterSection>

        <FilterSection theme={theme} title="Experience level">
          <div className="flex flex-col gap-2">
            {EXPERIENCE_LEVELS.map((lvl) => (
              <label
                key={lvl}
                className={`flex cursor-pointer items-center gap-2 text-sm ${
                  theme === "dark" ? "text-slate-300" : "text-slate-700"
                }`}
              >
                <input
                  type="checkbox"
                  className={checkboxClass}
                  checked={draftLevels.includes(lvl)}
                  onChange={() => setDraftLevels((prev) => toggleInList(prev, lvl))}
                />
                {lvl}
              </label>
            ))}
          </div>
        </FilterSection>

        <div className="mt-5 flex flex-col gap-2 border-t pt-4 sm:flex-row sm:gap-2">
          <Button theme={theme} variant="primary" type="submit" className="flex-1">
            Apply filters
          </Button>
          <Button theme={theme} variant="secondary" type="button" onClick={clearFilters} className="flex-1">
            Reset
          </Button>
        </div>
      </form>
    </aside>
  );

  const mainHeader = (
    <header className="mb-8">
      <h1 className={`text-2xl font-semibold tracking-tight sm:text-3xl ${headingPage(theme)}`}>
        Experience feed
      </h1>
      <p className={`mt-2 max-w-2xl ${subheading}`}>
        Structured interview write-ups from candidates. Use the filters on the left to narrow by
        company, role, and level.
      </p>
    </header>
  );

  if (loading && experiences.length === 0 && !error) {
    return (
      <div className={`min-h-screen pt-24 pb-14 ${pageBg(theme)}`}>
        <div className="mx-auto flex max-w-[1600px] flex-col gap-6 px-4 lg:flex-row lg:px-6">
          {sidebar}
          <div className="flex min-h-[50vh] flex-1 flex-col items-center justify-center gap-4">
            <span className="loading loading-spinner loading-lg text-blue-500" />
            <p className="text-sm text-slate-500">Loading experiences…</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen pt-24 pb-14 px-4 ${pageBg(theme)}`}>
        <div className="mx-auto flex max-w-[1600px] flex-col gap-6 lg:flex-row lg:px-2">
          {sidebar}
          <div className="flex flex-1 flex-col items-center justify-center py-20 text-center">
            <p
              className={`font-semibold text-lg max-w-md ${
                theme === "dark" ? "text-slate-200" : "text-slate-800"
              }`}
            >
              {error}
            </p>
            <button type="button" onClick={() => window.location.reload()} className={`mt-6 ${linkButton}`}>
              Reload page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-24 pb-14 ${pageBg(theme)}`}>
      <div className="mx-auto flex max-w-[1600px] flex-col gap-6 px-4 lg:flex-row lg:items-start lg:gap-8 lg:px-6">
        {sidebar}

        <main className="min-w-0 flex-1">
          {mainHeader}

          {!experiences || experiences.length === 0 ? (
            <div className={`rounded-xl p-10 text-center ${panelEmpty(theme)}`}>
              <p className={`text-lg font-medium ${headingPage(theme)}`}>
                {hasActiveUrlFilters ? "No experiences match these filters." : "The feed is empty for now."}
              </p>
              <p className="mt-3 mx-auto max-w-md text-sm leading-relaxed text-slate-500">
                {hasActiveUrlFilters
                  ? "Try removing a company or role, or add a custom filter that matches how people labeled their experience."
                  : "When candidates share experiences, they will appear here. Share yours to help others prepare."}
              </p>
              <button type="button" onClick={() => navigate("/share")} className={`mt-6 ${linkButton}`}>
                Share an experience →
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {loading && experiences.length > 0 && (
                <p className="text-center text-sm text-slate-500">Updating results…</p>
              )}
              {experiences.map((exp) => (
                <ExperienceCard
                  key={exp._id}
                  exp={exp}
                  theme={theme}
                  onOpen={() => navigate(`/experience/${exp._id}`)}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ExperienceFeed;
