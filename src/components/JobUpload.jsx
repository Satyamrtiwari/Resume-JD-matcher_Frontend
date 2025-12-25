import { useState } from "react";
import api from "../api/api";

export default function JobUpload({ onUpload }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const submit = async () => {
    await api.post("/jobs/", {
      job_title: title,
      job_description: desc
    });
    onUpload();
  };

  return (
    <>
      <input
        placeholder="Job Title"
        className="w-full mb-2 p-2 rounded text-black"
        onChange={e => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Job Description"
        className="w-full mb-2 p-2 rounded text-black"
        onChange={e => setDesc(e.target.value)}
      />
      <button onClick={submit} className="bg-purple-600 px-4 py-1 rounded">
        Upload
      </button>
    </>
  );
}
