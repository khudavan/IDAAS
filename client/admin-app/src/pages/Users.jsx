import React, { useEffect, useState } from "react";
import API from "../api/api";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { PlusCircle, Trash2 } from "lucide-react";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [submitting, setSubmitting] = useState(false);

  const [adminEmail, setAdminEmail] = useState(null);

  // Fetch all users
  async function fetchUsers() {
    try {
      setLoading(true);
      setError(null);
      const res = await API.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      setError(
        err.response?.data?.error || err.message || "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  }

  // Fetch admin email from backend
  async function fetchAdminEmail() {
    try {
      const { data } = await API.get("/admin-info");
      setAdminEmail(data.email);
    } catch (err) {
      console.error("Failed to fetch admin email:", err);
    }
  }

  useEffect(() => {
    fetchUsers();
    fetchAdminEmail();
  }, []);

  // Add new user
  async function addUser(e) {
    e.preventDefault();
    if (!email || !password) {
      alert("Email and password are required");
      return;
    }
    try {
      setSubmitting(true);
      await API.post("/admin/users", {
        name: name?.trim() || undefined,
        email,
        password,
        role,
      });
      setName("");
      setEmail("");
      setPassword("");
      setRole("USER");
      await fetchUsers();
    } catch (err) {
      alert(
        err.response?.data?.error || err.message || "Failed to create user"
      );
    } finally {
      setSubmitting(false);
    }
  }

  // Delete user
  async function handleDelete(id, emailAddr) {
    if (!window.confirm(`Delete user "${emailAddr}"? This cannot be undone.`))
      return;
    try {
      await API.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      alert(
        err.response?.data?.error || err.message || "Failed to delete user"
      );
    }
  }

  return (
    <div className="p-6 space-y-8">
      <motion.h1
        className="text-3xl font-extrabold text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        👥 Manage Users
      </motion.h1>

      <motion.form
        onSubmit={addUser}
        className="bg-white/70 backdrop-blur-lg shadow-xl rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600">
            Name (optional)
          </label>
          <input
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600">Email</label>
          <input
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            type="email"
            placeholder="user@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600">Password</label>
          <input
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600">Role</label>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-md transition disabled:opacity-50"
          >
            <PlusCircle className="w-5 h-5" />
            {submitting ? "Adding..." : "Add User"}
          </button>
        </div>
      </motion.form>

      <motion.div
        className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl overflow-hidden"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        {loading ? (
          <div className="p-6 text-gray-600 animate-pulse">Loading users...</div>
        ) : error ? (
          <div className="p-6 text-red-600">Error: {error}</div>
        ) : (
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Created</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, index) => (
                <motion.tr
                  key={u.id}
                  className="border-t hover:bg-blue-50 transition"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <td className="p-3">{u.name || "-"}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        u.role === "ADMIN"
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3">
                    {u.createdAt
                      ? new Date(u.createdAt).toLocaleString()
                      : "-"}
                  </td>
                  <td className="p-3 text-center">
                    {adminEmail && u.email?.toLowerCase().trim() === adminEmail.toLowerCase().trim() ? (
                      <span className="text-gray-400 italic">Protected</span>
                    ) : (
                      <button
                        onClick={() => handleDelete(u.id, u.email)}
                        className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg shadow transition"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </motion.div>
    </div>
  );
}
