// src/components/Alert.jsx
import React, { useEffect, useState } from "react";
import API from "../api/api";

export default function Alert() {
  const [alerts, setAlerts] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ type: "", message: "", userId: "" });
  const [loading, setLoading] = useState(false);

  // Fetch alerts
  const fetchAlerts = async () => {
    try {
      const res = await API.get("/admin/alerts");
      setAlerts(res.data || []);
    } catch (err) {
      console.error("Error fetching alerts:", err);
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchAlerts();
    fetchUsers();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add new alert
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        type: form.type,
        message: form.message,
        userId: form.userId === "" ? null : form.userId,
      };
      await API.post("/admin/alerts", payload);
      setForm({ type: "", message: "", userId: "" });
      fetchAlerts();
    } catch (err) {
      console.error("Error creating alert:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete alert (with popup confirmation)
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this alert?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/admin/alerts/${id}`);
      fetchAlerts();
    } catch (err) {
      console.error("Error deleting alert:", err);
    }
  };

  // Separate alerts
  const globalAlerts = alerts.filter((a) => !a.userId);
  const userAlerts = alerts.filter((a) => a.userId);

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">⚡ Manage Alerts</h2>

      {/* Alert Form */}
      <form onSubmit={handleSubmit} className="mb-10 space-y-4">
        <div>
          <label className="block font-medium text-gray-700">Type</label>
          <input
            type="text"
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-400"
            placeholder="e.g. Security, Info"
            required
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700">Message</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-400"
            placeholder="Enter alert message"
            required
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700">Target User</label>
          <select
            name="userId"
            value={form.userId}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-400"
          >
            <option value="">🌍 All Users</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                👤 {user.name || user.email}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow"
        >
          {loading ? "Saving..." : "Add Alert"}
        </button>
      </form>

      {/* Global Alerts Section */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold mb-3">🌍 Global Alerts</h3>
        {globalAlerts.length === 0 ? (
          <p className="text-gray-500">No global alerts</p>
        ) : (
          <ul className="space-y-3">
            {globalAlerts.map((alert) => (
              <li
                key={alert.id}
                className="flex justify-between items-center p-3 border rounded-lg bg-gray-50"
              >
                <div>
                  <p className="font-semibold text-gray-800">
                    {alert.type} — {alert.message}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(alert.createdAt).toLocaleString()}
                  </p>
                  <p className="text-xs text-blue-600 font-medium">🌍 Global</p>
                </div>
                <button
                  onClick={() => handleDelete(alert.id)}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* User Alerts Section */}
      <section>
        <h3 className="text-lg font-semibold mb-3">👤 User Alerts</h3>
        {userAlerts.length === 0 ? (
          <p className="text-gray-500">No user alerts</p>
        ) : (
          <ul className="space-y-3">
            {userAlerts.map((alert) => (
              <li
                key={alert.id}
                className="flex justify-between items-center p-3 border rounded-lg bg-gray-50"
              >
                <div>
                  <p className="font-semibold text-gray-800">
                    {alert.type} — {alert.message}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(alert.createdAt).toLocaleString()}
                  </p>
                  <p className="text-xs text-blue-600 font-medium">
                    👤 {alert.user?.name || alert.user?.email || alert.userId}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(alert.id)}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}












// // src/components/Alert.jsx
// import React, { useEffect, useState } from "react";
// import API from "../api/api";

// export default function Alert() {
//   const [alerts, setAlerts] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [form, setForm] = useState({ type: "", message: "", userId: "" });
//   const [loading, setLoading] = useState(false);

//   // Fetch alerts from backend
//   const fetchAlerts = async () => {
//     try {
//       const res = await API.get("/admin/alerts");
//       setAlerts(res.data);
//     } catch (err) {
//       console.error("Error fetching alerts:", err);
//     }
//   };

//   // Fetch users for dropdown
//   const fetchUsers = async () => {
//     try {
//       const res = await API.get("/admin/users");
//       setUsers(res.data);
//     } catch (err) {
//       console.error("Error fetching users:", err);
//     }
//   };

//   useEffect(() => {
//     fetchAlerts();
//     fetchUsers();
//   }, []);

//   // Handle form input
//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   // Add new alert
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const payload = {
//         type: form.type,
//         message: form.message,
//         // ✅ FIX: keep UUID as string or null
//         userId: form.userId === "" ? null : form.userId,
//       };

//       await API.post("/admin/alerts", payload);
//       setForm({ type: "", message: "", userId: "" });
//       fetchAlerts();
//     } catch (err) {
//       console.error("Error creating alert:", err);
//     } finally {
//       setLoading(false);
//     }
//   };


//   // Delete alert
//   const handleDelete = async (id) => {
//     try {
//       await API.delete(`/admin/alerts/${id}`);
//       fetchAlerts();
//     } catch (err) {
//       console.error("Error deleting alert:", err);
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
//       <h2 className="text-2xl font-bold mb-6 text-gray-800">⚡ Manage Alerts</h2>

//       {/* Alert Form */}
//       <form onSubmit={handleSubmit} className="mb-8 space-y-4">
//         <div>
//           <label className="block font-medium text-gray-700">Type</label>
//           <input
//             type="text"
//             name="type"
//             value={form.type}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-400"
//             placeholder="e.g. Security, Info"
//             required
//           />
//         </div>
//         <div>
//           <label className="block font-medium text-gray-700">Message</label>
//           <textarea
//             name="message"
//             value={form.message}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-400"
//             placeholder="Enter alert message"
//             required
//           />
//         </div>
//         <div>
//           <label className="block font-medium text-gray-700">Target User</label>
//           <select
//             name="userId"
//             value={form.userId}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-400"
//           >
//             <option value="">🌍 All Users</option>
//             {users.map((user) => (
//               <option key={user.id} value={user.id}>
//                 👤 {user.name || user.email}
//               </option>
//             ))}
//           </select>
//         </div>
//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow"
//         >
//           {loading ? "Saving..." : "Add Alert"}
//         </button>
//       </form>

//       {/* Alerts List */}
//       <div>
//         <h3 className="text-lg font-semibold mb-4">📋 Alerts List</h3>
//         {alerts.length === 0 ? (
//           <p className="text-gray-500">No alerts found.</p>
//         ) : (
//           <ul className="space-y-3">
//             {alerts.map((alert) => (
//               <li
//                 key={alert.id}
//                 className="flex justify-between items-center p-3 border rounded-lg bg-gray-50"
//               >
//                 <div>
//                   <p className="font-semibold text-gray-800">
//                     {alert.type} — {alert.message}
//                   </p>
//                   <p className="text-xs text-gray-500">
//                     {new Date(alert.createdAt).toLocaleString()}
//                   </p>
//                   <p className="text-xs text-blue-600 font-medium">
//                     {alert.user
//                       ? `👤 ${alert.user.name || alert.user.email}`
//                       : "🌍 Global"}
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => handleDelete(alert.id)}
//                   className="text-red-600 hover:text-red-800 font-medium"
//                 >
//                   Delete
//                 </button>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// }