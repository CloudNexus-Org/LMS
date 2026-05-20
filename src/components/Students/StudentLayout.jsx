import { useState } from "react";
import SideNavbar from "./Navbar/SideNavbar";
import TopNavbar from "./Navbar/TopNavbar";

import { Outlet } from "react-router-dom";

const StudentLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div>
      <SideNavbar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-72">
        <TopNavbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="pt-20 px-4 lg:px-8 min-h-screen bg-bg">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;