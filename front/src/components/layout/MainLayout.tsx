import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
// import Navbar from "./Navbar";

const MainLayout = () => {
  return (
    <div className="flex bg-gray-100 min-h-screen">

      {/* SIDEBAR */}

      <Sidebar />

      {/* MAIN CONTENT */}

      <div className="flex-1 flex flex-col">

        {/* <Navbar /> */}

        <main className="p-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default MainLayout;