import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { HiThumbUp, HiThumbDown } from "react-icons/hi";
import toast from "react-hot-toast";
import { EXPERIENCES_API } from "../config/api";
import { Button } from "./ui/Button";
import { pageBg, panel, panelMuted, headingPage, inputCls, primaryButton } from "../theme/ui";

function idIncluded(list, uid) {
  if (!uid || !list?.length) return false;
  const s = String(uid);
  return list.some((x) => String(x) === s);
}

function Section({ theme, title, children, className = "" }) {
  return (
    <section className={`rounded-xl p-5 ${panel(theme)} ${className}`.trim()}>
      <h3 className={`text-sm font-semibold uppercase tracking-wide text-slate-500 mb-3`}>
        {title}
      </h3>
      {children}
    </section>
  );
}

const ExperienceDetail = () => {
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
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userId = user?.id ?? user?._id;
  const theme = localStorage.getItem("theme") || "dark";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params = userId ? { viewerId: userId } : {};
        const expRes = await axios.get(`${EXPERIENCES_API}/${id}`, { params });
        setExperience(expRes.data);
        setHelpful(expRes.data.helpful || []);
        setNotHelpful(expRes.data.notHelpful || []);
        setDiscussion(expRes.data.discussion || []);

        const allRes = await axios.get(EXPERIENCES_API);
        setRelated(allRes.data.filter((ex) => ex._id !== id).slice(0, 8));
      } catch (err) {
        if (err.response?.status === 403) {
          setError("This experience is private. Only the candidate can open it.");
        } else if (err.response?.status === 404) {
          setError("Experience not found.");
        } else {
          setError("We could not load this experience.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
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

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${pageBg(theme)}`}>
        <span className="loading loading-spinner loading-lg text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center ${pageBg(
          theme
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

  const videoSrc = experience.videoUrl;
  const viewerKey = userId;
  const markedHelpful = idIncluded(helpful, viewerKey);
  const markedNotHelpful = idIncluded(notHelpful, viewerKey);
  const company = experience.company?.trim() || "Company not listed";
  const role = experience.role?.trim() || "";

  return (
    <div className={`min-h-screen pt-24 pb-14 px-4 sm:px-8 ${pageBg(theme)}`}>
      <div className="max-w-6xl mx-auto">
        <button
          type="button"
          onClick={() => navigate("/")}
          className={`mb-6 text-sm font-medium text-blue-500 hover:text-blue-400`}
        >
          ← Experience feed
        </button>

        <header className={`mb-8 rounded-xl p-6 sm:p-8 ${panel(theme)}`}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1">
              <p className={`text-2xl font-semibold tracking-tight sm:text-3xl ${headingPage(theme)}`}>
                {company}
              </p>
              {role && (
                <p className={`mt-1 text-base ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                  {role}
                </p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {experience.experienceLevel && (
                  <span
                    className={`inline-flex rounded-md border px-2 py-0.5 text-xs font-medium ${
                      theme === "dark"
                        ? "border-blue-500/30 bg-blue-950/50 text-blue-300"
                        : "border-blue-200 bg-blue-50 text-blue-800"
                    }`}
                  >
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
                className={`mt-4 text-xl font-semibold leading-snug sm:text-2xl ${headingPage(theme)}`}
              >
                {experience.title}
              </h1>
              <p className={`mt-2 text-sm ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                <span className="font-medium text-slate-500">Candidate:</span>{" "}
                {experience.candidate || "Anonymous"}
              </p>
            </div>

            <div className="flex flex-shrink-0 flex-col gap-2 sm:flex-row lg:flex-col">
              <div
                className={`flex overflow-hidden rounded-lg border sm:inline-flex ${
                  theme === "dark" ? "border-slate-600/60" : "border-slate-200"
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleReaction("helpful")}
                  className={`flex items-center gap-2 border-r px-4 py-2.5 text-sm font-medium transition-colors ${
                    theme === "dark" ? "border-slate-600/60" : "border-slate-200"
                  } ${
                    markedHelpful
                      ? "bg-blue-600/20 text-blue-400"
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
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2 lg:order-1">
            <Section theme={theme} title="Summary">
              <p
                className={`text-sm leading-relaxed ${
                  theme === "dark" ? "text-slate-300" : "text-slate-700"
                }`}
              >
                {experience.description || "No summary provided for this experience."}
              </p>
            </Section>

            <Section theme={theme} title="Interview details">
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-sm">
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Level
                  </dt>
                  <dd className={`mt-1 font-medium ${headingPage(theme)}`}>
                    {experience.experienceLevel || "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Rounds
                  </dt>
                  <dd className={`mt-1 font-medium ${headingPage(theme)}`}>
                    {experience.interviewRounds ?? "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Outcome
                  </dt>
                  <dd className={`mt-1 font-medium ${headingPage(theme)}`}>
                    {experience.outcome
                      ? experience.outcome === "selected"
                        ? "Selected"
                        : "Not selected"
                      : "—"}
                  </dd>
                </div>
              </dl>
            </Section>

            <Section theme={theme} title="Questions discussed">
              {experience.questions?.length ? (
                <ol className="list-decimal space-y-2 pl-4 text-sm">
                  {experience.questions.map((q, i) => (
                    <li
                      key={`${i}-${q.slice(0, 20)}`}
                      className={theme === "dark" ? "text-slate-300" : "text-slate-700"}
                    >
                      {q}
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm text-slate-500">No questions listed.</p>
              )}
            </Section>

            <Section theme={theme} title="Tips">
              <p
                className={`whitespace-pre-wrap text-sm leading-relaxed ${
                  theme === "dark" ? "text-slate-300" : "text-slate-700"
                }`}
              >
                {experience.tips || "No tips added."}
              </p>
            </Section>

            <section className={`rounded-xl p-5 ${panel(theme)}`}>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-1">
                Discussion
                <span className="ml-2 font-normal normal-case text-slate-500">({discussion.length})</span>
              </h3>
              <p className="text-xs text-slate-500 mb-5">
                Ask follow-ups or add context for others reading this experience.
              </p>

              <form onSubmit={handleAddDiscussion} className="flex flex-col gap-3 sm:flex-row sm:items-center">
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
                          theme === "dark" ? "bg-slate-700 text-slate-200" : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {entry.userName?.[0]?.toUpperCase() || "?"}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-baseline gap-2">
                          <span className={`text-sm font-semibold ${headingPage(theme)}`}>
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
                            theme === "dark" ? "text-slate-300" : "text-slate-700"
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
            <div className={`rounded-xl p-4 ${panelMuted(theme)} lg:sticky lg:top-24`}>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">
                Experience recording
              </h3>
              <div
                className={`overflow-hidden rounded-lg border ${
                  theme === "dark" ? "border-slate-700 bg-black" : "border-slate-200 bg-slate-900"
                }`}
              >
                {videoSrc ? (
                  <video key={videoSrc} className="max-h-[220px] w-full object-contain" controls playsInline>
                    <source src={videoSrc} type="video/mp4" />
                  </video>
                ) : (
                  <div className="flex min-h-[120px] items-center justify-center px-4 py-8 text-center text-sm text-slate-500">
                    No recording attached (legacy entry may need an update).
                  </div>
                )}
              </div>
            </div>

            <div className={`rounded-xl p-4 ${panel(theme)}`}>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-4">
                Related experiences
              </h3>
              {related.length === 0 ? (
                <p className="text-sm text-slate-500">No other public experiences right now.</p>
              ) : (
                <ul className="space-y-3">
                  {related.map((item) => (
                    <li key={item._id}>
                      <button
                        type="button"
                        onClick={() => navigate(`/experience/${item._id}`)}
                        className={`w-full rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${
                          theme === "dark"
                            ? "border-slate-700 hover:border-slate-600 hover:bg-slate-800/50"
                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <span
                          className={`block font-medium line-clamp-1 ${
                            theme === "dark" ? "text-blue-400" : "text-blue-700"
                          }`}
                        >
                          {item.company || "Experience"}
                        </span>
                        <span
                          className={`mt-0.5 block text-xs line-clamp-2 ${
                            theme === "dark" ? "text-slate-400" : "text-slate-600"
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
