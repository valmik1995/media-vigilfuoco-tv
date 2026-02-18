import React from "react";
import { DetailLayoutProps } from "@/types/detail";
import { Download, Calendar, MapPin } from "lucide-react";

const DetailLayout: React.FC<DetailLayoutProps> = (props) => {
  const { videos = [], immagini = [], title, content, slug } = props;

  // La tua funzione di download portata nel layout universale
  const handleDownload = async (url: string, fileName: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (e) {
      window.open(url, "_blank");
    }
  };

  const haFotoExtra = immagini.length > videos.length;

  return (
    <article className="vvf-detail-container">
      <header className="space-y-4">
        <h1 className="vvf-detail-title">{title}</h1>
        <div className="vvf-detail-meta">
          {props.date && <span className="font-bold border-r pr-4 border-slate-300">{props.date}</span>}
          {props.location && <span className="vvf-detail-badge">{props.location}</span>}
        </div>
      </header>

      {/* SEZIONE VIDEO DINAMICA */}
      <section className="space-y-6 mt-6">
        {videos.map((videoUrl, index) => (
          <div key={index} className="vvf-video-card">
            <video controls poster={immagini[index]} className="w-full aspect-video">
              <source src={videoUrl} type="video/mp4" />
            </video>
            <div className="vvf-video-footer">
              <span className="vvf-video-label">Video {index + 1}</span>
              <button onClick={() => handleDownload(videoUrl, `${slug || "video"}-${index + 1}.mp4`)} className="vvf-download-btn">
                <Download size={14} strokeWidth={3} /> Scarica Video
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* CORPO DEL TESTO */}
      <div className="vvf-prose mt-8" dangerouslySetInnerHTML={{ __html: content }} />

      {/* GALLERIA EXTRA (Se presente) */}
      {haFotoExtra && (
        <section className="vvf-gallery-grid mt-10">
          <h2 className="col-span-full text-xl font-black uppercase mb-4 text-slate-400">Galleria Fotografica</h2>
          {immagini.slice(videos.length).map((img, idx) => (
            <div key={idx} className="vvf-gallery-item">
              <img src={img} alt={`Dettaglio ${idx}`} className="vvf-gallery-img" />
            </div>
          ))}
        </section>
      )}
    </article>
  );
};

export default DetailLayout;
