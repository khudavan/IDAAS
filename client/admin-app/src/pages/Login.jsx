import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const { data } = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert("Login failed!");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Admin Login
        </h2>
        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none"
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none"
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleLogin}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow-md transition duration-300"
          >
            Login
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg shadow-md transition duration-300"
          >
            Back
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
