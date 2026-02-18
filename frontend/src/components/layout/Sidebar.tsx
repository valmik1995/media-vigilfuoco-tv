import { NavLink } from "react-router-dom";
import { Home, Zap, History, Map, Database, Tag } from "lucide-react";

const Sidebar = () => {
  // Funzione per lo stile dinamico (Tailwind v4)
  const navItemClass = ({ isActive }: { isActive: boolean }) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${isActive ? "bg-red-50 text-vvf-red border-l-4 border-vvf-red rounded-l-none" : "text-slate-600 hover:bg-slate-100 hover:text-vvf-red"}`;

  const mainLinks = [
    { name: "Dashboard", path: "/", icon: <Home size={18} /> },
    { name: "Ultimi Interventi", path: "/interventi", icon: <Zap size={18} /> },
    { name: "Mezzi Storici", path: "/mezzi", icon: <History size={18} /> },
    { name: "Comandi Locali", path: "/comandi", icon: <Map size={18} /> },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Sezione Navigazione Principale */}
      <div>
        <h3 className="px-4 text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Esplora</h3>
        <nav className="flex flex-col gap-1">
          {mainLinks.map((link) => (
            <NavLink key={link.path} to={link.path} className={navItemClass}>
              {link.icon}
              {link.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Sezione Statistiche Rapide */}
      <div className="mx-4 p-4 bg-vvf-dark rounded-xl text-white">
        <p className="text-[10px] uppercase opacity-70 mb-1">Totale Gallerie</p>
        <p className="text-2xl font-black">1.338</p>
      </div>
    </div>
  );
};

// QUESTA È LA RIGA FONDAMENTALE CHE MANCAVA:
export default Sidebar;
