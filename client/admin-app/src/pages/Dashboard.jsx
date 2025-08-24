// src/pages/Dashboard.jsx
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Shield, Users, Key, Bell } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();

  const actions = [
    { 
      label: "Manage Users", 
      description: "Handle user creation, updates, and removals with ease.", 
      color: "from-blue-500 to-blue-700", 
      route: "/users", 
      icon: <Users className="w-10 h-10 text-blue-500" />
    },
    { 
      label: "Edit Permissions", 
      description: "Assign and update role-based permissions securely.", 
      color: "from-purple-500 to-purple-700", 
      route: "/permissions", 
      icon: <Key className="w-10 h-10 text-purple-500" />
    },
    { 
      label: "View Alerts", 
      description: "Track and respond to system alerts in real time.", 
      color: "from-red-500 to-red-700", 
      route: "/alerts", 
      icon: <Bell className="w-10 h-10 text-red-500" />
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-5xl w-full bg-white shadow-2xl rounded-2xl p-10"
      >
        <div className="flex items-center gap-3 mb-10">
          <Shield className="w-12 h-12 text-indigo-600" />
          <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {actions.map((action, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-lg p-6 cursor-pointer flex flex-col items-start hover:shadow-2xl transition-all"
              onClick={() => navigate(action.route)}
            >
              <div className="mb-4">{action.icon}</div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{action.label}</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{action.description}</p>
              <div className={`mt-4 px-4 py-2 text-sm font-semibold text-white rounded-lg bg-gradient-to-r ${action.color} self-start`}>
                Go →
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}














// // src/pages/Dashboard.jsx
// import { useNavigate } from "react-router-dom";

// export default function Dashboard() {
//   const navigate = useNavigate();

//   const actions = [
//     { label: "Manage Users", color: "from-blue-500 to-blue-700", route: "/users" },
//     { label: "Edit Permissions", color: "from-purple-500 to-purple-700", route: "/permissions" },
//     { label: "View Alerts", color: "from-red-500 to-red-700", route: "/alerts" },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
//       <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl p-8 animate-fadeIn">
//         <h1 className="text-4xl font-bold text-gray-800 mb-6">🚀 Admin Dashboard</h1>
//         <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
//           {actions.map((action, idx) => (
//             <button
//               key={idx}
//               onClick={() => navigate(action.route)}
//               className={`p-6 text-lg font-semibold text-white rounded-xl shadow-lg bg-gradient-to-r ${action.color} transform hover:scale-105 transition-all duration-300`}
//             >
//               {action.label}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }











// import { Box, Typography, Button } from "@mui/material";
// import { useNavigate } from "react-router-dom";

// export default function Dashboard() {
//   const navigate = useNavigate();

//   return (
//     <Box p={4}>
//       <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
//       <Box display="flex" gap={2}>
//         <Button onClick={() => navigate("/users")} variant="contained">Manage Users</Button>
//         <Button onClick={() => navigate("/permissions")} variant="contained">Edit Permissions</Button>
//         <Button onClick={() => navigate("/alerts")} variant="contained" color="error">View Alerts</Button>
//       </Box>
//     </Box>
//   );
// }
