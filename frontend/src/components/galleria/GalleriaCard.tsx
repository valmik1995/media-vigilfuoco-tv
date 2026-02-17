// src/components/galleria/GalleriaCard.tsx
import { Galleria } from '../../api/galleriaService';

interface GalleriaCardProps {
  galleria: Galleria;
  onTagClick: (tagName: string) => void; // Aggiungiamo questa funzione alle props
}

export const GalleriaCard = ({ galleria, onTagClick }: GalleriaCardProps) => {
  return (
    <div className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-red-500 transition-all shadow-sm">
      <div className="aspect-video relative overflow-hidden">
        <img src={galleria.image_thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={galleria.title} />
      </div>
      <div className="p-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase mb-3">{galleria.title}</h3>
        <p className="mb-3 text-body">{galleria.description}</p>
        {/* Lista Tag Cliccabili */}
        <div className="flex flex-wrap gap-1">
          {galleria.tags.map(tag => (
            <button
              key={tag.id}
              onClick={() => onTagClick(tag.name)} // Al click chiamiamo la funzione passata dal padre
              className="text-[9px] font-black px-2 py-1 bg-slate-100 text-slate-500 rounded uppercase hover:bg-red-600 hover:text-white transition-colors"
            >
              #{tag.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};