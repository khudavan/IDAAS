import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, UserCircle } from "lucide-react";
import API from "../api/api";

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Fetch logged-in profile
  useEffect(() => {
    async function loadProfile() {
      try {
        const { data } = await API.get("/main/profile");
        setProfile(data);
      } catch (err) {
        console.error("Failed to load profile:", err);
        navigate("/login");
      }
    }
    loadProfile();
  }, [navigate]);

  // Close dropdown when clicking outside
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

      <div className="flex items-center gap-6 relative">
        <Link
          to="/"
          className="text-gray-700 hover:text-blue-600 font-medium transition"
        >
          Home
        </Link>

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
