import { Outlet } from "react-router-dom";

import Navbar from "../components/navbar/Navbar";
import Sidebar from "../components/sidebar/Sidebar";

export default function DashboardLayout() {

  return (

    <div className="h-screen bg-slate-100">

      <Navbar />

      <div className="flex h-[calc(100vh-64px)]">

        <Sidebar />

        <main className="flex-1 overflow-hidden">

          <Outlet />

        </main>

      </div>

    </div>

  );
}