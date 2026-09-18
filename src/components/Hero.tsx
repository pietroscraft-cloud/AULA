import React from 'react';
import { ArrowRight, Sparkles, Leaf, ShieldCheck, Droplet, Star } from 'lucide-react';
import { HERO_IMAGE } from '../data/content';

interface HeroProps {
  onStartRitual: () => void;
  onExploreIngredients: () => void;
  onViewCatalog: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartRitual, onExploreIngredients, onViewCatalog }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Subtle organic light background accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#EDE5D8]/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#E5DFD3]/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Editorial Typography & Compelling Value Proposition */}
          <div className="lg:col-span-7 space-y-7">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#EFE8DC] border border-[#DDD3C2] text-xs text-[#2F3D33] font-medium tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#41624B] animate-pulse" />
              <span>Autocuidado Holístico & Fórmulas 100% Limpas</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.12] text-[#17211B] tracking-tight font-normal">
              A sabedoria da terra para transformar o seu{' '}
              <span className="italic font-normal text-[#9C5B39] underline decoration-[#E4C8B8] underline-offset-8">
                ritual diário
              </span>{' '}
              de autocuidado.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#47544C] leading-relaxed max-w-2xl font-light">
              Fórmulas puras, orgânicas e sustentáveis que respeitam a inteligência biológica da sua pele. 
              Substitua rotinas complexas e agressivas por três gestos minimalistas que nutrem, regeneram e devolvem o viço natural.
            </p>

            {/* Primary & Secondary Call to Action (Claro e convidativo) */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                id="btn-hero-ver-catalogo"
                onClick={onViewCatalog}
                className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#223126] hover:bg-[#152019] text-[#FAF8F5] text-sm font-semibold uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-xl active:scale-[0.99]"
              >
                <span>Ver Catálogo & Ofertas</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#8C4E2D] text-white font-bold">
                  Até 32% OFF
                </span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-[#E3A882]" />
              </button>

              <button
                id="btn-hero-cta-principal"
                onClick={onStartRitual}
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full border border-[#CFC5B4] bg-[#FAF8F5]/90 hover:bg-[#EFE9DF] text-sm text-[#2A362E] font-medium transition-colors"
              >
                <Sparkles className="w-4 h-4 text-[#C2744E]" />
                <span>Quiz do Meu Ritual</span>
              </button>
            </div>

            {/* Social Proof Mini Bar */}
            <div className="pt-4 border-t border-[#E8DFCFA0] flex flex-wrap items-center gap-6 text-xs text-[#526056]">
              <div className="flex items-center gap-2">
                <div className="flex text-[#D17B49]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="font-semibold text-[#1C251F]">4.94 / 5</span>
                <span className="text-[#6D7B72]">(+1.200 avaliações reais)</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-[#DCD3C3]" />
              <div className="flex items-center gap-2 text-[#3B483F]">
                <ShieldCheck className="w-4 h-4 text-[#41624B]" />
                <span>Garantia de 30 dias de transformação</span>
              </div>
            </div>

            {/* Clean Certification Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-[#F6F2EB] border border-[#E9E1D4] flex items-center gap-2.5">
                <Leaf className="w-4 h-4 text-[#41624B] shrink-0" />
                <span className="text-xs font-medium text-[#2E3C32] leading-tight">100% Bioativo & Orgânico</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F6F2EB] border border-[#E9E1D4] flex items-center gap-2.5">
                <Droplet className="w-4 h-4 text-[#41624B] shrink-0" />
                <span className="text-xs font-medium text-[#2E3C32] leading-tight">Zero Parabenos ou Petrolatos</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F6F2EB] border border-[#E9E1D4] flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#41624B] shrink-0" />
                <span className="text-xs font-medium text-[#2E3C32] leading-tight">Certificação Cruelty-Free</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F6F2EB] border border-[#E9E1D4] flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-[#C2744E] shrink-0" />
                <span className="text-xs font-medium text-[#2E3C32] leading-tight">Embalagens Circulares</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Photography Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Decorative minimal border frame */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#E4DCCE] bg-[#F2EDE5]">
                <img
                  src={HERO_IMAGE}
                  alt="Cosméticos naturais botânicos em frasco de vidro e pedra travertino"
                  className="w-full h-auto object-cover aspect-[4/5] sm:aspect-[4/4] lg:aspect-[4/5] transition-transform duration-700 hover:scale-102"
                  referrerPolicy="no-referrer"
                />

                {/* Floating Experience Card */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-[#FAF8F5]/95 backdrop-blur-md border border-[#E5DDD0] shadow-md flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#9C5B39] block">
                      Ritual Minimalista
                    </span>
                    <h4 className="text-sm font-serif font-medium text-[#1A251E]">
                      3 Etapas • 4 Minutos ao Dia
                    </h4>
                    <p className="text-xs text-[#526156]">
                      98% sentiram a pele visivelmente radiante em 21 dias
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#EAE2D5] flex items-center justify-center text-[#243329] shrink-0 ml-3">
                    <Sparkles className="w-5 h-5 text-[#C2744E]" />
                  </div>
                </div>
              </div>

              {/* Minimal stamp element */}
              <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-[#243329] text-[#FAF8F5] p-2 flex flex-col items-center justify-center text-center shadow-lg border-2 border-[#FAF8F5]">
                <span className="text-[9px] uppercase tracking-wider font-semibold text-[#E3A882]">Fórmula</span>
                <span className="font-serif text-lg font-bold">100%</span>
                <span className="text-[9px] uppercase tracking-wider text-gray-300">Pura & Viva</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
