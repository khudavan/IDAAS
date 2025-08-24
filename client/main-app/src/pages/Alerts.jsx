// src/pages/Alerts.jsx
import React, { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  Tabs,
  Tab,
  Box,
  Chip,
  CircularProgress,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import API from "../api/api";
import AppLayout from "../components/AppLayout";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import PersonIcon from "@mui/icons-material/Person";
import PublicIcon from "@mui/icons-material/Public";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);

  const fetchAlerts = async () => {
    try {
      const res = await API.get("/main/alerts");
      setAlerts(res.data || []);
    } catch (err) {
      console.error("Error fetching alerts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const globalAlerts = alerts.filter((a) => !a.userId);
  const userAlerts = alerts.filter((a) => a.userId);

  const renderAlertCard = (alert, isGlobal = false) => (
    <motion.div
      key={alert.id}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        sx={{
          mb: 2,
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          transition: "0.3s",
          "&:hover": { transform: "scale(1.02)" },
        }}
      >
        <CardContent>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            {alert.type} — {alert.message}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {new Date(alert.createdAt).toLocaleString()}
          </Typography>
          <Box mt={1}>
            <Chip
              size="small"
              color={isGlobal ? "primary" : "secondary"}
              icon={isGlobal ? <PublicIcon /> : <PersonIcon />}
              label={isGlobal ? "Global" : alert.user?.name || "You"}
              sx={{ fontWeight: 500 }}
            />
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <AppLayout>
      <Box className="max-w-3xl mx-auto mt-8">
        <Typography variant="h4" fontWeight={700} mb={3} display="flex" alignItems="center" gap={1}>
          <NotificationsActiveIcon color="primary" /> My Alerts
        </Typography>

        {/* Loading Spinner */}
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" mt={5}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Tabs for Global/User Alerts */}
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              variant="fullWidth"
              textColor="primary"
              indicatorColor="primary"
              sx={{
                mb: 3,
                "& .MuiTab-root": { fontWeight: 600, textTransform: "none" },
              }}
            >
              <Tab label={`🌍 Global (${globalAlerts.length})`} />
              <Tab label={`👤 Personal (${userAlerts.length})`} />
            </Tabs>

            {/* Alerts List */}
            <motion.div layout>
              {tab === 0 && (
                <Box>
                  {globalAlerts.length === 0 ? (
                    <Typography align="center" color="text.secondary">
                      No global alerts 🎉
                    </Typography>
                  ) : (
                    globalAlerts.map((a) => renderAlertCard(a, true))
                  )}
                </Box>
              )}
              {tab === 1 && (
                <Box>
                  {userAlerts.length === 0 ? (
                    <Typography align="center" color="text.secondary">
                      No personal alerts 🚀
                    </Typography>
                  ) : (
                    userAlerts.map((a) => renderAlertCard(a, false))
                  )}
                </Box>
              )}
            </motion.div>
          </>
        )}
      </Box>
    </AppLayout>
  );
}












// // src/pages/Alerts.jsx
// import React, { useEffect, useState } from "react";
// import API from "../api/api";
// import AppLayout from "../components/AppLayout";  // ✅ Import layout

// export default function Alerts() {
//   const [alerts, setAlerts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchAlerts = async () => {
//     try {
//       const res = await API.get("/main/alerts");  // ✅ use same /main/ prefix as Profile
//       setAlerts(res.data || []);
//     } catch (err) {
//       console.error("Error fetching alerts:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAlerts();
//   }, []);

//   return (
//     <AppLayout>
//       {loading ? (
//         <div className="p-6 text-center">Loading alerts...</div>
//       ) : alerts.length === 0 ? (
//         <div className="p-6 text-center text-gray-500">No alerts</div>
//       ) : (
//         <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
//           <h2 className="text-2xl font-bold mb-6 text-gray-800">🔔 My Alerts</h2>

//           {/* Global Alerts */}
//           <section className="mb-8">
//             <h3 className="text-lg font-semibold mb-3">🌍 Global Alerts</h3>
//             {alerts.filter((a) => !a.userId).length === 0 ? (
//               <p className="text-gray-500">No global alerts</p>
//             ) : (
//               <ul className="space-y-3">
//                 {alerts
//                   .filter((a) => !a.userId)
//                   .map((alert) => (
//                     <li
//                       key={alert.id}
//                       className="p-3 border rounded-lg bg-gray-50 shadow-sm"
//                     >
//                       <p className="font-semibold text-gray-800">
//                         {alert.type} — {alert.message}
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         {new Date(alert.createdAt).toLocaleString()}
//                       </p>
//                       <p className="text-xs text-blue-600 font-medium">🌍 Global</p>
//                     </li>
//                   ))}
//               </ul>
//             )}
//           </section>

//           {/* User Alerts */}
//           <section>
//             <h3 className="text-lg font-semibold mb-3">👤 Your Alerts</h3>
//             {alerts.filter((a) => a.userId).length === 0 ? (
//               <p className="text-gray-500">No personal alerts</p>
//             ) : (
//               <ul className="space-y-3">
//                 {alerts
//                   .filter((a) => a.userId)
//                   .map((alert) => (
//                     <li
//                       key={alert.id}
//                       className="p-3 border rounded-lg bg-gray-50 shadow-sm"
//                     >
//                       <p className="font-semibold text-gray-800">
//                         {alert.type} — {alert.message}
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         {new Date(alert.createdAt).toLocaleString()}
//                       </p>
//                       <p className="text-xs text-purple-600 font-medium">
//                         👤 {alert.user?.name || alert.user?.email || "You"}
//                       </p>
//                     </li>
//                   ))}
//               </ul>
//             )}
//           </section>
//         </div>
//       )}
//     </AppLayout>
//   );
// }













// // src/pages/Alerts.jsx
// import React, { useEffect, useState } from "react";
// import API from "../api/api";

// export default function Alerts() {
//   const [alerts, setAlerts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchAlerts = async () => {
//     try {
//       const res = await API.get("/main/alerts");
//       setAlerts(res.data || []);
//     } catch (err) {
//       console.error("Error fetching alerts:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAlerts();
//   }, []);

//   if (loading) {
//     return <div className="p-6 text-center">Loading alerts...</div>;
//   }

//   if (alerts.length === 0) {
//     return <div className="p-6 text-center text-gray-500">No alerts</div>;
//   }

//   const globalAlerts = alerts.filter((a) => !a.userId);
//   const userAlerts = alerts.filter((a) => a.userId);

//   return (
//     <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
//       <h2 className="text-2xl font-bold mb-6 text-gray-800">🔔 My Alerts</h2>

//       {/* Global Alerts */}
//       <section className="mb-8">
//         <h3 className="text-lg font-semibold mb-3">🌍 Global Alerts</h3>
//         {globalAlerts.length === 0 ? (
//           <p className="text-gray-500">No global alerts</p>
//         ) : (
//           <ul className="space-y-3">
//             {globalAlerts.map((alert) => (
//               <li
//                 key={alert.id}
//                 className="p-3 border rounded-lg bg-gray-50 shadow-sm"
//               >
//                 <p className="font-semibold text-gray-800">
//                   {alert.type} — {alert.message}
//                 </p>
//                 <p className="text-xs text-gray-500">
//                   {new Date(alert.createdAt).toLocaleString()}
//                 </p>
//                 <p className="text-xs text-blue-600 font-medium">🌍 Global</p>
//               </li>
//             ))}
//           </ul>
//         )}
//       </section>

//       {/* User Alerts */}
//       <section>
//         <h3 className="text-lg font-semibold mb-3">👤 Your Alerts</h3>
//         {userAlerts.length === 0 ? (
//           <p className="text-gray-500">No personal alerts</p>
//         ) : (
//           <ul className="space-y-3">
//             {userAlerts.map((alert) => (
//               <li
//                 key={alert.id}
//                 className="p-3 border rounded-lg bg-gray-50 shadow-sm"
//               >
//                 <p className="font-semibold text-gray-800">
//                   {alert.type} — {alert.message}
//                 </p>
//                 <p className="text-xs text-gray-500">
//                   {new Date(alert.createdAt).toLocaleString()}
//                 </p>
//                 <p className="text-xs text-purple-600 font-medium">
//                   👤 {alert.user?.name || alert.user?.email || "You"}
//                 </p>
//               </li>
//             ))}
//           </ul>
//         )}
//       </section>
//     </div>
//   );
// }
