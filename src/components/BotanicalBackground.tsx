import React, { useState } from 'react';
import BOTANICAL_HEMP_BG from '../assets/images/botanical_hemp_bg_1790118122871.jpg';
import { Eye, Sparkles } from 'lucide-react';

interface BotanicalBackgroundProps {
  initialOpacity?: number;
}

export const BotanicalBackground: React.FC<BotanicalBackgroundProps> = ({ initialOpacity = 0.08 }) => {
  const [opacity, setOpacity] = useState<number>(initialOpacity);
  const [showControl, setShowControl] = useState<boolean>(false);

  return (
    <>
      {/* Seamless Ambient Wallpaper Layer with Opacity */}
      <div 
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none transition-opacity duration-700"
        style={{ opacity }}
      >
        <div 
          className="absolute inset-0 w-full h-full bg-repeat bg-center"
          style={{
            backgroundImage: `url(${BOTANICAL_HEMP_BG})`,
            backgroundSize: '800px auto',
            mixBlendMode: 'multiply',
          }}
        />
      </div>

      {/* Handcrafted Botanical Watermark SVGs with Cannabis Sativa & Herbal Flora */}
      <div 
        aria-hidden="true" 
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
        style={{ opacity: Math.min(1, opacity * 1.6) }}
      >
        {/* Top-Right Decorative Cannabis & Chamomile Sprig */}
        <div className="absolute -top-10 -right-10 w-96 h-96 text-[#2E4233] transition-opacity duration-700">
          <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            {/* Cannabis Sativa 7-leaflet palmate leaf */}
            <g transform="translate(110, 80) rotate(25) scale(0.7)">
              {/* Central leaflet */}
              <path d="M 0 0 C -4 -25 -10 -55 0 -85 C 10 -55 4 -25 0 0" fill="currentColor" fillOpacity="0.04" />
              <path d="M 0 0 L 0 -85" />
              {/* Serrations central */}
              <path d="M -2 -20 L -6 -23 M -4 -40 L -9 -43 M -3 -60 L -7 -63" />
              <path d="M 2 -20 L 6 -23 M 4 -40 L 9 -43 M 3 -60 L 7 -63" />
              
              {/* Lateral top pair */}
              <path d="M 0 0 C -15 -20 -35 -45 -35 -70 C -25 -50 -10 -25 0 0" fill="currentColor" fillOpacity="0.04" />
              <path d="M 0 0 C 15 -20 35 -45 35 -70 C 25 -50 10 -25 0 0" fill="currentColor" fillOpacity="0.04" />
              
              {/* Lateral mid pair */}
              <path d="M 0 0 C -25 -10 -55 -25 -65 -45 C -45 -30 -20 -12 0 0" fill="currentColor" fillOpacity="0.04" />
              <path d="M 0 0 C 25 -10 55 -25 65 -45 C 45 -30 20 -12 0 0" fill="currentColor" fillOpacity="0.04" />

              {/* Lower pair */}
              <path d="M 0 0 C -20 5 -50 0 -55 -15 C -40 -8 -15 -2 0 0" fill="currentColor" fillOpacity="0.04" />
              <path d="M 0 0 C 20 5 50 0 55 -15 C 40 -8 15 -2 0 0" fill="currentColor" fillOpacity="0.04" />

              {/* Petiole */}
              <path d="M 0 0 Q 2 20 6 35" strokeWidth="1.5" />
            </g>

            {/* Chamomile & Wild Flowers nearby */}
            <g transform="translate(60, 110) scale(0.55)">
              <circle cx="0" cy="0" r="10" fill="currentColor" fillOpacity="0.08" />
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                <ellipse key={deg} cx="0" cy="-22" rx="4" ry="12" transform={`rotate(${deg})`} fill="currentColor" fillOpacity="0.03" />
              ))}
              <path d="M 0 10 Q 5 50 -15 90" strokeWidth="1.2" />
              <path d="M 2 35 Q 15 30 25 35" />
            </g>
          </svg>
        </div>

        {/* Bottom-Left Botanical Watermark: Medicinal Flora & Cannabis Leaf */}
        <div className="absolute bottom-16 -left-12 w-96 h-96 text-[#243328] transition-opacity duration-700">
          <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            {/* Cannabis Sativa Palmate Silhouette */}
            <g transform="translate(90, 110) rotate(-35) scale(0.65)">
              {/* Central leaflet */}
              <path d="M 0 0 C -5 -25 -12 -58 0 -88 C 12 -58 5 -25 0 0" fill="currentColor" fillOpacity="0.05" />
              <path d="M 0 0 L 0 -88" />
              {/* Lateral top pair */}
              <path d="M 0 0 C -18 -20 -38 -48 -38 -74 C -26 -52 -10 -25 0 0" fill="currentColor" fillOpacity="0.05" />
              <path d="M 0 0 C 18 -20 38 -48 38 -74 C 26 -52 10 -25 0 0" fill="currentColor" fillOpacity="0.05" />
              {/* Lateral mid pair */}
              <path d="M 0 0 C -28 -10 -58 -28 -68 -48 C -48 -32 -22 -14 0 0" fill="currentColor" fillOpacity="0.05" />
              <path d="M 0 0 C 28 -10 58 -28 68 -48 C 48 -32 22 -14 0 0" fill="currentColor" fillOpacity="0.05" />
              {/* Lower pair */}
              <path d="M 0 0 C -22 6 -52 2 -58 -12 C -42 -6 -18 0 0 0" fill="currentColor" fillOpacity="0.05" />
              <path d="M 0 0 C 22 6 52 2 58 -12 C 42 -6 18 0 0 0" fill="currentColor" fillOpacity="0.05" />
              {/* Petiole */}
              <path d="M 0 0 Q -4 22 -8 38" strokeWidth="1.5" />
            </g>

            {/* Lavender / Rosemary Sprig */}
            <g transform="translate(130, 60) rotate(15) scale(0.6)">
              <path d="M 0 100 Q 10 50 0 0" strokeWidth="1.4" />
              {[15, 30, 45, 60, 75, 90].map((y) => (
                <React.Fragment key={y}>
                  <path d={`M 0 ${y} Q -15 ${y - 8} -22 ${y - 4}`} />
                  <path d={`M 0 ${y} Q 15 ${y - 8} 22 ${y - 4}`} />
                  <ellipse cx="-24" cy={y - 4} rx="3" ry="6" fill="currentColor" fillOpacity="0.06" />
                  <ellipse cx="24" cy={y - 4} rx="3" ry="6" fill="currentColor" fillOpacity="0.06" />
                </React.Fragment>
              ))}
            </g>
          </svg>
        </div>
      </div>

      {/* Floating Subtle Opacity Controller & Botanical Artistry Badge */}
      <aside 
        aria-label="Controle de fundo botânico"
        className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-30 flex flex-col items-end gap-2"
      >
        {showControl && (
          <div className="bg-[#FAF8F5]/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-[#D8CABE] text-[#243329] text-xs space-y-2.5 w-64 animate-fadeIn">
            <div className="flex items-center justify-between font-semibold border-b border-[#E7DDCF] pb-2 text-[11px] uppercase tracking-wider text-[#43574A]">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C2744E]" />
                Ilustrações de Fundo
              </span>
              <button 
                onClick={() => setShowControl(false)} 
                className="text-gray-400 hover:text-gray-700 text-xs px-1 font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-[11px] text-[#5A6C60] leading-snug">
              Gravuras botânicas autênticas com flores silvestres, ervas medicinais e folhas de <em>Cannabis sativa</em> (Cânhamo).
            </p>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-medium text-[#718276]">
                <span>Opacidade do Desenho:</span>
                <span>{Math.round(opacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.02"
                max="0.30"
                step="0.02"
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="w-full accent-[#243329] h-1.5 bg-[#E2D8C9] rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-[#8C9C90] pt-0.5">
                <button onClick={() => setOpacity(0.04)} className="hover:underline">Suave (4%)</button>
                <button onClick={() => setOpacity(0.08)} className="hover:underline">Padrão (8%)</button>
                <button onClick={() => setOpacity(0.18)} className="hover:underline">Vívido (18%)</button>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => setShowControl(!showControl)}
          title="Ajustar visibilidade do fundo botânico de flores, ervas e cânhamo"
          className="px-3 py-2 rounded-full bg-[#FAF8F5]/90 hover:bg-[#FAF8F5] text-[#28382E] shadow-md hover:shadow-lg border border-[#D5C7B3] text-[11px] font-semibold flex items-center gap-1.5 transition-all backdrop-blur-sm cursor-pointer"
        >
          <span className="text-sm">🌿</span>
          <span className="hidden sm:inline">Desenho Botânico & Cânhamo</span>
          <Eye className="w-3.5 h-3.5 text-[#C2744E]" />
        </button>
      </aside>
    </>
  );
};
