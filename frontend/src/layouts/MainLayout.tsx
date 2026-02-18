import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer";

interface MainLayoutProps {
  // Passiamo la sidebar e la larghezza come props opzionali
  sidebar?: React.ReactNode;
  sidebarWidth?: 3 | 4;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  sidebar = <Sidebar />, // Default: usa la Sidebar standard
  sidebarWidth = 3, // Default: 3/12
}) => {
  // Mappatura classi per evitare problemi con le stringhe dinamiche in Tailwind
  const gridConfig = {
    3: { aside: "lg:col-span-3", main: "lg:col-span-9" },
    4: { aside: "lg:col-span-4", main: "lg:col-span-8" },
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      <Navbar />

      {/* Cambiato da 'flex' a 'grid grid-cols-12' */}
      <div className="grid grid-cols-12 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8 flex-1">
        {/* Sidebar Dinamica */}
        {sidebar && (
          <aside className={`hidden lg:block ${gridConfig[sidebarWidth].aside}`}>
            <div className="sticky top-24">{sidebar}</div>
          </aside>
        )}

        {/* Zona Contenuto Dinamico */}
        <main className={`col-span-12 ${sidebar ? gridConfig[sidebarWidth].main : "lg:col-span-12"} min-w-0`}>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-10 transition-all min-h-[600px]">
            <Outlet />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default MainLayout;
