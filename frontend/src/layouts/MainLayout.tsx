import React from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';

const MainLayout: React.FC = () => {
  // Stile per i link attivi (per far capire all'utente dove si trova)
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-all ${
      isActive 
        ? 'bg-red-600 text-white shadow-md' 
        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
    }`;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      
      {/* Navbar - Migliorata con NavLink */}
      <nav className="sticky top-0 z-50 bg-slate-900 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl animate-pulse">🚒</span>
              <Link to="/" className="text-xl font-bold tracking-tight hover:text-red-500 transition-colors">
                VVF <span className="text-red-600">MEDIA</span> MANAGER
              </Link>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-2">
                {/* Nuova Navigazione Modulare */}
                <NavLink title="Gestione Immagini" to="/photos" className={navLinkClass}>
                   📸 Foto
                </NavLink>
                <NavLink title="Editing Video" to="/videos" className={navLinkClass}>
                   🎥 Video
                </NavLink>
                <div className="h-6 w-px bg-slate-700 mx-2"></div> {/* Separatore */}
                <NavLink title="Archivio Storico" to="/archivio" className={navLinkClass}>
                   📁 Archivio
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Container con effetto "Glassmorphism" leggero */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-10 transition-all">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2">
          <div className="flex justify-center gap-4 mb-4 opacity-50 grayscale hover:grayscale-0 transition-all">
            {/* Qui potresti mettere dei loghi istituzionali piccoli */}
          </div>
          <p className="text-slate-500 text-sm italic">
            "Sempre pronti, ovunque ci sia bisogno"
          </p>
          <p className="text-slate-400 text-xs">
            © 2026 Vigili del Fuoco - <span className="font-semibold text-slate-700 uppercase tracking-wider">Area Tecnica Digitale</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;