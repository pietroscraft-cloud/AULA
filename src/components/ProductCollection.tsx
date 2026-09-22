import React, { useState, useEffect } from 'react';
import { PRODUCTS_DATA } from '../data/content';
import { Product } from '../types';
import { 
  Star, ShoppingBag, Check, Sparkles, Eye, X, ShieldCheck, 
  Truck, ArrowRight, Zap, Gift, Clock, Flame, Tag, CheckCircle2 
} from 'lucide-react';

interface ProductCollectionProps {
  onAddToCart: (product: Product) => void;
  onSelectBundle: () => void;
  onBuyNow?: (product: Product) => void;
  activeProductModal?: Product | null;
  onCloseProductModal?: () => void;
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
}

export const ProductCollection: React.FC<ProductCollectionProps> = ({ 
  onAddToCart, 
  onSelectBundle,
  onBuyNow,
  activeProductModal,
  onCloseProductModal,
  selectedCategory: externalCategory,
  onCategoryChange,
}) => {
  const [internalCategory, setInternalCategory] = useState<string>('todos');
  const selectedCategory = externalCategory ?? internalCategory;

  const handleSelectCategory = (cat: string) => {
    setInternalCategory(cat);
    if (onCategoryChange) {
      onCategoryChange(cat);
    }
  };

  const [sortBy, setSortBy] = useState<'popular' | 'discount' | 'price-asc' | 'price-desc'>('popular');
  const [internalProductDetails, setInternalProductDetails] = useState<Product | null>(null);
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  const selectedProductDetails = activeProductModal !== undefined ? (activeProductModal || internalProductDetails) : internalProductDetails;

  const handleCloseModal = () => {
    setInternalProductDetails(null);
    if (onCloseProductModal) {
      onCloseProductModal();
    }
  };

  // Countdown timer for sales urgency
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 42, seconds: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 6, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAdd = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    onAddToCart(product);
    setAddedNotice(product.id);
    setTimeout(() => {
      setAddedNotice(null);
    }, 2200);
  };

  const handleDirectBuy = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (onBuyNow) {
      onBuyNow(product);
    } else {
      onAddToCart(product);
    }
  };

  // Filter products by category
  const filteredProducts = PRODUCTS_DATA.filter(p => {
    if (selectedCategory === 'todos') return true;
    if (selectedCategory === 'kits') return p.category === 'kits' || p.isBundle;
    if (selectedCategory === 'limpeza') return p.category === 'limpeza';
    if (selectedCategory === 'hidratacao' || selectedCategory === 'rosto') return p.category === 'hidratacao' || p.category === 'rosto';
    if (selectedCategory === 'solar') return p.category === 'solar';
    if (selectedCategory === 'mascaras') return p.category === 'mascaras';
    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'discount') {
      const discountA = a.originalPrice ? (a.originalPrice - a.price) / a.originalPrice : 0;
      const discountB = b.originalPrice ? (b.originalPrice - b.price) / b.originalPrice : 0;
      return discountB - discountA;
    }
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    // default: popular (bundles first, then reviews count)
    if (a.isBundle && !b.isBundle) return -1;
    if (!a.isBundle && b.isBundle) return 1;
    return b.reviewsCount - a.reviewsCount;
  });

  // Featured bundle item
  const featuredBundle = PRODUCTS_DATA.find(p => p.id === 'kit-ritual-completo-4-passos') || PRODUCTS_DATA[0];

  return (
    <section id="produtos" className="py-16 lg:py-24 bg-[#F4EFE7] border-y border-[#E4DCCE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* High-Impact Sales Urgency Banner */}
        <div className="mb-10 p-4 sm:p-5 rounded-2xl bg-[#243329] text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 border border-[#3E5545]">
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="w-10 h-10 rounded-full bg-[#E3A882]/20 flex items-center justify-center shrink-0 border border-[#E3A882]/40 text-[#E3A882]">
              <Flame className="w-5 h-5 text-[#E3A882]" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#E3A882] block">
                Condição Especial de Lançamento
              </span>
              <p className="text-sm sm:text-base font-medium text-[#FAF8F5]">
                Até <strong className="text-[#E3A882] font-bold">32% OFF</strong> + Frete Grátis Brasil + Mimo em todas as compras
              </p>
            </div>
          </div>

          {/* Real-time countdown timer */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs text-[#D1DDD5] font-light hidden sm:inline">
              Preços promocionais encerram em:
            </span>
            <div className="flex items-center gap-1.5 font-mono text-xs sm:text-sm font-bold text-white">
              <span className="px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10">
                {String(timeLeft.hours).padStart(2, '0')}h
              </span>
              <span>:</span>
              <span className="px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-[#E3A882]">
                {String(timeLeft.minutes).padStart(2, '0')}m
              </span>
              <span>:</span>
              <span className="px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-[#E3A882]">
                {String(timeLeft.seconds).padStart(2, '0')}s
              </span>
            </div>
          </div>
        </div>

        {/* Header Section */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8DFD1] border border-[#D5C7B4] text-xs uppercase tracking-widest font-semibold text-[#8C4E2D]">
            <Tag className="w-3.5 h-3.5" />
            Catálogo Oficial & Preços Promocionais
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#17211B] font-normal tracking-tight">
            Fórmulas vivas. Resultados reais. Preços transparentes.
          </h2>
          <p className="text-base sm:text-lg text-[#4E5C53] font-light leading-relaxed">
            Escolha itens avulsos ou invista nos nossos combos com <strong>descontos de até R$ 190</strong>. 
            Sem intermediários: da floresta ao seu ritual, com pureza garantida e parcelamento em até 6x sem juros.
          </p>

          {/* Quick Value Pillars */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-[#3F4F45]">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDE6D9] border border-[#DDD0BF]">
              <Truck className="w-3.5 h-3.5 text-[#3F634A]" /> Frete Grátis acima de R$ 180
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDE6D9] border border-[#DDD0BF]">
              <Zap className="w-3.5 h-3.5 text-[#8C4E2D]" /> 5% OFF extra no PIX
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDE6D9] border border-[#DDD0BF]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#3F634A]" /> 30 Dias para testar ou dinheiro de volta
            </span>
          </div>
        </div>

        {/* Incisive Highlight Bundle Showcase (Kit Completo) */}
        <div className="mb-14 p-6 sm:p-8 lg:p-10 rounded-3xl bg-gradient-to-br from-[#EAE2D4] to-[#DFD5C5] border-2 border-[#CCAFA0] shadow-md relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#C2744E]/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Col: Real Photo of the 4-step Kit + Linen Pouch */}
            <div className="lg:col-span-4 relative">
              <div className="rounded-2xl overflow-hidden aspect-square border border-[#D5C7B4] shadow-md bg-[#FAF8F5] relative group">
                <img
                  src={featuredBundle.image}
                  alt={featuredBundle.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#8C4E2D] text-white text-[10px] font-bold uppercase tracking-wider shadow-md">
                  Ritual Completo 4 Passos
                </span>
                <span className="absolute bottom-3 left-3 right-3 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-sm text-white text-[11px] text-center font-medium">
                  + Nécessaire de Linho Inclusa
                </span>
              </div>
            </div>

            {/* Middle Col: Bundle Details */}
            <div className="lg:col-span-4 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#8C4E2D] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                  <Flame className="w-3.5 h-3.5 text-[#FEDEC9]" />
                  Mais Econômico • 32% OFF
                </span>
                <span className="px-2.5 py-1 rounded-full bg-[#3F634A] text-white text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1">
                  <Gift className="w-3 h-3" /> Brinde Grátis
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl text-[#18231C] font-medium leading-tight">
                {featuredBundle.name}
              </h3>

              <p className="text-xs sm:text-sm text-[#46534B] leading-relaxed">
                Leve o ritual completo de 4 passos: Limpeza com Jojoba, Névoa Tonificante, Sérum Regenerador Infinito com Rosa Mosqueta e Bálsamo Reparador de Cupuaçu. 
                Acompanha a nécessaire artesanal de linho e garante frete grátis imediato.
              </p>

              {/* What's included checklist */}
              <div className="grid grid-cols-1 gap-1.5 pt-1 text-xs text-[#2E3C33]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#3F634A] shrink-0" />
                  <span>1x Óleo Limpador Botânico (100ml)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#3F634A] shrink-0" />
                  <span>1x Névoa Floral Calmante (120ml)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#3F634A] shrink-0" />
                  <span>1x Sérum Regenerador Infinito (30ml)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#3F634A] shrink-0" />
                  <span>1x Bálsamo Biocompatível (50g)</span>
                </div>
              </div>

              {/* Urgency callout */}
              <div className="flex items-center gap-2 text-xs font-semibold text-[#8C4E2D] pt-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Lote artesanal: apenas 14 kits disponíveis com brinde.</span>
              </div>
            </div>

            {/* Right Col: Pricing Box & Action Buttons */}
            <div className="lg:col-span-4 bg-[#FAF8F5] p-6 sm:p-7 rounded-2xl border border-[#D5C7B3] shadow-lg flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-[#7B8B81]">De R$ 588,00 por apenas:</span>
                  <span className="text-xs font-bold text-[#3F634A] bg-[#E8F0EA] px-2.5 py-0.5 rounded-full">
                    Economize R$ 190,00
                  </span>
                </div>

                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-[#18231C]">
                    R$ 398
                  </span>
                  <span className="text-xs text-[#5D6B62]">
                    ou <strong>6x de R$ 66,33</strong>
                  </span>
                </div>

                <div className="mt-2 text-xs font-medium text-[#8C4E2D] flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  <span>R$ 378,10 no PIX (5% OFF extra)</span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#ECE3D5]">
                <button
                  id="btn-ver-detalhes-kit-completo"
                  onClick={() => setInternalProductDetails(featuredBundle)}
                  className="w-full py-2 rounded-full border border-[#D5C7B3] bg-transparent hover:bg-[#EFE8DC] text-[#425247] text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                >
                  <Eye className="w-3.5 h-3.5 text-[#8C4E2D]" />
                  <span>Ver Detalhes do Kit</span>
                </button>

                <button
                  id="btn-comprar-kit-completo-agora"
                  onClick={() => handleDirectBuy(featuredBundle)}
                  className="w-full py-3.5 rounded-full bg-[#243329] hover:bg-[#16211A] text-white text-xs font-semibold uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 text-[#E3A882]" />
                  <span>Garantir Kit com 32% OFF</span>
                </button>

                <button
                  id="btn-adicionar-kit-completo"
                  onClick={() => handleAdd(featuredBundle)}
                  className="w-full py-2.5 rounded-full border border-[#D1C3AF] bg-[#FAF8F5] hover:bg-[#EDE5D8] text-[#243329] text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar à Sacola</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#6A786E]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#3F634A]" />
                <span>Garantia de 30 dias • Envio expresso 24h</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Navigation & Sort Bar */}
        <div className="mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-6 border-b border-[#E1D7C8]">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {[
              { id: 'todos', label: 'Todos os Produtos', count: PRODUCTS_DATA.length },
              { id: 'kits', label: '⭐ Kits & Ofertas', count: PRODUCTS_DATA.filter(p => p.category === 'kits' || p.isBundle).length },
              { id: 'limpeza', label: '💧 Limpeza Diária', count: PRODUCTS_DATA.filter(p => p.category === 'limpeza').length },
              { id: 'hidratacao', label: '🌿 Hidratação', count: PRODUCTS_DATA.filter(p => p.category === 'hidratacao' || p.category === 'rosto').length },
              { id: 'solar', label: '☀️ Proteção Solar', count: PRODUCTS_DATA.filter(p => p.category === 'solar').length },
              { id: 'mascaras', label: '🌸 Máscaras Faciais', count: PRODUCTS_DATA.filter(p => p.category === 'mascaras').length },
            ].map(cat => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  id={`tab-categoria-${cat.id}`}
                  onClick={() => handleSelectCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    active
                      ? 'bg-[#243329] text-white shadow-sm'
                      : 'bg-[#EAE3D6] text-[#47544C] hover:bg-[#DDD4C5]'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    active ? 'bg-white/20 text-white' : 'bg-[#DCD2C2] text-[#333E37]'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 self-end md:self-auto text-xs text-[#526056]">
            <span className="font-medium">Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#D5C7B3] text-xs font-semibold text-[#243329] focus:outline-none focus:border-[#8C4E2D]"
            >
              <option value="popular">Mais Populares</option>
              <option value="discount">Maior Desconto (%)</option>
              <option value="price-asc">Menor Preço</option>
              <option value="price-desc">Maior Preço</option>
            </select>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {sortedProducts.map((product) => {
            const isAdded = addedNotice === product.id;
            const discountPercent = product.originalPrice 
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
              : null;

            return (
              <div
                key={product.id}
                id={`card-produto-${product.id}`}
                className="bg-[#FAF8F5] rounded-3xl border border-[#DDD3C2] p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 relative"
              >
                {/* Top Section */}
                <div>
                  {/* Image container */}
                  <div className="relative rounded-2xl overflow-hidden aspect-[4/4] bg-[#EFE9DF] mb-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />

                    {/* Top-left: Discount Tag */}
                    {discountPercent && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#8C4E2D] text-white text-[11px] font-bold tracking-wider uppercase shadow-md">
                        -{discountPercent}% OFF
                      </span>
                    )}

                    {/* Top-right: Badge */}
                    {product.badge && (
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#FAF8F5]/95 backdrop-blur-sm text-[#253229] text-[10px] font-bold tracking-wider uppercase border border-[#E3D9CC] shadow-sm">
                        {product.badge}
                      </span>
                    )}

                    {/* Quick view button */}
                    <button
                      onClick={() => setInternalProductDetails(product)}
                      className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-[#FAF8F5]/95 backdrop-blur-sm hover:bg-white text-[#2B3830] flex items-center justify-center transition-all shadow-md group-hover:opacity-100"
                      title="Ver detalhes da fórmula"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Step label pill */}
                    <span className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-full bg-[#FAF8F5]/90 backdrop-blur-sm text-[#4E5C53] text-[10px] font-medium border border-[#E3D9CC]">
                      {product.ritualStep}
                    </span>
                  </div>

                  {/* Rating, Reviews & Volume */}
                  <div className="flex items-center justify-between text-xs text-[#6A786E] mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-[#D17B49] text-[#D17B49]" />
                      <span className="font-semibold text-[#1C251F]">{product.rating}</span>
                      <span>({product.reviewsCount})</span>
                    </div>
                    <span className="text-[11px] font-medium text-[#7E8C82]">{product.volume}</span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="font-serif text-xl font-medium text-[#18231C] leading-snug group-hover:text-[#8C4E2D] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-[#526056] mt-1.5 line-clamp-2 leading-relaxed">
                    {product.subtitle}
                  </p>

                  {/* Hero Ingredient Highlight */}
                  <div className="mt-3 p-2.5 rounded-xl bg-[#F4EFE6] border border-[#E9DFD2] text-[11px] text-[#3D4B42]">
                    <span className="font-bold text-[#8C4E2D]">Ativo Nobre:</span> {product.heroIngredient}
                  </div>

                  {/* Sensory Notes & Aromatherapy ("exala cheiro pelos olhos") */}
                  {product.sensoryNotes && (
                    <div className="mt-2 p-2 rounded-xl bg-[#F7F2EA] border border-[#E7DDD0] text-[11px] text-[#425046] flex items-start gap-1.5">
                      <span className="text-xs">🌸</span>
                      <div>
                        <span className="font-bold text-[#8C4E2D]">Aroma:</span>{' '}
                        <span className="italic">{product.sensoryNotes}</span>
                      </div>
                    </div>
                  )}

                  {product.texture && (
                    <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-[#5C6B61] px-1">
                      <span className="font-semibold text-[#243329]">Textura:</span>
                      <span className="truncate">{product.texture}</span>
                    </div>
                  )}

                  {/* Stock / Urgency Note if available */}
                  {product.urgencyNote && (
                    <div className="mt-2 text-[11px] text-[#3F634A] font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>{product.urgencyNote}</span>
                    </div>
                  )}
                </div>

                {/* Incisive Bottom Pricing & Dual Action Buttons */}
                <div className="pt-4 mt-4 border-t border-[#ECE3D5] space-y-3">
                  {/* Price Box */}
                  <div>
                    <div className="flex items-baseline justify-between">
                      {product.originalPrice ? (
                        <span className="text-xs line-through text-[#86948A]">
                          De R$ {product.originalPrice}
                        </span>
                      ) : <span />}
                      {product.savings && (
                        <span className="text-[11px] font-bold text-[#3F634A]">
                          Economize R$ {product.savings}
                        </span>
                      )}
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="font-serif text-2xl font-bold text-[#18231C]">
                        R$ {product.price}
                      </span>
                      {product.installments && (
                        <span className="text-xs text-[#5C6A61]">
                          ou {product.installments}
                        </span>
                      )}
                    </div>

                    {product.pixPrice && (
                      <span className="text-[11px] text-[#8C4E2D] font-medium block mt-0.5">
                        ⚡ R$ {product.pixPrice} no PIX (5% OFF)
                      </span>
                    )}
                  </div>

                  {/* Dual CTA Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      id={`btn-comprar-agora-${product.id}`}
                      onClick={(e) => handleDirectBuy(product, e)}
                      className="py-2.5 px-3 rounded-full bg-[#243329] hover:bg-[#152119] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-[#E3A882]" />
                      <span>Comprar</span>
                    </button>

                    <button
                      id={`btn-adicionar-${product.id}`}
                      onClick={(e) => handleAdd(product, e)}
                      className={`py-2.5 px-3 rounded-full border text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1 ${
                        isAdded
                          ? 'bg-[#3F634A] text-white border-[#3F634A]'
                          : 'bg-[#FAF8F5] hover:bg-[#EFE7DB] text-[#243329] border-[#D6C8B4]'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Adicionado</span>
                        </>
                      ) : (
                        <span>+ Sacola</span>
                      )}
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Product Details Modal */}
      {selectedProductDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-[#FAF8F5] rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-[#D5C7B4] shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={handleCloseModal}
              className="absolute top-5 right-5 z-10 p-2 rounded-full bg-[#EFE8DC] hover:bg-[#E2D8C9] text-[#2B372F] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
              {/* Product Photo */}
              <div className="sm:col-span-5 rounded-2xl overflow-hidden border border-[#D5C7B4] bg-[#EFE8DC] aspect-square relative shadow-xs">
                <img
                  src={selectedProductDetails.image}
                  alt={selectedProductDetails.name}
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
                {selectedProductDetails.badge && (
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-[#243329] text-white text-[10px] font-semibold uppercase tracking-wider">
                    {selectedProductDetails.badge}
                  </span>
                )}
              </div>

              {/* Product Header & Info */}
              <div className="sm:col-span-7 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-widest text-[#8C4E2D] font-bold">
                    {selectedProductDetails.ritualStep}
                  </span>
                  {selectedProductDetails.originalPrice && (
                    <span className="text-xs bg-[#8C4E2D] text-white px-2 py-0.5 rounded-full font-bold">
                      {Math.round(((selectedProductDetails.originalPrice - selectedProductDetails.price) / selectedProductDetails.originalPrice) * 100)}% OFF
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl text-[#18231C] font-medium leading-tight">
                  {selectedProductDetails.name}
                </h3>
                <p className="text-xs text-[#6A786E]">{selectedProductDetails.volume}</p>

                <p className="text-sm text-[#435148] leading-relaxed pt-1">
                  {selectedProductDetails.description}
                </p>
              </div>
            </div>

            <div className="mt-5 p-4 rounded-xl bg-[#F5EFE7] border border-[#E7DDD0] space-y-2">
              <span className="text-xs uppercase tracking-wider font-bold text-[#1E2822] block">
                Benefícios Dermatológicos Comprovados:
              </span>
              <ul className="space-y-1.5 text-xs text-[#3C4941]">
                {selectedProductDetails.benefits.map((b, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#3F634A] shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sensory Experience Highlight in Modal */}
            {(selectedProductDetails.sensoryNotes || selectedProductDetails.texture || selectedProductDetails.aromatherapy) && (
              <div className="mt-4 p-4 rounded-xl bg-[#F8F5EF] border border-[#E4D7C7] space-y-2">
                <span className="text-xs uppercase tracking-wider font-bold text-[#8C4E2D] block flex items-center gap-1.5">
                  <span>🌸</span> Experiência Sensorial & Olfativa
                </span>
                {selectedProductDetails.sensoryNotes && (
                  <p className="text-xs text-[#38463D]">
                    <strong>Aroma Botânico:</strong> <em>"{selectedProductDetails.sensoryNotes}"</em>
                  </p>
                )}
                {selectedProductDetails.texture && (
                  <p className="text-xs text-[#38463D]">
                    <strong>Sensação ao Toque:</strong> {selectedProductDetails.texture}
                  </p>
                )}
                {selectedProductDetails.aromatherapy && (
                  <p className="text-xs text-[#38463D]">
                    <strong>Efeito no Sistema Nervoso:</strong> {selectedProductDetails.aromatherapy}
                  </p>
                )}
              </div>
            )}

            <div className="mt-4 text-xs text-[#526056] space-y-1">
              <p><strong>Ativo Nobre Principal:</strong> {selectedProductDetails.heroIngredient}</p>
              <p><strong>Embalagem:</strong> Frasco ecológico reciclável com selo de logística reversa</p>
              <p><strong>Garantia:</strong> 30 dias incondicionais para teste em sua rotina</p>
            </div>

            {/* Modal Price & Buy */}
            <div className="mt-6 pt-5 border-t border-[#EAE1D3] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                {selectedProductDetails.originalPrice && (
                  <span className="text-xs line-through text-[#7A8A80] block">
                    De R$ {selectedProductDetails.originalPrice}
                  </span>
                )}
                <div className="font-serif text-3xl font-bold text-[#18231C]">
                  R$ {selectedProductDetails.price}
                </div>
                {selectedProductDetails.installments && (
                  <span className="text-xs text-[#59695F]">
                    {selectedProductDetails.installments}
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <button
                  id="btn-modal-adicionar-carrinho"
                  onClick={() => {
                    handleAdd(selectedProductDetails);
                    handleCloseModal();
                  }}
                  className="px-5 py-3 rounded-full border border-[#C5B59E] bg-[#FAF8F5] hover:bg-[#EFE7DC] text-[#243329] text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-[#3F634A]" />
                  <span>Adicionar ao Carrinho</span>
                </button>

                <button
                  id="btn-modal-comprar-agora"
                  onClick={() => {
                    handleDirectBuy(selectedProductDetails);
                    handleCloseModal();
                  }}
                  className="px-6 py-3 rounded-full bg-[#243329] hover:bg-[#16211A] text-white text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  <ShoppingBag className="w-4 h-4 text-[#E3A882]" />
                  <span>Ir Direto ao Pagamento</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

// Helper Plus icon component
const Plus = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);
