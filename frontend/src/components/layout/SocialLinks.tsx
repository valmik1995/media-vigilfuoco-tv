import React from 'react';

const SocialLinks: React.FC = () => {
  return (
    <div className="flex items-center gap-4 text-white/90">
      
      {/* YouTube */}
      <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" 
         className="hover:text-white transition-all transform hover:scale-110" title="YouTube">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 2-2h15a2 2 0 0 1 2 2 24.12 24.12 0 0 1 0 10 2 2 0 0 1-2 2h-15a2 2 0 0 1-2-2Z" />
          <path d="m10 15 5-3-5-3v6Z" />
        </svg>
      </a>

      {/* X (ex Twitter) */}
      <a href="https://x.com" target="_blank" rel="noopener noreferrer" 
         className="hover:text-white transition-all transform hover:scale-110" title="X (Twitter)">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
          <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
        </svg>
      </a>

      {/* Instagram */}
      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" 
         className="hover:text-white transition-all transform hover:scale-110" title="Instagram">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      </a>

      {/* Telegram */}
      <a href="https://t.me" target="_blank" rel="noopener noreferrer" 
         className="hover:text-white transition-all transform hover:scale-110 -rotate-12" title="Telegram">
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </a>

      {/* TikTok */}
      <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" 
         className="hover:text-white transition-all transform hover:scale-110" title="TikTok">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
        </svg>
      </a>

    </div>
  );
};

export default SocialLinks;