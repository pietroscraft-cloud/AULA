import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowRight, RotateCcw, Heart, Shield } from 'lucide-react';
import { PRODUCTS_DATA } from '../data/content';
import { Product } from '../types';

interface RoutineConsultantProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRecommendedKit: (products: Product[]) => void;
}

export const RoutineConsultant: React.FC<RoutineConsultantProps> = ({
  isOpen,
  onClose,
  onAddRecommendedKit,
}) => {
  const [step, setStep] = useState(1);
  const [skinType, setSkinType] = useState<string>('');
  const [concern, setConcern] = useState<string>('');
  const [sensitivity, setSensitivity] = useState<string>('');

  const resetQuiz = () => {
    setStep(1);
    setSkinType('');
    setConcern('');
    setSensitivity('');
  };

  // Determine recommendation based on choices
  const getRecommendation = () => {
    if (skinType === 'sensivel' || sensitivity === 'alta') {
      return {
        title: 'Ritual Botânico Calmante & Anti-Reatividade',
        description: 'Focado em desinflamar a barreira cutânea com fitoativos de camomila biodinâmica e esqualano de oliva.',
        products: [PRODUCTS_DATA[1], PRODUCTS_DATA[3]], // Bálsamo + Névoa
        discountPercent: 15,
      };
    }

    if (concern === 'manchas' || skinType === 'seca') {
      return {
        title: 'Ritual Botânico de Regeneração Celular & Glow',
        description: 'Potente renovação com rosa mosqueta prensada a frio e ácido hialurônico de fermentação verde.',
        products: [PRODUCTS_DATA[0], PRODUCTS_DATA[1]], // Sérum + Bálsamo
        discountPercent: 15,
      };
    }

    // Default balanced ritual
    return {
      title: 'Ritual Essencial de Equilíbrio & Vitalidade',
      description: 'Purificação gentil com óleo de calêndula e nutrição profunda com sérum bioativo.',
      products: [PRODUCTS_DATA[0], PRODUCTS_DATA[2]], // Sérum + Óleo limpador
      discountPercent: 15,
    };
  };

  const recommendation = getRecommendation();
  const totalPrice = recommendation.products.reduce((sum, p) => sum + p.price, 0);
  const discountedPrice = Math.round(totalPrice * (1 - recommendation.discountPercent / 100));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-[#FAF8F5] rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-[#D5C7B4] shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#EFE8DC] hover:bg-[#E2D8C9] text-[#2B372F] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {step <= 3 ? (
          <div>
            {/* Progress bar */}
            <div className="flex items-center justify-between text-xs text-[#7A8A80] mb-4">
              <span className="font-semibold uppercase tracking-wider text-[#9C5B39]">
                Diagnóstico de Autocuidado Botânico
              </span>
              <span>Pergunta {step} de 3</span>
            </div>
            <div className="w-full h-1.5 bg-[#EAE2D5] rounded-full mb-6 overflow-hidden">
              <div
                className="h-full bg-[#9C5B39] transition-all duration-300 rounded-full"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>

            {/* Question 1 */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="font-serif text-2xl text-[#18231C] font-medium">
                  Como você sente a sua pele cerca de 1 hora após acordar?
                </h3>
                <p className="text-xs text-[#5E6D64]">
                  Isso nos ajuda a entender o comportamento do seu manto lipídico natural.
                </p>

                <div className="space-y-2.5 pt-2">
                  {[
                    { id: 'seca', label: 'Repuxada, ressecada ou sem viço natural' },
                    { id: 'mista', label: 'Oleosa na testa/nariz, mas normal ou seca nas bochechas' },
                    { id: 'oleosa', label: 'Brilho excessivo no rosto todo ao longo do dia' },
                    { id: 'sensivel', label: 'Facilmente avermelhada, reativa ou com sensação de ardência' },
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setSkinType(option.id);
                        setStep(2);
                      }}
                      className="w-full text-left p-4 rounded-2xl border border-[#DFD5C6] bg-[#F7F3EC] hover:bg-[#EFE7DB] text-sm text-[#27342C] font-medium transition-colors flex items-center justify-between"
                    >
                      <span>{option.label}</span>
                      <ArrowRight className="w-4 h-4 text-[#9C5B39]" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Question 2 */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="font-serif text-2xl text-[#18231C] font-medium">
                  Qual é o seu objetivo prioritário com o autocuidado natural?
                </h3>
                <p className="text-xs text-[#5E6D64]">
                  Selecionaremos os fitoativos mais concentrados para sua necessidade atual.
                </p>

                <div className="space-y-2.5 pt-2">
                  {[
                    { id: 'glow', label: 'Restaurar o viço saudável e hidratação profunda' },
                    { id: 'calmar', label: 'Acalmar reatividade, vermelhidão e sensibilidade' },
                    { id: 'manchas', label: 'Uniformizar a textura e atenuar marcas solares' },
                    { id: 'linhas', label: 'Prevenção natural de linhas de expressão e firmeza' },
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setConcern(option.id);
                        setStep(3);
                      }}
                      className="w-full text-left p-4 rounded-2xl border border-[#DFD5C6] bg-[#F7F3EC] hover:bg-[#EFE7DB] text-sm text-[#27342C] font-medium transition-colors flex items-center justify-between"
                    >
                      <span>{option.label}</span>
                      <ArrowRight className="w-4 h-4 text-[#9C5B39]" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Question 3 */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="font-serif text-2xl text-[#18231C] font-medium">
                  Sua pele costuma reagir mal a cosméticos convencionais com perfume?
                </h3>
                <p className="text-xs text-[#5E6D64]">
                  Garantimos a biocompatibilidade ideal para sua segurança.
                </p>

                <div className="space-y-2.5 pt-2">
                  {[
                    { id: 'alta', label: 'Sim, frequentemente sinto coceira, pinicação ou ardor' },
                    { id: 'media', label: 'Às vezes, principalmente com ácidos fortes sintéticos' },
                    { id: 'baixa', label: 'Raramente, minha pele tolera a maioria dos produtos' },
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setSensitivity(option.id);
                        setStep(4);
                      }}
                      className="w-full text-left p-4 rounded-2xl border border-[#DFD5C6] bg-[#F7F3EC] hover:bg-[#EFE7DB] text-sm text-[#27342C] font-medium transition-colors flex items-center justify-between"
                    >
                      <span>{option.label}</span>
                      <Sparkles className="w-4 h-4 text-[#9C5B39]" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Step 4: Result presentation */
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5DCCF] text-[#243329] text-[11px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#9C5B39]" />
                Recomendação Personalizada
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#18231C] font-medium">
                {recommendation.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#526157] max-w-md mx-auto">
                {recommendation.description}
              </p>
            </div>

            {/* Recommended Products */}
            <div className="space-y-3">
              {recommendation.products.map((p) => (
                <div
                  key={p.id}
                  className="p-3.5 rounded-2xl bg-[#F6F1EA] border border-[#E3D7C7] flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-12 h-12 rounded-xl object-cover border border-[#D8CCBD]"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#9C5B39]">
                        {p.ritualStep}
                      </span>
                      <h4 className="font-serif text-base font-medium text-[#1A251E] leading-tight">
                        {p.name}
                      </h4>
                      <p className="text-[11px] text-[#69796F]">{p.volume}</p>
                    </div>
                  </div>
                  <span className="font-serif font-semibold text-[#1F2922] text-sm">
                    R$ {p.price}
                  </span>
                </div>
              ))}
            </div>

            {/* Offer Summary */}
            <div className="p-4 rounded-2xl bg-[#EBE4D8] border border-[#D5C6B2] flex items-center justify-between">
              <div>
                <span className="text-xs text-[#6C7B72] block line-through">
                  Total normal: R$ {totalPrice}
                </span>
                <span className="font-serif text-2xl font-bold text-[#1E2721]">
                  R$ {discountedPrice}
                </span>
                <span className="text-[11px] text-[#3F634A] font-semibold block">
                  15% OFF com cupom aplicado + Frete Grátis
                </span>
              </div>

              <button
                id="btn-adicionar-recomendacao"
                onClick={() => {
                  onAddRecommendedKit(recommendation.products);
                  onClose();
                }}
                className="px-6 py-3 rounded-full bg-[#243329] hover:bg-[#16211A] text-white text-xs uppercase tracking-wider font-semibold shadow-md flex items-center gap-2"
              >
                <span>Adicionar ao Ritual</span>
                <ArrowRight className="w-4 h-4 text-[#E3A882]" />
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 text-xs text-[#7B8B81]">
              <button
                onClick={resetQuiz}
                className="flex items-center gap-1.5 hover:text-[#18231C]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Refazer diagnóstico
              </button>
              <span>Garantia de 30 dias de satisfação</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
