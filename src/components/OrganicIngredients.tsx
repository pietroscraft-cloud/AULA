import React, { useState } from 'react';
import { INGREDIENTS_DATA, BOTANICAL_MACRO_IMAGE } from '../data/content';
import { Leaf, ShieldCheck, HeartHandshake, Check, Sparkles, Droplet, Sun, Globe } from 'lucide-react';

export const OrganicIngredients: React.FC = () => {
  const [selectedIngredient, setSelectedIngredient] = useState(INGREDIENTS_DATA[0]);

  return (
    <section id="ingredientes" className="py-20 lg:py-28 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAE2D5] text-xs font-semibold uppercase tracking-widest text-[#243329]">
            <Leaf className="w-3.5 h-3.5 text-[#3F634A]" />
            Pureza Rastreável do Solo ao Frasco
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#17211B] font-normal tracking-tight">
            Os benefícios dos ingredientes orgânicos & sustentáveis.
          </h2>
          <p className="text-base sm:text-lg text-[#4F5D54] font-light leading-relaxed">
            Acreditamos na bio-afinidade: quando os ativos são cultivados organicamente em solos vivos, sem agrotóxicos ou solventes de petróleo, eles retêm até 4x mais antioxidantes naturais, reconhecidos imediatamente pela sua barreira celular.
          </p>
        </div>

        {/* 4 Core Pillars of Sustainable Skincare */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="p-6 rounded-2xl bg-[#F4EFE7] border border-[#E5DDD0] space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#E5DBCB] flex items-center justify-center text-[#243329]">
              <Sun className="w-5 h-5 text-[#9C5B39]" />
            </div>
            <h3 className="font-serif text-lg font-medium text-[#1A251E]">Prensagem a Frio</h3>
            <p className="text-xs sm:text-sm text-[#505E55] leading-relaxed">
              Sem calor excessivo ou solventes químicos industriais. Os ácidos graxos essenciais e vitaminas chegam intactos à sua pele.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#F4EFE7] border border-[#E5DDD0] space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#E5DBCB] flex items-center justify-center text-[#243329]">
              <HeartHandshake className="w-5 h-5 text-[#3F634A]" />
            </div>
            <h3 className="font-serif text-lg font-medium text-[#1A251E]">Comércio Justo & Floresta em Pé</h3>
            <p className="text-xs sm:text-sm text-[#505E55] leading-relaxed">
              Manteigas e óleos colhidos por cooperativas ribeirinhas amazônicas que protegem a biodiversidade florestal.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#F4EFE7] border border-[#E5DDD0] space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#E5DBCB] flex items-center justify-center text-[#243329]">
              <Droplet className="w-5 h-5 text-[#3F634A]" />
            </div>
            <h3 className="font-serif text-lg font-medium text-[#1A251E]">Biocompatibilidade Celular</h3>
            <p className="text-xs sm:text-sm text-[#505E55] leading-relaxed">
              Fitoativos que se fundem perfeitamente com os lipídios humanos, sem entupir os poros nem gerar oleosidade rebote.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#F4EFE7] border border-[#E5DDD0] space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#E5DBCB] flex items-center justify-center text-[#243329]">
              <Globe className="w-5 h-5 text-[#9C5B39]" />
            </div>
            <h3 className="font-serif text-lg font-medium text-[#1A251E]">Vidro Violeta & Circularidade</h3>
            <p className="text-xs sm:text-sm text-[#505E55] leading-relaxed">
              Embalagens de vidro biofotônico que protegem a energia dos botânicos sem gerar microplásticos nos oceanos.
            </p>
          </div>
        </div>

        {/* Interactive Bioactive Ingredient Explorer */}
        <div className="bg-[#F6F2EA] rounded-3xl border border-[#E5DDD0] p-6 sm:p-10 shadow-lg">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* List of active botanicals */}
            <div className="w-full lg:w-5/12 space-y-2">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-[#8B5335] block mb-3">
                Clique para explorar cada fitoativo orgânico:
              </span>
              {INGREDIENTS_DATA.map((ingredient) => {
                const isSelected = selectedIngredient.id === ingredient.id;
                return (
                  <button
                    key={ingredient.id}
                    id={`btn-ingrediente-${ingredient.id}`}
                    onClick={() => setSelectedIngredient(ingredient)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-200 border flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#FAF8F5] border-[#C7B59E] shadow-sm text-[#18231C]'
                        : 'bg-[#EFE9DF]/60 border-transparent hover:bg-[#FAF8F5]/60 text-[#445249]'
                    }`}
                  >
                    <div>
                      <h4 className="font-serif text-base font-semibold text-[#1B251F]">
                        {ingredient.name}
                      </h4>
                      <span className="text-xs text-[#6A786F] italic">
                        {ingredient.scientificName}
                      </span>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#E6DDCF] text-[#3A4940] shrink-0 ml-2">
                      {ingredient.category}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Focused ingredient dossier */}
            <div className="w-full lg:w-7/12 bg-[#FAF8F5] rounded-2xl p-6 sm:p-8 border border-[#E3D8C8] space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#ECE3D5]">
                <div>
                  <span className="text-[11px] uppercase tracking-widest text-[#9C5B39] font-bold">
                    Origem Certificada
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#17211B] font-medium">
                    {selectedIngredient.name}
                  </h3>
                  <p className="text-xs text-[#6C7B71] italic">
                    {selectedIngredient.scientificName} • {selectedIngredient.origin}
                  </p>
                </div>
              </div>

              {/* Bioactive description */}
              <p className="text-sm sm:text-base text-[#46544B] leading-relaxed">
                {selectedIngredient.description}
              </p>

              {/* Verified Benefits for Skin */}
              <div className="space-y-2.5">
                <span className="text-xs uppercase font-bold tracking-wider text-[#2B3830]">
                  Ação celular comprovada no autocuidado:
                </span>
                <div className="space-y-2">
                  {selectedIngredient.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#38453D]">
                      <div className="w-4 h-4 rounded-full bg-[#E1D6C5] flex items-center justify-center text-[#243329] shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-[#3F634A]" />
                      </div>
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sustainable commitment */}
              <div className="p-4 rounded-xl bg-[#F4EFE6] border border-[#E5DDD0] space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#3F634A] uppercase tracking-wider">
                  <HeartHandshake className="w-4 h-4" />
                  <span>Impacto Regenerativo & Sustentabilidade</span>
                </div>
                <p className="text-xs text-[#4F5D54]">
                  {selectedIngredient.sustainableCommitment}
                </p>
              </div>

              {/* Certifications badges */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {selectedIngredient.certifications.map((cert, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDE6DC] text-[#344238] text-[11px] font-medium"
                  >
                    <ShieldCheck className="w-3 h-3 text-[#3F634A]" />
                    {cert}
                  </span>
                ))}
              </div>

            </div>

          </div>
        </div>

        {/* Clean Beauty Banned List ("O que NUNCA entra em nossas fórmulas") */}
        <div className="mt-16 bg-[#212E25] text-[#FAF8F5] rounded-3xl p-8 sm:p-12 border border-[#334237] shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-3">
              <span className="text-xs uppercase tracking-widest font-bold text-[#E3A882]">
                Nosso Compromisso Radical
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-normal leading-tight">
                Mais de 2.700 toxinas banidas para sempre da sua pele.
              </h3>
              <p className="text-sm text-[#C8D1CA] font-light leading-relaxed">
                Enquanto cosméticos convencionais utilizam parabenos e derivados do petróleo como conservantes baratos, 
                nossas fórmulas botânicas são 100% livres de ingredientes que possam causar alergias, desregulação endócrina ou poluição marinha.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              {[
                'Zero Parabenos',
                'Zero Petrolatos & Óleo Mineral',
                'Zero Silicones Insolúveis',
                'Zero Sulfatos Agressivos',
                'Zero Fragrâncias Sintéticas',
                'Zero Ftalatos & BHT',
                'Zero Microplásticos',
                'Zero Corantes Artificiais',
                'Zero Testes em Animais',
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 text-[#E7EDE9]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E3A882]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
