import React, { useState } from 'react';
import { RITUAL_STEPS, RITUAL_SKIN_IMAGE } from '../data/content';
import { Clock, Heart, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface SelfcareRitualProps {
  onSelectProduct: (productIdOrStep: string) => void;
}

export const SelfcareRitual: React.FC<SelfcareRitualProps> = ({ onSelectProduct }) => {
  const [activeStep, setActiveStep] = useState(0);

  const currentStep = RITUAL_STEPS[activeStep];

  return (
    <section id="o-ritual" className="py-20 lg:py-28 bg-[#F4EFE6] border-y border-[#E7DFD2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <span className="text-xs uppercase tracking-[0.24em] font-semibold text-[#9C5B39]">
            Menos Etapas, Mais Vitalidade
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#17211B] font-normal tracking-tight">
            A arte do minimalismo no seu autocuidado.
          </h2>
          <p className="text-base sm:text-lg text-[#515E55] font-light leading-relaxed">
            Sua pele não precisa de dez etapas químicas que sobrecarregam sua barreira. 
            Criamos um ritual botânico descomplicado de 3 gestos diários que restauram o equilíbrio natural em harmonia com os ritmos biológicos.
          </p>
        </div>

        {/* Interactive Steps Grid & Card Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left: Step Selector Tabs */}
          <div className="lg:col-span-6 space-y-4">
            {RITUAL_STEPS.map((stepItem, index) => {
              const isSelected = activeStep === index;
              return (
                <div
                  key={stepItem.number}
                  id={`ritual-step-${index}`}
                  onClick={() => setActiveStep(index)}
                  className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 border ${
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
                        <h3 className={`text-lg font-serif font-medium ${isSelected ? 'text-[#17211B]' : 'text-[#3B4840]'}`}>
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

                  <p className="mt-3 text-sm text-[#4E5C53] leading-relaxed">
                    {stepItem.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right: Focused Detail of Active Step */}
          <div className="lg:col-span-6">
            <div className="bg-[#FAF8F5] p-8 sm:p-10 rounded-3xl border border-[#DCD0BE] shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-6 border-b border-[#EBE3D7]">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#9C5B39]" />
                  <span className="text-xs uppercase tracking-widest font-semibold text-[#66746B]">
                    Ritual Diário • Passo {currentStep.number} de 03
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-[#828F86]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{currentStep.duration}</span>
                </div>
              </div>

              <div className="py-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                  {/* Step Product Photo */}
                  <div className="sm:col-span-4 rounded-2xl overflow-hidden aspect-square border border-[#DFD6C7] bg-[#EFE8DC] relative shadow-xs group">
                    <img
                      src={currentStep.image}
                      alt={currentStep.productTitle || currentStep.step}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    {currentStep.productVolume && (
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium">
                        {currentStep.productVolume}
                      </span>
                    )}
                  </div>

                  {/* Step Title and Description */}
                  <div className="sm:col-span-8 space-y-2">
                    <span className="text-xs uppercase tracking-wider font-semibold text-[#8C4E2D]">
                      {currentStep.productTitle}
                    </span>
                    <h4 className="font-serif text-2xl sm:text-3xl text-[#17211B] font-medium leading-tight">
                      {currentStep.step}
                    </h4>
                    <p className="text-[#4A574E] text-sm leading-relaxed">
                      {currentStep.description}
                    </p>
                  </div>
                </div>

                {/* Sensory Experience highlight */}
                <div className="p-4 rounded-xl bg-[#F6F2EA] border border-[#E6DCCF] space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#9C5B39]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Experiência Sensorial Aromaterapêutica</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#38453D] italic">
                    "{currentStep.sensoryNote}"
                  </p>
                </div>

                {/* Direct Cellular Benefit */}
                <div className="flex items-start gap-3 text-xs sm:text-sm text-[#38453D]">
                  <CheckCircle2 className="w-4 h-4 text-[#3F634A] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#1B251F]">Resultado no tecido cutâneo:</span>{' '}
                    <span>{currentStep.benefit}</span>
                  </div>
                </div>
              </div>

              {/* Action for this step */}
              <div className="pt-6 border-t border-[#EBE3D7] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <button
                  id={`btn-adicionar-etapa-${activeStep}`}
                  onClick={() => onSelectProduct((currentStep as any).productId || currentStep.step)}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#243329] hover:bg-[#18231C] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold transition-all shadow-sm"
                >
                  <span>Ver Detalhes do Produto</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#E3A882]" />
                </button>

                <span className="text-xs text-[#718076] text-center sm:text-right">
                  Adequado para todos os tipos de pele
                </span>
              </div>
            </div>
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
              Tempo fisiológico para a barreira lipídica absorver os ácidos graxos biocompatíveis e reverter danos anteriores.
            </p>
          </div>

          <div className="space-y-1">
            <span className="font-serif text-4xl sm:text-5xl text-[#9C5B39] font-light">
              4 Minutos
            </span>
            <h5 className="text-sm font-semibold text-[#303E34]">Ritual Rápido & Mindfulness</h5>
            <p className="text-xs text-[#5D6B62] max-w-xs mx-auto">
              Uma pausa consciente pela manhã e antes de dormir para respirar os óleos essenciais e cuidar de si.
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
