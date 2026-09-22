import React, { useState } from 'react';
import { RITUAL_STEPS, SELFCARE_WISDOM } from '../data/content';
import { Clock, Sparkles, CheckCircle2, ArrowRight, BookOpen, Wind } from 'lucide-react';

interface SelfcareRitualProps {
  onSelectProduct: (productIdOrStep: string) => void;
  onOpenConsultant?: (tab?: 'chatbot' | 'quiz' | 'benchmark') => void;
}

export const SelfcareRitual: React.FC<SelfcareRitualProps> = ({ 
  onSelectProduct,
  onOpenConsultant,
}) => {
  const [activeStep, setActiveStep] = useState(0);

  const currentStep = RITUAL_STEPS[activeStep];

  return (
    <section id="o-ritual" className="py-20 lg:py-28 bg-[#F4EFE6] border-y border-[#E7DFD2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <span className="text-xs uppercase tracking-[0.24em] font-semibold text-[#9C5B39]">
            Os 4 Pilares do Autocuidado Holístico
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#17211B] font-normal tracking-tight">
            Limpeza diária, Hidratação, Proteção solar e Máscaras faciais.
          </h2>
          <p className="text-base sm:text-lg text-[#515E55] font-light leading-relaxed">
            Sua pele não precisa de dezenas de etapas químicas sintéticas. Criamos uma rotina botânica sinérgica que restaura a barreira cutânea, acalma o sistema nervoso pelo aroma das ervas puras e preserva a luminosidade natural.
          </p>
        </div>

        {/* Interactive Steps Grid & Card Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left: Step Selector Tabs */}
          <div className="lg:col-span-6 space-y-3.5">
            {RITUAL_STEPS.map((stepItem, index) => {
              const isSelected = activeStep === index;
              return (
                <div
                  key={stepItem.number}
                  id={`ritual-step-${index}`}
                  onClick={() => setActiveStep(index)}
                  className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 border ${
                    isSelected
                      ? 'bg-[#FAF8F5] border-[#D6C7B2] shadow-md -translate-y-0.5'
                      : 'bg-[#EDE7DC]/60 border-[#DFD6C7] hover:bg-[#FAF8F5]/70 text-[#49564E]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <span
                        className={`font-serif text-2xl font-light ${
                          isSelected ? 'text-[#9C5B39]' : 'text-[#87938A]'
                        }`}
                      >
                        {stepItem.number}
                      </span>
                      <div>
                        <h3 className={`text-base sm:text-lg font-serif font-medium ${isSelected ? 'text-[#17211B]' : 'text-[#3B4840]'}`}>
                          {stepItem.step}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-[#6B7970] mt-0.5">
                          <Clock className="w-3.5 h-3.5 text-[#9C5B39]" />
                          <span>{stepItem.duration}</span>
                        </div>
                      </div>
                    </div>

                    {isSelected ? (
                      <span className="text-xs uppercase tracking-wider font-semibold text-[#9C5B39] bg-[#F7EFE7] px-3 py-1 rounded-full border border-[#E9DACB]">
                        Ativo
                      </span>
                    ) : (
                      <span className="text-xs text-[#87938A] hover:text-[#17211B]">
                        Ver detalhes →
                      </span>
                    )}
                  </div>

                  <p className="mt-2.5 text-xs sm:text-sm text-[#4E5C53] leading-relaxed">
                    {stepItem.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right: Focused Detail of Active Step */}
          <div className="lg:col-span-6">
            <div className="bg-[#FAF8F5] p-6 sm:p-8 rounded-3xl border border-[#DCD0BE] shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-5 border-b border-[#EBE3D7]">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#9C5B39]" />
                  <span className="text-xs uppercase tracking-widest font-semibold text-[#66746B]">
                    Ritual Guiado • Passo {currentStep.number} de 04
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-[#828F86]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{currentStep.duration}</span>
                </div>
              </div>

              <div className="py-5 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                  {/* Step Product Photo */}
                  <div className="sm:col-span-5 rounded-2xl overflow-hidden aspect-square border border-[#DFD6C7] bg-[#EFE8DC] relative shadow-xs group">
                    <img
                      src={currentStep.image}
                      alt={currentStep.productTitle || currentStep.step}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    {currentStep.productVolume && (
                      <span className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium">
                        {currentStep.productVolume}
                      </span>
                    )}
                  </div>

                  {/* Step Title and Description */}
                  <div className="sm:col-span-7 space-y-2">
                    <span className="text-xs uppercase tracking-wider font-semibold text-[#8C4E2D]">
                      {currentStep.productTitle}
                    </span>
                    <h4 className="font-serif text-2xl text-[#17211B] font-medium leading-tight">
                      {currentStep.step}
                    </h4>
                    <p className="text-[#4A574E] text-xs sm:text-sm leading-relaxed">
                      {currentStep.description}
                    </p>
                  </div>
                </div>

                {/* Sensory Experience highlight */}
                <div className="p-3.5 rounded-xl bg-[#F6F2EA] border border-[#E6DCCF] space-y-1">
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[#9C5B39]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Experiência Olfativa & Toque na Pele</span>
                  </div>
                  <p className="text-xs text-[#38453D] italic">
                    "{currentStep.sensoryNote}"
                  </p>
                </div>

                {/* Direct Cellular Benefit */}
                <div className="flex items-start gap-2.5 text-xs text-[#38453D]">
                  <CheckCircle2 className="w-4 h-4 text-[#3F634A] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#1B251F]">Benefício bioativo comprovado:</span>{' '}
                    <span>{currentStep.benefit}</span>
                  </div>
                </div>
              </div>

              {/* Action for this step */}
              <div className="pt-5 border-t border-[#EBE3D7] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <button
                  id={`btn-adicionar-etapa-${activeStep}`}
                  onClick={() => onSelectProduct((currentStep as any).productId || currentStep.step)}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#243329] hover:bg-[#18231C] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold transition-all shadow-sm"
                >
                  <span>Ver Fórmulas no Catálogo</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#E3A882]" />
                </button>

                <span className="text-xs text-[#718076] text-center sm:text-right">
                  100% livre de toxinas e silicones
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* AI Chatbot & Price Comparison Discovery Banner */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#243329] via-[#1F2B23] to-[#15201A] text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-[#3B4C40]">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E3A882]/20 text-[#E3A882] text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Inteligência Artificial Botânica</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#FAF8F5]">
              Dúvida sobre qual pilar sua pele mais necessita?
            </h3>
            <p className="text-xs sm:text-sm text-[#D5DED8] max-w-xl leading-relaxed">
              Inicie uma conversa acolhedora com a <strong>Aura IA</strong> para responder o questionário conversacional interativo e receber uma rotina personalizada com <strong>28% OFF</strong>, ou consulte a pesquisa de preços de mercado de <em>La Roche-Posay, CeraVe, Vichy e SkinCeuticals</em>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <button
              id="btn-abrir-chatbot-ritual"
              onClick={() => onOpenConsultant?.('chatbot')}
              className="px-6 py-3.5 rounded-full bg-[#E3A882] hover:bg-[#D59871] text-[#1E2822] text-xs uppercase tracking-wider font-bold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#1E2822]" />
              <span>Questionário com Chatbot IA</span>
            </button>
            <button
              id="btn-comparar-precos-ritual"
              onClick={() => onOpenConsultant?.('benchmark')}
              className="px-5 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs uppercase tracking-wider font-semibold border border-white/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Comparar Preços de Mercado</span>
            </button>
          </div>
        </div>

        {/* Dedicated Educational Selfcare Wisdom Section */}
        <div className="mt-20 pt-16 border-t border-[#E3D8C7]">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8DFD1] text-[#8C4E2D] text-xs font-semibold uppercase tracking-widest">
              <BookOpen className="w-3.5 h-3.5" />
              Guia de Autocuidado & Fisiologia
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl text-[#18231C] font-normal">
              A ciência do toque consciente e da aromaterapia.
            </h3>
            <p className="text-sm text-[#546258] font-light leading-relaxed">
              O autocuidado não é vaidade: é uma prática fisiológica de restauração imunológica e equilíbrio do sistema nervoso.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SELFCARE_WISDOM.map((wisdom, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#DDD1C0] shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full bg-[#EBE3D5] text-[10px] uppercase font-bold text-[#8C4E2D]">
                      {wisdom.tag}
                    </span>
                    <Wind className="w-3.5 h-3.5 text-[#3F634A]" />
                  </div>
                  <h4 className="font-serif text-lg font-medium text-[#18231C] leading-snug">
                    {wisdom.title}
                  </h4>
                  <p className="text-[11px] font-semibold text-[#8C4E2D]">
                    {wisdom.subtitle}
                  </p>
                  <p className="text-xs text-[#4F5D54] leading-relaxed">
                    {wisdom.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quantitative Transformation Promise */}
        <div className="mt-16 pt-12 border-t border-[#E3D8C7] grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-1">
            <span className="font-serif text-4xl sm:text-5xl text-[#17211B] font-light">
              21 Dias
            </span>
            <h5 className="text-sm font-semibold text-[#303E34]">Ciclo de Renovação Cutânea</h5>
            <p className="text-xs text-[#5D6B62] max-w-xs mx-auto">
              Tempo fisiológico para a barreira lipídica absorver os ácidos graxos biocompatíveis e restaurar o manto de hidratação.
            </p>
          </div>

          <div className="space-y-1">
            <span className="font-serif text-4xl sm:text-5xl text-[#9C5B39] font-light">
              4 Minutos
            </span>
            <h5 className="text-sm font-semibold text-[#303E34]">Ritual Rápido & Mindfulness</h5>
            <p className="text-xs text-[#5D6B62] max-w-xs mx-auto">
              Uma pausa consciente pela manhã e antes de dormir para respirar os óleos essenciais e desconectar da correria.
            </p>
          </div>

          <div className="space-y-1">
            <span className="font-serif text-4xl sm:text-5xl text-[#17211B] font-light">
              Zero
            </span>
            <h5 className="text-sm font-semibold text-[#303E34]">Toxinas ou Agressores</h5>
            <p className="text-xs text-[#5D6B62] max-w-xs mx-auto">
              Sem substâncias de efeito rebote. Fórmulas vivas que fortalecem sua imunidade dérmica dia após dia.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

