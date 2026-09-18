import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Sparkles, Check, Heart, Gift, Truck } from 'lucide-react';

interface CallToActionProps {
  onClaimOffer: () => void;
}

export const CallToAction: React.FC<CallToActionProps> = ({ onClaimOffer }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText('BEMVINDA15');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section className="py-20 lg:py-28 relative overflow-hidden bg-[#243329] text-[#FAF8F5]">
      {/* Subtle organic light reflections */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#4A6451]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#9C5B39]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
        
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold uppercase tracking-widest text-[#E3A882]">
          <Gift className="w-3.5 h-3.5" />
          Convite Especial para Sua Transformação
        </div>

        {/* Headline */}
        <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal leading-[1.14] tracking-tight max-w-3xl mx-auto">
          Dê à sua pele o respeito e a gentileza que a natureza sempre planejou.
        </h2>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-[#D0D9D3] max-w-2xl mx-auto font-light leading-relaxed">
          Você não precisa de cosméticos sintéticos agressivos para ter uma pele viçosa, calma e saudável. 
          Comece hoje o seu ritual com <strong className="text-white font-medium">15% de desconto</strong> no seu primeiro pedido e descubra o poder dos fitoativos vivos.
        </p>

        {/* Coupon pill */}
        <div className="inline-flex flex-col sm:flex-row items-center gap-3 p-2 pl-4 pr-3 rounded-2xl bg-white/5 border border-white/15 backdrop-blur-sm">
          <span className="text-xs text-[#E1E8E4]">
            Use o cupom de boas-vindas no checkout:
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold tracking-widest text-[#E3A882] bg-black/30 px-3 py-1 rounded-lg border border-[#E3A882]/40 text-sm">
              BEMVINDA15
            </span>
            <button
              id="btn-copiar-cupom"
              onClick={handleCopyCoupon}
              className="text-xs font-medium px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              {copied ? 'Copiado!' : 'Copiar'}
            </button>
          </div>
        </div>

        {/* The Big, Clear, Inviting Call to Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            id="btn-cta-principal-convidativo"
            onClick={onClaimOffer}
            className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 rounded-full bg-[#FAF8F5] hover:bg-[#EFE8DC] text-[#1E2922] text-sm sm:text-base font-semibold uppercase tracking-wider transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.99]"
          >
            <span>Experimentar o Meu Ritual Botânico Agora</span>
            <ArrowRight className="w-5 h-5 text-[#9C5B39] transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Trust Guarantees */}
        <div className="pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-[#CBD6CE]">
          <div className="flex items-center justify-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#E3A882] shrink-0" />
            <span className="text-left">
              <strong className="text-white block">Garantia Incondicional</strong>
              30 dias para testar ou seu dinheiro de volta
            </span>
          </div>

          <div className="flex items-center justify-center gap-2.5">
            <Truck className="w-5 h-5 text-[#E3A882] shrink-0" />
            <span className="text-left">
              <strong className="text-white block">Frete Grátis Brasil</strong>
              Em todos os pedidos acima de R$ 180
            </span>
          </div>

          <div className="flex items-center justify-center gap-2.5">
            <Sparkles className="w-5 h-5 text-[#E3A882] shrink-0" />
            <span className="text-left">
              <strong className="text-white block">Mimo Sustentável</strong>
              Amostra botânica em todas as compras
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
