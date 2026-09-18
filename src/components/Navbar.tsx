import React, { useState } from 'react';
import { ShoppingBag, Sparkles, Menu, X, Check, ShieldCheck, Heart, Leaf } from 'lucide-react';
import { CartItem } from '../types';

interface NavbarProps {
  cart: CartItem[];
  onOpenCart: () => void;
  onOpenConsultant: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ cart, onOpenCart, onOpenConsultant }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#FAF8F5]/95 border-b border-[#ECE5DA] transition-all">
      {/* Top Announcement Banner */}
      <div className="bg-[#243329] text-[#F3EFEA] text-xs py-2 px-4 text-center flex items-center justify-center gap-3">
        <span className="inline-flex items-center gap-1.5 font-medium tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-[#E3A882]" />
          Cupom de Boas-Vindas: use <strong className="text-[#E3A882] tracking-wider">BEMVINDA15</strong> para 15% OFF
        </span>
        <span className="hidden sm:inline text-white/30">•</span>
        <span className="hidden sm:inline text-[#E8E2D5]/90">
          Frete grátis para todo o Brasil acima de R$ 180
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo - Perfeitamente enquadrado com badge e tipografia fina */}
          <div 
            id="brand-logo-aura"
            className="flex items-center gap-3.5 cursor-pointer select-none group" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-[#243329] to-[#17221A] p-0.5 shadow-sm group-hover:shadow transition-all duration-300">
              <div className="w-full h-full rounded-[14px] bg-[#FAF8F5] flex items-center justify-center border border-[#E5DBCE]/60">
                <span className="font-serif italic text-2xl font-light text-[#243329] group-hover:text-[#8C4E2D] transition-colors">
                  A
                </span>
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#8C4E2D] border-2 border-[#FAF8F5] flex items-center justify-center shadow-xs">
                <Leaf className="w-2 h-2 text-white" />
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl tracking-[0.18em] text-[#1E2721] uppercase font-medium leading-none">
                Aura Botânica
              </span>
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.26em] text-[#78887F] font-sans font-medium mt-1">
                Autocuidado Consciente
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm tracking-wide text-[#3D4740]">
            <button
              onClick={() => scrollTo('o-ritual')}
              className="hover:text-[#1E2721] transition-colors py-1 relative group font-medium"
            >
              O Ritual
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C2744E] transition-all duration-300 group-hover:w-full" />
            </button>
            <button
              onClick={() => scrollTo('ingredientes')}
              className="hover:text-[#1E2721] transition-colors py-1 relative group font-medium"
            >
              Ingredientes Orgânicos
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C2744E] transition-all duration-300 group-hover:w-full" />
            </button>
            <button
              onClick={() => scrollTo('produtos')}
              className="hover:text-[#1E2721] transition-colors py-1 relative group font-medium"
            >
              Coleção
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C2744E] transition-all duration-300 group-hover:w-full" />
            </button>
            <button
              onClick={() => scrollTo('depoimentos')}
              className="hover:text-[#1E2721] transition-colors py-1 relative group font-medium"
            >
              Depoimentos Reais
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C2744E] transition-all duration-300 group-hover:w-full" />
            </button>
            <button
              onClick={() => scrollTo('perguntas')}
              className="hover:text-[#1E2721] transition-colors py-1 relative group font-medium"
            >
              Dúvidas
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C2744E] transition-all duration-300 group-hover:w-full" />
            </button>
          </nav>

          {/* Right Action Icons & CTA */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={onOpenConsultant}
              className="hidden lg:inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#D5C9B7] bg-[#F7F3EC] hover:bg-[#EFE8DC] text-xs uppercase tracking-wider text-[#2A362E] font-medium transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C2744E]" />
              Descobrir Meu Ritual
            </button>

            {/* Cart Button com Destaque Diferenciado Especial */}
            <button
              id="btn-abrir-carrinho"
              onClick={onOpenCart}
              aria-label="Abrir sacola de autocuidado"
              className={`relative py-2 px-3.5 sm:px-4 rounded-full border transition-all duration-200 flex items-center gap-2 shadow-xs group ${
                totalItems > 0 
                  ? 'border-[#243329] bg-[#243329] text-white hover:bg-[#16211A] shadow-md hover:shadow-lg' 
                  : 'border-[#D5C9B7] bg-[#F8F4ED] hover:bg-[#EDE5D7] text-[#1E2721]'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <ShoppingBag className={`w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform group-hover:scale-110 ${totalItems > 0 ? 'text-[#E3A882]' : 'text-[#243329]'}`} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2.5 bg-[#8C4E2D] text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-[#243329] shadow-xs animate-pulse">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider hidden sm:inline-block">
                Sacola {totalItems > 0 ? `(${totalItems})` : ''}
              </span>
            </button>

            {/* Primary Action Button */}
            <button
              id="btn-header-ritual"
              onClick={() => scrollTo('produtos')}
              className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#8C4E2D] hover:bg-[#743F24] text-[#FAF8F5] text-xs font-semibold tracking-wider uppercase transition-all shadow-sm hover:shadow"
            >
              Começar Ritual
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#243329] focus:outline-none"
              aria-label="Alternar menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF8F5] border-b border-[#ECE5DA] px-6 py-6 space-y-4 shadow-lg">
          <div className="flex flex-col gap-3 text-base text-[#243329] font-medium">
            <button
              onClick={() => scrollTo('o-ritual')}
              className="text-left py-2 border-b border-[#F0E9DF]"
            >
              O Ritual de Autocuidado
            </button>
            <button
              onClick={() => scrollTo('ingredientes')}
              className="text-left py-2 border-b border-[#F0E9DF]"
            >
              Ingredientes Orgânicos & Sustentáveis
            </button>
            <button
              onClick={() => scrollTo('produtos')}
              className="text-left py-2 border-b border-[#F0E9DF]"
            >
              Nossa Coleção Botânica
            </button>
            <button
              onClick={() => scrollTo('depoimentos')}
              className="text-left py-2 border-b border-[#F0E9DF]"
            >
              Depoimentos de Clientes
            </button>
            <button
              onClick={() => scrollTo('perguntas')}
              className="text-left py-2 border-b border-[#F0E9DF]"
            >
              Perguntas Frequentes
            </button>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenConsultant();
              }}
              className="w-full py-3 rounded-full border border-[#D5C9B7] bg-[#F7F3EC] text-xs font-semibold uppercase tracking-wider text-[#2A362E] flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#C2744E]" />
              Quiz: Descubra Seu Ritual Ideal
            </button>
            <button
              onClick={() => scrollTo('produtos')}
              className="w-full py-3 rounded-full bg-[#243329] text-white text-xs font-semibold uppercase tracking-wider"
            >
              Ver Fórmulas Botânicas
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
