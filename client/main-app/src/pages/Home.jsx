// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { User, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 text-gray-900 px-4">
      <motion.div
        className="text-center max-w-3xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-6"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          Identity-as-a-Service
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-gray-700 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Secure access management for users and administrators
        </motion.p>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
      
          <div className="p-6 bg-white rounded-2xl shadow-md text-center">
            <div className="flex justify-center">
              <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-400 to-indigo-600 text-white">
                <User size={32} />
              </div>
            </div>
            <h3 className="mt-4 text-xl font-semibold">User Login</h3>
            <p className="mt-2 text-gray-600">
              Access your applications securely with single sign-on.
            </p>
            <button
              onClick={() => (window.location.href = "/login")}
              className="mt-4 px-6 py-2 rounded-lg text-white bg-gradient-to-r from-indigo-500 to-indigo-600 hover:opacity-90 transition"
            >
              Login →
            </button>
          </div>

          <div className="p-6 bg-white rounded-2xl shadow-md text-center">
            <div className="flex justify-center">
              <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <Shield size={32} />
              </div>
            </div>
            <h3 className="mt-4 text-xl font-semibold">Admin Portal</h3>
            <p className="mt-2 text-gray-600">
              Manage users, roles, and permissions with ease.
            </p>
            <button
              onClick={() => (window.location.href = "http://localhost:5173")}
              className="mt-4 px-6 py-2 rounded-lg text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition"
            >
              Access →
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}