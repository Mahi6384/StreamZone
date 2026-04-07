import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiDocumentAdd, HiCheckCircle } from "react-icons/hi";
import toast from "react-hot-toast";
import { EXPERIENCES_API } from "../config/api";
import { Button } from "../components/ui/Button";
import {
  pageBg,
  panel,
  labelCls,
  inputCls,
  selectCls,
  textareaCls,
  headingPage,
  subheading,
} from "../theme/ui";
import { useTheme } from "../context/ThemeContext";

const LEVELS = ["Intern", "SDE1", "SDE2", "SDE3", "Senior", "Staff", "Other"];

const ShareExperiencePage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("SDE1");
  const [interviewRounds, setInterviewRounds] = useState("3");
  const [questionsText, setQuestionsText] = useState("");
  const [tips, setTips] = useState("");
  const [outcome, setOutcome] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userId = user?.id ?? user?._id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to share an experience.");
      return;
    }

    const lines = questionsText
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (!lines.length) {
      toast.error("Add at least one question you were asked (one per line).");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("video", file);
    formData.append("candidate", user.name || "Anonymous");
    if (userId) formData.append("candidateId", userId);
    formData.append("visibility", visibility);
    formData.append("company", company);
    formData.append("role", role);
    formData.append("experienceLevel", experienceLevel);
    formData.append("interviewRounds", interviewRounds);
    formData.append("questions", JSON.stringify(lines));
    formData.append("tips", tips);
    if (outcome) formData.append("outcome", outcome);

    try {
      await axios.post(`${EXPERIENCES_API}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Your experience was published.");
      navigate("/");
    } catch (error) {
      console.error(error);
      const msg =
        error.response?.data?.error || "Could not publish your experience. Try again.";
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`min-h-screen pt-[4.75rem] pb-10 px-3 sm:px-5 ${pageBg(theme)}`}>
      <div className="mx-auto max-w-xl">
        <div className={`rounded-lg p-5 sm:p-6 ${panel(theme)}`}>
          <div className="mb-5 flex gap-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${
                theme === "dark"
                  ? "border-blue-500/30 bg-blue-950/40 text-blue-400"
                  : "border-blue-200 bg-blue-50 text-blue-700"
              }`}
            >
              <HiDocumentAdd className="h-5 w-5" />
            </div>
            <div>
              <h1 className={`text-xl font-semibold tracking-tight ${headingPage(theme)}`}>
                Share experience
              </h1>
              <p className={`mt-0.5 max-w-lg text-sm ${subheading}`}>
                Add structured notes plus a short recording so others can learn from your interview
                loop.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={labelCls} htmlFor="se-title">
                Title
              </label>
              <input
                id="se-title"
                type="text"
                placeholder="e.g. Backend onsite — distributed systems focus"
                className={inputCls(theme)}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls} htmlFor="se-company">
                  Company
                </label>
                <input
                  id="se-company"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                  className={inputCls(theme)}
                />
              </div>
              <div>
                <label className={labelCls} htmlFor="se-role">
                  Role
                </label>
                <input
                  id="se-role"
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                  placeholder="e.g. Software engineer"
                  className={inputCls(theme)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls} htmlFor="se-level">
                  Experience level
                </label>
                <select
                  id="se-level"
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  required
                  className={selectCls(theme)}
                >
                  {LEVELS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls} htmlFor="se-rounds">
                  Interview rounds
                </label>
                <input
                  id="se-rounds"
                  type="number"
                  min={0}
                  value={interviewRounds}
                  onChange={(e) => setInterviewRounds(e.target.value)}
                  required
                  className={inputCls(theme)}
                />
              </div>
            </div>

            <div>
              <label className={labelCls} htmlFor="se-questions">
                Questions (one per line)
              </label>
              <textarea
                id="se-questions"
                placeholder="Paste or type each question on its own line."
                rows={5}
                value={questionsText}
                onChange={(e) => setQuestionsText(e.target.value)}
                className={textareaCls(theme)}
              />
            </div>

            <div>
              <label className={labelCls} htmlFor="se-tips">
                Tips for others
              </label>
              <textarea
                id="se-tips"
                placeholder="What would you repeat, or do differently?"
                rows={3}
                value={tips}
                onChange={(e) => setTips(e.target.value)}
                className={textareaCls(theme)}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls} htmlFor="se-outcome">
                  Outcome (optional)
                </label>
                <select
                  id="se-outcome"
                  value={outcome}
                  onChange={(e) => setOutcome(e.target.value)}
                  className={selectCls(theme)}
                >
                  <option value="">Prefer not to say</option>
                  <option value="selected">Selected</option>
                  <option value="rejected">Not selected</option>
                </select>
              </div>
              <div>
                <label className={labelCls} htmlFor="se-visibility">
                  Visibility
                </label>
                <select
                  id="se-visibility"
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                  className={selectCls(theme)}
                >
                  <option value="public">Public — on the experience feed</option>
                  <option value="private">Private — only in My experiences</option>
                </select>
              </div>
            </div>

            <div>
              <label className={labelCls} htmlFor="se-summary">
                Summary
              </label>
              <textarea
                id="se-summary"
                placeholder="Brief context: team, timeline, or what stood out."
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className={textareaCls(theme)}
              />
            </div>

            <div>
              <span className={labelCls}>Recording file</span>
              <p className="mb-2 text-xs text-slate-500">
                MP4, MOV, or similar — walkthrough of your interview experience.
              </p>
              <input
                type="file"
                accept="video/*"
                id="file-upload"
                className="hidden"
                onChange={(e) => setFile(e.target.files[0])}
                required
              />
              <label
                htmlFor="file-upload"
                className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed py-4 px-4 text-sm transition-colors ${
                  theme === "dark"
                    ? "border-slate-600 hover:border-blue-500/50 hover:bg-slate-800/50"
                    : "border-slate-300 hover:border-blue-400 hover:bg-slate-50"
                }`}
              >
                {file ? (
                  <>
                    <HiCheckCircle className="text-emerald-500 shrink-0" />
                    <span
                      className={`truncate ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}
                    >
                      {file.name}
                    </span>
                  </>
                ) : (
                  <span className="text-slate-500">Choose recording file…</span>
                )}
              </label>
            </div>

            <Button
              theme={theme}
              variant="primary"
              type="submit"
              disabled={uploading}
              className="w-full"
            >
              {uploading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="loading loading-spinner loading-sm" />
                  Publishing…
                </span>
              ) : (
                "Publish experience"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShareExperiencePage;
