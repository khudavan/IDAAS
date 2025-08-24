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
