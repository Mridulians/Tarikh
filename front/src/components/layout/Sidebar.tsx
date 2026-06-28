// import { Link, useLocation } from "react-router-dom";

// import {
//   FiHome,
//   FiFolder,
//   FiUsers,
//   FiLogOut,
// } from "react-icons/fi";

// const Sidebar = () => {
//   const location = useLocation();

//   const menuItems = [
//     {
//       name: "Dashboard",
//       path: "/",
//       icon: <FiHome />,
//     },
//     {
//       name: "Cases",
//       path: "/cases",
//       icon: <FiFolder />,
//     },
//     {
//       name: "Clients",
//       path: "/clients",
//       icon: <FiUsers />,
//     },
//   ];

//   const logout = () => {
//     localStorage.removeItem("token");
//     window.location.href = "/login";
//   };

//   return (
//     <div className="w-64 h-screen bg-gray-900 text-white flex flex-col">

//       {/* LOGO */}

//       <div className="p-6 border-b border-gray-700">
//         <h1 className="text-2xl font-bold">
//           Tarikh
//         </h1>

//         <p className="text-sm text-gray-400">
//           Legal Case System
//         </p>
//       </div>

//       {/* MENU */}

//       <div className="flex-1 p-4 space-y-2">

//         {menuItems.map((item) => {

//           const active =
//             location.pathname === item.path;

//           return (
//             <Link
//               key={item.path}
//               to={item.path}
//               className={`flex items-center gap-3 p-3 rounded-lg transition-all
//               ${
//                 active
//                   ? "bg-blue-600"
//                   : "hover:bg-gray-800"
//               }`}
//             >
//               <span className="text-lg">
//                 {item.icon}
//               </span>

//               <span>{item.name}</span>
//             </Link>
//           );
//         })}
//       </div>

//       {/* LOGOUT */}

//       <div className="p-4 border-t border-gray-700">
//         <button
//           onClick={logout}
//           className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-red-600 transition-all"
//         >
//           <FiLogOut />

//           Logout
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

import { Link, useLocation } from "react-router-dom";

import { FiHome, FiFolder, FiUsers, FiLogOut } from "react-icons/fi";

import { useAuth } from "../../hooks/useAuth";

import { useState } from "react";

const Sidebar = () => {
  const { user } = useAuth();

  console.log(user);
  const location = useLocation();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const menuItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: <FiHome />,
    },
    {
      name: "Cases",
      path: "/cases",
      icon: <FiFolder />,
    },
    // {
    //   name: "Clients",
    //   path: "/clients",
    //   icon: <FiUsers />,
    // },

    // hide for clerk
    ...(user?.user?.role !== "CLERK"
      ? [
          {
            name: "Clients",
            path: "/clients",
            icon: <FiUsers />,
          },
        ]
      : []),
  ];

  const logout = () => {
    localStorage.removeItem("token");

    window.location.href = "/login";
  };

  return (
    <>
      <div className="w-64 h-screen bg-gray-900 text-white flex flex-col">
        {/* LOGO */}

        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold">Tarikh</h1>

          <p className="text-sm text-gray-400">Legal Case System</p>
        </div>

        {/* MENU */}

        <div className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const active = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all
                  ${active ? "bg-blue-600" : "hover:bg-gray-800"}`}
              >
                <span className="text-lg">{item.icon}</span>

                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* LOGOUT */}

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-red-600 transition-all"
          >
            <FiLogOut />
            Logout
          </button>
        </div>
      </div>

      {/* LOGOUT MODAL */}

      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-80 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900">Logout</h2>

            <p className="text-sm text-gray-600 mt-2">Do you want to logout?</p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
              >
                No
              </button>

              <button
                onClick={logout}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
