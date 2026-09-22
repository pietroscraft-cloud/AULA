import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Sparkles, Check, ArrowRight, RotateCcw, Heart, Shield, 
  Leaf, Sun, Droplets, Smile, Wind, Tag, ShoppingBag, Send, 
  Bot, User, Scale, DollarSign, Award, RefreshCw, AlertCircle
} from 'lucide-react';
import { PRODUCTS_DATA } from '../data/content';
import { Product } from '../types';

interface RoutineConsultantProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRecommendedKit: (products: Product[]) => void;
  onGoToPromotions: (category?: string) => void;
  initialMode?: 'chatbot' | 'quiz' | 'benchmark';
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  recommendedProducts?: Product[];
  suggestedActions?: string[];
}

export const RoutineConsultant: React.FC<RoutineConsultantProps> = ({
  isOpen,
  onClose,
  onAddRecommendedKit,
  onGoToPromotions,
  initialMode = 'chatbot',
}) => {
  const [activeTab, setActiveTab] = useState<'chatbot' | 'quiz' | 'benchmark'>(initialMode);

  // Sync initialMode when opened
  useEffect(() => {
    if (isOpen && initialMode) {
      setActiveTab(initialMode);
    }
  }, [isOpen, initialMode]);

  // ===================== ESTADOS DO QUIZ RÁPIDO =====================
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

  // ===================== ESTADOS DO CHATBOT IA =====================
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'bot',
      text: 'Olá! Sou a **Aura IA**, sua especialista em cosmetologia botânica e bem-estar holístico. 🌿\n\nEstou aqui para conduzir seu questionário de autocuidado e montar a rotina personalizada dos **4 Pilares**: Limpeza Diária, Hidratação, Proteção Solar e Máscara Semanal.\n\nPara começarmos o diagnóstico: **Como sua pele costuma acordar pela manhã (oleosa, seca, repuxando ou sensível) e qual incômodo você mais deseja aliviar hoje?**',
      timestamp: 'Agora',
      suggestedActions: [
        'Tenho pele oleosa com poros abertos',
        'Minha pele repuxa, é seca e sensível',
        'Quero viço, viço e uniformizar manchas',
        'Passo o dia no computador sob luz de telas',
        'Qual a diferença de preço para CeraVe e La Roche-Posay?',
        'Como a Aura se compara a SkinCeuticals e Vichy?',
      ],
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab === 'chatbot') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, activeTab]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputMessage).trim();
    if (!textToSend || isTyping) return;

    setInputMessage('');

    const newUserMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, newUserMsg]);
    setIsTyping(true);

    try {
      // Build conversation history for the API
      const conversationHistory = [...messages, newUserMsg].map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        content: m.text,
      }));

      const res = await fetch('/api/consultant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: conversationHistory,
        }),
      });

      if (!res.ok) {
        throw new Error('Falha na resposta do assistente');
      }

      const data = await res.json();
      const botReply = data.reply || 'Recebi suas preferências! Recomendo explorarmos a rotina com ativos de Rosa Mosqueta e Proteção Solar mineral.';

      // Smart product recommendation match in chat
      let recommendedProducts: Product[] | undefined = undefined;
      const lower = (textToSend + ' ' + botReply).toLowerCase();
      if (lower.includes('oleos') || lower.includes('acne') || lower.includes('poro')) {
        recommendedProducts = [
          PRODUCTS_DATA.find(p => p.id === 'espuma-facial-enzimatica') || PRODUCTS_DATA[5],
          PRODUCTS_DATA.find(p => p.id === 'aqua-gel-fito-hidratante') || PRODUCTS_DATA[9],
          PRODUCTS_DATA.find(p => p.id === 'fluido-solar-mineral-fps50') || PRODUCTS_DATA[11],
          PRODUCTS_DATA.find(p => p.id === 'mascara-detox-argila-verde') || PRODUCTS_DATA[14],
        ];
      } else if (lower.includes('seca') || lower.includes('repux') || lower.includes('sensiv')) {
        recommendedProducts = [
          PRODUCTS_DATA.find(p => p.id === 'oleo-limpeza-calmante') || PRODUCTS_DATA[4],
          PRODUCTS_DATA.find(p => p.id === 'balsamo-hidratante-biomimetico') || PRODUCTS_DATA[8],
          PRODUCTS_DATA.find(p => p.id === 'protetor-solar-mineral-glow-fps60') || PRODUCTS_DATA[12],
          PRODUCTS_DATA.find(p => p.id === 'mascara-facial-renovadora-enzimas') || PRODUCTS_DATA[13],
        ];
      } else if (lower.includes('ritual') || lower.includes('completo') || lower.includes('4 passos') || lower.includes('preco') || lower.includes('cerave') || lower.includes('skinceuticals')) {
        recommendedProducts = ritualResult.products;
      }

      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: botReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          recommendedProducts,
          suggestedActions: [
            'Como aplicar cada etapa na ordem correta?',
            'Qual o benefício da aromaterapia no estresse?',
            'Quero adicionar esse kit à minha sacola com 28% OFF',
            'Ver comparativo com CeraVe, Vichy e SkinCeuticals',
          ],
        },
      ]);
    } catch (err) {
      console.error('Erro na IA:', err);
      // Fallback message
      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: 'Com base nas suas respostas, estruturei o seu **Ritual Botânico dos 4 Pilares**:\n\n1. **Limpeza Diária:** Espuma Facial Enzimática com Papaína e flor de laranjeira.\n2. **Hidratação:** Sérum Botânico com Rosa Mosqueta pura e Bakuchiol 1%.\n3. **Proteção Solar:** Fluido Solar Mineral FPS 50 invisível.\n4. **Máscara Semanal:** Máscara de Argila Branca & Enzimas de Romã.\n\n✨ Você pode adicionar essa rotina personalizada diretamente à sacola com **28% de desconto exclusivo**!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          recommendedProducts: ritualResult.products,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/65 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#FAF8F5] rounded-3xl max-w-3xl w-full p-4 sm:p-6 lg:p-7 border border-[#D5C7B4] shadow-2xl relative my-auto max-h-[94vh] flex flex-col">
        
        {/* ================= HEADER & TABS ================= */}
        <div className="flex items-center justify-between pb-3 border-b border-[#ECE3D5] relative">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#EAE1D3] flex items-center justify-center text-[#8C4E2D]">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-medium text-[#1A251E] leading-tight">
                Consultora & Diagnóstico de Autocuidado
              </h2>
              <p className="text-[11px] text-[#637368]">
                Inteligência botânica para prescrever os 4 pilares da sua pele
              </p>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#EFE8DC] hover:bg-[#E2D8C9] text-[#2B372F] transition-colors"
            title="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* TABS SELECTOR */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 p-1.5 mt-3 rounded-2xl bg-[#EDE6D9] text-xs font-semibold">
          <button
            onClick={() => setActiveTab('chatbot')}
            className={`py-2 px-2 sm:px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'chatbot'
                ? 'bg-[#243329] text-white shadow-xs font-bold'
                : 'text-[#4A5950] hover:text-[#19241D] hover:bg-[#FAF8F5]/60'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-[#E3A882]" />
            <span className="truncate">Chatbot com IA</span>
            <span className="hidden sm:inline-block px-1.5 py-0.2 rounded-full bg-[#8C4E2D] text-[9px] text-white font-bold uppercase">
              Novo
            </span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`py-2 px-2 sm:px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'quiz'
                ? 'bg-[#243329] text-white shadow-xs font-bold'
                : 'text-[#4A5950] hover:text-[#19241D] hover:bg-[#FAF8F5]/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#A8D5BA]" />
            <span className="truncate">Questionário 5 Passos</span>
          </button>

          <button
            onClick={() => setActiveTab('benchmark')}
            className={`py-2 px-2 sm:px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'benchmark'
                ? 'bg-[#243329] text-white shadow-xs font-bold'
                : 'text-[#4A5950] hover:text-[#19241D] hover:bg-[#FAF8F5]/60'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-[#D4A373]" />
            <span className="truncate">Preços de Mercado</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* ABA 1: CHATBOT IA QUESTIONÁRIO CONVERSACIONAL                             */}
        {/* ========================================================================= */}
        {activeTab === 'chatbot' && (
          <div className="flex-1 flex flex-col min-h-0 pt-3">
            
            {/* Context bar */}
            <div className="px-3 py-1.5 mb-2 rounded-xl bg-[#F4EFE6] border border-[#E4D7C7] flex items-center justify-between text-[11px] text-[#55655B]">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                Aura IA conectada • Modelo especializado em cosmetologia e aromaterapia
              </span>
              <button
                onClick={() => setMessages([messages[0]])}
                className="hover:text-[#1C2820] underline text-[10px]"
              >
                Limpar conversa
              </button>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto space-y-3.5 p-2 sm:p-3 rounded-2xl bg-[#F7F3EB] border border-[#E5DACD] max-h-[50vh] min-h-[260px]">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] text-[#78887F] px-1">
                    {msg.sender === 'user' ? (
                      <>
                        <span>Você</span>
                        <User className="w-3 h-3 text-[#5A6A60]" />
                      </>
                    ) : (
                      <>
                        <Bot className="w-3 h-3 text-[#8C4E2D]" />
                        <span className="font-semibold text-[#8C4E2D]">Aura IA</span>
                      </>
                    )}
                    <span>• {msg.timestamp}</span>
                  </div>

                  <div
                    className={`max-w-[88%] sm:max-w-[82%] p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                      msg.sender === 'user'
                        ? 'bg-[#243329] text-white rounded-tr-none'
                        : 'bg-[#FAF8F5] text-[#242F28] border border-[#DDD0BF] rounded-tl-none'
                    }`}
                  >
                    <div className="whitespace-pre-line space-y-2">
                      {msg.text.split('\n\n').map((paragraph, pIdx) => (
                        <p key={pIdx} className="leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>

                    {/* If Bot matched recommended products */}
                    {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-[#E3D6C5] space-y-2 bg-[#F1ECE2] p-2.5 rounded-xl">
                        <span className="text-[10px] uppercase font-bold text-[#8C4E2D] block">
                          🌸 Fórmulas Prescritas para os 4 Pilares:
                        </span>
                        <div className="grid grid-cols-2 gap-1.5">
                          {msg.recommendedProducts.map((p, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 p-1.5 rounded-lg bg-white/80 border border-[#D8CABE]">
                              <img src={p.image} alt={p.name} className="w-7 h-7 rounded-md object-cover" />
                              <div className="min-w-0 flex-1">
                                <span className="text-[10px] font-medium text-[#1A251E] block truncate">{p.name}</span>
                                <span className="text-[9px] text-[#8C4E2D] font-bold">R$ {p.price}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="pt-1.5 flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={() => {
                              onAddRecommendedKit(msg.recommendedProducts || ritualResult.products);
                              onClose();
                            }}
                            className="flex-1 py-2 px-3 rounded-full bg-[#243329] hover:bg-[#16211A] text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                          >
                            <ShoppingBag className="w-3.5 h-3.5 text-[#E3A882]" />
                            <span>Garantir Kit na Sacola (28% OFF)</span>
                          </button>
                          <button
                            onClick={() => {
                              onGoToPromotions('kits');
                              onClose();
                            }}
                            className="py-2 px-3 rounded-full bg-[#E5DCCE] hover:bg-[#D8CDBC] text-[#334238] text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
                          >
                            <span>Ver Ofertas</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Suggested Quick Question Chips */}
                  {msg.suggestedActions && (
                    <div className="flex flex-wrap gap-1.5 mt-1.5 max-w-[90%]">
                      {msg.suggestedActions.map((action, aIdx) => (
                        <button
                          key={aIdx}
                          onClick={() => handleSendMessage(action)}
                          className="text-[11px] px-2.5 py-1 rounded-full bg-[#EDE5D8] hover:bg-[#E0D5C4] text-[#445248] hover:text-[#18231C] border border-[#DDD0BE] transition-all text-left flex items-center gap-1"
                        >
                          <span>💬</span>
                          <span>{action}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#FAF8F5] border border-[#DDD0BF] text-xs text-[#5E6E64] w-fit">
                  <Bot className="w-3.5 h-3.5 text-[#8C4E2D] animate-spin" />
                  <span>Aura IA está formulando sua recomendação botânica...</span>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Input Bar */}
            <div className="mt-3 pt-2 border-t border-[#ECE3D5]">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={e => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Escreva como sente sua pele ou faça uma pergunta sobre a rotina..."
                  className="flex-1 px-4 py-3 rounded-full bg-[#FAF8F5] border border-[#D5C7B4] focus:outline-hidden focus:border-[#243329] focus:ring-1 focus:ring-[#243329] text-xs sm:text-sm text-[#1A251E] placeholder:text-[#8E9D93]"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || isTyping}
                  className="p-3 rounded-full bg-[#243329] hover:bg-[#16211A] text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm shrink-0"
                  title="Enviar mensagem"
                >
                  <Send className="w-4 h-4 text-[#E3A882]" />
                </button>
              </div>

              <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-[#76867D]">
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-[#3F634A]" /> Prescrição biocompatível com seus 4 pilares
                </span>
                <button
                  onClick={() => setActiveTab('benchmark')}
                  className="text-[#8C4E2D] font-semibold hover:underline flex items-center gap-1"
                >
                  <span>Ver pesquisa de preços farmacêuticos</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* ABA 2: QUESTIONÁRIO RÁPIDO GUIADO (5 ETAPAS)                              */}
        {/* ========================================================================= */}
        {activeTab === 'quiz' && (
          <div className="flex-1 overflow-y-auto pt-3">
            {step <= 5 ? (
              <div className="space-y-4">
                {/* Header & Progress bar */}
                <div className="flex items-center justify-between text-xs text-[#7A8A80]">
                  <span className="font-semibold uppercase tracking-wider text-[#9C5B39] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Quest dos 4 Pilares de Autocuidado
                  </span>
                  <span className="font-medium bg-[#EAE3D6] px-2.5 py-0.5 rounded-full text-[#38463E]">
                    Pergunta {step} de 5
                  </span>
                </div>
                
                <div className="w-full h-2 bg-[#EAE2D5] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#9C5B39] to-[#243329] transition-all duration-300 rounded-full"
                    style={{ width: `${(step / 5) * 100}%` }}
                  />
                </div>

                {/* QUESTÃO 1: LIMPEZA DIÁRIA */}
                {step === 1 && (
                  <div className="space-y-3.5 animate-in fade-in duration-300">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#3F634A] flex items-center gap-1">
                        <Droplets className="w-3.5 h-3.5" /> Pilar 1 • Limpeza Diária & Barreira
                      </span>
                      <h3 className="font-serif text-lg sm:text-xl text-[#18231C] font-medium leading-snug">
                        Como se comporta o manto natural da sua pele cerca de 1 hora após acordar?
                      </h3>
                      <p className="text-xs text-[#5E6D64]">
                        Identificamos o estado basal da barreira cutânea para prescrever a limpeza biocompatível exata.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      {[
                        {
                          id: 'oleosa',
                          title: 'Brilho Intenso na Zona T',
                          subtitle: 'Poros dilatados e tendência a cravos ao longo do dia.',
                          tag: 'Precisa de Papaína & Romã',
                        },
                        {
                          id: 'mista',
                          title: 'Mista / Zona T Levemente Oleosa',
                          subtitle: 'Bochechas equilibradas ou secas e testa/nariz com brilho.',
                          tag: 'Equilíbrio Hidrolipídico',
                        },
                        {
                          id: 'seca',
                          title: 'Sensação de Repuxamento & Opacidade',
                          subtitle: 'Falta de viço, textura áspera e necessidade imediata de creme.',
                          tag: 'Óleo Calmante & Calêndula',
                        },
                        {
                          id: 'sensivel',
                          title: 'Reativa, Vermelhidão & Sensível',
                          subtitle: 'Pinica facilmente com sabonetes comuns ou mudanças de clima.',
                          tag: 'Fórmula Calmante Hipoalergênica',
                        },
                      ].map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            setSkinType(item.id);
                            setStep(2);
                          }}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                            skinType === item.id
                              ? 'bg-[#EDE7DC] border-[#9C5B39] shadow-sm'
                              : 'bg-[#FAF8F5] border-[#DDD2C2] hover:bg-[#F3EDE3]'
                          }`}
                        >
                          <div>
                            <span className="text-[10px] font-bold uppercase text-[#8C4E2D] block mb-0.5">
                              {item.tag}
                            </span>
                            <h4 className="font-serif font-medium text-sm text-[#1E2822]">
                              {item.title}
                            </h4>
                            <p className="text-xs text-[#5A6860] mt-0.5">
                              {item.subtitle}
                            </p>
                          </div>
                          <div className="mt-2 flex justify-end">
                            <ArrowRight className="w-3.5 h-3.5 text-[#8C4E2D]" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* QUESTÃO 2: HIDRATAÇÃO */}
                {step === 2 && (
                  <div className="space-y-3.5 animate-in fade-in duration-300">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C4E2D] flex items-center gap-1">
                        <Leaf className="w-3.5 h-3.5" /> Pilar 2 • Hidratação & Reparação Celular
                      </span>
                      <h3 className="font-serif text-lg sm:text-xl text-[#18231C] font-medium leading-snug">
                        Qual textura de hidratação faz seu ritual matinal e noturno ser prazeroso?
                      </h3>
                      <p className="text-xs text-[#5E6D64]">
                        O autocuidado só é constante quando a textura desperta conforto sensorial imediato no seu toque.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                      {[
                        {
                          id: 'serum',
                          title: 'Sérum Fluido Botânico',
                          texture: 'Leve como seda, toque aveludado e glow dourado.',
                          actives: 'Rosa Mosqueta + Bakuchiol 1%',
                        },
                        {
                          id: 'aqua_gel',
                          title: 'Aqua-Gel Fito-Refrescante',
                          texture: 'Gel aquoso gelado, absorção em 3 segundos, acabamento mate.',
                          actives: 'Niacinamida 5% + Algas Marinhas',
                        },
                        {
                          id: 'balsamo',
                          title: 'Bálsamo Reparador Rico',
                          texture: 'Cremoso biomimético, abraço nutritivo e barreira 48h.',
                          actives: 'Manteiga de Cupuaçu + Ácido Hialurônico',
                        },
                      ].map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            setHydrationPreference(item.id);
                            setStep(3);
                          }}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                            hydrationPreference === item.id
                              ? 'bg-[#EDE7DC] border-[#9C5B39] shadow-sm'
                              : 'bg-[#FAF8F5] border-[#DDD2C2] hover:bg-[#F3EDE3]'
                          }`}
                        >
                          <div>
                            <span className="text-[10px] font-bold uppercase text-[#3F634A] block mb-0.5">
                              {item.actives}
                            </span>
                            <h4 className="font-serif font-medium text-sm text-[#1E2822]">
                              {item.title}
                            </h4>
                            <p className="text-xs text-[#5A6860] mt-0.5">
                              {item.texture}
                            </p>
                          </div>
                          <div className="mt-2 flex justify-end">
                            <ArrowRight className="w-3.5 h-3.5 text-[#8C4E2D]" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* QUESTÃO 3: PROTEÇÃO SOLAR */}
                {step === 3 && (
                  <div className="space-y-3.5 animate-in fade-in duration-300">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#A06C3B] flex items-center gap-1">
                        <Sun className="w-3.5 h-3.5" /> Pilar 3 • Proteção Solar Mineral & Luz de Telas
                      </span>
                      <h3 className="font-serif text-lg sm:text-xl text-[#18231C] font-medium leading-snug">
                        Como é a sua rotina diária em relação à exposição solar e luz azul de telas?
                      </h3>
                      <p className="text-xs text-[#5E6D64]">
                        Monitores e celulares emitem radiação azul de alta energia que degrada o colágeno e intensifica manchas.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      {[
                        {
                          id: 'telas',
                          title: 'Ambiente Fechado + Luz de Telas',
                          subtitle: 'Trabalho em escritório ou home office diante de computador e celular o dia todo.',
                          choice: 'Fluido Mineral FPS 50 Invisível',
                        },
                        {
                          id: 'glow',
                          title: 'Desejo Efeito Make Natural / Glow',
                          subtitle: 'Prefiro um filtro que uniformize o tom da pele com cobertura leve e radiante.',
                          choice: 'Protetor Mineral Glow FPS 60',
                        },
                      ].map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            setSunLifestyle(item.id);
                            setStep(4);
                          }}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                            sunLifestyle === item.id
                              ? 'bg-[#EDE7DC] border-[#9C5B39] shadow-sm'
                              : 'bg-[#FAF8F5] border-[#DDD2C2] hover:bg-[#F3EDE3]'
                          }`}
                        >
                          <div>
                            <span className="text-[10px] font-bold uppercase text-[#8C4E2D] block mb-0.5">
                              {item.choice}
                            </span>
                            <h4 className="font-serif font-medium text-sm text-[#1E2822]">
                              {item.title}
                            </h4>
                            <p className="text-xs text-[#5A6860] mt-0.5">
                              {item.subtitle}
                            </p>
                          </div>
                          <div className="mt-2 flex justify-end">
                            <ArrowRight className="w-3.5 h-3.5 text-[#8C4E2D]" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* QUESTÃO 4: MÁSCARAS FACIAIS */}
                {step === 4 && (
                  <div className="space-y-3.5 animate-in fade-in duration-300">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#3F634A] flex items-center gap-1">
                        <Smile className="w-3.5 h-3.5" /> Pilar 4 • Máscaras Faciais & Spa Semanal
                      </span>
                      <h3 className="font-serif text-lg sm:text-xl text-[#18231C] font-medium leading-snug">
                        Qual é o seu momento de descompressão semanal favorito com máscara?
                      </h3>
                      <p className="text-xs text-[#5E6D64]">
                        15 a 20 minutos de máscara semanal renovam o estrato córneo e ativam o descanso celular.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      {[
                        {
                          id: 'peeling',
                          title: 'Máscara Iluminadora de Argila Branca & Enzimas',
                          subtitle: 'Peeling biológico suave com papaína e romã. Uniformiza e devolve o viço sem agredir.',
                          aroma: 'Aroma relaxante de lavanda francesa',
                        },
                        {
                          id: 'detox',
                          title: 'Máscara Detox de Argila Verde & Babaçu',
                          subtitle: 'Desobstrui poros profundamente, controla excesso de oleosidade e remove poluição urbana.',
                          aroma: 'Toque herbal refrescante de hortelã',
                        },
                      ].map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            setMaskPreference(item.id);
                            setStep(5);
                          }}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                            maskPreference === item.id
                              ? 'bg-[#EDE7DC] border-[#9C5B39] shadow-sm'
                              : 'bg-[#FAF8F5] border-[#DDD2C2] hover:bg-[#F3EDE3]'
                          }`}
                        >
                          <div>
                            <span className="text-[10px] font-bold uppercase text-[#3F634A] block mb-0.5">
                              {item.aroma}
                            </span>
                            <h4 className="font-serif font-medium text-sm text-[#1E2822]">
                              {item.title}
                            </h4>
                            <p className="text-xs text-[#5A6860] mt-0.5">
                              {item.subtitle}
                            </p>
                          </div>
                          <div className="mt-2 flex justify-end">
                            <ArrowRight className="w-3.5 h-3.5 text-[#8C4E2D]" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* QUESTÃO 5: INTENÇÃO & BEM-ESTAR */}
                {step === 5 && (
                  <div className="space-y-3.5 animate-in fade-in duration-300">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#9C5B39] flex items-center gap-1">
                        <Wind className="w-3.5 h-3.5" /> Intenção & Fisiologia Holística
                      </span>
                      <h3 className="font-serif text-lg sm:text-xl text-[#18231C] font-medium leading-snug">
                        Qual é o seu objetivo de conexão e bem-estar com seu autocuidado?
                      </h3>
                      <p className="text-xs text-[#5E6D64]">
                        Os óleos essenciais inalados durante a rotina atuam no sistema límbico, reduzindo a liberação de cortisol.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                      {[
                        {
                          id: 'vico',
                          title: 'Viço & Firmeza Saudável',
                          desc: 'Quero pele radiante, luminosa e protegida das linhas do tempo.',
                        },
                        {
                          id: 'calma',
                          title: 'Alívio do Estresse & Calmaria',
                          desc: 'Quero um momento de silêncio para descontrair a musculatura e desacelerar.',
                        },
                        {
                          id: 'pureza',
                          title: 'Frescor Leve & Controle de Poros',
                          desc: 'Sensação de pele limpa, sequinha e revigorada o dia todo.',
                        },
                      ].map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            setIntention(item.id);
                            setStep(6);
                          }}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                            intention === item.id
                              ? 'bg-[#EDE7DC] border-[#9C5B39] shadow-sm'
                              : 'bg-[#FAF8F5] border-[#DDD2C2] hover:bg-[#F3EDE3]'
                          }`}
                        >
                          <div>
                            <h4 className="font-serif font-medium text-sm text-[#1E2822]">
                              {item.title}
                            </h4>
                            <p className="text-xs text-[#5A6860] mt-0.5">
                              {item.desc}
                            </p>
                          </div>
                          <div className="mt-2 flex justify-end">
                            <Check className="w-3.5 h-3.5 text-[#8C4E2D]" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Navigation back */}
                {step > 1 && (
                  <div className="pt-2 flex justify-between items-center">
                    <button
                      onClick={() => setStep(step - 1)}
                      className="text-xs text-[#718177] hover:text-[#17211B] underline"
                    >
                      ← Voltar à pergunta anterior
                    </button>
                    <button
                      onClick={() => setActiveTab('chatbot')}
                      className="text-xs text-[#8C4E2D] font-semibold hover:underline flex items-center gap-1"
                    >
                      <Bot className="w-3 h-3" />
                      Prefere conversar com a IA?
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* RESULTADO DO QUESTIONÁRIO */
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="p-4 rounded-2xl bg-[#EFE9DF] border border-[#D8CCBD] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C4E2D]">
                      Diagnóstico Personalizado Concluído
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#3F634A] text-white text-[10px] font-bold">
                      Rotina dos 4 Pilares
                    </span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#19241D]">
                    {ritualResult.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#4E5D53] leading-relaxed">
                    {ritualResult.description}
                  </p>
                  <p className="text-xs text-[#6F432A] italic pt-1 border-t border-[#DFD3C4]">
                    <strong>Orientação de Bem-estar:</strong> {ritualResult.selfcareAdvice}
                  </p>
                </div>

                {/* 4 Pilares Prescritos */}
                <div className="space-y-2">
                  <span className="text-xs uppercase font-bold text-[#1E2922] block">
                    Fórmulas Sinergéticas Recomendadas:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {ritualResult.products.map((p, idx) => {
                      const labels = ['1. Limpeza Diária', '2. Hidratação', '3. Proteção Solar', '4. Máscara Semanal'];
                      return (
                        <div key={p.id} className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#DDD0BF] flex items-center gap-3">
                          <img src={p.image} alt={p.name} className="w-12 h-12 rounded-xl object-cover" />
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] font-bold uppercase text-[#8C4E2D] block truncate">
                              {labels[idx]}
                            </span>
                            <h4 className="font-serif text-xs font-semibold text-[#1A251E] truncate">
                              {p.name}
                            </h4>
                            <span className="text-xs font-bold text-[#243329]">R$ {p.price}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Promoção da Quest */}
                <div className="p-4 rounded-2xl bg-[#EBE4D8] border border-[#D5C6B2] flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <span className="text-xs text-[#718076] line-through block">De R$ {ritualResult.regularTotal}</span>
                    <span className="font-serif text-2xl font-bold text-[#1E2721]">
                      R$ {ritualResult.questSpecialPrice} <span className="text-xs text-[#8C4E2D]">({ritualResult.questDiscountPercent}% OFF)</span>
                    </span>
                    <span className="text-[11px] text-[#3F634A] block font-semibold">✓ Frete Grátis + Nécessaire de Linho inclusa</span>
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => {
                        onAddRecommendedKit(ritualResult.products);
                        onClose();
                      }}
                      className="flex-1 sm:flex-none px-5 py-3 rounded-full bg-[#243329] hover:bg-[#16211A] text-white text-xs uppercase tracking-wider font-semibold shadow-md flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-[#E3A882]" />
                      <span>Garantir na Sacola</span>
                    </button>
                    <button
                      onClick={() => {
                        onGoToPromotions('kits');
                        onClose();
                      }}
                      className="px-4 py-3 rounded-full bg-[#8C4E2D] hover:bg-[#723B1E] text-white text-xs uppercase tracking-wider font-semibold shadow-sm flex items-center justify-center gap-1"
                    >
                      <span>Ver Ofertas</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs text-[#75867D]">
                  <button onClick={resetQuiz} className="hover:underline flex items-center gap-1">
                    <RotateCcw className="w-3 h-3" /> Refazer teste
                  </button>
                  <button onClick={() => setActiveTab('chatbot')} className="text-[#8C4E2D] font-semibold hover:underline flex items-center gap-1">
                    <Bot className="w-3.5 h-3.5" /> Tirar dúvidas no Chatbot IA
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* ABA 3: PESQUISA DE PREÇOS DE MERCADO (CeraVe, La Roche, Vichy, SkinC)     */}
        {/* ========================================================================= */}
        {activeTab === 'benchmark' && (
          <div className="flex-1 overflow-y-auto space-y-4 pt-3 text-xs sm:text-sm">
            
            {/* Context Box */}
            <div className="p-4 rounded-2xl bg-[#F4EFE6] border border-[#E3D6C5] space-y-1.5">
              <div className="flex items-center gap-1.5 text-[#8C4E2D] font-bold uppercase tracking-wider text-[11px]">
                <Scale className="w-4 h-4" />
                <span>Estudo de Mercado Farmacêutico Brasileiro</span>
              </div>
              <h3 className="font-serif text-lg font-medium text-[#18231C]">
                Média de Preços: La Roche-Posay, CeraVe, Vichy e SkinCeuticals
              </h3>
              <p className="text-xs text-[#526358] leading-relaxed">
                Pesquisa recente de mercado em drogarias nacionais (Drogasil, Raia, Pacheco, São Paulo) comparando as fórmulas convencionais com a pureza dos biocosméticos botânicos da Aura.
              </p>
            </div>

            {/* Benchmark Table / Cards */}
            <div className="space-y-2.5">
              {[
                {
                  brand: 'SkinCeuticals',
                  category: 'Luxo Médico-Dermatológico',
                  priceRange: 'R$ 350 a R$ 650+',
                  avgTicket: 'R$ 420 - R$ 520 por frasco (30ml)',
                  popularItems: 'C E Ferulic (R$ 505), Silymarin CF (R$ 505), H.A. Intensifier (R$ 415), A.G.E. Eye (R$ 630).',
                  pros: 'Patentes consolidadas de Vitamina C pura e alta penetração ácida.',
                  cons: 'Preço proibitivo para uso contínuo, frascos que oxidam rápido, fórmulas sintéticas.',
                  badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
                },
                {
                  brand: 'La Roche-Posay',
                  category: 'Dermocosmético Tradicional Francês',
                  priceRange: 'R$ 50 a R$ 250',
                  avgTicket: 'R$ 90 - R$ 130 (Protetores/Limpadores) | R$ 210 - R$ 260 (Séruns)',
                  popularItems: 'Anthelios FPS 60 (~R$ 99), Effaclar Gel (~R$ 119), Cicaplast B5+ (R$ 55 a R$ 99), Hyalu B5 (R$ 230).',
                  pros: 'Água termal reconhecida e ampla disponibilidade em farmácias.',
                  cons: 'Uso de silicones derivados de petróleo, microplásticos e conservantes sintéticos.',
                  badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
                },
                {
                  brand: 'Vichy',
                  category: 'Dermocosmético Intermediário-Premium',
                  priceRange: 'R$ 100 a R$ 260',
                  avgTicket: 'R$ 130 - R$ 180 por produto',
                  popularItems: 'Minéral 89 (R$ 130 a R$ 180), Protetor Idéal Soleil (R$ 111), Normaderm Phytosolution (R$ 120).',
                  pros: 'Texturas fluídas refrescantes e foco em água vulcânica.',
                  cons: 'Fragrâncias químicas sintéticas e ativos nobres em concentrações moderadas.',
                  badgeColor: 'bg-teal-100 text-teal-900 border-teal-300',
                },
                {
                  brand: 'CeraVe',
                  category: 'Dermocosmético Acessível de Farmácia',
                  priceRange: 'R$ 40 a R$ 140',
                  avgTicket: 'R$ 75 - R$ 110 (Hidratantes corporais e faciais)',
                  popularItems: 'Loção Hidratante 473ml (~R$ 110), Gel de Limpeza (~R$ 99), Creme Reparador de Mãos (~R$ 45).',
                  pros: 'Custo por ml competitivo para hidratação básica diária.',
                  cons: 'Base forte de petrolatos (mineral oil / parafina líquida) e ceramidas sintetizadas em laboratório.',
                  badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
                },
              ].map((item, bIdx) => (
                <div key={bIdx} className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#DDD0BF] space-y-1.5 shadow-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-sm text-[#18231C]">{item.brand}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${item.badgeColor}`}>
                        {item.category}
                      </span>
                    </div>
                    <span className="font-serif font-bold text-xs text-[#8C4E2D] bg-[#F3ECE0] px-2.5 py-0.5 rounded-full">
                      Faixa: {item.priceRange}
                    </span>
                  </div>

                  <p className="text-xs text-[#4F5E55]">
                    <strong>Produtos Chave:</strong> {item.popularItems}
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                    <div className="p-2 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-emerald-900">
                      <strong>Ponto Forte:</strong> {item.pros}
                    </div>
                    <div className="p-2 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-900">
                      <strong>Limitação:</strong> {item.cons}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Aura Botânica Destaque */}
            <div className="p-4 rounded-2xl bg-[#243329] text-white space-y-2.5 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-bold text-[#E3A882] flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  Aura Botânica: A Revolução do Luxo Limpo Acessível
                </span>
                <span className="text-xs bg-[#8C4E2D] px-2 py-0.5 rounded-full font-bold">
                  R$ 78 a R$ 139 / item
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#D7DFD9] leading-relaxed">
                Enquanto a <strong>SkinCeuticals</strong> cobra mais de R$ 500 por um sérum com conservantes sintéticos e a <strong>CeraVe</strong> utiliza derivados de petróleo, a <strong>Aura Botânica</strong> entrega fórmulas 100% ativas com <em>Bakuchiol puro 1%, Rosa Mosqueta chilena prensada a frio, Ácido Hialurônico Botânico e Filtro Solar 100% Mineral</em> em frascos de vidro âmbar com logística reversa.
              </p>
              
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#3B4D41]">
                <span className="text-xs text-[#A8D5BA] font-medium">
                  🌿 Eficácia de alta performance com custo honesto e sustentável.
                </span>
                <button
                  onClick={() => {
                    onGoToPromotions('kits');
                    onClose();
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#E3A882] hover:bg-[#CE956F] text-[#1E2721] text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Ver Kits com até 35% de Economia</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
