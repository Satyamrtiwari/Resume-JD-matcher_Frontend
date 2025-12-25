import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    api.get("history/").then((res) => setHistory(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white p-10">
      {/* Home button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => navigate("/")}
          className="text-sm text-purple-400 hover:underline"
        >
          Home
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-8">Match History</h1>

      {history.length === 0 && (
        <p className="text-gray-400">No matches yet.</p>
      )}

      <div className="space-y-4">
        {history.map((h) => (
          <div
            key={h.id}
            className="bg-gray-800/80 p-4 rounded-xl"
          >
            <p><b>Job:</b> {h.job_title}</p>
            <p><b>Candidate:</b> {h.candidate_name}</p>
            <p><b>Score:</b> {h.score_percent}%</p>
            <p><b>Verdict:</b> {h.verdict}</p>
            <p className="text-sm text-gray-400">
              {new Date(h.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
