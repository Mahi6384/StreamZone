import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { HiPencil, HiTrash } from "react-icons/hi";
import { EXPERIENCES_API } from "../config/api";
import ExperienceCard from "../components/ExperienceCard";
import { Button } from "../components/ui/Button";
import { pageBg, panelEmpty, headingPage, linkButton } from "../theme/ui";
import { useTheme } from "../context/ThemeContext";

const MyExperiences = () => {
  const { theme } = useTheme();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userId = user?.id ?? user?._id;

  useEffect(() => {
    if (!userId) {
      navigate("/", { replace: true });
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`${EXPERIENCES_API}/user/${userId}`);
        if (!cancelled) setExperiences(res.data);
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError("We could not load your experiences. Try again in a moment.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();

    return () => {
      cancelled = true;
    };
  }, [userId, navigate]);

  const handleDeleteCard = async (expId) => {
    if (!userId) return;
    if (
      !window.confirm(
        "Delete this experience permanently? This cannot be undone.",
      )
    ) {
      return;
    }
    try {
      setDeletingId(expId);
      await axios.delete(
        `${EXPERIENCES_API}/delete/${encodeURIComponent(String(expId).trim())}`,
        { params: { userId } },
      );
      setExperiences((prev) =>
        prev.filter((e) => String(e._id) !== String(expId)),
      );
      toast.success("Experience deleted.");
    } catch {
      toast.error("Could not delete experience.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className={`flex min-h-screen flex-col items-center justify-center pt-20 ${pageBg(theme)}`}>
        <span className="loading loading-spinner loading-lg text-emerald-500" />
        <p className="mt-4 text-sm text-slate-500">Loading your library…</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-20 pb-14 px-4 sm:px-6 ${pageBg(theme)}`}>
      <Helmet>
        <title>My Experiences — InsightHire</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center sm:text-left">
          <h1 className={`text-xl font-bold tracking-tight sm:text-2xl ${headingPage(theme)}`}>
            My experiences
          </h1>
          <p
            className={`mt-2 max-w-xl text-sm leading-relaxed ${
              theme === "dark" ? "text-slate-300" : "text-slate-600"
            }`}
          >
            Everything you have shared — public entries appear on the feed; private ones stay here for
            your own tracking.
          </p>
        </div>

        {error && (
          <div
            className={`mb-8 rounded-2xl border px-4 py-3 text-sm ${
              theme === "dark"
                ? "border-amber-500/30 bg-amber-950/20 text-amber-200"
                : "border-amber-200 bg-amber-50 text-amber-900"
            }`}
          >
            {error}
          </div>
        )}

        {experiences.length === 0 ? (
          <div className={`mx-auto max-w-lg rounded-2xl p-6 text-center ${panelEmpty(theme)}`}>
            <p className={`text-base font-medium ${headingPage(theme)}`}>No experiences yet</p>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              When you document a loop — company, questions, tips — it shows up here. Start with one
              experience to build your personal archive.
            </p>
            <Button
              theme={theme}
              variant="primary"
              className="mt-8"
              onClick={() => navigate("/share")}
            >
              Add Interview
            </Button>
            <p className="mt-6 text-xs text-slate-500">
              Looking for community content?{" "}
              <button type="button" onClick={() => navigate("/")} className={linkButton}>
                Open the feed
              </button>
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {experiences.map((exp) => (
              <ExperienceCard
                key={exp._id}
                exp={exp}
                theme={theme}
                visibilityBadge={exp.visibility === "private" ? "private" : null}
                onOpen={() => navigate(`/experience/${exp._id}`)}
                footerActions={
                  <>
                    <Button
                      type="button"
                      theme={theme}
                      variant="secondary"
                      className="!gap-1.5 !py-1.5 !text-xs"
                      onClick={() => navigate(`/experience/${exp._id}/edit`)}
                    >
                      <HiPencil className="h-3.5 w-3.5" />
                      Edit
                    </Button>
                    <Button
                      type="button"
                      theme={theme}
                      variant="secondary"
                      disabled={deletingId === exp._id}
                      className={`!gap-1.5 !py-1.5 !text-xs ${
                        theme === "dark"
                          ? "!border-red-500/40 !text-red-300"
                          : "!border-red-200 !text-red-700"
                      }`}
                      onClick={() => handleDeleteCard(exp._id)}
                    >
                      <HiTrash className="h-3.5 w-3.5" />
                      {deletingId === exp._id ? "Deleting…" : "Delete"}
                    </Button>
                  </>
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyExperiences;
