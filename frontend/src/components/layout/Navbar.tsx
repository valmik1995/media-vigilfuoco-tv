import React, { useState } from "react";
import { useSearchStore } from "@/store/useSearchStore";
import { useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";
import logoVvf from "@/assets/logo_vvf.png";
import SocialLinks from "./SocialLinks";
import { Menu, X } from "lucide-react"; // Se non le hai, usa pure degli SVG o testo

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { searchQuery, setSearchQuery } = useSearchStore();
  const location = useLocation();
  // Decidiamo il placeholder in base alla pagina in cui si trova l'utente
  const getPlaceholder = () => {
    if (location.pathname.includes("storia")) return "Cerca nelle storie...";
    if (location.pathname.includes("visti-in-tv")) return "Cerca nei visti in TV...";
    return "Cerca...";
  };

  const isListPage = location.pathname === "/storia" || location.pathname === "/visti-in-tv";

  // Stile per i link su desktop (usando classi standard invece di template strings complesse)
  const getLinkClass = ({ isActive }: { isActive: boolean }) => `nav-link-vvf ${isActive ? "active" : ""}`;

  return (
    <header className="w-full shadow-md sticky top-0 z-50">
      {/* 1. TOP BAR ROSSA */}
      <div className="bg-[#D02635] text-white">
        <div className="header-main-bar">
          {/* Logo e Titolo (Sempre visibili) */}
          <div className="flex items-center gap-4 z-50">
            <img src={logoVvf} alt="Logo VVF" className="h-12 w-12 object-contain" />
            <NavLink to="/" className="font-black text-lg tracking-tighter" onClick={() => setIsOpen(false)}>
              VIGILFUOCO<span className="font-light">.TV</span>
            </NavLink>
          </div>

          {/* Hamburger Button (Visibile solo sotto i 1024px) */}
          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 text-white z-50 focus:outline-none">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          {/* WRAPPER RESPONSIVE: Qui dentro mettiamo i link e i social */}
          <div className={`vvf-nav-wrapper ${isOpen ? "is-open" : ""}`}>
            <nav className="flex flex-col lg:flex-row lg:items-center">
              <NavLink to="/eventi" className={getLinkClass} onClick={() => setIsOpen(false)}>
                Eventi Live
              </NavLink>
              <NavLink to="/stampa" className={getLinkClass} onClick={() => setIsOpen(false)}>
                Area Stampa
              </NavLink>
              <NavLink to="/storia" className={getLinkClass} onClick={() => setIsOpen(false)}>
                Storia
              </NavLink>
              <NavLink to="/comandi" className={getLinkClass} onClick={() => setIsOpen(false)}>
                Comandi
              </NavLink>
              <NavLink to="/mappe" className={getLinkClass} onClick={() => setIsOpen(false)}>
                Mappe
              </NavLink>
            </nav>

            {/* Social Links: In fondo su mobile, a destra su desktop */}
            <div className="p-4 lg:p-0 lg:ml-6 border-t border-white/10 lg:border-none">
              <SocialLinks />
            </div>
          </div>
        </div>
      </div>

      {/* 2. NEWS BAR (Resta sotto) */}
<div className="bg-slate-100 border-b border-slate-200 py-2 px-4">
  <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
    
    {/* Sezione News Ticker */}
    <div className="flex items-center text-[11px] text-slate-600 italic min-w-0 flex-1">
      <span className="font-bold text-red-700 mr-2 uppercase tracking-tighter whitespace-nowrap">
        Ultima pubblicazione:
      </span>
      <span className="truncate">
        INCENDIO TEATRO SANNAZARO: 5 SQUADRE AL LAVORO DALLE ORE...
      </span>
    </div>

    {/* Sezione Search Input - Appare solo nelle liste */}
    {isListPage && (
      <div className="relative w-full max-w-xs"> 
        <input
          type="text"
          className="w-full bg-slate-800 text-white text-xs px-4 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-red-500 transition-all"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={getPlaceholder()}
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')} 
            className="absolute right-2.5 top-1.5 text-slate-400 hover:text-white text-xs"
          >
            ✕
          </button>
        )}
      </div>
    )}

  </div>
</div>
    </header>
  );
};

export default Navbar;
