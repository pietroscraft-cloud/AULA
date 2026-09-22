import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Sparkles, Check, ArrowRight, RotateCcw, Heart, Shield, 
  Leaf, Sun, Droplets, Smile, Wind, Tag, ShoppingBag, Send, 
  Bot, User, Scale, DollarSign, Award, RefreshCw, AlertCircle,
  Copy, CheckCircle2, FileText, Moon, Clock, ClipboardList, Target
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

  // ===================== ESTADOS DO QUIZ RITUAL =====================
  const [step, setStep] = useState(1);
  const [skinType, setSkinType] = useState<string>('mista');
  const [primaryConcern, setPrimaryConcern] = useState<string>('vermelhidao_rosacea');
  const [hydrationPreference, setHydrationPreference] = useState<string>('canhamo_terpenos');
  const [sunLifestyle, setSunLifestyle] = useState<string>('telas');
  const [maskPreference, setMaskPreference] = useState<string>('peeling');
  const [intention, setIntention] = useState<string>('calma');
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  const resetQuiz = () => {
    setStep(1);
    setSkinType('mista');
    setPrimaryConcern('vermelhidao_rosacea');
    setHydrationPreference('canhamo_terpenos');
    setSunLifestyle('telas');
    setMaskPreference('peeling');
    setIntention('calma');
    setCopiedSummary(false);
  };

  // Helper labels for gathering questionnaire information
  const getSkinTypeLabel = (id: string) => {
    switch (id) {
      case 'sensivel_rosacea': return 'Pele Reativa / Rosácea / Vermelhidão';
      case 'oleosa': return 'Pele Oleosa / Brilho & Poros Dilatados';
      case 'mista': return 'Pele Mista (Zona T com Brilho & Bochechas Neutras)';
      case 'seca': return 'Pele Seca / Repuxamento & Aspereza';
      case 'madura': return 'Pele Madura / Perda de Firmeza & Linhas';
      default: return 'Equilibrada';
    }
  };

  const getConcernLabel = (id: string) => {
    switch (id) {
      case 'vermelhidao_rosacea': return 'Alívio de Vermelhidão, Queimação & Rosácea';
      case 'manchas_opacidade': return 'Uniformização de Manchas & Viço Natural';
      case 'oleosidade_acne': return 'Controle de Oleosidade & Desobstrução sem Rebote';
      case 'linhas_firmeza': return 'Suavização de Linhas & Firmeza com Colágeno Botânico';
      case 'desidratacao': return 'Hidratação Profunda 48h & Reparação da Barreira';
      default: return 'Equilíbrio Global';
    }
  };

  const getHydrationLabel = (id: string) => {
    switch (id) {
      case 'canhamo_terpenos': return 'Óleo Puro de Cânhamo & Terpenos (Cannabis sativa)';
      case 'serum_mosqueta': return 'Sérum de Rosa Mosqueta Silvestre & Bakuchiol 1%';
      case 'aqua_gel': return 'Aqua-Gel Fito-Refrescante Niacinamida 5% & Algas';
      case 'balsamo_cupuacu': return 'Bálsamo Biomimético de Cupuaçu & Ácido Hialurônico';
      default: return 'Hidratação Sinergética';
    }
  };

  const getSunLabel = (id: string) => {
    switch (id) {
      case 'telas': return 'Ambiente Fechado + Luz Azul de Telas (Computador/Celular)';
      case 'glow': return 'Filtro Mineral Fito-Pigmentado com Efeito Make Glow';
      case 'sol_ar_livre': return 'Exposição Frequente ao Ar Livre, Sol & Vento';
      default: return 'Proteção Mineral Diária';
    }
  };

  const getMaskLabel = (id: string) => {
    switch (id) {
      case 'peeling': return 'Peeling Biológico de Enzimas de Romã & Argila Branca';
      case 'detox': return 'Máscara Detox de Argila Verde & Carvão de Babaçu';
      case 'resgate_canhamo': return 'Terapia Intensiva de Cânhamo & Centella Asiática';
      default: return 'Spa Semanal';
    }
  };

  const getIntentionLabel = (id: string) => {
    switch (id) {
      case 'calma': return 'Desaceleração do Sistema Nervoso & Alívio de Estresse';
      case 'vico': return 'Vitalidade Radiante, Viço Dourado & Autoestima';
      case 'pureza': return 'Mente Clara, Frescor Puro & Sensação de Renascimento';
      default: return 'Conexão Holística';
    }
  };

  // Determine personalized 4-pillar routine based on gathered answers
  const getPersonalizedRitual = () => {
    // 1. Limpeza Diária
    let cleansingProduct: Product;
    if (skinType === 'sensivel_rosacea' || skinType === 'seca' || primaryConcern === 'vermelhidao_rosacea') {
      cleansingProduct = PRODUCTS_DATA.find(p => p.id === 'oleo-limpeza-calmante') || PRODUCTS_DATA[4];
    } else {
      cleansingProduct = PRODUCTS_DATA.find(p => p.id === 'espuma-facial-enzimatica') || PRODUCTS_DATA[5];
    }

    // 2. Hidratação & Reparação Celular
    let hydrationProduct: Product;
    if (hydrationPreference === 'canhamo_terpenos' || primaryConcern === 'vermelhidao_rosacea' || skinType === 'sensivel_rosacea') {
      hydrationProduct = PRODUCTS_DATA.find(p => p.id === 'oleo-facial-canhamo-puro') || PRODUCTS_DATA[7];
    } else if (hydrationPreference === 'aqua_gel' || skinType === 'oleosa' || primaryConcern === 'oleosidade_acne') {
      hydrationProduct = PRODUCTS_DATA.find(p => p.id === 'aqua-gel-fito-hidratante') || PRODUCTS_DATA[9];
    } else if (hydrationPreference === 'balsamo_cupuacu' || skinType === 'seca' || primaryConcern === 'desidratacao') {
      hydrationProduct = PRODUCTS_DATA.find(p => p.id === 'balsamo-hidratante-biomimetico') || PRODUCTS_DATA[8];
    } else {
      hydrationProduct = PRODUCTS_DATA.find(p => p.id === 'serum-botanico-regenerador') || PRODUCTS_DATA[7];
    }

    // 3. Proteção Solar & Luz Azul
    let sunProduct: Product;
    if (sunLifestyle === 'glow' || primaryConcern === 'manchas_opacidade') {
      sunProduct = PRODUCTS_DATA.find(p => p.id === 'protetor-solar-mineral-glow-fps60') || PRODUCTS_DATA[12];
    } else {
      sunProduct = PRODUCTS_DATA.find(p => p.id === 'fluido-solar-mineral-fps50') || PRODUCTS_DATA[11];
    }

    // 4. Máscara Semanal / Spa
    let maskProduct: Product;
    if (maskPreference === 'resgate_canhamo' || primaryConcern === 'vermelhidao_rosacea') {
      maskProduct = PRODUCTS_DATA.find(p => p.id === 'creme-reparador-canhamo-ceramidas') || PRODUCTS_DATA.find(p => p.id === 'mascara-facial-renovadora-enzimas') || PRODUCTS_DATA[13];
    } else if (maskPreference === 'detox' || skinType === 'oleosa' || primaryConcern === 'oleosidade_acne') {
      maskProduct = PRODUCTS_DATA.find(p => p.id === 'mascara-detox-argila-verde') || PRODUCTS_DATA[14];
    } else {
      maskProduct = PRODUCTS_DATA.find(p => p.id === 'mascara-facial-renovadora-enzimas') || PRODUCTS_DATA[13];
    }

    // Biotype Title, Clinical Diagnosis and Holistic Advice
    let biotypeTitle = 'Biotipo Botânico: Equilíbrio & Viço Celular';
    let biotypeDesc = 'Sua pele busca harmonia fisiológica entre desobstrução de poros, hidratação biocompatível e escudo antioxidante contra o estresse urbano.';
    let selfcareAdvice = 'Dedique 1 minuto ao acordar para inalar os terpenos naturais dos produtos com os olhos fechados. Essa pausa inicial estimula o sistema nervoso parassimpático e relaxa a musculatura facial.';

    if (skinType === 'sensivel_rosacea' || primaryConcern === 'vermelhidao_rosacea') {
      biotypeTitle = 'Biotipo Botânico: Alívio Calmante & Resgate com Cânhamo';
      biotypeDesc = 'Barreira cutânea sensibilizada com reatividade e queimação. Foco em ácidos graxos essenciais Ômega 3 e 6 (Cannabis sativa seed oil), fito-ceramidas e alfa-bisabolol para desinflamar e blindar o estrato córneo com toque seco e sedoso.';
      selfcareAdvice = 'Ao aplicar o Óleo de Cânhamo puro, pressione delicadamente as palmas mornas das mãos contra as bochechas e testa, sem esfregar. O calor corporal acelera a bio-afinidade dos lipídios sem estimular a vasodilatação.';
    } else if (skinType === 'oleosa' || primaryConcern === 'oleosidade_acne') {
      biotypeTitle = 'Biotipo Botânico: Pureza Mate & Detox de Poros';
      biotypeDesc = 'Tendência a hipersecreção sebácea e poros dilatados. Priorizamos Papaína enzimática e Niacinamida botânica 5%, que equilibram o microbioma cutâneo sem gerar o temido efeito rebote dos adstringentes sintéticos.';
      selfcareAdvice = 'Lave o rosto com água em temperatura ambiente ou levemente fresca. A água quente estimula a secreção sebácea reflexa. Finalize com movimentos circulares suaves usando a espuma enzimática.';
    } else if (skinType === 'seca' || primaryConcern === 'desidratacao') {
      biotypeTitle = 'Biotipo Botânico: Nutrição Biomimética & Reparação 48h';
      biotypeDesc = 'Déficit de manto lipídico e elevada taxa de perda de água transepidérmica (TEWL). Foco em manteiga amazônica de cupuaçu pura e ácido hialurônico vegetal para retenção hídrica duradoura.';
      selfcareAdvice = 'Aplique a hidratação com a pele ainda levemente úmida pós-limpeza. Isso permite que os fitoativos biomiméticos capturem a água superficial e a fixem nas camadas mais profundas.';
    } else if (skinType === 'madura' || primaryConcern === 'linhas_firmeza') {
      biotypeTitle = 'Biotipo Botânico: Regeneração Celular & Firmeza Dourada';
      biotypeDesc = 'Necessidade de renovação celular acelerada e estímulo da síntese de colágeno sem a agressão do retinol sintético. Foco em Bakuchiol 1%, Rosa Mosqueta silvestre da Patagônia e antioxidantes nobres.';
      selfcareAdvice = 'Massageie o rosto de baixo para cima, partindo da clavícula até o contorno da mandíbula e maçãs do rosto, promovendo drenagem linfática e tonificação da musculatura.';
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

  const handleCopyDossier = () => {
    const text = `🌿 DOSSIÊ DE AUTOCUIDADO & BIOTIPO CUTÂNEO - AURA BOTÂNICA
==================================================
DIAGNÓSTICO: ${ritualResult.title}
ANÁLISE FISIOLÓGICA: ${ritualResult.description}
ORIENTAÇÃO HOLÍSTICA: ${ritualResult.selfcareAdvice}

RESUMO CONSOLIDADO DAS SUAS RESPOSTAS:
• Biotipo Cutâneo ao Despertar: ${getSkinTypeLabel(skinType)}
• Prioridade & Desafio Central: ${getConcernLabel(primaryConcern)}
• Textura & Ativo de Hidratação: ${getHydrationLabel(hydrationPreference)}
• Estilo de Vida & Blindagem: ${getSunLabel(sunLifestyle)}
• Spa Semanal & Descompressão: ${getMaskLabel(maskPreference)}
• Intenção Emocional & Aromaterapia: ${getIntentionLabel(intention)}

RITUAL DOS 4 PILARES BOTÂNICOS PRESCRITO:
1. ${ritualResult.products[0]?.name} (${ritualResult.products[0]?.volume})
2. ${ritualResult.products[1]?.name} (${ritualResult.products[1]?.volume})
3. ${ritualResult.products[2]?.name} (${ritualResult.products[2]?.volume})
4. ${ritualResult.products[3]?.name} (${ritualResult.products[3]?.volume})

GUIA DE APLICAÇÃO PASSO A PASSO:
☀️ RITUAL MATINAL (3 min):
   1. Limpeza suave com ${ritualResult.products[0]?.name}.
   2. 3 a 4 gotas ou camada leve de ${ritualResult.products[1]?.name}, pressionando com as palmas das mãos mornas.
   3. Blindagem com ${ritualResult.products[2]?.name} para proteção contra sol e luz de telas.

🌙 RITUAL NOTURNO (5 min):
   1. Limpeza profunda biocompatível para remover poluentes urbanos e sebo acumulado.
   2. Massagem facial relaxante inalando os óleos essenciais com ${ritualResult.products[1]?.name}.
   3. Aplicação semanal da máscara ${ritualResult.products[3]?.name} (1 a 2 vezes por semana, deixando agir 15 min).

VALOR DO RITUAL COMPLETO DO QUIZ (28% OFF):
• Total Promocional: R$ ${ritualResult.questSpecialPrice} (De R$ ${ritualResult.regularTotal})
• Benefícios Inclusos: Frete Grátis para todo o Brasil + Nécessaire de Linho Cru
==================================================
Aura Botânica • Fitoativos Puros, Veganos & Biocompatíveis`;

    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 3500);
  };

  const handleTransferDiagnosisToChat = () => {
    setMessages(prev => [
      ...prev,
      {
        id: `user-diag-${Date.now()}`,
        sender: 'user',
        text: `Olá Aura! Concluí o meu Quiz de Autocuidado e quero orientações com base no meu diagnóstico:\n\n• Biotipo: ${getSkinTypeLabel(skinType)}\n• Prioridade: ${getConcernLabel(primaryConcern)}\n• Ativo Escolhido: ${getHydrationLabel(hydrationPreference)}\n• Rotina Diurna: ${getSunLabel(sunLifestyle)}\n• Spa Semanal: ${getMaskLabel(maskPreference)}\n• Intenção: ${getIntentionLabel(intention)}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      {
        id: `bot-diag-${Date.now()}`,
        sender: 'bot',
        text: `Que maravilha receber seu **Dossiê Completo de Autocuidado**! 🌿\n\nAnalisei as suas 6 respostas: sua barreira cutânea apresenta o **${ritualResult.title}** e o foco prioritário que vamos cuidar é o **${getConcernLabel(primaryConcern)}**.\n\nSua rotina sinérgica de 4 pilares está montada com **28% de desconto exclusivo do Quiz** e frete grátis:\n1. **${ritualResult.products[0]?.name}**\n2. **${ritualResult.products[1]?.name}**\n3. **${ritualResult.products[2]?.name}**\n4. **${ritualResult.products[3]?.name}**\n\nComo posso enriquecer seu ritual agora? Gostaria do guia detalhado de massagem facial matinal ou quer entender a bio-afinidade dos ativos no seu biotipo?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendedProducts: ritualResult.products,
        suggestedActions: [
          'Como aplicar na ordem certa de manhã e à noite?',
          'Qual o papel do Cânhamo e dos fitoterpenos no alívio da pele?',
          'Adicionar esses 4 produtos à minha sacola com 28% OFF',
          'Comparar o valor com CeraVe, Vichy e SkinCeuticals',
        ],
      }
    ]);
    setActiveTab('chatbot');
  };

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
      if (lower.includes('cânhamo') || lower.includes('canhamo') || lower.includes('cannabis') || lower.includes('maconha') || lower.includes('rosácea') || lower.includes('rosacea') || lower.includes('vermelhid')) {
        recommendedProducts = [
          PRODUCTS_DATA.find(p => p.id === 'oleo-facial-canhamo-puro') || PRODUCTS_DATA[0],
          PRODUCTS_DATA.find(p => p.id === 'creme-reparador-canhamo-ceramidas') || PRODUCTS_DATA[1],
          PRODUCTS_DATA.find(p => p.id === 'duo-terapeutico-canhamo-restaurador') || PRODUCTS_DATA[2],
          PRODUCTS_DATA.find(p => p.id === 'oleo-limpeza-calmante') || PRODUCTS_DATA[4],
        ];
      } else if (lower.includes('oleos') || lower.includes('acne') || lower.includes('poro')) {
        recommendedProducts = [
          PRODUCTS_DATA.find(p => p.id === 'espuma-facial-enzimatica') || PRODUCTS_DATA[5],
          PRODUCTS_DATA.find(p => p.id === 'aqua-gel-fito-hidratante') || PRODUCTS_DATA[9],
          PRODUCTS_DATA.find(p => p.id === 'fluido-solar-mineral-fps50') || PRODUCTS_DATA[11],
          PRODUCTS_DATA.find(p => p.id === 'mascara-detox-argila-verde') || PRODUCTS_DATA[14],
        ];
      } else if (lower.includes('seca') || lower.includes('repux') || lower.includes('sensiv')) {
        recommendedProducts = [
          PRODUCTS_DATA.find(p => p.id === 'oleo-facial-canhamo-puro') || PRODUCTS_DATA[0],
          PRODUCTS_DATA.find(p => p.id === 'creme-reparador-canhamo-ceramidas') || PRODUCTS_DATA[1],
          PRODUCTS_DATA.find(p => p.id === 'oleo-limpeza-calmante') || PRODUCTS_DATA[4],
          PRODUCTS_DATA.find(p => p.id === 'balsamo-hidratante-biomimetico') || PRODUCTS_DATA[8],
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
        {/* ABA 2: QUESTIONÁRIO RITUAL DE AUTOCUIDADO (6 ETAPAS GUIADAS)              */}
        {/* ========================================================================= */}
        {activeTab === 'quiz' && (
          <div className="flex-1 overflow-y-auto pt-3">
            {step <= 6 ? (
              <div className="space-y-4">
                {/* Header & Progress bar */}
                <div className="flex items-center justify-between text-xs text-[#7A8A80]">
                  <span className="font-semibold uppercase tracking-wider text-[#9C5B39] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Quiz do Ritual • Mapeamento Botânico
                  </span>
                  <span className="font-medium bg-[#EAE3D6] px-2.5 py-0.5 rounded-full text-[#38463E]">
                    Etapa {step} de 6
                  </span>
                </div>
                
                <div className="w-full h-2 bg-[#EAE2D5] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#9C5B39] to-[#243329] transition-all duration-300 rounded-full"
                    style={{ width: `${(step / 6) * 100}%` }}
                  />
                </div>

                {/* ETAPA 1: BIOTIPO AO DESPERTAR */}
                {step === 1 && (
                  <div className="space-y-3.5 animate-in fade-in duration-300">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#3F634A] flex items-center gap-1">
                        <Droplets className="w-3.5 h-3.5" /> Etapa 1 • Biotipo Cutâneo ao Despertar
                      </span>
                      <h3 className="font-serif text-lg sm:text-xl text-[#18231C] font-medium leading-snug">
                        Como se comporta o manto natural da sua pele cerca de 30 a 60 minutos após acordar?
                      </h3>
                      <p className="text-xs text-[#5E6D64]">
                        Avaliamos o estado basal da sua barreira dérmica para prescrever o pH e a fórmula de limpeza biocompatível ideal.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      {[
                        {
                          id: 'sensivel_rosacea',
                          title: 'Reativa, Vermelhidão & Rosácea',
                          subtitle: 'Pinica com sabonetes comuns, reage a calor ou vento e apresenta vasinhos ou queimação.',
                          tag: 'Cânhamo Puro & Alfa-Bisabolol',
                        },
                        {
                          id: 'mista',
                          title: 'Mista / Zona T Levemente Oleosa',
                          subtitle: 'Bochechas equilibradas ou secas com brilho moderado na testa, nariz e queixo.',
                          tag: 'Equilíbrio Hidrolipídico',
                        },
                        {
                          id: 'oleosa',
                          title: 'Brilho Intenso & Poros Abertos',
                          subtitle: 'Sensação de oleosidade em todo o rosto, poros dilatados e tendência a cravos ao longo do dia.',
                          tag: 'Papaína & Niacinamida Botânica',
                        },
                        {
                          id: 'seca',
                          title: 'Sensação de Repuxamento & Aspereza',
                          subtitle: 'Falta de viço, descamação fina e sensação imediata de desconforto caso não aplique hidratante.',
                          tag: 'Cupuaçu & Lipídios Nobres',
                        },
                        {
                          id: 'madura',
                          title: 'Pele Madura / Linhas & Perda de Firmeza',
                          subtitle: 'Redução da elasticidade natural, linhas finas de expressão e desidratação crônica.',
                          tag: 'Bakuchiol 1% & Rosa Mosqueta',
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

                {/* ETAPA 2: DESAFIO & QUEIXA PRIORITÁRIA */}
                {step === 2 && (
                  <div className="space-y-3.5 animate-in fade-in duration-300">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C4E2D] flex items-center gap-1">
                        <Target className="w-3.5 h-3.5" /> Etapa 2 • Queixa Central & Prioridade de Tratamento
                      </span>
                      <h3 className="font-serif text-lg sm:text-xl text-[#18231C] font-medium leading-snug">
                        Qual é o principal desafio ou incômodo que você deseja transformar hoje?
                      </h3>
                      <p className="text-xs text-[#5E6D64]">
                        Mapeamos seu objetivo clínico primário para calibrar a concentração dos fitoativos orgânicos.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      {[
                        {
                          id: 'vermelhidao_rosacea',
                          title: 'Acalmar Vermelhidão & Rosácea',
                          subtitle: 'Alívio instantâneo da queimação, recuperação da barreira rompida e ação anti-inflamatória.',
                          tag: 'Protocolo de Resgate Cânhamo',
                        },
                        {
                          id: 'manchas_opacidade',
                          title: 'Uniformizar Manchas & Devolver Viço',
                          subtitle: 'Clarear marcas pós-sol ou acne, devolvendo luminosidade saudável sem agredir a pele.',
                          tag: 'Fitocomplexo Clareador Suave',
                        },
                        {
                          id: 'oleosidade_acne',
                          title: 'Controlar Sebo & Desobstruir Poros',
                          subtitle: 'Reduzir acne ativa e o brilho excessivo ao longo do dia, mantendo a hidratação equilibrada.',
                          tag: 'Seborregulação sem Rebote',
                        },
                        {
                          id: 'linhas_firmeza',
                          title: 'Atenuar Linhas & Estimular Firmeza',
                          subtitle: 'Aumentar a sustentação dérmica com bio-retinol natural (Bakuchiol) sem ressecamento.',
                          tag: 'Anti-idade Botânico Nobre',
                        },
                        {
                          id: 'desidratacao',
                          title: 'Hidratação Profunda 48h & Fim do Repuxo',
                          subtitle: 'Eliminar a sensação de aspereza e devolver maciez imediata com biomimetismo vegetal.',
                          tag: 'Nutrição Lipídica Intensiva',
                        },
                      ].map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            setPrimaryConcern(item.id);
                            setStep(3);
                          }}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                            primaryConcern === item.id
                              ? 'bg-[#EDE7DC] border-[#9C5B39] shadow-sm'
                              : 'bg-[#FAF8F5] border-[#DDD2C2] hover:bg-[#F3EDE3]'
                          }`}
                        >
                          <div>
                            <span className="text-[10px] font-bold uppercase text-[#3F634A] block mb-0.5">
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

                {/* ETAPA 3: TEXTURA & ATIVO DE HIDRATAÇÃO */}
                {step === 3 && (
                  <div className="space-y-3.5 animate-in fade-in duration-300">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#3F634A] flex items-center gap-1">
                        <Leaf className="w-3.5 h-3.5" /> Etapa 3 • Textura Sensorial & Assinatura de Ativos
                      </span>
                      <h3 className="font-serif text-lg sm:text-xl text-[#18231C] font-medium leading-snug">
                        Qual textura faz seu toque diário ser um instante de puro prazer sensorial?
                      </h3>
                      <p className="text-xs text-[#5E6D64]">
                        O autocuidado só se torna consistente quando a textura desperta conforto imediato nos seus dedos.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      {[
                        {
                          id: 'canhamo_terpenos',
                          title: 'Óleo Puro de Cânhamo & Terpenos (Cannabis sativa)',
                          texture: 'Toque seco sedoso, grau comedogênico zero, absorção rápida e alívio calmante anti-inflamatório.',
                          actives: 'Cannabis Sativa Seed Oil + Alfa-Bisabolol',
                          badge: 'Novidade Exclusiva',
                        },
                        {
                          id: 'serum_mosqueta',
                          title: 'Sérum Fluido Botânico Regenerador',
                          texture: 'Néctar dourado leve como seda, toque aveludado e glow radiante com 8 óleos nobres prensados a frio.',
                          actives: 'Rosa Mosqueta Silvestre + Bakuchiol 1%',
                          badge: 'Mais Vendido',
                        },
                        {
                          id: 'aqua_gel',
                          title: 'Aqua-Gel Fito-Refrescante',
                          texture: 'Gel aquoso geladinho, absorção em 3 segundos e acabamento mate aveludado sem resíduos.',
                          actives: 'Niacinamida 5% + Algas Marinhas',
                          badge: 'Toque Seco Total',
                        },
                        {
                          id: 'balsamo_cupuacu',
                          title: 'Bálsamo Reparador Rico Biomimético',
                          texture: 'Creme amanteigado reconfortante, selagem biomimética profunda e barreira de proteção 48 horas.',
                          actives: 'Manteiga de Cupuaçu + Ácido Hialurônico',
                          badge: 'Reparação Intensa',
                        },
                      ].map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            setHydrationPreference(item.id);
                            setStep(4);
                          }}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                            hydrationPreference === item.id
                              ? 'bg-[#EDE7DC] border-[#9C5B39] shadow-sm'
                              : 'bg-[#FAF8F5] border-[#DDD2C2] hover:bg-[#F3EDE3]'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-0.5">
                              <span className="text-[10px] font-bold uppercase text-[#8C4E2D]">
                                {item.actives}
                              </span>
                              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#E4D8C8] text-[#554131] font-semibold">
                                {item.badge}
                              </span>
                            </div>
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

                {/* ETAPA 4: ROTINA DIURNA & LUZ DE TELAS */}
                {step === 4 && (
                  <div className="space-y-3.5 animate-in fade-in duration-300">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#A06C3B] flex items-center gap-1">
                        <Sun className="w-3.5 h-3.5" /> Etapa 4 • Rotina Diurna & Blindagem contra Telas
                      </span>
                      <h3 className="font-serif text-lg sm:text-xl text-[#18231C] font-medium leading-snug">
                        Como é a sua exposição diária a telas digitais e radiação ambiental?
                      </h3>
                      <p className="text-xs text-[#5E6D64]">
                        Monitores e celulares emitem radiação azul de alta energia que degrada o colágeno e intensifica manchas tanto quanto o sol.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                      {[
                        {
                          id: 'telas',
                          title: 'Ambiente Fechado + Luz de Telas',
                          subtitle: 'Home office ou escritório diante de monitores e smartphones o dia todo.',
                          choice: 'Fluido Mineral FPS 50 Invisível',
                        },
                        {
                          id: 'glow',
                          title: 'Efeito Make Natural & Glow',
                          subtitle: 'Filtro mineral fito-pigmentado que uniformiza manchas e disfarça poros com luminosidade.',
                          choice: 'Protetor Mineral Glow FPS 60',
                        },
                        {
                          id: 'sol_ar_livre',
                          title: 'Exposição Dinâmica ao Sol & Ar Livre',
                          subtitle: 'Caminhadas, sol direto, vento e poluição urbana frequentes na rotina.',
                          choice: 'Fluido Mineral FPS 50 Invisível',
                        },
                      ].map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            setSunLifestyle(item.id);
                            setStep(5);
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

                {/* ETAPA 5: SPA SEMANAL & MÁSCARAS */}
                {step === 5 && (
                  <div className="space-y-3.5 animate-in fade-in duration-300">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#3F634A] flex items-center gap-1">
                        <Smile className="w-3.5 h-3.5" /> Etapa 5 • Máscaras & Spa Facial de Descompressão
                      </span>
                      <h3 className="font-serif text-lg sm:text-xl text-[#18231C] font-medium leading-snug">
                        Qual é o seu momento favorito de descompressão semanal com máscara facial?
                      </h3>
                      <p className="text-xs text-[#5E6D64]">
                        15 minutos de tratamento intensivo semanal aceleram a renovação celular e acalmam microinflamações.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                      {[
                        {
                          id: 'peeling',
                          title: 'Máscara Argila Branca & Enzimas de Romã',
                          subtitle: 'Peeling biológico suave sem atrito que uniformiza o relevo e devolve viço instantâneo.',
                          aroma: 'Lavanda francesa e romã',
                        },
                        {
                          id: 'detox',
                          title: 'Máscara Detox Argila Verde & Babaçu',
                          subtitle: 'Purificação profunda antipoluição, desobstrução de poros e equilíbrio duradouro do sebo.',
                          aroma: 'Hortelã verde e eucalipto',
                        },
                        {
                          id: 'resgate_canhamo',
                          title: 'Terapia Intensiva de Cânhamo & Centella',
                          subtitle: 'Cuidado de choque calmante para restaurar a barreira de peles sensibilizadas e atópicas.',
                          aroma: 'Camomila alemã e terpenos herbais',
                        },
                      ].map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            setMaskPreference(item.id);
                            setStep(6);
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

                {/* ETAPA 6: INTENÇÃO HOLÍSTICA & AROMATERAPIA */}
                {step === 6 && (
                  <div className="space-y-3.5 animate-in fade-in duration-300">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#9C5B39] flex items-center gap-1">
                        <Wind className="w-3.5 h-3.5" /> Etapa 6 • Intenção Emocional & Aromaterapia Integrativa
                      </span>
                      <h3 className="font-serif text-lg sm:text-xl text-[#18231C] font-medium leading-snug">
                        Qual estado de espírito você busca cultivar durante o seu autocuidado?
                      </h3>
                      <p className="text-xs text-[#5E6D64]">
                        A inalação dos óleos essenciais puros estimula receptores no sistema límbico, reduzindo a liberação de cortisol.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                      {[
                        {
                          id: 'calma',
                          title: 'Desaceleração & Alívio de Estresse',
                          desc: 'Silenciar a mente, descontrair os músculos da testa e aliviar a tensão acumulada do dia.',
                          blend: 'Notas de Camomila & Cânhamo Calmante',
                        },
                        {
                          id: 'vico',
                          title: 'Vitalidade Radiante & Autoestima',
                          desc: 'Começar o dia com brilho no olhar, energia renovada e pele iluminada com viço dourado.',
                          blend: 'Notas de Gerânio Imperial & Rosas',
                        },
                        {
                          id: 'pureza',
                          title: 'Mente Clara, Frescor & Renascimento',
                          desc: 'Sensação profunda de banho revigorante, limpeza energizante e leveza imediata.',
                          blend: 'Notas de Alecrim, Hortelã & Laranjeira',
                        },
                      ].map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            setIntention(item.id);
                            setStep(7);
                          }}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                            intention === item.id
                              ? 'bg-[#EDE7DC] border-[#9C5B39] shadow-sm'
                              : 'bg-[#FAF8F5] border-[#DDD2C2] hover:bg-[#F3EDE3]'
                          }`}
                        >
                          <div>
                            <span className="text-[10px] font-bold uppercase text-[#8C4E2D] block mb-0.5">
                              {item.blend}
                            </span>
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

                {/* Barra de Navegação Inferior */}
                {step > 1 && (
                  <div className="pt-2 flex justify-between items-center border-t border-[#EAE3D6]">
                    <button
                      onClick={() => setStep(step - 1)}
                      className="text-xs text-[#718177] hover:text-[#17211B] underline flex items-center gap-1"
                    >
                      ← Voltar à etapa anterior
                    </button>
                    <button
                      onClick={() => setActiveTab('chatbot')}
                      className="text-xs text-[#8C4E2D] font-semibold hover:underline flex items-center gap-1"
                    >
                      <Bot className="w-3 h-3" />
                      Prefere conversar diretamente com a IA?
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* ========================================================================= */
              /* RESULTADO INTEGRADO: DOSSIÊ CONSOLIDADO DE RESPOSTAS E PRESCRIÇÃO         */
              /* ========================================================================= */
              <div className="space-y-4 animate-in fade-in duration-300">
                
                {/* Certificado do Diagnóstico */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#EFE9DF] border border-[#D8CCBD] space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C4E2D] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Dossiê de Autocuidado Concluído
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#243329] text-white text-[10px] font-bold tracking-wider">
                      Prescrição dos 4 Pilares
                    </span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#19241D] leading-snug">
                    {ritualResult.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#4E5D53] leading-relaxed">
                    {ritualResult.description}
                  </p>
                  <div className="pt-2 border-t border-[#DFD3C4] text-xs text-[#6F432A] flex items-start gap-1.5">
                    <Heart className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-[#9C5B39]" />
                    <p>
                      <strong>Orientação Holística:</strong> {ritualResult.selfcareAdvice}
                    </p>
                  </div>
                </div>

                {/* PAINEL CONSOLIDADO DAS 6 RESPOSTAS DO QUESTIONÁRIO */}
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#DDD2C2] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-bold text-[#1E2922] flex items-center gap-1.5">
                      <ClipboardList className="w-3.5 h-3.5 text-[#8C4E2D]" />
                      Resumo Consolidado das suas Respostas:
                    </span>
                    <span className="text-[10px] text-[#7A8A80]">
                      6 parâmetros mapeados
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-0.5">
                    <div className="p-2.5 rounded-xl bg-white border border-[#E8DEC8]">
                      <span className="text-[9px] uppercase font-bold text-[#8C4E2D] block">1. Biotipo Basal</span>
                      <p className="text-xs font-semibold text-[#1F2B23] mt-0.5">{getSkinTypeLabel(skinType)}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-[#E8DEC8]">
                      <span className="text-[9px] uppercase font-bold text-[#8C4E2D] block">2. Queixa Prioritária</span>
                      <p className="text-xs font-semibold text-[#1F2B23] mt-0.5">{getConcernLabel(primaryConcern)}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-[#E8DEC8]">
                      <span className="text-[9px] uppercase font-bold text-[#3F634A] block">3. Textura & Ativo</span>
                      <p className="text-xs font-semibold text-[#1F2B23] mt-0.5">{getHydrationLabel(hydrationPreference)}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-[#E8DEC8]">
                      <span className="text-[9px] uppercase font-bold text-[#3F634A] block">4. Blindagem Diurna</span>
                      <p className="text-xs font-semibold text-[#1F2B23] mt-0.5">{getSunLabel(sunLifestyle)}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-[#E8DEC8]">
                      <span className="text-[9px] uppercase font-bold text-[#74452C] block">5. Spa Semanal</span>
                      <p className="text-xs font-semibold text-[#1F2B23] mt-0.5">{getMaskLabel(maskPreference)}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-[#E8DEC8]">
                      <span className="text-[9px] uppercase font-bold text-[#74452C] block">6. Intenção Holística</span>
                      <p className="text-xs font-semibold text-[#1F2B23] mt-0.5">{getIntentionLabel(intention)}</p>
                    </div>
                  </div>
                </div>

                {/* 4 PILARES BOTÂNICOS PRESCRITOS */}
                <div className="space-y-2">
                  <span className="text-xs uppercase font-bold text-[#1E2922] block">
                    Fórmulas Sinergéticas Recomendadas para o seu Biotipo:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {ritualResult.products.map((p, idx) => {
                      const labels = ['1. Purificar (Limpeza Diária)', '2. Nutrir & Reparar (Fitoativo)', '3. Proteger (Mineral & Telas)', '4. Descomprimir (Spa Semanal)'];
                      return (
                        <div key={p.id} className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#DDD0BF] flex items-center gap-3">
                          <img src={p.image} alt={p.name} className="w-14 h-14 rounded-xl object-cover border border-[#E5DACB]" />
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] font-bold uppercase text-[#8C4E2D] block truncate">
                              {labels[idx]}
                            </span>
                            <h4 className="font-serif text-xs font-semibold text-[#1A251E] truncate">
                              {p.name}
                            </h4>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-[10px] text-[#697A70]">{p.volume}</span>
                              <span className="text-xs font-bold text-[#243329]">R$ {p.price}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* GUIA DE USO PASSO A PASSO (MANHÃ VS. NOITE) */}
                <div className="p-3.5 rounded-2xl bg-[#F6F1EA] border border-[#DFD3C4] space-y-2">
                  <span className="text-xs font-bold uppercase text-[#1B261F] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#3F634A]" />
                    Como Aplicar seu Ritual Diário (Minuto a Minuto):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#4F5E55]">
                    <div className="p-2.5 rounded-xl bg-white/80 border border-[#E6DDD0]">
                      <div className="flex items-center gap-1 font-bold text-[#8C4E2D] mb-1">
                        <Sun className="w-3.5 h-3.5" /> Ritual Matinal (3 minutos)
                      </div>
                      <ol className="list-decimal pl-4 space-y-1">
                        <li>Limpar com <strong>{ritualResult.products[0]?.name}</strong> e água morna.</li>
                        <li>Aplicar 3 a 4 gotas ou camada leve de <strong>{ritualResult.products[1]?.name}</strong> pressionando as palmas.</li>
                        <li>Finalizar com <strong>{ritualResult.products[2]?.name}</strong> para escudo contra sol e telas.</li>
                      </ol>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/80 border border-[#E6DDD0]">
                      <div className="flex items-center gap-1 font-bold text-[#243329] mb-1">
                        <Moon className="w-3.5 h-3.5" /> Ritual Noturno (5 minutos)
                      </div>
                      <ol className="list-decimal pl-4 space-y-1">
                        <li>Limpeza profunda para remover sebo e poluentes do dia.</li>
                        <li>Inalar os terpenos aromáticos e aplicar <strong>{ritualResult.products[1]?.name}</strong> para regeneração celular noturna.</li>
                        <li>Aplicar <strong>{ritualResult.products[3]?.name}</strong> 1 a 2x por semana (agir 15 min).</li>
                      </ol>
                    </div>
                  </div>
                </div>

                {/* PAINEL DE OFERTA EXCLUSIVA DO QUIZ */}
                <div className="p-4 rounded-2xl bg-[#EBE4D8] border border-[#D5C6B2] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
                  <div>
                    <span className="text-xs text-[#718076] line-through block">Valor avulso: R$ {ritualResult.regularTotal}</span>
                    <span className="font-serif text-2xl font-bold text-[#1E2721]">
                      R$ {ritualResult.questSpecialPrice} <span className="text-xs text-[#8C4E2D]">({ritualResult.questDiscountPercent}% OFF Especial do Quiz)</span>
                    </span>
                    <span className="text-[11px] text-[#3F634A] block font-semibold">
                      ✓ Frete Grátis + Nécessaire de Linho Cru inclusa
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => {
                        onAddRecommendedKit(ritualResult.products);
                        onClose();
                      }}
                      className="flex-1 sm:flex-none px-5 py-3 rounded-full bg-[#243329] hover:bg-[#16211A] text-white text-xs uppercase tracking-wider font-semibold shadow-md flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-[#E3A882]" />
                      <span>Adicionar os 4 Passos</span>
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

                {/* BARRA DE AÇÕES CLÍNICAS: COPIAR DOSSIÊ, CHATBOT IA E REFAZER */}
                <div className="flex flex-wrap justify-between items-center gap-2 pt-1 text-xs text-[#75867D] border-t border-[#DFD3C4]">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleCopyDossier}
                      className="hover:text-[#18231C] font-medium flex items-center gap-1.5 transition-colors"
                    >
                      {copiedSummary ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#3F634A]" />
                          <span className="text-[#3F634A] font-semibold">Dossiê copiado com sucesso!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-[#8C4E2D]" />
                          <span>Copiar Dossiê Completo</span>
                        </>
                      )}
                    </button>
                    <span className="text-[#CFC2AF]">•</span>
                    <button onClick={resetQuiz} className="hover:underline flex items-center gap-1">
                      <RotateCcw className="w-3 h-3" /> Refazer teste
                    </button>
                  </div>

                  <button
                    onClick={handleTransferDiagnosisToChat}
                    className="text-[#8C4E2D] hover:text-[#673319] font-bold hover:underline flex items-center gap-1"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>Conversar com a Aura IA sobre este Diagnóstico →</span>
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
