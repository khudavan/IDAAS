import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, UserCircle } from "lucide-react";
import API from "../api/api"; // ✅ use same axios instance as Profile

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // ✅ Fetch logged-in profile
  useEffect(() => {
    async function loadProfile() {
      try {
        const { data } = await API.get("/main/profile");
        setProfile(data); // { id, name, email, role }
      } catch (err) {
        console.error("Failed to load profile:", err);
        navigate("/login"); // redirect if not logged in
      }
    }
    loadProfile();
  }, [navigate]);

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setDropdownOpen(false);
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-white/70 backdrop-blur-md border-b shadow-sm sticky top-0 z-40 rounded-b-xl overflow-visible">
      🔍 Search Bar
      <div className="flex items-center gap-3 bg-gray-100 px-3 py-2 rounded-lg hover:shadow transition">
        <Search className="text-gray-500" size={18} />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent text-sm focus:outline-none w-48 sm:w-72"
        />
      </div>

      {/* 🔗 Links + Profile */}
      <div className="flex items-center gap-6 relative">
        <Link
          to="/"
          className="text-gray-700 hover:text-blue-600 font-medium transition"
        >
          Home
        </Link>

        {/* 👤 User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <UserCircle
              size={34}
              className="text-gray-600 hover:text-blue-600 transition"
            />
            {profile && (
              <span className="hidden sm:block text-gray-700 font-medium">
                {profile.name}
              </span>
            )}
          </div>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-white rounded-lg shadow-lg border p-4 z-50">
              {profile && (
                <>
                  <div className="mb-3">
                    <p className="font-semibold text-gray-800">{profile.name}</p>
                    <p className="text-sm text-gray-500">{profile.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md transition"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}












// import { useState, useEffect, useRef } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { Search, UserCircle } from "lucide-react";

// export default function Navbar() {
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const dropdownRef = useRef(null);

//   // Fetch user info
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           setLoading(false);
//           return;
//         }

//         const res = await fetch("http://localhost:5000/api/me", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (res.ok) {
//           const data = await res.json();
//           setUser(data); // { name, email }
//         }
//       } catch (err) {
//         console.error("Error fetching user:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, []);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     setUser(null);
//     setDropdownOpen(false);
//     navigate("/login");
//   };

//   return (
//     <nav className="flex justify-between items-center px-8 py-4 bg-white/70 backdrop-blur-md border-b shadow-sm sticky top-0 z-40 rounded-b-xl overflow-visible">
//       {/* Search Bar */}
//       <div className="flex items-center gap-3 bg-gray-100 px-3 py-2 rounded-lg hover:shadow transition">
//         <Search className="text-gray-500" size={18} />
//         <input
//           type="text"
//           placeholder="Search..."
//           className="bg-transparent text-sm focus:outline-none w-48 sm:w-72"
//         />
//       </div>

//       {/* Links + Profile */}
//       <div className="flex items-center gap-6 relative">
//         <Link
//           to="/"
//           className="text-gray-700 hover:text-blue-600 font-medium transition"
//         >
//           Home
//         </Link>

//         {!user && !loading && (
//           <Link
//             to="/login"
//             className="text-gray-700 hover:text-blue-600 font-medium transition"
//           >
//             Login
//           </Link>
//         )}

//         {/* UserCircle + Dropdown */}
//         <div className="relative" ref={dropdownRef}>
//           <UserCircle
//             size={34}
//             className="text-gray-600 cursor-pointer hover:text-blue-600 transition"
//             onClick={() => setDropdownOpen(!dropdownOpen)}
//           />

//           {dropdownOpen && (
//             <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border p-4 z-50">
//               {user ? (
//                 <>
//                   <div className="mb-3">
//                     <p className="font-semibold text-gray-800">{user.name}</p>
//                     <p className="text-sm text-gray-500">{user.email}</p>
//                   </div>
//                   <button
//                     onClick={handleLogout}
//                     className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md transition"
//                   >
//                     Logout
//                   </button>
//                 </>
//               ) : (
//                 <Link
//                   to="/login"
//                   className="w-full block text-center bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition"
//                   onClick={() => setDropdownOpen(false)}
//                 >
//                   Login
//                 </Link>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// }