import React from 'react';
import { Home, Sparkles, Tag, ShoppingBag, Leaf } from 'lucide-react';
import { CartItem } from '../types';

interface MobileBottomNavProps {
  cart: CartItem[];
  onOpenCart: () => void;
  onOpenConsultant: () => void;
  onNavigatePromotions: () => void;
  onNavigateRitual: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  cart,
  onOpenCart,
  onOpenConsultant,
  onNavigatePromotions,
  onNavigateRitual,
}) => {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav 
      aria-label="Navegação Rápida Android"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-lg border-t border-[#DFD5C6] px-2 py-2 shadow-2xl safe-area-pb"
    >
      <div className="grid grid-cols-5 gap-1 items-center max-w-md mx-auto">
        {/* Início */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex flex-col items-center justify-center py-1 px-1 rounded-xl text-[#5A6860] hover:text-[#243329] active:scale-95 transition-all"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">Início</span>
        </button>

        {/* 4 Pilares / Rituais */}
        <button
          onClick={onNavigateRitual}
          className="flex flex-col items-center justify-center py-1 px-1 rounded-xl text-[#5A6860] hover:text-[#243329] active:scale-95 transition-all"
        >
          <Leaf className="w-5 h-5 text-[#3F634A]" />
          <span className="text-[10px] font-medium mt-1">Rituais</span>
        </button>

        {/* Quest / Diagnóstico */}
        <button
          onClick={onOpenConsultant}
          className="flex flex-col items-center justify-center py-1 px-1 rounded-xl relative group active:scale-95 transition-all text-[#8C4E2D]"
        >
          <div className="w-8 h-8 rounded-full bg-[#8C4E2D] text-white flex items-center justify-center shadow-md -mt-3 ring-4 ring-[#FAF8F5]">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <span className="text-[10px] font-bold mt-0.5 text-[#8C4E2D]">Quest</span>
        </button>

        {/* Promoções */}
        <button
          onClick={onNavigatePromotions}
          className="flex flex-col items-center justify-center py-1 px-1 rounded-xl text-[#5A6860] hover:text-[#243329] active:scale-95 transition-all"
        >
          <Tag className="w-5 h-5 text-[#8C4E2D]" />
          <span className="text-[10px] font-medium mt-1">Ofertas</span>
        </button>

        {/* Sacola */}
        <button
          onClick={onOpenCart}
          className="flex flex-col items-center justify-center py-1 px-1 rounded-xl text-[#5A6860] hover:text-[#243329] active:scale-95 transition-all relative"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-[#243329]" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-[#8C4E2D] text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-bounce shadow-xs">
                {totalItems}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium mt-1">Sacola</span>
        </button>
      </div>
    </nav>
  );
};
