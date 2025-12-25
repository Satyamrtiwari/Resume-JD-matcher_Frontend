import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Dashboard() {
  const navigate = useNavigate();

  const [jobTitle, setJobTitle] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobs, setJobs] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [selectedJob, setSelectedJob] = useState("");
  const [selectedResume, setSelectedResume] = useState("");
  const [result, setResult] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /* ---------------- LOAD DATA ---------------- */
  const loadData = async () => {
    try {
      const j = await api.get("jobs/list/");
      const r = await api.get("resumes/list/");
      setJobs(j.data);
      setResumes(r.data);
    } catch {
      setError("Failed to load jobs or resumes");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ---------------- JOB UPLOAD ---------------- */
  const uploadJob = async () => {
    if (!jobTitle || !jobDesc) {
      setError("Job title and description required");
      return;
    }

    try {
      await api.post("jobs/", {
        job_title: jobTitle,
        job_description: jobDesc,
      });
      setJobTitle("");
      setJobDesc("");
      setMessage("Job uploaded successfully ✅");
      setError("");
      loadData();
    } catch {
      setError("Failed to upload job");
    }
  };

  /* ---------------- RESUME UPLOAD ---------------- */
  const uploadResume = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const form = new FormData();
    form.append("candidate_name", file.name);
    form.append("resume_file", file);

    try {
      await api.post("resumes/upload/", form);
      setMessage("Resume uploaded successfully ✅");
      setError("");
      loadData();
    } catch {
      setError("Failed to upload resume");
    }
  };

  /* ---------------- MATCH ---------------- */
  const match = async () => {
    if (!selectedJob || !selectedResume) {
      setError("Please select both job and resume");
      return;
    }

    try {
      const res = await api.post("match/", {
        job_id: selectedJob,
        resume_id: selectedResume,
      });
      setResult(res.data);
      setShowModal(true);
      setError("");
    } catch {
      setError("Match failed");
    }
  };

  /* ---------------- THEME BY VERDICT ---------------- */
  const getTheme = (verdict) => {
    if (verdict === "Strong Match") {
      return {
        border: "border-green-400",
        bg: "bg-green-500/20",
        text: "text-green-400",
      };
    }
    if (verdict === "Moderate Match") {
      return {
        border: "border-orange-400",
        bg: "bg-orange-500/20",
        text: "text-orange-400",
      };
    }
    return {
      border: "border-red-400",
      bg: "bg-red-500/20",
      text: "text-red-400",
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white p-8">

      {/* NAVBAR */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="space-x-4">
          <button
            onClick={() => navigate("/")}
            className="bg-gray-700 px-4 py-2 rounded-lg"
          >
            Home
          </button>
          <button
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
            className="bg-red-600 px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>

      {/* STATUS MESSAGES */}
      {message && <p className="text-green-400 mb-4">{message}</p>}
      {error && <p className="text-red-400 mb-4">{error}</p>}

      {/* JOB UPLOAD */}
      <section className="bg-gray-900/80 p-6 rounded-xl mb-8 border border-gray-700">
        <h2 className="text-xl text-purple-400 mb-4">Upload Job Description</h2>

        <input
          className="w-full mb-3 p-3 rounded-lg bg-white text-black"
          placeholder="Job Title"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
        />

        <textarea
          className="w-full mb-4 p-3 rounded-lg bg-white text-black"
          placeholder="Job Description"
          rows={4}
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
        />

        <button
          onClick={uploadJob}
          className="bg-purple-600 px-5 py-2 rounded-lg"
        >
          Upload Job
        </button>
      </section>

      {/* JOB CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {jobs.map((j) => (
          <div
            key={j.id}
            className="bg-black/60 p-4 rounded-lg cursor-pointer border border-gray-700 hover:border-purple-500"
            onClick={() => alert(j.job_description)}
          >
            <h3 className="font-semibold">{j.job_title}</h3>
            <p className="text-sm text-gray-400">Job Description</p>
          </div>
        ))}
      </div>

      {/* RESUME UPLOAD */}
      <section className="bg-gray-900/80 p-6 rounded-xl mb-8 border border-gray-700">
        <h2 className="text-xl text-purple-400 mb-4">Upload Resume</h2>
        <input type="file" onChange={uploadResume} />
      </section>

      {/* RESUME CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {resumes.map((r) => (
          <div
            key={r.id}
            className="bg-black/60 p-4 rounded-lg cursor-pointer border border-gray-700 hover:border-purple-500"
            onClick={() => window.open(r.resume_file)}
          >
            <h3 className="font-semibold">{r.candidate_name}</h3>
            <p className="text-sm text-gray-400">Resume</p>
          </div>
        ))}
      </div>

      {/* MATCH */}
      <section className="bg-gray-900/80 p-6 rounded-xl border border-gray-700">
        <h2 className="text-xl text-purple-400 mb-4">Match Resume with Job</h2>

        <select
          className="w-full mb-4 p-3 rounded-lg bg-white text-black"
          onChange={(e) => setSelectedJob(e.target.value)}
        >
          <option value="">Select Job</option>
          {jobs.map((j) => (
            <option key={j.id} value={j.id}>
              {j.job_title}
            </option>
          ))}
        </select>

        <select
          className="w-full mb-4 p-3 rounded-lg bg-white text-black"
          onChange={(e) => setSelectedResume(e.target.value)}
        >
          <option value="">Select Resume</option>
          {resumes.map((r) => (
            <option key={r.id} value={r.id}>
              {r.candidate_name}
            </option>
          ))}
        </select>

        <button
          onClick={match}
          className="bg-purple-600 px-5 py-2 rounded-lg"
        >
          Match
        </button>
      </section>

      {/* ================== RESULT MODAL ================== */}
      {showModal && result && (() => {
        const theme = getTheme(result.verdict);

        return (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
            <div
              className={`relative w-full max-w-md p-8 rounded-2xl border-2 
              ${theme.border} ${theme.bg} shadow-2xl`}
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-xl text-gray-300 hover:text-white"
              >
                ✕
              </button>

              <h2 className={`text-3xl font-bold mb-4 text-center ${theme.text}`}>
                {result.verdict}
              </h2>

              <p className="text-center text-gray-300 mb-6">
                Candidate–Job Compatibility Result
              </p>

              <div className="text-center">
                <p className="mb-2">
                  <span className="text-gray-400">Candidate:</span>{" "}
                  <span className="font-semibold">{result.candidate}</span>
                </p>

                <div className="my-6">
                  <span className={`text-5xl font-extrabold ${theme.text}`}>
                    {result.match_score_percent}%
                  </span>
                  <p className="text-gray-400 mt-1">Match Score</p>
                </div>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="w-full mt-6 bg-white/10 hover:bg-white/20 py-3 rounded-lg font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
