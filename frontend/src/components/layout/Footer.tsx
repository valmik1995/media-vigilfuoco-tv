import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Griglia a 4 colonne: 1 su mobile, 2 su tablet, 4 su desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Colonna 1: Identità & Brand */}
          <div className="space-y-4">
            <div className="text-white font-bold text-lg italic tracking-wider">
              VVF <span className="text-red-600">MEDIA</span>
            </div>
            <p className="text-sm opacity-60 leading-relaxed">
              Il portale dedicato alla memoria storica e alla documentazione operativa del Corpo Nazionale dei Vigili del Fuoco.
            </p>
          </div>

          {/* Colonna 2: Risorse & Navigazione */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Risorse</h4>
            <ul className="text-sm space-y-2 opacity-70">
              <li><Link to="/visti-in-tv" className="hover:text-red-500 transition-colors">Visti in TV</Link></li>
              <li><Link to="/storia" className="hover:text-red-500 transition-colors">Storia</Link></li>
              <li><Link to="/videos" className="hover:text-red-500 transition-colors">Canale Video</Link></li>
            </ul>
          </div>

          {/* Colonna 3: Soccorso & Emergenza */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Soccorso</h4>
            <div className="text-red-500 font-black text-3xl mb-2 flex items-center gap-2">
              <span role="img" aria-label="phone">📞</span> 115
            </div>
            <p className="text-xs opacity-50 italic">
              Chiamata gratuita, attiva 24h/24h su tutto il territorio nazionale.
            </p>
          </div>

          {/* Colonna 4: Info Ministeriali */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Ministero</h4>
            <p className="text-xs opacity-60">Ministero dell'Interno</p>
            <p className="text-xs opacity-60">Dipartimento dei Vigili del Fuoco</p>
            <p className="text-xs opacity-60 mt-4 underline cursor-pointer hover:text-white transition-colors">
              Note Legali & Privacy
            </p>
          </div>
        </div>

        {/* Parte finale: Copyright e Motto */}
        <div className="pt-8 border-t border-slate-800 text-center">
          <p className="text-slate-500 text-xs italic">"Sempre pronti, ovunque ci sia bisogno"</p>
          <p className="text-slate-400 text-[10px] mt-2 tracking-widest uppercase font-semibold">
            © 2026 Area Tecnica Digitale
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;