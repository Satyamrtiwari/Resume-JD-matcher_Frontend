import { useState } from "react";
import api from "../api/api";
import { useAuth } from "../auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post("login/", {
        username,
        password,
      });

      // ✅ Save JWT token
      const accessToken = res.data.access;
      login(accessToken);
      localStorage.setItem("token", accessToken);

      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err.response?.data);

      // DRF SimpleJWT error message
      const message =
        err.response?.data?.detail ||
        "Login failed. Please check your username and password.";

      alert(message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white">
      {/* TOP BAR */}
      <div className="flex justify-end p-6">
        <button
          onClick={() => navigate("/")}
          className="bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600"
        >
          Home
        </button>
      </div>

      {/* LOGIN CARD */}
      <div className="flex items-center justify-center">
        <div className="bg-gray-800/80 backdrop-blur-md p-8 rounded-2xl w-96 shadow-xl">
          <h2 className="text-3xl font-bold mb-6 text-center">Sign In</h2>

          <input
            className="w-full p-3 mb-4 rounded-lg bg-gray-100 text-gray-900"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            className="w-full p-3 mb-6 rounded-lg bg-gray-100 text-gray-900"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className="w-full bg-purple-600 py-3 rounded-lg hover:bg-purple-700 font-semibold"
          >
            Login
          </button>

          <p className="text-gray-400 text-sm mt-6 text-center">
            Don’t have an account?{" "}
            <Link to="/register" className="text-purple-400 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
