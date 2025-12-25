import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex justify-between items-center mb-10">
      <h1
        onClick={() => navigate("/")}
        className="text-xl font-bold cursor-pointer text-white"
      >
        Resume–JD Matcher
      </h1>

      <div className="space-x-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm text-white hover:underline"
        >
          Dashboard
        </button>

        <button
          onClick={() => navigate("/history")}
          className="text-sm text-white hover:underline"
        >
          History
        </button>

        <button
          onClick={logout}
          className="bg-red-500 px-4 py-1 rounded text-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
