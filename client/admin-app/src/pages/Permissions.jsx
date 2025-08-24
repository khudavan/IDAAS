import React, { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import API from "../api/api"; // ✅ axios instance

function Permissions() {
  const [users, setUsers] = useState([]);        // saved from backend
  const [editedUsers, setEditedUsers] = useState({}); // local drafts
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [error, setError] = useState(null);
  const [systemAdminEmail, setSystemAdminEmail] = useState(null);

  const ALL_ACTIONS = ["read", "write"];
  const ALL_RESOURCES = ["service:dashboard", "service:reports", "service:users"];

  // ✅ Initial fetch
  async function fetchData() {
    try {
      setLoading(true);
      setError(null);

      const [usersRes, adminInfoRes] = await Promise.all([
        API.get("/admin/users"),
        API.get("/admin/admin-info"),
      ]);

      setUsers(usersRes.data);
      setSystemAdminEmail(adminInfoRes.data.email);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Helpers
  function getUserData(u) {
    return editedUsers[u.id] ? editedUsers[u.id] : u;
  }

  function updateDraft(id, changes) {
    setEditedUsers((prev) => ({
      ...prev,
      [id]: { ...getUserData(users.find((u) => u.id === id)), ...changes },
    }));
  }

  // ✅ Save user (commit draft → backend)
  async function saveUser(u) {
    try {
      setSaving(u.id);

      const res = await API.put(`/admin/users/${u.id}`, {
        role: u.role,
        policy: u.policy,
      });

      const updatedUser = res.data;

      // update saved users with latest response
      setUsers((prev) =>
        prev.map((usr) => (usr.id === u.id ? { ...usr, ...updatedUser } : usr))
      );

      // ✅ merge updated response into editedUsers instead of overwriting
      setEditedUsers((prev) => ({
        ...prev,
        [u.id]: {
          ...prev[u.id],   // keep existing checkboxes
          ...updatedUser,  // overwrite only role/policy fields from backend
        },
      }));
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setSaving(null);
    }
  }


  // ✅ Handlers
  function handleRoleChange(id, newRole) {
    updateDraft(id, { role: newRole });
  }

  function togglePermission(userId, type, value) {
    const user = getUserData(users.find((u) => u.id === userId));
    let policy = user.policy;

    if (
      !policy ||
      !Array.isArray(policy.statements) ||
      policy.statements.length === 0
    ) {
      policy = {
        version: "2025-08-01",
        statements: [{ action: [], effect: "allow", resource: [] }],
      };
    }

    const statement = policy.statements[0];
    let updatedList = [...statement[type]];

    if (updatedList.includes(value)) {
      updatedList = updatedList.filter((v) => v !== value);
    } else {
      updatedList.push(value);
    }

    const newPolicy = {
      ...policy,
      statements: [
        {
          ...statement,
          [type]: updatedList,
        },
      ],
    };

    updateDraft(userId, { policy: newPolicy });
  }

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );

  if (error)
    return <div className="text-red-600 text-center mt-6">Error: {error}</div>;

  // ✅ Split users into admins and normal users (based on saved state only)
  const adminUsers = users.filter((u) => u.role === "ADMIN");
  const normalUsers = users.filter((u) => u.role !== "ADMIN");

  // ✅ User Card Component (memoized)
  const UserCard = React.memo(({ u }) => {
    const draftUser = getUserData(u);
    const isSystemAdmin =
      systemAdminEmail &&
      draftUser.email.toLowerCase().trim() ===
        systemAdminEmail.toLowerCase().trim();

    let policy = draftUser.policy;
    if (
      !policy ||
      !Array.isArray(policy.statements) ||
      policy.statements.length === 0
    ) {
      policy = {
        version: "2025-08-01",
        statements: [{ action: [], effect: "allow", resource: [] }],
      };
    }
    const statement = policy.statements[0];

    return (
      <motion.div
        key={draftUser.id}
        initial={false}   // ✅ prevents re-animation flicker
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.03 }}
        className={`border rounded-2xl p-5 bg-white shadow-md transition ${
          isSystemAdmin ? "border-yellow-500" : "hover:shadow-xl"
        }`}
      >
        {/* User info */}
        <div className="mb-3">
          <p className="text-sm text-gray-500">Name</p>
          <p className="text-lg font-semibold">{draftUser.name}</p>
        </div>
        <div className="mb-3">
          <p className="text-sm text-gray-500">Email</p>
          <p className="text-md text-gray-700">{draftUser.email}</p>
        </div>

        {/* Role */}
        <div className="mb-3">
          <p className="text-sm text-gray-500 mb-1">Role</p>
          {isSystemAdmin ? (
            <span className="px-3 py-2 rounded bg-gray-200 text-gray-700 font-semibold">
              SYSTEM ADMIN (locked)
            </span>
          ) : (
            <select
              value={draftUser.role}
              onChange={(e) => handleRoleChange(draftUser.id, e.target.value)}
              className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          )}
        </div>

        {/* Actions */}
        <div className="mb-3">
          <p className="text-sm text-gray-500 mb-1">Actions</p>
          <div className="flex gap-4 flex-wrap">
            {ALL_ACTIONS.map((a) => (
              <label key={a} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={
                    draftUser.role === "ADMIN" ? true : statement.action.includes(a)
                  }
                  disabled={draftUser.role === "ADMIN" || isSystemAdmin}
                  onChange={() => togglePermission(draftUser.id, "action", a)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">{a}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Resources */}
        <div className="mb-3">
          <p className="text-sm text-gray-500 mb-1">Resources</p>
          <div className="flex gap-3 flex-wrap">
            {ALL_RESOURCES.map((r) => (
              <label key={r} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={
                    draftUser.role === "ADMIN"
                      ? true
                      : statement.resource.includes(r)
                  }
                  disabled={draftUser.role === "ADMIN" || isSystemAdmin}
                  onChange={() => togglePermission(draftUser.id, "resource", r)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">{r}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Save button */}
        {!isSystemAdmin && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => saveUser(draftUser)}
            disabled={saving === draftUser.id}
            className={`mt-3 w-full px-4 py-2 rounded-lg text-white font-semibold transition 
              ${
                saving === draftUser.id
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-600"
              }`}
          >
            {saving === draftUser.id ? "Saving..." : "Save"}
          </motion.button>
        )}
      </motion.div>
    );
  });

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">User Permissions</h2>

      {/* Admin Section */}
      {adminUsers.length > 0 && (
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4 text-indigo-700 flex items-center gap-2">
            👑 Admins
          </h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {adminUsers.map((u, i) => (
              <UserCard key={u.id} u={u} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Normal Users Section */}
      {normalUsers.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
            👤 Regular Users
          </h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {normalUsers.map((u, i) => (
              <UserCard key={u.id} u={u} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Permissions;













// import React, { useEffect, useState } from "react";
// // eslint-disable-next-line no-unused-vars
// import { motion } from "framer-motion";
// import API from "../api/api"; // ✅ axios instance

// function Permissions() {
//   const [users, setUsers] = useState([]);        // saved from backend
//   const [editedUsers, setEditedUsers] = useState({}); // local drafts
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(null);
//   const [error, setError] = useState(null);
//   const [systemAdminEmail, setSystemAdminEmail] = useState(null);

//   const ALL_ACTIONS = ["read", "write"];
//   const ALL_RESOURCES = ["service:dashboard", "service:reports", "service:users"];

//   // ✅ Initial fetch
//   async function fetchData() {
//     try {
//       setLoading(true);
//       setError(null);

//       const [usersRes, adminInfoRes] = await Promise.all([
//         API.get("/admin/users"),
//         API.get("/admin/admin-info"),
//       ]);

//       setUsers(usersRes.data);
//       setSystemAdminEmail(adminInfoRes.data.email);
//     } catch (err) {
//       setError(err.response?.data?.message || err.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // ✅ Helpers
//   function getUserData(u) {
//     return editedUsers[u.id] ? editedUsers[u.id] : u;
//   }

//   function updateDraft(id, changes) {
//     setEditedUsers((prev) => ({
//       ...prev,
//       [id]: { ...getUserData(users.find((u) => u.id === id)), ...changes },
//     }));
//   }

//   // ✅ Save user (commit draft → backend)
//   async function saveUser(u) {
//     try {
//       setSaving(u.id);
//       const res = await API.put(`/admin/users/${u.id}`, {
//         role: u.role,
//         policy: u.policy,
//       });

//       // update saved users
//       setUsers((prev) =>
//         prev.map((usr) => (usr.id === u.id ? { ...usr, ...res.data } : usr))
//       );

//       // remove from drafts
//       setEditedUsers((prev) => {
//         const newEdits = { ...prev };
//         delete newEdits[u.id];
//         return newEdits;
//       });
//     } catch (err) {
//       alert(err.response?.data?.message || err.message);
//     } finally {
//       setSaving(null);
//     }
//   }

//   // ✅ Handlers
//   function handleRoleChange(id, newRole) {
//     updateDraft(id, { role: newRole });
//   }

//   function togglePermission(userId, type, value) {
//     const user = getUserData(users.find((u) => u.id === userId));
//     let policy = user.policy;

//     if (
//       !policy ||
//       !Array.isArray(policy.statements) ||
//       policy.statements.length === 0
//     ) {
//       policy = {
//         version: "2025-08-01",
//         statements: [{ action: [], effect: "allow", resource: [] }],
//       };
//     }

//     const statement = policy.statements[0];
//     let updatedList = [...statement[type]];

//     if (updatedList.includes(value)) {
//       updatedList = updatedList.filter((v) => v !== value);
//     } else {
//       updatedList.push(value);
//     }

//     const newPolicy = {
//       ...policy,
//       statements: [
//         {
//           ...statement,
//           [type]: updatedList,
//         },
//       ],
//     };

//     updateDraft(userId, { policy: newPolicy });
//   }

//   if (loading)
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
//       </div>
//     );

//   if (error)
//     return <div className="text-red-600 text-center mt-6">Error: {error}</div>;

//   // ✅ Split users into admins and normal users (based on saved state only)
//   const adminUsers = users.filter((u) => u.role === "ADMIN");
//   const normalUsers = users.filter((u) => u.role !== "ADMIN");

//   // ✅ User Card Component (memoized)
//   const UserCard = React.memo(({ u }) => {
//     const draftUser = getUserData(u);
//     const isSystemAdmin =
//       systemAdminEmail &&
//       draftUser.email.toLowerCase().trim() ===
//         systemAdminEmail.toLowerCase().trim();

//     let policy = draftUser.policy;
//     if (
//       !policy ||
//       !Array.isArray(policy.statements) ||
//       policy.statements.length === 0
//     ) {
//       policy = {
//         version: "2025-08-01",
//         statements: [{ action: [], effect: "allow", resource: [] }],
//       };
//     }
//     const statement = policy.statements[0];

//     return (
//       <motion.div
//         key={draftUser.id}
//         initial={false}   // ✅ prevents re-animation flicker
//         animate={{ opacity: 1, y: 0 }}
//         whileHover={{ scale: 1.03 }}
//         className={`border rounded-2xl p-5 bg-white shadow-md transition ${
//           isSystemAdmin ? "border-yellow-500" : "hover:shadow-xl"
//         }`}
//       >
//         {/* User info */}
//         <div className="mb-3">
//           <p className="text-sm text-gray-500">Name</p>
//           <p className="text-lg font-semibold">{draftUser.name}</p>
//         </div>
//         <div className="mb-3">
//           <p className="text-sm text-gray-500">Email</p>
//           <p className="text-md text-gray-700">{draftUser.email}</p>
//         </div>

//         {/* Role */}
//         <div className="mb-3">
//           <p className="text-sm text-gray-500 mb-1">Role</p>
//           {isSystemAdmin ? (
//             <span className="px-3 py-2 rounded bg-gray-200 text-gray-700 font-semibold">
//               SYSTEM ADMIN (locked)
//             </span>
//           ) : (
//             <select
//               value={draftUser.role}
//               onChange={(e) => handleRoleChange(draftUser.id, e.target.value)}
//               className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
//             >
//               <option value="USER">USER</option>
//               <option value="ADMIN">ADMIN</option>
//             </select>
//           )}
//         </div>

//         {/* Actions */}
//         <div className="mb-3">
//           <p className="text-sm text-gray-500 mb-1">Actions</p>
//           <div className="flex gap-4 flex-wrap">
//             {ALL_ACTIONS.map((a) => (
//               <label key={a} className="flex items-center gap-2 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={
//                     draftUser.role === "ADMIN" ? true : statement.action.includes(a)
//                   }
//                   disabled={draftUser.role === "ADMIN" || isSystemAdmin}
//                   onChange={() => togglePermission(draftUser.id, "action", a)}
//                   className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
//                 />
//                 <span className="text-gray-700">{a}</span>
//               </label>
//             ))}
//           </div>
//         </div>

//         {/* Resources */}
//         <div className="mb-3">
//           <p className="text-sm text-gray-500 mb-1">Resources</p>
//           <div className="flex gap-3 flex-wrap">
//             {ALL_RESOURCES.map((r) => (
//               <label key={r} className="flex items-center gap-2 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={
//                     draftUser.role === "ADMIN"
//                       ? true
//                       : statement.resource.includes(r)
//                   }
//                   disabled={draftUser.role === "ADMIN" || isSystemAdmin}
//                   onChange={() => togglePermission(draftUser.id, "resource", r)}
//                   className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
//                 />
//                 <span className="text-gray-700">{r}</span>
//               </label>
//             ))}
//           </div>
//         </div>

//         {/* Save button */}
//         {!isSystemAdmin && (
//           <motion.button
//             whileTap={{ scale: 0.95 }}
//             onClick={() => saveUser(draftUser)}
//             disabled={saving === draftUser.id}
//             className={`mt-3 w-full px-4 py-2 rounded-lg text-white font-semibold transition 
//               ${
//                 saving === draftUser.id
//                   ? "bg-gray-400 cursor-not-allowed"
//                   : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-600"
//               }`}
//           >
//             {saving === draftUser.id ? "Saving..." : "Save"}
//           </motion.button>
//         )}
//       </motion.div>
//     );
//   });

//   return (
//     <div className="p-6">
//       <h2 className="text-3xl font-bold mb-6 text-gray-800">User Permissions</h2>

//       {/* Admin Section */}
//       {adminUsers.length > 0 && (
//         <div className="mb-10">
//           <h3 className="text-xl font-semibold mb-4 text-indigo-700 flex items-center gap-2">
//             👑 Admins
//           </h3>
//           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//             {adminUsers.map((u, i) => (
//               <UserCard key={u.id} u={u} index={i} />
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Normal Users Section */}
//       {normalUsers.length > 0 && (
//         <div>
//           <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
//             👤 Regular Users
//           </h3>
//           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//             {normalUsers.map((u, i) => (
//               <UserCard key={u.id} u={u} index={i} />
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Permissions;
















// import React, { useEffect, useState } from "react";
// // eslint-disable-next-line no-unused-vars
// import { motion } from "framer-motion";
// import API from "../api/api"; // ✅ axios instance

// function Permissions() {
//   const [users, setUsers] = useState([]);        // saved from backend
//   const [editedUsers, setEditedUsers] = useState({}); // local drafts
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(null);
//   const [error, setError] = useState(null);
//   const [systemAdminEmail, setSystemAdminEmail] = useState(null);

//   const ALL_ACTIONS = ["read", "write"];
//   const ALL_RESOURCES = ["service:dashboard", "service:reports", "service:users"];

//   // ✅ Initial fetch
//   async function fetchData() {
//     try {
//       setLoading(true);
//       setError(null);

//       const [usersRes, adminInfoRes] = await Promise.all([
//         API.get("/admin/users"),
//         API.get("/admin/admin-info"),
//       ]);

//       setUsers(usersRes.data);
//       setSystemAdminEmail(adminInfoRes.data.email);
//     } catch (err) {
//       setError(err.response?.data?.message || err.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // ✅ Helpers
//   function getUserData(u) {
//     return editedUsers[u.id] ? editedUsers[u.id] : u;
//   }

//   function updateDraft(id, changes) {
//     setEditedUsers((prev) => ({
//       ...prev,
//       [id]: { ...getUserData(users.find((u) => u.id === id)), ...changes },
//     }));
//   }

//   // ✅ Save user (commit draft → backend)
//   async function saveUser(u) {
//     try {
//       setSaving(u.id);
//       const res = await API.put(`/admin/users/${u.id}`, {
//         role: u.role,
//         policy: u.policy,
//       });

//       // update saved users
//       setUsers((prev) =>
//         prev.map((usr) => (usr.id === u.id ? { ...usr, ...res.data } : usr))
//       );

//       // remove from drafts
//       setEditedUsers((prev) => {
//         const newEdits = { ...prev };
//         delete newEdits[u.id];
//         return newEdits;
//       });
//     } catch (err) {
//       alert(err.response?.data?.message || err.message);
//     } finally {
//       setSaving(null);
//     }
//   }

//   // ✅ Handlers
//   function handleRoleChange(id, newRole) {
//     updateDraft(id, { role: newRole });
//   }

//   function togglePermission(userId, type, value) {
//     const user = getUserData(users.find((u) => u.id === userId));
//     let policy = user.policy;

//     if (
//       !policy ||
//       !Array.isArray(policy.statements) ||
//       policy.statements.length === 0
//     ) {
//       policy = {
//         version: "2025-08-01",
//         statements: [{ action: [], effect: "allow", resource: [] }],
//       };
//     }

//     const statement = policy.statements[0];
//     let updatedList = [...statement[type]];

//     if (updatedList.includes(value)) {
//       updatedList = updatedList.filter((v) => v !== value);
//     } else {
//       updatedList.push(value);
//     }

//     const newPolicy = {
//       ...policy,
//       statements: [
//         {
//           ...statement,
//           [type]: updatedList,
//         },
//       ],
//     };

//     updateDraft(userId, { policy: newPolicy });
//   }

//   if (loading)
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
//       </div>
//     );

//   if (error)
//     return <div className="text-red-600 text-center mt-6">Error: {error}</div>;

//   // ✅ Split users into admins and normal users (based on saved state only)
//   const adminUsers = users.filter((u) => u.role === "ADMIN");
//   const normalUsers = users.filter((u) => u.role !== "ADMIN");

//   // ✅ User Card Component
//   const UserCard = ({ u, index }) => {
//     const draftUser = getUserData(u);
//     const isSystemAdmin =
//       systemAdminEmail &&
//       draftUser.email.toLowerCase().trim() ===
//         systemAdminEmail.toLowerCase().trim();

//     let policy = draftUser.policy;
//     if (
//       !policy ||
//       !Array.isArray(policy.statements) ||
//       policy.statements.length === 0
//     ) {
//       policy = {
//         version: "2025-08-01",
//         statements: [{ action: [], effect: "allow", resource: [] }],
//       };
//     }
//     const statement = policy.statements[0];

//     return (
//       <motion.div
//         key={draftUser.id}
//         initial={{ opacity: 0, y: 40 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: index * 0.1, duration: 0.4 }}
//         whileHover={{ scale: 1.03 }}
//         className={`border rounded-2xl p-5 bg-white shadow-md transition ${
//           isSystemAdmin ? "border-yellow-500" : "hover:shadow-xl"
//         }`}
//       >
//         {/* User info */}
//         <div className="mb-3">
//           <p className="text-sm text-gray-500">Name</p>
//           <p className="text-lg font-semibold">{draftUser.name}</p>
//         </div>
//         <div className="mb-3">
//           <p className="text-sm text-gray-500">Email</p>
//           <p className="text-md text-gray-700">{draftUser.email}</p>
//         </div>

//         {/* Role */}
//         <div className="mb-3">
//           <p className="text-sm text-gray-500 mb-1">Role</p>
//           {isSystemAdmin ? (
//             <span className="px-3 py-2 rounded bg-gray-200 text-gray-700 font-semibold">
//               SYSTEM ADMIN (locked)
//             </span>
//           ) : (
//             <select
//               value={draftUser.role}
//               onChange={(e) => handleRoleChange(draftUser.id, e.target.value)}
//               className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
//             >
//               <option value="USER">USER</option>
//               <option value="ADMIN">ADMIN</option>
//             </select>
//           )}
//         </div>

//         {/* Actions */}
//         <div className="mb-3">
//           <p className="text-sm text-gray-500 mb-1">Actions</p>
//           <div className="flex gap-4 flex-wrap">
//             {ALL_ACTIONS.map((a) => (
//               <label key={a} className="flex items-center gap-2 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={
//                     draftUser.role === "ADMIN" ? true : statement.action.includes(a)
//                   }
//                   disabled={draftUser.role === "ADMIN" || isSystemAdmin}
//                   onChange={() => togglePermission(draftUser.id, "action", a)}
//                   className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
//                 />
//                 <span className="text-gray-700">{a}</span>
//               </label>
//             ))}
//           </div>
//         </div>

//         {/* Resources */}
//         <div className="mb-3">
//           <p className="text-sm text-gray-500 mb-1">Resources</p>
//           <div className="flex gap-3 flex-wrap">
//             {ALL_RESOURCES.map((r) => (
//               <label key={r} className="flex items-center gap-2 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={
//                     draftUser.role === "ADMIN"
//                       ? true
//                       : statement.resource.includes(r)
//                   }
//                   disabled={draftUser.role === "ADMIN" || isSystemAdmin}
//                   onChange={() => togglePermission(draftUser.id, "resource", r)}
//                   className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
//                 />
//                 <span className="text-gray-700">{r}</span>
//               </label>
//             ))}
//           </div>
//         </div>

//         {/* Save button */}
//         {!isSystemAdmin && (
//           <motion.button
//             whileTap={{ scale: 0.95 }}
//             onClick={() => saveUser(draftUser)}
//             disabled={saving === draftUser.id}
//             className={`mt-3 w-full px-4 py-2 rounded-lg text-white font-semibold transition 
//               ${
//                 saving === draftUser.id
//                   ? "bg-gray-400 cursor-not-allowed"
//                   : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-600"
//               }`}
//           >
//             {saving === draftUser.id ? "Saving..." : "Save"}
//           </motion.button>
//         )}
//       </motion.div>
//     );
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-3xl font-bold mb-6 text-gray-800">User Permissions</h2>

//       {/* Admin Section */}
//       {adminUsers.length > 0 && (
//         <div className="mb-10">
//           <h3 className="text-xl font-semibold mb-4 text-indigo-700 flex items-center gap-2">
//             👑 Admins
//           </h3>
//           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//             {adminUsers.map((u, i) => (
//               <UserCard key={u.id} u={u} index={i} />
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Normal Users Section */}
//       {normalUsers.length > 0 && (
//         <div>
//           <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
//             👤 Regular Users
//           </h3>
//           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//             {normalUsers.map((u, i) => (
//               <UserCard key={u.id} u={u} index={i} />
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Permissions;















// // import React, { useEffect, useState } from "react";
// // // eslint-disable-next-line no-unused-vars
// // import { motion } from "framer-motion";
// // import API from "../api/api"; // ✅ axios instance

// // function Permissions() {
// //   const [users, setUsers] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [saving, setSaving] = useState(null);
// //   const [error, setError] = useState(null);
// //   const [systemAdminEmail, setSystemAdminEmail] = useState(null);

// //   const ALL_ACTIONS = ["read", "write"];
// //   const ALL_RESOURCES = [
// //     "service:dashboard",
// //     "service:reports",
// //     "service:users",
// //   ];

// //   // ✅ Initial fetch: users & system admin email
// //   async function fetchData() {
// //     try {
// //       setLoading(true);
// //       setError(null);

// //       const [usersRes, adminInfoRes] = await Promise.all([
// //         API.get("/admin/users"),
// //         API.get("/admin/admin-info"),
// //       ]);

// //       setUsers(usersRes.data);
// //       setSystemAdminEmail(adminInfoRes.data.email);
// //     } catch (err) {
// //       setError(err.response?.data?.message || err.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   }

// //   useEffect(() => {
// //     fetchData();
// //   }, []);

// //   // ✅ Save user (update only that user in state, no full reload)
// //   async function saveUser(u) {
// //     try {
// //       setSaving(u.id);
// //       const res = await API.put(`/admin/users/${u.id}`, {
// //         role: u.role,
// //         policy: u.policy,
// //       });

// //       // 🔄 Update only that user in state (no blinking)
// //       setUsers((prev) =>
// //         prev.map((usr) => (usr.id === u.id ? { ...usr, ...res.data } : usr))
// //       );
// //     } catch (err) {
// //       alert(err.response?.data?.message || err.message);
// //     } finally {
// //       setSaving(null);
// //     }
// //   }

// //   // ✅ Role change
// //   function handleRoleChange(id, newRole) {
// //     setUsers((prev) =>
// //       prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
// //     );
// //   }

// //   // ✅ Toggle permission
// //   function togglePermission(userId, type, value) {
// //     setUsers((prev) =>
// //       prev.map((u) => {
// //         if (u.id !== userId) return u;

// //         let policy = u.policy;
// //         if (
// //           !policy ||
// //           !Array.isArray(policy.statements) ||
// //           policy.statements.length === 0
// //         ) {
// //           policy = {
// //             version: "2025-08-01",
// //             statements: [{ action: [], effect: "allow", resource: [] }],
// //           };
// //         }

// //         const statement = policy.statements[0];
// //         let updatedList = [...statement[type]];

// //         if (updatedList.includes(value)) {
// //           updatedList = updatedList.filter((v) => v !== value);
// //         } else {
// //           updatedList.push(value);
// //         }

// //         return {
// //           ...u,
// //           policy: {
// //             ...policy,
// //             statements: [
// //               {
// //                 ...statement,
// //                 [type]: updatedList,
// //               },
// //             ],
// //           },
// //         };
// //       })
// //     );
// //   }

// //   if (loading)
// //     return (
// //       <div className="flex justify-center items-center h-64">
// //         <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
// //       </div>
// //     );

// //   if (error)
// //     return <div className="text-red-600 text-center mt-6">Error: {error}</div>;

// //   // ✅ Split users into admins and normal users
// //   const adminUsers = users.filter((u) => u.role === "ADMIN");
// //   const normalUsers = users.filter((u) => u.role !== "ADMIN");

// //   // ✅ User Card Component
// //   const UserCard = ({ u, index }) => {
// //     const isSystemAdmin =
// //       systemAdminEmail &&
// //       u.email.toLowerCase().trim() === systemAdminEmail.toLowerCase().trim();

// //     let policy = u.policy;
// //     if (
// //       !policy ||
// //       !Array.isArray(policy.statements) ||
// //       policy.statements.length === 0
// //     ) {
// //       policy = {
// //         version: "2025-08-01",
// //         statements: [{ action: [], effect: "allow", resource: [] }],
// //       };
// //     }
// //     const statement = policy.statements[0];

// //     return (
// //       <motion.div
// //         key={u.id}
// //         initial={{ opacity: 0, y: 40 }}
// //         animate={{ opacity: 1, y: 0 }}
// //         transition={{ delay: index * 0.1, duration: 0.4 }}
// //         whileHover={{ scale: 1.03 }}
// //         className={`border rounded-2xl p-5 bg-white shadow-md transition ${
// //           isSystemAdmin ? "border-yellow-500" : "hover:shadow-xl"
// //         }`}
// //       >
// //         {/* User info */}
// //         <div className="mb-3">
// //           <p className="text-sm text-gray-500">Name</p>
// //           <p className="text-lg font-semibold">{u.name}</p>
// //         </div>
// //         <div className="mb-3">
// //           <p className="text-sm text-gray-500">Email</p>
// //           <p className="text-md text-gray-700">{u.email}</p>
// //         </div>

// //         {/* Role */}
// //         <div className="mb-3">
// //           <p className="text-sm text-gray-500 mb-1">Role</p>
// //           {isSystemAdmin ? (
// //             <span className="px-3 py-2 rounded bg-gray-200 text-gray-700 font-semibold">
// //               SYSTEM ADMIN (locked)
// //             </span>
// //           ) : (
// //             <select
// //               value={u.role}
// //               onChange={(e) => handleRoleChange(u.id, e.target.value)}
// //               className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
// //             >
// //               <option value="USER">USER</option>
// //               <option value="ADMIN">ADMIN</option>
// //             </select>
// //           )}
// //         </div>

// //         {/* Actions */}
// //         <div className="mb-3">
// //           <p className="text-sm text-gray-500 mb-1">Actions</p>
// //           <div className="flex gap-4 flex-wrap">
// //             {ALL_ACTIONS.map((a) => (
// //               <label
// //                 key={a}
// //                 className="flex items-center gap-2 cursor-pointer"
// //               >
// //                 <input
// //                   type="checkbox"
// //                   checked={
// //                     u.role === "ADMIN" ? true : statement.action.includes(a)
// //                   }
// //                   disabled={u.role === "ADMIN" || isSystemAdmin}
// //                   onChange={() => togglePermission(u.id, "action", a)}
// //                   className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
// //                 />
// //                 <span className="text-gray-700">{a}</span>
// //               </label>
// //             ))}
// //           </div>
// //         </div>

// //         {/* Resources */}
// //         <div className="mb-3">
// //           <p className="text-sm text-gray-500 mb-1">Resources</p>
// //           <div className="flex gap-3 flex-wrap">
// //             {ALL_RESOURCES.map((r) => (
// //               <label
// //                 key={r}
// //                 className="flex items-center gap-2 cursor-pointer"
// //               >
// //                 <input
// //                   type="checkbox"
// //                   checked={
// //                     u.role === "ADMIN" ? true : statement.resource.includes(r)
// //                   }
// //                   disabled={u.role === "ADMIN" || isSystemAdmin}
// //                   onChange={() => togglePermission(u.id, "resource", r)}
// //                   className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
// //                 />
// //                 <span className="text-gray-700">{r}</span>
// //               </label>
// //             ))}
// //           </div>
// //         </div>

// //         {/* Save button */}
// //         {!isSystemAdmin && (
// //           <motion.button
// //             whileTap={{ scale: 0.95 }}
// //             onClick={() => saveUser(u)}
// //             disabled={saving === u.id}
// //             className={`mt-3 w-full px-4 py-2 rounded-lg text-white font-semibold transition 
// //               ${
// //                 saving === u.id
// //                   ? "bg-gray-400 cursor-not-allowed"
// //                   : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-600"
// //               }`}
// //           >
// //             {saving === u.id ? "Saving..." : "Save"}
// //           </motion.button>
// //         )}
// //       </motion.div>
// //     );
// //   };

// //   return (
// //     <div className="p-6">
// //       <h2 className="text-3xl font-bold mb-6 text-gray-800">
// //         User Permissions
// //       </h2>

// //       {/* Admin Section */}
// //       {adminUsers.length > 0 && (
// //         <div className="mb-10">
// //           <h3 className="text-xl font-semibold mb-4 text-indigo-700 flex items-center gap-2">
// //             👑 Admins
// //           </h3>
// //           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
// //             {adminUsers.map((u, i) => (
// //               <UserCard key={u.id} u={u} index={i} />
// //             ))}
// //           </div>
// //         </div>
// //       )}

// //       {/* Normal Users Section */}
// //       {normalUsers.length > 0 && (
// //         <div>
// //           <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
// //             👤 Regular Users
// //           </h3>
// //           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
// //             {normalUsers.map((u, i) => (
// //               <UserCard key={u.id} u={u} index={i} />
// //             ))}
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // export default Permissions;