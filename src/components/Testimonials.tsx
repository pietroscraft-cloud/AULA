import React, { useState } from 'react';
import { TESTIMONIALS_DATA } from '../data/content';
import { Star, CheckCircle, Quote, Sparkles, Filter } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const [filter, setFilter] = useState<string>('todos');

  const filteredTestimonials = TESTIMONIALS_DATA.filter((t) => {
    if (filter === 'todos') return true;
    if (filter === 'sensivel') return t.skinType.toLowerCase().includes('sensível');
    if (filter === 'madura') return t.skinType.toLowerCase().includes('madura') || t.skinType.toLowerCase().includes('mista');
    if (filter === 'manchas') return t.skinType.toLowerCase().includes('manchas') || t.skinType.toLowerCase().includes('ressecada');
    return true;
  });

  return (
    <section id="depoimentos" className="py-20 lg:py-28 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAE3D5] text-xs font-semibold uppercase tracking-widest text-[#243329]">
            <Sparkles className="w-3.5 h-3.5 text-[#9C5B39]" />
            Resultados Comprovados no Espelho
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#17211B] font-normal tracking-tight">
            Depoimentos reais de quem transformou o autocuidado.
          </h2>
          <p className="text-base sm:text-lg text-[#526057] font-light leading-relaxed">
            Mais de 12.000 clientes já abandonaram rotinas complexas e agressivas. 
            Veja como a transição para produtos botânicos e sustentáveis resgatou a saúde da pele de forma gentil e duradoura.
          </p>
        </div>

        {/* Metrics Banner */}
        <div className="mb-14 p-6 sm:p-8 rounded-3xl bg-[#F4EFE6] border border-[#E3D8C8] grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="space-y-1">
            <span className="font-serif text-4xl sm:text-5xl font-light text-[#17211B]">98%</span>
            <p className="text-xs sm:text-sm text-[#46544B] font-medium">
              Sentiram a pele mais macia, hidratada e com viço natural em 21 dias.
            </p>
          </div>
          <div className="space-y-1 border-y sm:border-y-0 sm:border-x border-[#DDD2C0] py-4 sm:py-0">
            <span className="font-serif text-4xl sm:text-5xl font-light text-[#9C5B39]">96%</span>
            <p className="text-xs sm:text-sm text-[#46544B] font-medium">
              Relataram redução expressiva de sensibilidade, repuxamento e vermelhidão.
            </p>
          </div>
          <div className="space-y-1">
            <span className="font-serif text-4xl sm:text-5xl font-light text-[#17211B]">100%</span>
            <p className="text-xs sm:text-sm text-[#46544B] font-medium">
              Aprovaram os aromas aromaterapêuticos 100% naturais sem fragrância sintética.
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 text-xs">
          <button
            onClick={() => setFilter('todos')}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              filter === 'todos'
                ? 'bg-[#243329] text-white shadow-sm'
                : 'bg-[#EFE9DE] text-[#445249] hover:bg-[#E4DCCE]'
            }`}
          >
            Todos os Relatos
          </button>
          <button
            onClick={() => setFilter('sensivel')}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              filter === 'sensivel'
                ? 'bg-[#243329] text-white shadow-sm'
                : 'bg-[#EFE9DE] text-[#445249] hover:bg-[#E4DCCE]'
            }`}
          >
            Pele Sensível & Rosácea
          </button>
          <button
            onClick={() => setFilter('madura')}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              filter === 'madura'
                ? 'bg-[#243329] text-white shadow-sm'
                : 'bg-[#EFE9DE] text-[#445249] hover:bg-[#E4DCCE]'
            }`}
          >
            Pele Madura & Mista
          </button>
          <button
            onClick={() => setFilter('manchas')}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              filter === 'manchas'
                ? 'bg-[#243329] text-white shadow-sm'
                : 'bg-[#EFE9DE] text-[#445249] hover:bg-[#E4DCCE]'
            }`}
          >
            Renovação de Marcas & Textura
          </button>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredTestimonials.map((t) => (
            <div
              key={t.id}
              className="bg-[#F8F5EE] rounded-3xl p-7 sm:p-8 border border-[#E4DCCE] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Rating and Quote icon */}
                <div className="flex items-center justify-between">
                  <div className="flex text-[#D17B49]">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-[#D5C7B4]" />
                </div>

                {/* Title */}
                <h3 className="font-serif text-xl sm:text-2xl text-[#19241D] font-medium leading-snug">
                  "{t.title}"
                </h3>

                {/* Quote body */}
                <p className="text-sm text-[#48564D] leading-relaxed font-light">
                  {t.quote}
                </p>

                {/* Skin context badge */}
                <div className="p-3 rounded-xl bg-[#EFE9DF] border border-[#E0D5C4] flex items-center justify-between text-xs">
                  <span className="text-[#647269]">
                    Tipo de Pele: <strong className="text-[#2B3830] font-semibold">{t.skinType}</strong>
                  </span>
                  <span className="text-[#845034] font-medium">
                    {t.timeUsing}
                  </span>
                </div>
              </div>

              {/* Author footer with avatar */}
              <div className="pt-6 mt-6 border-t border-[#E8DFCFA0] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {t.avatarUrl ? (
                    <img
                      src={t.avatarUrl}
                      alt={t.name}
                      className="w-11 h-11 rounded-full object-cover border border-[#D5C8B6]"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-[#E5DCCF] flex items-center justify-center font-serif text-lg text-[#253229]">
                      {t.name.charAt(0)}
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-semibold text-[#1B2620] flex items-center gap-1.5">
                      {t.name}
                      {t.verified && (
                        <span title="Compra Verificada" className="inline-flex">
                          <CheckCircle className="w-3.5 h-3.5 text-[#3F634A]" />
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-[#718076]">
                      {t.age} anos • {t.city}
                    </p>
                  </div>
                </div>

                <div className="text-right hidden sm:block">
                  <span className="text-[10px] uppercase tracking-wider text-[#79887E] block">
                    Fórmula Favorita:
                  </span>
                  <span className="text-xs font-serif font-medium text-[#2A372F]">
                    {t.favoriteProduct}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* User satisfaction promise */}
        <div className="mt-14 text-center">
          <p className="text-xs uppercase tracking-widest text-[#7D8C82]">
            Depoimentos coletados e verificados de compras reais • Atualizado mensalmente
          </p>
        </div>

      </div>
    </section>
  );
};
