import React, { useEffect, useState } from 'react';
import { galleriaService, Galleria } from '../api/galleriaService'; // Aggiornato import
import { Link } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  // Lo stato ora gestisce un array di Gallerie
  const [gallerie, setGallerie] = useState<Galleria[]>([]);
  const [status, setStatus] = useState({ 
    django: 'checking', 
    worker: 'online',
    totalCount: 0 
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await galleriaService.getGallerie();
        
        // CORREZIONE QUI:
        // 'data' ora è { count: 100, results: [...], next: ..., previous: ... }
        // Dobbiamo passare .results (che è l'array) a setGallerie
        setGallerie(data.results); 
        
        setStatus(prev => ({ 
          ...prev, 
          django: 'online', 
          totalCount: data.count // Django ci dà il totale nel campo 'count'
        }));
      } catch (e) {
        console.error("Errore fetch dashboard", e);
        setStatus(prev => ({ ...prev, django: 'offline' }));
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Intestazione */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight uppercase">Centrale Operativa Media</h1>
        <p className="text-slate-500 font-medium">Monitoraggio sistema e attività recente dei Vigili del Fuoco.</p>
      </div>

      {/* Widget Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Stato Backend" 
          value={status.django === 'online' ? 'Attivo' : 'Offline'} 
          icon="⚡" 
          color={status.django === 'online' ? 'green' : 'red'} 
          pulse={status.django === 'online'}
        />
        <StatCard 
          title="Totale Gallerie" 
          value={status.totalCount} 
          icon="🗄️" 
          color="blue" 
        />
        <StatCard 
          title="Worker Celery" 
          value="In ascolto" 
          icon="⚙️" 
          color="green" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Azioni Rapide & Anteprime Gallerie */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-black mb-4 text-slate-400 uppercase tracking-widest">Azioni Rapide</h3>
            <div className="grid grid-cols-2 gap-4">
              <Link to="/photos" className="p-4 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-all flex flex-col items-center gap-2 group border border-red-100">
                <span className="text-3xl group-hover:scale-110 transition-transform">🖼️</span>
                <span className="font-bold uppercase text-[10px] tracking-widest">Watermark</span>
              </Link>
              <Link to="/videos" className="p-4 bg-slate-800 text-white rounded-xl hover:bg-slate-900 transition-all flex flex-col items-center gap-2 group border border-slate-700">
                <span className="text-3xl group-hover:scale-110 transition-transform">🎬</span>
                <span className="font-bold uppercase text-[10px] tracking-widest">Processing Video</span>
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-black mb-4 text-slate-400 uppercase tracking-widest">Ultime Gallerie Caricate</h3>
            <div className="grid grid-cols-4 gap-2">
              {gallerie.slice(0, 4).map(g => (
                <div key={g.id} className="aspect-square bg-slate-100 rounded-lg overflow-hidden border border-slate-200 shadow-inner group relative">
                  <img src={g.image_thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt={g.title} />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
              {gallerie.length === 0 && <p className="col-span-4 text-slate-400 text-xs italic p-4 text-center">Nessun media presente in archivio.</p>}
            </div>
          </div>
        </div>

        {/* Tabella Attività Tecnica */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Log Elaborazioni Recenti</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-black">
                <tr>
                  <th className="p-4">Anteprima</th>
                  <th className="p-4">Identificativo</th>
                  <th className="p-4">Stato Task</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {gallerie.slice(0, 6).map(g => (
                  <tr key={g.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <img src={g.image_thumbnail} className="w-10 h-7 object-cover rounded shadow-sm border border-slate-200" />
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-700 text-xs uppercase truncate max-w-[150px]">{g.title}</span>
                        <span className="font-mono text-[9px] text-slate-400">UUID: {g.id}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-[9px] font-black uppercase border border-green-200">
                        Pronto
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-slate-50 text-center border-t border-slate-100">
             <Link to="/galleria" className="text-[10px] font-black text-red-600 hover:text-red-700 uppercase tracking-tighter">
               Accedi all'Archivio Integrale Galleria →
             </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

// Componente StatCard (Rimasto invariato ma con tipi definiti meglio)
const StatCard = ({ title, value, icon, color, pulse }: { title: string, value: string | number, icon: string, color: string, pulse?: boolean }) => {
  const colorMap: Record<string, string> = {
    red: "text-red-600 bg-red-50 border-red-100",
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    green: "text-green-600 bg-green-50 border-green-100"
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 flex items-center justify-center rounded-xl text-2xl border ${colorMap[color]}`}>
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
          <p className="text-xl font-bold text-slate-900 tracking-tight">{value}</p>
        </div>
      </div>
      {pulse && (
        <div className="flex h-3 w-3 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;