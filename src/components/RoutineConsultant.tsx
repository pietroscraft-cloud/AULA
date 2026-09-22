import React, { useState } from 'react';
import { 
  X, Sparkles, Check, ArrowRight, RotateCcw, Heart, Shield, 
  Leaf, Sun, Droplets, Smile, Wind, Tag, ShoppingBag, Eye
} from 'lucide-react';
import { PRODUCTS_DATA } from '../data/content';
import { Product } from '../types';

interface RoutineConsultantProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRecommendedKit: (products: Product[]) => void;
  onGoToPromotions: (category?: string) => void;
}

export const RoutineConsultant: React.FC<RoutineConsultantProps> = ({
  isOpen,
  onClose,
  onAddRecommendedKit,
  onGoToPromotions,
}) => {
  const [step, setStep] = useState(1);
  const [skinType, setSkinType] = useState<string>('mista');
  const [hydrationPreference, setHydrationPreference] = useState<string>('serum');
  const [sunLifestyle, setSunLifestyle] = useState<string>('telas');
  const [maskPreference, setMaskPreference] = useState<string>('peeling');
  const [intention, setIntention] = useState<string>('vico');

  const resetQuiz = () => {
    setStep(1);
    setSkinType('mista');
    setHydrationPreference('serum');
    setSunLifestyle('telas');
    setMaskPreference('peeling');
    setIntention('vico');
  };

  // Determine personalized 4-pillar routine based on the 5 answers
  const getPersonalizedRitual = () => {
    // 1. Limpeza Diária
    let cleansingProduct: Product;
    if (skinType === 'oleosa' || skinType === 'mista') {
      cleansingProduct = PRODUCTS_DATA.find(p => p.id === 'espuma-facial-enzimatica') || PRODUCTS_DATA[5];
    } else {
      cleansingProduct = PRODUCTS_DATA.find(p => p.id === 'oleo-limpeza-calmante') || PRODUCTS_DATA[4];
    }

    // 2. Hidratação
    let hydrationProduct: Product;
    if (hydrationPreference === 'aqua_gel' || skinType === 'oleosa') {
      hydrationProduct = PRODUCTS_DATA.find(p => p.id === 'aqua-gel-fito-hidratante') || PRODUCTS_DATA[9];
    } else if (hydrationPreference === 'balsamo' || skinType === 'seca' || skinType === 'sensivel') {
      hydrationProduct = PRODUCTS_DATA.find(p => p.id === 'balsamo-hidratante-biomimetico') || PRODUCTS_DATA[8];
    } else {
      hydrationProduct = PRODUCTS_DATA.find(p => p.id === 'serum-botanico-regenerador') || PRODUCTS_DATA[7];
    }

    // 3. Proteção Solar
    let sunProduct: Product;
    if (sunLifestyle === 'glow' || sunLifestyle === 'uniformizar') {
      sunProduct = PRODUCTS_DATA.find(p => p.id === 'protetor-solar-mineral-glow-fps60') || PRODUCTS_DATA[12];
    } else {
      sunProduct = PRODUCTS_DATA.find(p => p.id === 'fluido-solar-mineral-fps50') || PRODUCTS_DATA[11];
    }

    // 4. Máscara Semanal
    let maskProduct: Product;
    if (maskPreference === 'detox' || skinType === 'oleosa') {
      maskProduct = PRODUCTS_DATA.find(p => p.id === 'mascara-detox-argila-verde') || PRODUCTS_DATA[14];
    } else {
      maskProduct = PRODUCTS_DATA.find(p => p.id === 'mascara-facial-renovadora-enzimas') || PRODUCTS_DATA[13];
    }

    // Biotype Title and Diagnosis
    let biotypeTitle = 'Biotipo Botânico: Equilíbrio & Viço Celular';
    let biotypeDesc = 'Sua pele busca harmonia fisiológica entre desobstrução de poros, hidratação biocompatível e escudo antioxidante contra o estresse urbano.';
    let selfcareAdvice = 'Dedique 1 minuto ao acordar para inalar os terpenos naturais dos produtos com os olhos fechados. Essa pausa inicial estimula o sistema nervoso parassimpático e relaxa a musculatura facial.';

    if (skinType === 'oleosa') {
      biotypeTitle = 'Biotipo Botânico: Pureza Mate & Detox de Poros';
      biotypeDesc = 'Priorizamos ativos seborreguladores naturais que limpam sem efeito rebote e hidratam com toque aquoso refrescante.';
      selfcareAdvice = 'Evite sabonetes adstringentes com sulfatos agressivos que geram efeito rebote. A combinação de Papaína enzimática e Niacinamida vegetal estabiliza o brilho de forma duradoura.';
    } else if (skinType === 'seca' || skinType === 'sensivel') {
      biotypeTitle = 'Biotipo Botânico: Nutrição Reparadora & Calma';
      biotypeDesc = 'Foco total na regeneração da barreira cutânea, prevenção de vermelhidão e selagem contínua de água transepidérmica.';
      selfcareAdvice = 'Aplique o Bálsamo de Cupuaçu com a ponta dos dedos em movimentos suaves de dentro para fora, aquecendo o produto na pele para acelerar a absorção biomimética.';
    }

    const products = [cleansingProduct, hydrationProduct, sunProduct, maskProduct];
    const originalTotal = products.reduce((sum, p) => sum + (p.originalPrice || p.price), 0);
    const regularTotal = products.reduce((sum, p) => sum + p.price, 0);
    // Quest exclusive promotion discount: 28% off
    const questDiscountPercent = 28;
    const questSpecialPrice = Math.round(regularTotal * (1 - questDiscountPercent / 100));
    const savingsAmount = originalTotal - questSpecialPrice;

    return {
      title: biotypeTitle,
      description: biotypeDesc,
      selfcareAdvice,
      products,
      originalTotal,
      regularTotal,
      questSpecialPrice,
      savingsAmount,
      questDiscountPercent,
    };
  };

  const ritualResult = getPersonalizedRitual();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#FAF8F5] rounded-3xl max-w-2xl w-full p-5 sm:p-8 border border-[#D5C7B4] shadow-2xl relative my-auto max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full bg-[#EFE8DC] hover:bg-[#E2D8C9] text-[#2B372F] transition-colors z-10"
          title="Fechar diagnóstico"
        >
          <X className="w-5 h-5" />
        </button>

        {step <= 5 ? (
          <div>
            {/* Header & Progress bar */}
            <div className="flex items-center justify-between text-xs text-[#7A8A80] mb-3">
              <span className="font-semibold uppercase tracking-wider text-[#9C5B39] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Quest do Autocuidado Botânico
              </span>
              <span className="font-medium bg-[#EAE3D6] px-2.5 py-0.5 rounded-full text-[#38463E]">
                Pergunta {step} de 5
              </span>
            </div>
            
            <div className="w-full h-2 bg-[#EAE2D5] rounded-full mb-6 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#9C5B39] to-[#243329] transition-all duration-300 rounded-full"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>

            {/* QUESTÃO 1: LIMPEZA DIÁRIA & MANTO LIPÍDICO */}
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#3F634A] flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5" /> Pilar 1 • Limpeza Diária & Barreira
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl text-[#18231C] font-medium leading-snug">
                    Como se comporta o manto natural da sua pele cerca de 1 hora após acordar?
                  </h3>
                  <p className="text-xs text-[#5E6D64]">
                    Identificamos o estado basal da barreira cutânea para prescrever a limpeza biocompatível exata.
                  </p>
                </div>

                <div className="space-y-2.5 pt-2">
                  {[
                    { id: 'seca', label: 'Repuxada, ressecada ou sem viço natural', tag: 'Precisa de hidratação lipídica' },
                    { id: 'mista', label: 'Zona T (testa e nariz) oleosa, mas bochechas equilibradas ou secas', tag: 'Equilíbrio misto' },
                    { id: 'oleosa', label: 'Brilho evidente no rosto todo, poros aparentes e cravos', tag: 'Controle de sebo' },
                    { id: 'sensivel', label: 'Facilmente avermelhada, com pinicação, calor ou rosácea', tag: 'Pele reativa' },
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setSkinType(option.id);
                        setStep(2);
                      }}
                      className="w-full text-left p-4 rounded-2xl border border-[#DFD5C6] bg-[#F7F3EC] hover:bg-[#EFE7DB] text-[#27342C] transition-all flex items-center justify-between group hover:border-[#8C4E2D]"
                    >
                      <div>
                        <span className="text-sm font-semibold block text-[#18231C]">{option.label}</span>
                        <span className="text-[10px] text-[#8C4E2D] font-medium uppercase tracking-wider">{option.tag}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#8C4E2D] group-hover:translate-x-1 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* QUESTÃO 2: HIDRATAÇÃO & TEXTURA PREFERIDA */}
            {step === 2 && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#3F634A] flex items-center gap-1">
                    <Leaf className="w-3.5 h-3.5" /> Pilar 2 • Hidratação & Reparação Celular
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl text-[#18231C] font-medium leading-snug">
                    Qual textura sensorial desperta mais aconchego na sua pele?
                  </h3>
                  <p className="text-xs text-[#5E6D64]">
                    Nossos fitoativos biocompatíveis penetram sem película pesada, adequando-se ao seu toque preferido.
                  </p>
                </div>

                <div className="space-y-2.5 pt-2">
                  {[
                    { id: 'serum', label: 'Néctar fluido concentrado de absorção rápida (Sérum Infinito com Rosa Mosqueta)', tag: 'Glow Real & Viço' },
                    { id: 'balsamo', label: 'Bálsamo aveludado rico que derrete ao toque com manteiga de cupuaçu 48h', tag: 'Nutrição Profunda' },
                    { id: 'aqua_gel', label: 'Aqua-Gel cristalino com fito-niacinamida e algas marinhas (toque seco gelado)', tag: 'Ultra-refrescante' },
                    { id: 'olhar', label: 'Elixir com roll-on gelado de quartzo para drenagem de olheiras e bolsas', tag: 'Contorno dos Olhos' },
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setHydrationPreference(option.id);
                        setStep(3);
                      }}
                      className="w-full text-left p-4 rounded-2xl border border-[#DFD5C6] bg-[#F7F3EC] hover:bg-[#EFE7DB] text-[#27342C] transition-all flex items-center justify-between group hover:border-[#8C4E2D]"
                    >
                      <div>
                        <span className="text-sm font-semibold block text-[#18231C]">{option.label}</span>
                        <span className="text-[10px] text-[#8C4E2D] font-medium uppercase tracking-wider">{option.tag}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#8C4E2D] group-hover:translate-x-1 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* QUESTÃO 3: PROTEÇÃO SOLAR & RADIAÇÃO URBANA */}
            {step === 3 && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#3F634A] flex items-center gap-1">
                    <Sun className="w-3.5 h-3.5" /> Pilar 3 • Proteção Mineral & Luz de Telas
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl text-[#18231C] font-medium leading-snug">
                    Como é a sua exposição diária à luminosidade e aos aparelhos eletrônicos?
                  </h3>
                  <p className="text-xs text-[#5E6D64]">
                    Filtros minerais 100% físicos bloqueiam os raios UV e a luz azul de telas de celulares e computadores.
                  </p>
                </div>

                <div className="space-y-2.5 pt-2">
                  {[
                    { id: 'telas', label: 'Trabalho em frente a telas de computador e celular a maior parte do dia', tag: 'Luz Azul & Estresse Urbano' },
                    { id: 'sol_direto', label: 'Exposição solar frequente ao ar livre, caminhadas ou trânsito', tag: 'FPS 50 Mineral Toque Seco' },
                    { id: 'glow', label: 'Gosto de proteção solar com cor adaptável inteligente que uniformiza manchas', tag: 'FPS 60 Fito-Pigmentado' },
                    { id: 'invisivel', label: 'Prefiro acabamento totalmente transparente, fosco e amigo dos corais', tag: 'Reef Safe • Sem Resíduo Branco' },
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setSunLifestyle(option.id);
                        setStep(4);
                      }}
                      className="w-full text-left p-4 rounded-2xl border border-[#DFD5C6] bg-[#F7F3EC] hover:bg-[#EFE7DB] text-[#27342C] transition-all flex items-center justify-between group hover:border-[#8C4E2D]"
                    >
                      <div>
                        <span className="text-sm font-semibold block text-[#18231C]">{option.label}</span>
                        <span className="text-[10px] text-[#8C4E2D] font-medium uppercase tracking-wider">{option.tag}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#8C4E2D] group-hover:translate-x-1 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* QUESTÃO 4: MÁSCARAS FACIAIS & SPA SEMANAL */}
            {step === 4 && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#3F634A] flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Pilar 4 • Máscaras & Renovação Semanal
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl text-[#18231C] font-medium leading-snug">
                    Qual experiência de SPA semanal você deseja desfrutar em casa?
                  </h3>
                  <p className="text-xs text-[#5E6D64]">
                    Um momento de 15 minutos para renovar as células mortas sem agredir o tecido vivo.
                  </p>
                </div>

                <div className="space-y-2.5 pt-2">
                  {[
                    { id: 'peeling', label: 'Máscara Facial Enzimática de Romã & Argila Branca (peeling suave e luminosidade)', tag: 'Viço & Brilho Imediato' },
                    { id: 'detox', label: 'Máscara Detox de Argila Verde & Carvão de Babaçu (desobstrução profunda de poros)', tag: 'Anti-Poluição & Poros Limpos' },
                    { id: 'nevoa', label: 'Névoa Facial Floral Calmante com camomila destilada a vapor', tag: 'Aromaterapia Relaxante' },
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setMaskPreference(option.id);
                        setStep(5);
                      }}
                      className="w-full text-left p-4 rounded-2xl border border-[#DFD5C6] bg-[#F7F3EC] hover:bg-[#EFE7DB] text-[#27342C] transition-all flex items-center justify-between group hover:border-[#8C4E2D]"
                    >
                      <div>
                        <span className="text-sm font-semibold block text-[#18231C]">{option.label}</span>
                        <span className="text-[10px] text-[#8C4E2D] font-medium uppercase tracking-wider">{option.tag}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#8C4E2D] group-hover:translate-x-1 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* QUESTÃO 5: INTENÇÃO DE AUTOCUIDADO */}
            {step === 5 && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#3F634A] flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5" /> Intenção Sagrada • Bem-Estar Pleno
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl text-[#18231C] font-medium leading-snug">
                    Qual transformação pessoal você quer colher nos próximos 21 dias?
                  </h3>
                  <p className="text-xs text-[#5E6D64]">
                    Alinharemos os óleos essenciais para apoiar o seu estado emocional.
                  </p>
                </div>

                <div className="space-y-2.5 pt-2">
                  {[
                    { id: 'vico', label: 'Pele viçosa, luminosa e descansada ao acordar', tag: 'Autoestima Radiante' },
                    { id: 'paz', label: 'Menos ansiedade: uma pausa diária de relaxamento e respiração consciente', tag: 'Paz Interior' },
                    { id: 'equilibrio', label: 'Poros refinados, controle de oleosidade e sensação de frescor contínuo', tag: 'Equilíbrio Puro' },
                    { id: 'longevidade', label: 'Firmeza celular e nutrição preventiva natural com fito-retinol', tag: 'Longevidade Saudável' },
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setIntention(option.id);
                        setStep(6);
                      }}
                      className="w-full text-left p-4 rounded-2xl border border-[#DFD5C6] bg-[#F7F3EC] hover:bg-[#EFE7DB] text-[#27342C] transition-all flex items-center justify-between group hover:border-[#8C4E2D]"
                    >
                      <div>
                        <span className="text-sm font-semibold block text-[#18231C]">{option.label}</span>
                        <span className="text-[10px] text-[#8C4E2D] font-medium uppercase tracking-wider">{option.tag}</span>
                      </div>
                      <Sparkles className="w-4 h-4 text-[#8C4E2D] group-hover:scale-110 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* RESULTADO PERSONALIZADO COM REDIRECIONAMENTO PARA PROMOÇÕES */
          <div className="space-y-5 animate-in fade-in duration-300">
            
            {/* Header com Diagnóstico */}
            <div className="text-center space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5DCCF] text-[#243329] text-[11px] font-bold uppercase tracking-wider shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#9C5B39]" />
                Diagnóstico Concluído • Prescrição Holística
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#18231C] font-medium">
                {ritualResult.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#526157] max-w-lg mx-auto leading-relaxed">
                {ritualResult.description}
              </p>
            </div>

            {/* Conselho de Autocuidado & Respiração */}
            <div className="p-3.5 rounded-2xl bg-[#F4EFE6] border border-[#E3D7C7] flex items-start gap-3">
              <Wind className="w-5 h-5 text-[#8C4E2D] shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-[#8C4E2D] block uppercase tracking-wider">
                  Gesto de Autocuidado Recomendado
                </span>
                <p className="text-xs text-[#425046] mt-0.5 leading-relaxed">
                  {ritualResult.selfcareAdvice}
                </p>
              </div>
            </div>

            {/* Os 4 Produtos do Ritual Prescrito (Limpeza, Hidratação, Solar, Máscara) */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-[#35433B] uppercase tracking-wider mb-2.5">
                <span>Os 4 Pilares da Sua Rotina:</span>
                <span className="text-[#8C4E2D]">{ritualResult.products.length} Fórmulas Sinergéticas</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {ritualResult.products.map((p, idx) => {
                  const pillarLabels = ['1. Limpeza Diária', '2. Hidratação & Reparação', '3. Proteção Solar', '4. Máscara Semanal'];
                  return (
                    <div
                      key={p.id}
                      className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E3D7C7] hover:border-[#8C4E2D] transition-colors flex items-center gap-3 shadow-xs"
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-14 h-14 rounded-xl object-cover border border-[#D8CCBD] shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] uppercase font-bold text-[#8C4E2D] block truncate">
                          {pillarLabels[idx]}
                        </span>
                        <h4 className="font-serif text-sm font-medium text-[#1A251E] truncate">
                          {p.name}
                        </h4>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[10px] text-[#69796F]">{p.volume}</span>
                          <span className="font-serif font-bold text-xs text-[#1F2922]">
                            R$ {p.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Oferta Promocional Exclusiva da Quest */}
            <div className="p-4 rounded-2xl bg-[#EBE4D8] border border-[#D5C6B2] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#718076] line-through">
                    De R$ {ritualResult.regularTotal}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#8C4E2D] text-white text-[10px] font-bold">
                    {ritualResult.questDiscountPercent}% OFF da Quest
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-[#1E2721]">
                    R$ {ritualResult.questSpecialPrice}
                  </span>
                  <span className="text-xs text-[#4F5E54]">
                    ou 6x de R$ {(ritualResult.questSpecialPrice / 6).toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <span className="text-[11px] text-[#3F634A] font-semibold block mt-0.5">
                  ✓ Frete Grátis + Brinde Nécessaire de Linho inclusa
                </span>
              </div>

              {/* Botão de Adicionar à Sacola */}
              <button
                id="btn-adicionar-recomendacao-sacola"
                onClick={() => {
                  onAddRecommendedKit(ritualResult.products);
                  onClose();
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#243329] hover:bg-[#16211A] text-white text-xs uppercase tracking-wider font-semibold shadow-md flex items-center justify-center gap-2 transition-all shrink-0"
              >
                <ShoppingBag className="w-4 h-4 text-[#E3A882]" />
                <span>Garantir Ritual na Sacola</span>
              </button>
            </div>

            {/* REDIRECIONAMENTO EXPLÍCITO PARA PROMOÇÕES CONFORME SOLICITADO */}
            <div className="p-3.5 rounded-2xl bg-[#F0EAE0] border border-[#DDD0BF] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-center sm:text-left">
                <Tag className="w-5 h-5 text-[#8C4E2D] shrink-0" />
                <div>
                  <span className="text-xs font-bold text-[#1C2820] block">
                    Quer ver os Kits e Ofertas Promocionais no Catálogo?
                  </span>
                  <span className="text-[11px] text-[#5C6D63]">
                    Economize até R$ 190 com nossos combos prontos para presentear.
                  </span>
                </div>
              </div>

              <button
                id="btn-redirecionar-promocoes"
                onClick={() => {
                  onGoToPromotions('kits');
                  onClose();
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#8C4E2D] hover:bg-[#723B1E] text-white text-xs font-semibold uppercase tracking-wider shadow-sm flex items-center justify-center gap-1.5 transition-all shrink-0"
              >
                <span>Ver Ofertas no Catálogo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Rodapé com Ações Auxiliares */}
            <div className="flex items-center justify-between pt-2 text-xs text-[#7B8B81]">
              <button
                onClick={resetQuiz}
                className="flex items-center gap-1.5 hover:text-[#18231C] underline"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Refazer quest
              </button>
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-[#3F634A]" />
                Garantia Incondicional de 30 Dias
              </span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
