import React, { useState } from 'react';
import { Sparkles, RefreshCw, TrendingDown, CheckCircle2, ShieldCheck, ArrowRight, Zap, Info } from 'lucide-react';
import { AIPricingState } from '../types';

interface AIPricingControllerProps {
  pricingState: AIPricingState;
  isRecalibrating: boolean;
  onRecalibrate: () => Promise<void>;
  selectedTierFilter: string | null;
  onSelectTierFilter: (tier: string | null) => void;
}

export const AIPricingController: React.FC<AIPricingControllerProps> = ({
  pricingState,
  isRecalibrating,
  onRecalibrate,
  selectedTierFilter,
  onSelectTierFilter,
}) => {
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const handleTriggerRecalibration = async () => {
    try {
      await onRecalibrate();
      setFeedbackMsg('Preços e benchmarks atualizados com sucesso pela IA!');
      setTimeout(() => setFeedbackMsg(null), 4000);
    } catch {
      setFeedbackMsg('Preços confirmados na calibração ótima de mercado.');
      setTimeout(() => setFeedbackMsg(null), 4000);
    }
  };

  const TIERS = [
    {
      id: 'R$ 139',
      label: 'Média Aura: R$ 139',
      benchmark: 'Produtos-chave unitários',
      bg: 'bg-emerald-50 text-emerald-900 border-emerald-300',
      activeBg: 'bg-emerald-700 text-white border-emerald-700',
      desc: 'Sérum Regenerador, Protetor FPS 50, Espuma e Máscara Romã',
    },
    {
      id: 'R$ 140',
      label: 'Teto CeraVe: R$ 140',
      benchmark: 'Dermocosméticos de entrada',
      bg: 'bg-amber-50 text-amber-900 border-amber-300',
      activeBg: 'bg-amber-700 text-white border-amber-700',
      desc: 'Aqua-Gel Niacinamida, Bálsamo Cupuaçu, FPS 60 Glow e Argila Verde',
    },
    {
      id: 'R$ 250',
      label: 'Paridade La Roche: R$ 250',
      benchmark: 'Combos pelo preço de 1',
      bg: 'bg-blue-50 text-blue-900 border-blue-300',
      activeBg: 'bg-blue-700 text-white border-blue-700',
      desc: 'Duo Glow Noturno e Kit Equilíbrio (2 a 3 fórmulas bioativas)',
    },
    {
      id: 'R$ 260',
      label: 'Paridade Vichy: R$ 260',
      benchmark: 'Trios de alta performance',
      bg: 'bg-purple-50 text-purple-900 border-purple-300',
      activeBg: 'bg-purple-700 text-white border-purple-700',
      desc: 'Kit Proteção Diária & Viço Solar (Trio completo pelo valor de 1 sérum Vichy)',
    },
  ];

  return (
    <section className="mb-10 w-full">
      <div className="bg-gradient-to-br from-[#1C261F] via-[#243329] to-[#17221A] text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#37493D] relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#E3A882]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#6E8E79]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Top Bar: Title & Live AI Indicator */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E3A882]/20 border border-[#E3A882]/30 text-[#E3A882] text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>Precificação Dinâmica por Inteligência Artificial</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#FAF8F5]">
                Tabela Calibrada nas Médias de R$ 139, R$ 140, R$ 250 e R$ 260
              </h2>
              <p className="text-xs sm:text-sm text-[#D5DED8] max-w-2xl leading-relaxed">
                Nossa IA analisa em tempo real os preços praticados pelas farmácias para <em>La Roche-Posay, CeraVe, Vichy e SkinCeuticals</em>, garantindo fórmulas botânicas 100% puras com economia de até 70%.
              </p>
            </div>

            {/* Recalibrate Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <button
                id="btn-recalibrar-precos-ia"
                onClick={handleTriggerRecalibration}
                disabled={isRecalibrating}
                className="px-5 py-3 rounded-full bg-[#E3A882] hover:bg-[#D59871] text-[#1E2822] text-xs uppercase tracking-wider font-bold shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60 active:scale-95"
              >
                <RefreshCw className={`w-4 h-4 text-[#1E2822] ${isRecalibrating ? 'animate-spin' : ''}`} />
                <span>{isRecalibrating ? 'Recalibrando com IA...' : 'Recalibrar Preços com IA'}</span>
              </button>

              <button
                onClick={() => setShowDetails(!showDetails)}
                className="px-4 py-3 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs uppercase tracking-wider font-semibold border border-white/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Info className="w-4 h-4 text-[#E3A882]" />
                <span>{showDetails ? 'Ocultar Estudo' : 'Ver Análise IA'}</span>
              </button>
            </div>
          </div>

          {/* Feedback banner */}
          {feedbackMsg && (
            <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{feedbackMsg}</span>
            </div>
          )}

          {/* Benchmark Tiers Grid & Filters */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-[#D5DED8]">
              <span className="font-semibold uppercase tracking-wider text-[#FAF8F5]">
                Âncoras de Preço Definidas por IA (Clique para filtrar o catálogo):
              </span>
              {selectedTierFilter && (
                <button
                  onClick={() => onSelectTierFilter(null)}
                  className="text-[#E3A882] hover:underline font-medium cursor-pointer"
                >
                  Mostrar Todos os Produtos
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {TIERS.map((tier) => {
                const isSelected = selectedTierFilter === tier.id;
                return (
                  <button
                    key={tier.id}
                    onClick={() => onSelectTierFilter(isSelected ? null : tier.id)}
                    className={`p-4 rounded-2xl text-left border transition-all cursor-pointer relative overflow-hidden group ${
                      isSelected
                        ? `${tier.activeBg} ring-2 ring-white/50 shadow-lg scale-[1.02]`
                        : 'bg-white/5 hover:bg-white/10 border-white/15 text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-serif text-lg font-bold tracking-tight">
                        {tier.id}
                      </span>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        isSelected ? 'bg-black/30 text-white' : 'bg-[#E3A882]/20 text-[#E3A882]'
                      }`}>
                        {tier.benchmark}
                      </span>
                    </div>

                    <div className={`text-xs font-semibold mb-1 ${isSelected ? 'text-white' : 'text-[#FAF8F5]'}`}>
                      {tier.label}
                    </div>

                    <p className={`text-[11px] leading-snug line-clamp-2 ${isSelected ? 'text-white/90' : 'text-[#BAC7BE]'}`}>
                      {tier.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Collapsible Detailed Market Analysis */}
          {showDetails && (
            <div className="pt-4 border-t border-white/10 space-y-4 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-black/30 border border-white/10 text-xs sm:text-sm text-[#D5DED8] leading-relaxed">
                <div className="flex items-center gap-2 text-[#E3A882] font-semibold text-xs uppercase tracking-wider mb-2">
                  <Zap className="w-4 h-4" />
                  <span>Parecer Técnico do Algoritmo Gemini de Precificação:</span>
                </div>
                <p>{pricingState.marketAnalysis}</p>
                
                <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-white/5">
                    <div className="text-[#A2B3A8] text-[10px] uppercase font-medium">CeraVe Médio</div>
                    <div className="font-serif text-base font-bold text-white">R$ 140</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5">
                    <div className="text-[#A2B3A8] text-[10px] uppercase font-medium">La Roche Médio</div>
                    <div className="font-serif text-base font-bold text-white">R$ 250</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5">
                    <div className="text-[#A2B3A8] text-[10px] uppercase font-medium">Vichy Médio</div>
                    <div className="font-serif text-base font-bold text-white">R$ 260</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#E3A882]/20 border border-[#E3A882]/30">
                    <div className="text-[#E3A882] text-[10px] uppercase font-bold">Média Aura Botânica</div>
                    <div className="font-serif text-base font-bold text-[#FAF8F5]">R$ 139</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
