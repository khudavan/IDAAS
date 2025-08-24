// client/src/pages/Reports.jsx
import React, { useEffect, useState } from "react";
import API from "../api/api";

export default function Reports() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await API.get("/reports/login-activity");
        setLogs(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Login Activity Report</h1>
      <table className="w-full border border-gray-300 rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">User</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">IP</th>
            <th className="p-2 border">Time</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td className="p-2 border">{log.user?.name || "Unknown"}</td>
              <td className="p-2 border">{log.user?.email || "-"}</td>
              <td
                className={`p-2 border font-semibold ${
                  log.status === "success" ? "text-green-600" : "text-red-600"
                }`}
              >
                {log.status}
              </td>
              <td className="p-2 border">{log.ip || "-"}</td>
              <td className="p-2 border">
                {new Date(log.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}










// // src/pages/Reports.jsx
// import { useEffect, useState } from "react";
// import { Alert, Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
// import API from "../api/api";
// import AppLayout from "../components/AppLayout";
// import usePermission from "../hooks/usePermission";

// export default function Reports() {
//   const [items, setItems] = useState([]);
//   const [name, setName] = useState("");
//   const [err, setErr] = useState("");
//   const [loading, setLoading] = useState(true);

//   const { allowed: canRead } = usePermission("read", "service:reports");
//   const { allowed: canWrite } = usePermission("write", "service:reports");

//   useEffect(() => {
//     async function load() {
//       setLoading(true);
//       setErr("");
//       try {
//         // Only try if read is allowed; otherwise backend will 403
//         if (!canRead) return;
//         const { data } = await API.get("/main/reports");
//         setItems(data.items || []);
//       } catch {
//         setErr("Cannot read reports (permission denied).");
//       } finally {
//         setLoading(false);
//       }
//     }
//     load();
//   }, [canRead]);

//   const createReport = async () => {
//     try {
//       await API.post("/main/reports", { name });
//       setName("");
//       const { data } = await API.get("/main/reports");
//       setItems(data.items || []);
//     } catch {
//       setErr("Cannot create report (permission denied).");
//     }
//   };

//   return (
//     <AppLayout>
//       <Typography variant="h4" gutterBottom>Reports</Typography>
//       {!canRead && <Alert severity="warning" sx={{ mb: 2 }}>You don’t have permission to view reports.</Alert>}

//       {canRead && (
//         <>
//           <Paper sx={{ p: 2, mb: 2 }}>
//             <Typography variant="h6" mb={1}>Available Reports</Typography>
//             {loading ? (
//               <Typography variant="body2">Loading…</Typography>
//             ) : (
//               <Stack spacing={1}>
//                 {items.length === 0 && <Typography variant="body2">No reports yet.</Typography>}
//                 {items.map((r) => (
//                   <Box key={r.id} sx={{ p: 1.5, border: "1px solid #eee", borderRadius: 1 }}>
//                     <Typography fontWeight={600}>{r.name}</Typography>
//                     <Typography variant="caption">Created: {new Date(r.createdAt).toLocaleString()}</Typography>
//                   </Box>
//                 ))}
//               </Stack>
//             )}
//           </Paper>

//           {canWrite && (
//             <Paper sx={{ p: 2 }}>
//               <Typography variant="h6" mb={1}>Create Report</Typography>
//               <Stack direction="row" spacing={2}>
//                 <TextField label="Report Name" value={name} onChange={(e) => setName(e.target.value)} />
//                 <Button variant="contained" onClick={createReport} disabled={!name.trim()}>Create</Button>
//               </Stack>
//             </Paper>
//           )}

//           {err && <Alert severity="error" sx={{ mt: 2 }}>{err}</Alert>}
//         </>
//       )}
//     </AppLayout>
//   );
// }
