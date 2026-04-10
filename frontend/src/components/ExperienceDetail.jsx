import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { HiThumbUp, HiThumbDown, HiPencil, HiTrash } from "react-icons/hi";
import toast from "react-hot-toast";
import { EXPERIENCES_API } from "../config/api";
import { Button } from "./ui/Button";
import {
  pageBg,
  panel,
  panelMuted,
  headingPage,
  inputCls,
  primaryButton,
  accentBadge,
} from "../theme/ui";
import { useTheme } from "../context/ThemeContext";

function idIncluded(list, uid) {
  if (!uid || !list?.length) return false;
  const s = String(uid);
  return list.some((x) => String(x) === s);
}

function Section({ theme, title, children, className = "" }) {
  return (
    <section
      className={`rounded-2xl p-4 sm:p-5 ${panel(theme)} ${className}`.trim()}
    >
      <h3
        className={`text-sm font-semibold uppercase tracking-wide text-slate-500 mb-3`}
      >
        {title}
      </h3>
      {children}
    </section>
  );
}

function roundAnchorId(idx) {
  return `experience-round-${idx}`;
}

function ImageStrip({ theme, urls }) {
  if (!urls?.length) return null;
  return (
    <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
      {urls.map((src, idx) => (
        <a
          key={`${src}-${idx}`}
          href={src}
          target="_blank"
          rel="noreferrer"
          className={`group overflow-hidden rounded-xl border ${
            theme === "dark"
              ? "border-slate-700 bg-slate-950"
              : "border-slate-200 bg-white"
          }`}
        >
          <img
            src={src}
            alt=""
            loading="lazy"
            className="h-28 w-full object-cover transition-transform group-hover:scale-[1.02]"
          />
        </a>
      ))}
    </div>
  );
}

const ExperienceDetail = () => {
  const { theme } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [experience, setExperience] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [helpful, setHelpful] = useState([]);
  const [notHelpful, setNotHelpful] = useState([]);
  const [discussion, setDiscussion] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [deleting, setDeleting] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userId = user?.id ?? user?._id;

  useEffect(() => {
    let cancelled = false;
    const idStr = id != null ? String(id) : "";

    const fetchData = async () => {
      setError(null);
      setLoading(true);
      const params = userId ? { viewerId: userId } : {};
      try {
        const expRes = await axios.get(`${EXPERIENCES_API}/${idStr}`, {
          params,
        });
        if (cancelled) return;
        setExperience(expRes.data);
        setHelpful(expRes.data.helpful || []);
        setNotHelpful(expRes.data.notHelpful || []);
        setDiscussion(expRes.data.discussion || []);

        try {
          const allRes = await axios.get(EXPERIENCES_API);
          if (cancelled) return;
          const list = Array.isArray(allRes.data) ? allRes.data : [];
          setRelated(list.filter((ex) => String(ex._id) !== idStr).slice(0, 8));
        } catch {
          if (!cancelled) setRelated([]);
        }
      } catch (err) {
        if (cancelled) return;
        if (err.response?.status === 403) {
          setError(
            "This experience is private. Only the candidate can open it.",
          );
        } else if (err.response?.status === 404) {
          setError("Experience not found.");
        } else {
          setError("We could not load this experience.");
        }
        setExperience(null);
        setHelpful([]);
        setNotHelpful([]);
        setDiscussion([]);
        setRelated([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (!idStr) {
      setLoading(false);
      setError("Experience not found.");
      return () => {
        cancelled = true;
      };
    }

    fetchData();
    window.scrollTo(0, 0);
    return () => {
      cancelled = true;
    };
  }, [id, userId]);

  const handleReaction = async (kind) => {
    if (!user) {
      toast.error("Sign in to mark experiences as helpful.");
      return;
    }

    try {
      const path = kind === "helpful" ? "helpful" : "not-helpful";
      const res = await axios.patch(`${EXPERIENCES_API}/${id}/${path}`, {
        userId,
      });
      setHelpful(res.data.helpful || []);
      setNotHelpful(res.data.notHelpful || []);
    } catch {
      toast.error("Could not update your reaction.");
    }
  };

  const handleAddDiscussion = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Sign in to join the discussion.");
    if (!newMessage.trim()) return;

    try {
      const res = await axios.post(`${EXPERIENCES_API}/${id}/discussion`, {
        userId,
        userName: user.name,
        text: newMessage,
      });
      setDiscussion(res.data);
      setNewMessage("");
      toast.success("Posted to discussion.");
    } catch {
      toast.error("Could not post message.");
    }
  };

  const handleDeleteExperience = async () => {
    if (!userId || !id) return;
    if (
      !window.confirm(
        "Delete this experience permanently? This cannot be undone.",
      )
    ) {
      return;
    }
    try {
      setDeleting(true);
      await axios.delete(
        `${EXPERIENCES_API}/delete/${encodeURIComponent(String(id).trim())}`,
        {
          params: { userId },
        },
      );
      toast.success("Experience deleted.");
      navigate("/my-experiences");
    } catch {
      toast.error("Could not delete experience.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div
        className={`flex min-h-screen items-center justify-center pt-20 ${pageBg(theme)}`}
      >
        <span className="loading loading-spinner loading-lg text-emerald-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`flex min-h-screen flex-col items-center justify-center gap-4 px-4 pt-20 text-center ${pageBg(
          theme,
        )}`}
      >
        <p
          className={`max-w-md text-lg font-medium ${
            theme === "dark" ? "text-slate-200" : "text-slate-800"
          }`}
        >
          {error}
        </p>
        <Button theme={theme} variant="secondary" onClick={() => navigate("/")}>
          Back to feed
        </Button>
      </div>
    );
  }

  if (!experience) return null;

  const ownerIdStr =
    experience.candidateId != null ? String(experience.candidateId) : "";
  const isOwner = Boolean(
    userId && ownerIdStr && String(userId) === ownerIdStr,
  );

  const videoSrc = experience.videoUrl;
  const viewerKey = userId;
  const markedHelpful = idIncluded(helpful, viewerKey);
  const markedNotHelpful = idIncluded(notHelpful, viewerKey);
  const company = experience.company?.trim() || "Company not listed";
  const role = experience.role?.trim() || "";

  return (
    <div className={`min-h-screen pt-20 pb-14 px-4 sm:px-6 ${pageBg(theme)}`}>
      <div className="mx-auto max-w-7xl">
        <button
          type="button"
          onClick={() => navigate("/")}
          className={`mb-6 text-sm font-medium text-emerald-500 hover:text-emerald-400`}
        >
          ← Back to Feed
        </button>

        <header className={`mb-6 rounded-2xl p-4 sm:p-5 ${panel(theme)}`}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1">
              <p
                className={`text-xl font-semibold tracking-tight sm:text-2xl ${headingPage(theme)}`}
              >
                {company}
              </p>
              {role && (
                <p
                  className={`mt-1 text-base ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}
                >
                  {role}
                </p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {experience.experienceLevel && (
                  <span className={accentBadge(theme)}>
                    {experience.experienceLevel}
                  </span>
                )}
                <span
                  className={`text-xs font-medium ${
                    theme === "dark" ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  {Number(experience.interviewRounds) >= 0
                    ? `${experience.interviewRounds} interview round${
                        Number(experience.interviewRounds) === 1 ? "" : "s"
                      }`
                    : null}
                </span>
              </div>
              <h1
                className={`mt-3 text-lg font-semibold leading-snug sm:text-xl ${headingPage(theme)}`}
              >
                {experience.title}
              </h1>
              <p
                className={`mt-2 text-sm ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}
              >
                <span className="font-medium text-slate-500">Candidate:</span>{" "}
                {experience.candidate || "Anonymous"}
              </p>
            </div>

            <div className="flex flex-shrink-0 flex-col gap-2 sm:flex-row lg:flex-col">
              <div
                className={`flex overflow-hidden rounded-xl border sm:inline-flex ${
                  theme === "dark" ? "border-slate-600/60" : "border-slate-200"
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleReaction("helpful")}
                  className={`flex items-center gap-2 border-r px-4 py-2.5 text-sm font-medium transition-colors ${
                    theme === "dark"
                      ? "border-slate-600/60"
                      : "border-slate-200"
                  } ${
                    markedHelpful
                      ? "bg-emerald-600/20 text-emerald-400"
                      : theme === "dark"
                        ? "text-slate-300 hover:bg-slate-800"
                        : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <HiThumbUp className="text-lg" />
                  {helpful.length} helpful
                </button>
                <button
                  type="button"
                  onClick={() => handleReaction("not")}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                    markedNotHelpful
                      ? theme === "dark"
                        ? "bg-slate-700/50 text-slate-200"
                        : "bg-slate-200 text-slate-800"
                      : theme === "dark"
                        ? "text-slate-300 hover:bg-slate-800"
                        : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <HiThumbDown className="text-lg" />
                  {notHelpful.length} not helpful
                </button>
              </div>
              {isOwner && (
                <div className="flex flex-wrap gap-2">
                  <Button
                    theme={theme}
                    variant="secondary"
                    type="button"
                    className="!gap-2"
                    onClick={() => navigate(`/experience/${id}/edit`)}
                  >
                    <HiPencil className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    theme={theme}
                    variant="secondary"
                    type="button"
                    disabled={deleting}
                    className={`!gap-2 ${
                      theme === "dark"
                        ? "!border-red-500/40 !text-red-300 hover:!bg-red-950/30"
                        : "!border-red-200 !text-red-700 hover:!bg-red-50"
                    }`}
                    onClick={handleDeleteExperience}
                  >
                    <HiTrash className="h-4 w-4" />
                    {deleting ? "Deleting…" : "Delete"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2 lg:order-1">
            <Section theme={theme} title="Summary">
              <p
                className={`text-sm leading-relaxed ${
                  theme === "dark" ? "text-slate-300" : "text-slate-700"
                }`}
              >
                {experience.description ||
                  "No summary provided for this experience."}
              </p>
            </Section>
            <Section
              theme={theme}
              title={
                experience.interviewRoundDetails?.length
                  ? "Interview rounds"
                  : "Questions discussed"
              }
            >
              {experience.interviewRoundDetails?.length ? (
                <>
                  <div
                    className={`mb-4 rounded-xl border p-3 lg:hidden ${
                      theme === "dark"
                        ? "border-slate-700 bg-slate-900/30"
                        : "border-slate-200 bg-slate-50/90"
                    }`}
                  ></div>
                  <div className="space-y-5">
                    {experience.interviewRoundDetails.map((round, idx) => {
                      const lines = String(round.questionsText || "")
                        .split(/\r?\n/)
                        .map((s) => s.trim())
                        .filter(Boolean);
                      return (
                        <div
                          key={idx}
                          id={roundAnchorId(idx)}
                          className={`scroll-mt-28 overflow-hidden rounded-xl border text-sm ${
                            theme === "dark"
                              ? "border-slate-700 bg-slate-900/35"
                              : "border-slate-200 bg-white"
                          }`}
                        >
                          <div
                            className={`flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 ${
                              theme === "dark"
                                ? "bg-emerald-950/35"
                                : "bg-emerald-50/90"
                            }`}
                          >
                            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                              Round {String(idx + 1).padStart(2, "0")}
                              {round.name ? ` · ${round.name}` : ""}
                            </span>
                          </div>
                          <div className="space-y-3 p-4">
                            {lines.length ? (
                              <div>
                                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                  Questions asked
                                </p>
                                <ol className="list-decimal space-y-2 pl-4">
                                  {lines.map((q, i) => (
                                    <li
                                      key={i}
                                      className={
                                        theme === "dark"
                                          ? "text-slate-300"
                                          : "text-slate-700"
                                      }
                                    >
                                      {q}
                                    </li>
                                  ))}
                                </ol>
                              </div>
                            ) : (
                              <p className="text-slate-500">
                                No questions listed for this round.
                              </p>
                            )}
                            {round.notes?.trim() ? (
                              <div
                                className={`rounded-lg border p-3 text-sm ${
                                  theme === "dark"
                                    ? "border-slate-700 bg-slate-950/50 text-slate-300"
                                    : "border-slate-200 bg-slate-50 text-slate-700"
                                }`}
                              >
                                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                  Notes &amp; strategies
                                </p>
                                <p className="whitespace-pre-wrap leading-relaxed">
                                  {round.notes}
                                </p>
                              </div>
                            ) : null}
                            {round.preparationTips?.trim() ? (
                              <div
                                className={`rounded-lg border p-3 text-sm ${
                                  theme === "dark"
                                    ? "border-emerald-500/20 bg-emerald-950/25 text-slate-300"
                                    : "border-emerald-200/80 bg-emerald-50/50 text-slate-700"
                                }`}
                              >
                                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                  Preparation tips
                                </p>
                                <p className="whitespace-pre-wrap leading-relaxed">
                                  {round.preparationTips}
                                </p>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : experience.questions?.length ? (
                <ol className="list-decimal space-y-2 pl-4 text-sm">
                  {experience.questions.map((q, i) => (
                    <li
                      key={`${i}-${q.slice(0, 20)}`}
                      className={
                        theme === "dark" ? "text-slate-300" : "text-slate-700"
                      }
                    >
                      {q}
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm text-slate-500">No questions listed.</p>
              )}

              {experience.questionsNotes?.trim() ? (
                <div
                  className={`mt-4 rounded-xl border p-3 text-sm ${
                    theme === "dark"
                      ? "border-slate-700 bg-slate-900/40 text-slate-300"
                      : "border-slate-200 bg-slate-50 text-slate-700"
                  }`}
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">
                    Notes
                  </p>
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {experience.questionsNotes}
                  </p>
                  <ImageStrip
                    theme={theme}
                    urls={experience.questionsNotesImages}
                  />
                </div>
              ) : null}
            </Section>

            <Section theme={theme} title="Tips">
              <p
                className={`whitespace-pre-wrap text-sm leading-relaxed ${
                  theme === "dark" ? "text-slate-300" : "text-slate-700"
                }`}
              >
                {experience.tips?.trim()
                  ? experience.tips
                  : experience.tipsNotes?.trim()
                    ? "See the yellow tips note in the sidebar for links and extras."
                    : "No tips added."}
              </p>
            </Section>

            <section className={`rounded-2xl p-4 sm:p-5 ${panel(theme)}`}>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-1">
                Discussion
                <span className="ml-2 font-normal normal-case text-slate-500">
                  ({discussion.length})
                </span>
              </h3>
              <p className="text-xs text-slate-500 mb-5">
                Ask follow-ups or add context for others reading this
                experience.
              </p>

              <form
                onSubmit={handleAddDiscussion}
                className="flex flex-col gap-3 sm:flex-row sm:items-center"
              >
                <input
                  type="text"
                  placeholder="Write a reply…"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className={`flex-1 ${inputCls(theme)}`}
                />
                <button type="submit" className={`${primaryButton} shrink-0`}>
                  Post
                </button>
              </form>

              <ul className="mt-8 space-y-6">
                {discussion.map((entry, index) => (
                  <li
                    key={entry._id || index}
                    className={`border-t pt-5 first:border-t-0 first:pt-0 ${
                      theme === "dark" ? "border-slate-700" : "border-slate-200"
                    }`}
                  >
                    <div className="flex gap-3">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                          theme === "dark"
                            ? "bg-slate-700 text-slate-200"
                            : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {entry.userName?.[0]?.toUpperCase() || "?"}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-baseline gap-2">
                          <span
                            className={`text-sm font-semibold ${headingPage(theme)}`}
                          >
                            {entry.userName}
                          </span>
                          <span className="text-xs text-slate-500">
                            {entry.createdAt
                              ? new Date(entry.createdAt).toLocaleDateString()
                              : ""}
                          </span>
                        </div>
                        <p
                          className={`mt-1 text-sm leading-relaxed ${
                            theme === "dark"
                              ? "text-slate-300"
                              : "text-slate-700"
                          }`}
                        >
                          {entry.text}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="space-y-6 lg:order-2">
            <div className={`rounded-2xl p-4 ${panelMuted(theme)}`}>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">
                Experience recording
              </h3>
              <div
                className={`overflow-hidden rounded-xl border ${
                  theme === "dark"
                    ? "border-slate-700 bg-black"
                    : "border-slate-200 bg-slate-900"
                }`}
              >
                {videoSrc ? (
                  <video
                    key={videoSrc}
                    className="max-h-[220px] w-full object-contain"
                    controls
                    playsInline
                  >
                    <source src={videoSrc} type="video/mp4" />
                  </video>
                ) : (
                  <div className="flex min-h-[120px] items-center justify-center px-4 py-8 text-center text-sm text-slate-500">
                    No recording attached (legacy entry may need an update).
                  </div>
                )}
              </div>
            </div>

            {experience.tipsNotes?.trim() ? (
              <div
                className="relative rotate-[0.2deg] rounded-sm border-2 border-amber-300/90 bg-amber-50 px-4 py-4 shadow-md ring-1 ring-amber-200/80 dark:border-amber-700/80 dark:bg-amber-950/40 dark:ring-amber-900/50"
                style={{
                  boxShadow: "4px 5px 0 rgba(180, 140, 40, 0.12)",
                }}
              >
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-800/90 dark:text-amber-400/90">
                  Tips note
                </p>
                <p
                  className={`mt-2 whitespace-pre-wrap text-[13px] leading-relaxed text-amber-950 dark:text-amber-100/95`}
                >
                  {experience.tipsNotes}
                </p>
              </div>
            ) : null}

            <div className={`rounded-2xl p-4 ${panel(theme)}`}>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-4">
                Related experiences
              </h3>
              {related.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No other public experiences right now.
                </p>
              ) : (
                <ul className="space-y-3">
                  {related.map((item) => (
                    <li key={item._id}>
                      <button
                        type="button"
                        onClick={() => navigate(`/experience/${item._id}`)}
                        className={`w-full rounded-xl border px-3 py-2.5 text-left text-sm transition-colors ${
                          theme === "dark"
                            ? "border-slate-700 hover:border-emerald-500/30 hover:bg-slate-800/50"
                            : "border-slate-200 hover:border-emerald-200 hover:bg-slate-50"
                        }`}
                      >
                        <span
                          className={`block font-medium line-clamp-1 ${
                            theme === "dark"
                              ? "text-emerald-400"
                              : "text-emerald-700"
                          }`}
                        >
                          {item.company || "Experience"}
                        </span>
                        <span
                          className={`mt-0.5 block text-xs line-clamp-2 ${
                            theme === "dark"
                              ? "text-slate-400"
                              : "text-slate-600"
                          }`}
                        >
                          {item.title}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ExperienceDetail;
