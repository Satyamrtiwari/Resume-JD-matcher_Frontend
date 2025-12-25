import api from "../api/api";

export default function ResumeUpload({ onUpload }) {
  const upload = async e => {
    const form = new FormData();
    form.append("candidate_name", e.target.files[0].name);
    form.append("resume_file", e.target.files[0]);

    await api.post("/resumes/upload/", form);
    onUpload();
  };

  return <input type="file" onChange={upload} />;
}
