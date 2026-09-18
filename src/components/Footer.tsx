import React, { useState } from 'react';
import { Leaf, ShieldCheck, Heart, Send, Check } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail('');
    }
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#18231C] text-[#E0E8E3] pt-16 pb-12 border-t border-[#2A382F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Col 1: Brand Manifesto */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#2A3B30] border border-[#3E5244] flex items-center justify-center text-[#E3A882]">
                <span className="font-serif italic font-bold">A</span>
              </div>
              <span className="font-serif text-2xl tracking-[0.16em] uppercase text-white font-medium">
                Aura Botânica
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#A8B7AE] leading-relaxed font-light">
              Nascemos para resgatar a conexão entre a sabedoria das plantas e o cuidado diário com o corpo. 
              Criamos formulações puras, vivas e sustentáveis que transformam seu autocuidado em um momento de paz e renovação.
            </p>
            <div className="flex items-center gap-3 text-xs text-[#8A9D91]">
              <span className="inline-flex items-center gap-1">
                <Leaf className="w-3.5 h-3.5 text-[#E3A882]" />
                100% Vegano
              </span>
              <span>•</span>
              <span>Cruelty-Free</span>
              <span>•</span>
              <span>Vidro Infinitamente Reciclável</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-widest text-white">
              Explorar
            </h4>
            <ul className="space-y-2 text-xs text-[#A8B7AE]">
              <li>
                <button onClick={() => scrollTo('o-ritual')} className="hover:text-white transition-colors">
                  O Ritual de 3 Passos
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('ingredientes')} className="hover:text-white transition-colors">
                  Ingredientes Orgânicos
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('produtos')} className="hover:text-white transition-colors">
                  Coleção Botânica
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('depoimentos')} className="hover:text-white transition-colors">
                  Depoimentos Reais
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('perguntas')} className="hover:text-white transition-colors">
                  Dúvidas Frequentes
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Ethical Certifications & Traceability */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-widest text-white">
              Certificações
            </h4>
            <ul className="space-y-2 text-xs text-[#A8B7AE]">
              <li>Ecocert Cosmos Organic</li>
              <li>Origens Brasil Amazônia</li>
              <li>Demeter Biodinâmico</li>
              <li>Cruelty-Free International</li>
              <li>Logística Reversa de Vidros</li>
            </ul>
          </div>

          {/* Col 4: Newsletter & Selfcare Tips */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-widest text-white">
              Cartas de Autocuidado Consciente
            </h4>
            <p className="text-xs text-[#A8B7AE] leading-relaxed">
              Receba reflexões sobre bem-estar holístico, rituais sazonais e 15% de desconto no seu primeiro pedido com cupom <strong className="text-white">BEMVINDA15</strong>.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu melhor e-mail..."
                className="flex-1 px-4 py-2.5 rounded-full bg-white/5 border border-white/15 text-xs text-white placeholder:text-[#7A8C80] focus:outline-none focus:border-[#E3A882]"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-full bg-[#E3A882] hover:bg-[#C98A66] text-[#18231C] text-xs font-bold uppercase tracking-wider transition-colors shrink-0 flex items-center gap-1.5"
              >
                {subscribed ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                {subscribed ? 'Inscrita!' : 'Assinar'}
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#788C80] gap-4">
          <p>© {new Date().getFullYear()} Aura Botânica Cosméticos Conscientes Ltda. Todos os direitos reservados.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-white cursor-pointer">Termos de Uso</span>
            <span className="hover:text-white cursor-pointer">Política de Privacidade</span>
            <span className="hover:text-white cursor-pointer">Programa ReCicla Vidro</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
