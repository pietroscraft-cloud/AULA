import React, { useState } from 'react';
import { FAQS } from '../data/content';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="perguntas" className="py-20 lg:py-28 bg-[#FAF8F5]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAE2D4] text-xs font-semibold uppercase tracking-widest text-[#243329]">
            <HelpCircle className="w-3.5 h-3.5 text-[#9C5B39]" />
            Transparência Sem Segredos
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#17211B] font-normal tracking-tight">
            Perguntas frequentes sobre o autocuidado botânico.
          </h2>
          <p className="text-sm sm:text-base text-[#55645A] font-light">
            Tudo o que você precisa saber sobre a transição para formulações biocompatíveis e sustentáveis.
          </p>
        </div>

        {/* Accordion list */}
        <div className="space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-[#DFD6C8] bg-[#F7F3EC] overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="font-serif text-base sm:text-lg font-medium text-[#1A251E]">
                    {faq.question}
                  </span>
                  <div
                    className={`p-1.5 rounded-full bg-[#EDE6DA] text-[#313E35] transition-transform duration-300 shrink-0 ${
                      isOpen ? 'rotate-180 bg-[#E0D5C4]' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-sm text-[#49564E] leading-relaxed border-t border-[#E8DFCFA0]">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
