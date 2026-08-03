import { useEffect, useState } from "react";
import api from "../api/api";

export default function Dashboard() {
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
  const [loading, setLoading] = useState(false);

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
      setError("Job title and description are required");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      await api.post("jobs/", {
        job_title: jobTitle,
        job_description: jobDesc,
      });

      setJobTitle("");
      setJobDesc("");
      setMessage("Job uploaded successfully ✅");
      loadData();
    } catch {
      setError("Failed to upload job");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- RESUME UPLOAD ---------------- */
  const uploadResume = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError("");
    setMessage("");

    const formData = new FormData();
    formData.append("candidate_name", file.name);
    formData.append("resume_file", file);

    try {
      await api.post("resumes/upload/", formData);
      setMessage("Resume uploaded successfully ✅");
      loadData();
    } catch {
      setError("Failed to upload resume");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- DELETE JOB ---------------- */
  const deleteJob = async (id) => {
    if (!window.confirm("Delete this job description?")) return;

    try {
      await api.delete(`jobs/${id}/`);
      setMessage("Job deleted successfully 🗑️");
      loadData();
    } catch {
      setError("Failed to delete job");
    }
  };

  /* ---------------- DELETE RESUME ---------------- */
  const deleteResume = async (id) => {
    if (!window.confirm("Delete this resume?")) return;

    try {
      await api.delete(`resumes/${id}/`);
      setMessage("Resume deleted successfully 🗑️");
      loadData();
    } catch {
      setError("Failed to delete resume");
    }
  };

  /* ---------------- MATCH ---------------- */
  const match = async () => {
    if (!selectedJob || !selectedResume) {
      setError("Please select both job and resume");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api.post("match/", {
        job_id: selectedJob,
        resume_id: selectedResume,
      });

      setResult(res.data);
      setShowModal(true);
    } catch {
      setError("Match failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- THEME ---------------- */
  const getTheme = (verdict) => {
    if (verdict === "Strong Match") {
      return { border: "border-green-400", bg: "bg-green-950/80", text: "text-green-400" };
    }
    if (verdict === "Moderate Match") {
      return { border: "border-amber-400", bg: "bg-amber-950/80", text: "text-amber-400" };
    }
    return { border: "border-rose-400", bg: "bg-rose-950/80", text: "text-rose-400" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white p-8">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-purple-400">Resume–JD Matcher</h1>
          <p className="text-sm text-gray-400">Semantic AI evaluation powered by Hugging Face transformers</p>
        </div>
      </div>

      {/* STATUS */}
      {loading && <p className="text-yellow-400 mb-4 font-medium animate-pulse">Processing request...</p>}
      {message && <p className="text-green-400 mb-4 font-medium">{message}</p>}
      {error && <p className="text-red-400 mb-4 font-medium">{error}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* JOB UPLOAD */}
        <section className="bg-gray-900/80 p-6 rounded-xl border border-gray-700 shadow-xl">
          <h2 className="text-xl text-purple-400 font-semibold mb-4">1. Upload Job Description</h2>

          <input
            className="w-full mb-3 p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-purple-500"
            placeholder="Job Title (e.g. Senior Fullstack Engineer)"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />

          <textarea
            className="w-full mb-4 p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-purple-500"
            placeholder="Paste Job Description here..."
            rows={5}
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
          />

          <button onClick={uploadJob} className="bg-purple-600 hover:bg-purple-700 font-medium px-5 py-2.5 rounded-lg transition">
            Upload Job
          </button>
        </section>

        {/* RESUME UPLOAD */}
        <section className="bg-gray-900/80 p-6 rounded-xl border border-gray-700 shadow-xl">
          <h2 className="text-xl text-purple-400 font-semibold mb-4">2. Upload Resume</h2>
          <p className="text-sm text-gray-400 mb-4">Upload a candidate resume in PDF format. Text will be automatically extracted and preprocessed.</p>
          <input
            type="file"
            accept=".pdf"
            onChange={uploadResume}
            className="block w-full text-sm text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 cursor-pointer"
          />
        </section>
      </div>

      {/* JOB CARDS */}
      {jobs.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-300 mb-3">Saved Job Descriptions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {jobs.map((j) => (
              <div
                key={j.id}
                className="bg-black/60 p-4 rounded-lg border border-gray-700 hover:border-purple-500 transition flex flex-col justify-between"
              >
                <div>
                  <h4 className="font-semibold text-purple-300">{j.job_title}</h4>
                  <p className="text-xs text-gray-400 line-clamp-2 mt-1">{j.job_description}</p>
                </div>
                <button
                  onClick={() => deleteJob(j.id)}
                  className="bg-red-600/80 hover:bg-red-600 px-3 py-1 rounded text-xs mt-3 self-start transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RESUME CARDS */}
      {resumes.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-300 mb-3">Saved Resumes</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {resumes.map((r) => (
              <div
                key={r.id}
                className="bg-black/60 p-4 rounded-lg border border-gray-700 hover:border-purple-500 transition flex flex-col justify-between"
              >
                <div>
                  <h4 className="font-semibold text-purple-300">{r.candidate_name}</h4>
                  <p className="text-xs text-gray-400 mt-1">PDF Document</p>
                </div>
                <button
                  onClick={() => deleteResume(r.id)}
                  className="bg-red-600/80 hover:bg-red-600 px-3 py-1 rounded text-xs mt-3 self-start transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MATCH */}
      <section className="bg-gray-900/80 p-6 rounded-xl border border-gray-700 shadow-xl">
        <h2 className="text-xl text-purple-400 font-semibold mb-4">3. Match Resume with Job Description</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <select className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-purple-500" onChange={(e) => setSelectedJob(e.target.value)} value={selectedJob}>
            <option value="">-- Select Job --</option>
            {jobs.map((j) => <option key={j.id} value={j.id}>{j.job_title}</option>)}
          </select>

          <select className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-purple-500" onChange={(e) => setSelectedResume(e.target.value)} value={selectedResume}>
            <option value="">-- Select Resume --</option>
            {resumes.map((r) => <option key={r.id} value={r.id}>{r.candidate_name}</option>)}
          </select>
        </div>

        <button onClick={match} className="bg-purple-600 hover:bg-purple-700 font-medium px-6 py-2.5 rounded-lg transition">
          Proceed to match
        </button>
      </section>

      {/* RESULT MODAL */}
      {showModal && result && (() => {
        const theme = getTheme(result.verdict);
        return (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className={`relative w-full max-w-md p-8 rounded-2xl border-2 ${theme.border} ${theme.bg} text-center shadow-2xl`}>
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>

              <p className="text-sm uppercase tracking-wider text-gray-400 mb-1">Match Evaluation</p>
              <h3 className="text-lg font-semibold text-purple-300 mb-1">{result.job}</h3>
              <p className="text-sm text-gray-300 mb-6">Candidate: <span className="font-semibold text-white">{result.candidate}</span></p>

              <div className="my-6">
                <span className={`text-6xl font-extrabold ${theme.text}`}>{result.match_score_percent}%</span>
              </div>

              <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold border ${theme.border} ${theme.text}`}>
                {result.verdict}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
