import { useState } from "react";
import api from "../api/api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await api.post("register/", {
        username,
        email,
        password,
      });

      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (err) {
      console.error("Register error:", err.response?.data);

      const data = err.response?.data;

      // DRF returns field-wise validation errors
      if (data) {
        const messages = Object.entries(data)
          .map(([field, msgs]) => `${field}: ${msgs.join(", ")}`)
          .join("\n");

        alert(messages);
      } else {
        alert("Registration failed. Please try again.");
      }
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

      {/* REGISTER CARD */}
      <div className="flex items-center justify-center">
        <div className="bg-gray-800/80 backdrop-blur-md p-8 rounded-2xl w-96 shadow-xl">
          <h2 className="text-3xl font-bold mb-6 text-center">Register</h2>

          <input
            className="w-full p-3 mb-4 rounded-lg bg-gray-100 text-gray-900"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            className="w-full p-3 mb-4 rounded-lg bg-gray-100 text-gray-900"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="w-full p-3 mb-6 rounded-lg bg-gray-100 text-gray-900"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleRegister}
            className="w-full bg-purple-600 py-3 rounded-lg hover:bg-purple-700 font-semibold"
          >
            Register
          </button>

          <p className="text-gray-400 text-sm mt-6 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-400 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
