import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Shield, Bell } from "lucide-react";
import AssessmentIcon from "@mui/icons-material/Assessment";

export default function Sidebar() {
  const location = useLocation();

  const links = [
    { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { to: "/users", label: "Users", icon: <Users size={20} /> },
    { to: "/permissions", label: "Permissions", icon: <Shield size={20} /> },
    { to: "/alerts", label: "Alerts", icon: <Bell size={20} /> },
    { to: "/reports", label: "Reports", icon: <AssessmentIcon size={20} />},
  ];

  return (
    <aside className="w-64 bg-white/80 backdrop-blur-md border-r border-gray-200 h-screen p-6 shadow-xl flex flex-col rounded-r-3xl">
      {/* Logo */}
      <h2 className="text-2xl font-extrabold text-blue-600 mb-10 tracking-tight">
        Admin Panel
      </h2>

      {/* Navigation */}
      <nav className="space-y-3">
        {links.map(({ to, label, icon }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              {icon}
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-6 border-t">
        <p className="text-xs text-gray-500">&copy; 2025 Admin Panel</p>
      </div>
    </aside>
  );
}

















// import { Link, useLocation } from "react-router-dom";
// import { LayoutDashboard, Users, Shield, Bell } from "lucide-react";

// export default function Sidebar() {
//   const location = useLocation();

//   const links = [
//     { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
//     { to: "/users", label: "Users", icon: <Users size={20} /> },
//     { to: "/permissions", label: "Permissions", icon: <Shield size={20} /> },
//     { to: "/alerts", label: "Alerts", icon: <Bell size={20} /> },
//   ];

//   return (
//     <aside className="w-64 bg-white border-r border-gray-200 h-screen p-6 shadow-xl flex flex-col transition-all duration-300">
//       {/* Logo */}
//       <h2 className="text-2xl font-extrabold text-blue-600 mb-10 tracking-tight">
//         Admin Panel
//       </h2>

//       {/* Navigation Links */}
//       <nav className="space-y-2">
//         {links.map(({ to, label, icon }) => {
//           const isActive = location.pathname === to;
//           return (
//             <Link
//               key={to}
//               to={to}
//               className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
//                 isActive
//                   ? "bg-blue-600 text-white shadow-md"
//                   : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
//               }`}
//             >
//               <span className="transition-transform duration-200 group-hover:scale-110">
//                 {icon}
//               </span>
//               {label}
//             </Link>
//           );
//         })}
//       </nav>

//       {/* Footer Section */}
//       <div className="mt-auto pt-6 border-t">
//         <p className="text-xs text-gray-500">&copy; 2025 Admin Panel</p>
//       </div>
//     </aside>
//   );
// }

















// // import { Link, useLocation } from "react-router-dom";
// // import { LayoutDashboard, Users, Shield, Bell } from "lucide-react";

// // export default function Sidebar() {
// //   const location = useLocation();

// //   const links = [
// //     { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
// //     { to: "/users", label: "Users", icon: <Users size={18} /> },
// //     { to: "/permissions", label: "Permissions", icon: <Shield size={18} /> },
// //     { to: "/alerts", label: "Alerts", icon: <Bell size={18} /> },
// //   ];

// //   return (
// //     <aside className="w-64 bg-white border-r border-gray-200 h-screen p-6 shadow-md">
// //       <h2 className="text-2xl font-bold text-blue-600 mb-8">Admin Panel</h2>
// //       <nav className="space-y-3">
// //         {links.map(({ to, label, icon }) => (
// //           <Link
// //             key={to}
// //             to={to}
// //             className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
// //               location.pathname === to
// //                 ? "bg-blue-600 text-white"
// //                 : "text-gray-700 hover:bg-blue-100"
// //             }`}
// //           >
// //             {icon}
// //             {label}
// //           </Link>
// //         ))}
// //       </nav>
// //     </aside>
// //   );
// // }