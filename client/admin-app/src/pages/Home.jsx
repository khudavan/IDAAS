import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-4xl"
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
            <svg
              className="w-10 h-10 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 1a9 9 0 00-9 9v5.586l-1.707 1.707a1 1 0 000 1.414L4 21.414a1 1 0 001.414 0L7.121 19.707 7 20a9 9 0 0010 0l-.121-.293L18.586 21.414a1 1 0 001.414 0L22 18.707a1 1 0 000-1.414L20.293 15.586V10a9 9 0 00-9-9z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-700">
          Permission Management <span className="text-black">System</span>
        </h1>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Complete full-stack solution with JWT authentication, role-based access control,
          and comprehensive user management for secure application environments.
        </p>

        {/* Cards */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Admin Portal */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-2xl p-6 shadow-xl flex flex-col items-center"
          >
            <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white mb-4">
              <svg
                className="w-8 h-8"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 1a9 9 0 00-9 9v5.586l-1.707 1.707a1 1 0 000 1.414L4 21.414a1 1 0 001.414 0L7.121 19.707 7 20a9 9 0 0010 0l-.121-.293L18.586 21.414a1 1 0 001.414 0L22 18.707a1 1 0 000-1.414L20.293 15.586V10a9 9 0 00-9-9z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Admin Portal</h2>
            <p className="text-gray-500 text-center mb-4">
              Complete user management with JWT authentication and role-based access control.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium hover:opacity-90 transition"
            >
              Access Portal →
            </button>
          </motion.div>

          {/* Main Application */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-2xl p-6 shadow-xl flex flex-col items-center"
          >
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-blue-600 text-white mb-4">
              <svg
                className="w-8 h-8"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M3 3v18h18V3H3zm4 14H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V7h2v2zm4 8H9v-2h2v2zm0-4H9v-2h2v2zm0-4H9V7h2v2zm4 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2zm4 8h-2v-2h2v2zm0-4h-2v-2h2v2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Main Application</h2>
            <p className="text-gray-500 text-center mb-4">
              Protected dashboard with reports, analytics, and permission-based features.
            </p>
            <button
              onClick={() => (window.location.href = "http://localhost:5174")}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-green-500 to-blue-600 text-white font-medium hover:opacity-90 transition"
            >
              Access Portal →
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}














// import { Box, Button, Typography } from "@mui/material";
// import { useNavigate } from "react-router-dom";

// export default function Home() {
//   const navigate = useNavigate();
//   return (
//     <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
//       <Typography variant="h3" gutterBottom>IDaaS Platform</Typography>
//       <Box display="flex" gap={2}>
//         <Button variant="contained" color="primary" onClick={() => navigate("/login")}>
//           Admin Login
//         </Button>
//         <Button variant="outlined" color="secondary" onClick={() => window.location.href="http://localhost:5174"}>
//           User Login
//         </Button>
//       </Box>
//     </Box>
//   );
// }
