import React, { useEffect, useState } from "react";
import API from "../api/api";

export default function Reports() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem("token"); 
        const res = await API.get("/admin/login-activity", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("API response:", res.data);

        // Handle both {data: [...]} and plain [...] formats
        setLogs(Array.isArray(res.data) ? res.data : res.data.data || []);
      } catch (err) {
        console.error("Error fetching login logs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (loading) return <p className="p-4">Loading report...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Login Activity Report</h1>

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">User</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">IP</th>
              <th className="px-4 py-2 text-left">User Agent</th>
            </tr>
          </thead>
          <tbody>
            {logs.length > 0 ? (
              logs.map((log) => (
                <tr key={log.id || log._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2">
                    {log.user ? log.user.name : "—"}
                  </td>
                  <td className="px-4 py-2">{log.email}</td>
                  <td className="px-4 py-2">
                    {log.success ? (
                      <span className="text-green-600 font-medium">Success</span>
                    ) : (
                      <span className="text-red-600 font-medium">Failed</span>
                    )}
                  </td>
                  <td className="px-4 py-2">{log.ip || "—"}</td>
                  <td className="px-4 py-2 truncate max-w-xs">
                    {log.userAgent || "—"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No logs available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
