import React, { useState, useEffect } from 'react';
import { CartItem } from '../types';
import { 
  X, Trash2, Plus, Minus, ShoppingBag, ShieldCheck, Sparkles, 
  ArrowRight, Check, CreditCard, QrCode, Lock, ChevronLeft, Copy, 
  CheckCircle2, Truck, HelpCircle, MapPin, Eye, EyeOff
} from 'lucide-react';
import { trackBeginCheckout, trackPurchase } from '../utils/analytics';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

// Helpers de formatação e detecção de bandeira
const formatCardNumber = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
};

const formatExpiry = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) {
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
  }
  return digits;
};

const formatCvv = (value: string) => {
  return value.replace(/\D/g, '').slice(0, 4);
};

const detectBrand = (number: string): { name: string; color: string } => {
  const clean = number.replace(/\D/g, '');
  if (clean.startsWith('4')) return { name: 'VISA', color: '#1A1F71' };
  if (/^(5[1-5]|2[2-7])/.test(clean)) return { name: 'MASTERCARD', color: '#EB001B' };
  if (/^(4011|5041|5067|5090|6277|6362|6363)/.test(clean)) return { name: 'ELO', color: '#00A4E0' };
  if (/^(34|37)/.test(clean)) return { name: 'AMEX', color: '#007BC1' };
  if (/^(606282|3841)/.test(clean)) return { name: 'HIPERCARD', color: '#9B1B1B' };
  return { name: 'CARTÃO', color: '#6A7B70' };
};

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  // Cupons e Descontos
  const [couponCode, setCouponCode] = useState('BEMVINDA15');
  const [couponApplied, setCouponApplied] = useState(true);
  const [couponMessage, setCouponMessage] = useState<string | null>('Cupom ativado: 15% OFF aplicado');
  
  // Abas do Fluxo de Checkout: 'cart' (sacola) | 'payment_choice' (escolha PIX/Cartão) | 'card_form' (adicionar cartão) | 'success' (concluído)
  const [activeTab, setActiveTab] = useState<'cart' | 'payment_choice' | 'card_form' | 'success'>('cart');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCvvTip, setShowCvvTip] = useState(false);
  const [showCvvText, setShowCvvText] = useState(false);
  const [pixCopied, setPixCopied] = useState(false);
  const [pixMethodActive, setPixMethodActive] = useState(false);

  // Dados de Entrega
  const [shippingData, setShippingData] = useState({
    nome: 'Maria Clara Silva',
    email: 'maria.clara@email.com',
    telefone: '(11) 98765-4321',
    cep: '01310-100',
    endereco: 'Av. Paulista, 1578 - Apto 82',
    cidade: 'São Paulo - SP',
  });
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  // Dados do Cartão de Crédito
  const [cardData, setCardData] = useState({
    number: '4532 8901 2345 6789',
    name: 'MARIA C SILVA',
    expiry: '08/29',
    cvv: '890',
    installments: '3',
    saveCard: true,
  });

  const [orderNumber, setOrderNumber] = useState('');
  const [paymentTypeChosen, setPaymentTypeChosen] = useState<'pix' | 'credit_card'>('credit_card');

  // Cálculos de Totais
  const rawSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalOriginal = cart.reduce((sum, item) => sum + (item.product.originalPrice || item.product.price) * item.quantity, 0);
  const catalogSavings = Math.max(0, totalOriginal - rawSubtotal);
  const discountAmount = couponApplied ? Math.round(rawSubtotal * 0.15) : 0;
  const subtotalAfterCoupon = Math.max(0, rawSubtotal - discountAmount);

  const freeShippingThreshold = 180;
  const missingForFreeShipping = Math.max(0, freeShippingThreshold - rawSubtotal);
  const freeShippingPercent = Math.min(100, Math.round((rawSubtotal / freeShippingThreshold) * 100));
  const shippingCost = missingForFreeShipping === 0 ? 0 : 18;

  // Desconto adicional de 5% se optar por PIX
  const isPixSelected = activeTab === 'payment_choice' && pixMethodActive;
  const pixDiscount = isPixSelected ? Math.round((subtotalAfterCoupon + shippingCost) * 0.05) : 0;
  const finalTotalToPay = Math.max(0, subtotalAfterCoupon + shippingCost - (isPixSelected ? pixDiscount : 0));
  const totalSavingsCalculated = catalogSavings + discountAmount + (isPixSelected ? pixDiscount : 0);

  const cardBrand = detectBrand(cardData.number);

  // Cupom Handler
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'BEMVINDA15') {
      setCouponApplied(true);
      setCouponMessage('Cupom ativado com sucesso! 15% OFF garantido.');
    } else {
      setCouponApplied(false);
      setCouponMessage('Cupom inválido. Tente o código BEMVINDA15');
    }
  };

  // Analytics Tracker
  useEffect(() => {
    if (isOpen && cart.length > 0 && activeTab === 'cart') {
      trackBeginCheckout(finalTotalToPay, cart.reduce((s, i) => s + i.quantity, 0));
    }
  }, [isOpen, activeTab]);

  // Transições de Abas
  const handleGoToPaymentChoice = () => {
    setActiveTab('payment_choice');
  };

  const handleGoToCardForm = () => {
    setPaymentTypeChosen('credit_card');
    setActiveTab('card_form');
  };

  const handleFinalizeWithPix = () => {
    setPaymentTypeChosen('pix');
    setIsProcessing(true);
    const newOrderCode = `AURA-PIX-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderNumber(newOrderCode);

    setTimeout(() => {
      setIsProcessing(false);
      setActiveTab('success');
      trackPurchase(newOrderCode, finalTotalToPay);
    }, 1200);
  };

  const handleFinalizeWithCard = () => {
    setPaymentTypeChosen('credit_card');
    setIsProcessing(true);
    const newOrderCode = `AURA-CARD-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderNumber(newOrderCode);

    setTimeout(() => {
      setIsProcessing(false);
      setActiveTab('success');
      trackPurchase(newOrderCode, finalTotalToPay);
    }, 1500);
  };

  const handleCopyPix = () => {
    navigator.clipboard?.writeText(
      `00020126580014br.gov.bcb.pix0136aura-botanica-pagamentos-oficial@pix.com.br520400005303986540${finalTotalToPay.toFixed(2)}`
    );
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 3000);
  };

  const handleResetOrder = () => {
    setActiveTab('cart');
    setPixMethodActive(false);
    onClearCart();
    onClose();
  };

  // Regra de Hooks: Verificação de renderização SOMENTE após todos os hooks
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-xl bg-[#FAF8F5] h-full shadow-2xl flex flex-col border-l border-[#DFD5C6] relative animate-in slide-in-from-right duration-300">
        
        {/* ================= HEADER COM NAVEGAÇÃO DE ABAS ================= */}
        <div className="p-4 sm:p-5 border-b border-[#ECE3D5] bg-[#F7F3EC] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {activeTab !== 'cart' && activeTab !== 'success' && (
                <button
                  onClick={() => {
                    if (activeTab === 'card_form') {
                      setActiveTab('payment_choice');
                    } else if (activeTab === 'payment_choice') {
                      setActiveTab('cart');
                    }
                  }}
                  className="p-1.5 rounded-full hover:bg-[#EAE1D3] text-[#2F3E34] transition-colors"
                  title="Voltar à aba anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#243329] text-[#E3A882] flex items-center justify-center shadow-xs">
                  {activeTab === 'cart' && <ShoppingBag className="w-4 h-4" />}
                  {activeTab === 'payment_choice' && <QrCode className="w-4 h-4" />}
                  {activeTab === 'card_form' && <CreditCard className="w-4 h-4" />}
                  {activeTab === 'success' && <CheckCircle2 className="w-4 h-4 text-[#A8D5BA]" />}
                </div>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-medium text-[#1A251E] leading-tight">
                    {activeTab === 'cart' && 'Sua Sacola de Autocuidado'}
                    {activeTab === 'payment_choice' && 'Escolha da Forma de Pagamento'}
                    {activeTab === 'card_form' && 'Adicionar Cartão de Crédito'}
                    {activeTab === 'success' && 'Pedido Confirmado!'}
                  </h3>
                  <span className="text-[11px] text-[#7A8A80]">
                    {activeTab === 'cart' && `${cart.reduce((s, i) => s + i.quantity, 0)} itens selecionados`}
                    {activeTab === 'payment_choice' && 'Selecione PIX ou Cartão para concluir'}
                    {activeTab === 'card_form' && 'Insira os dados do cartão com segurança bancária'}
                    {activeTab === 'success' && 'Transação concluída com sucesso'}
                  </span>
                </div>
              </div>
            </div>

            <button
              id="btn-fechar-carrinho"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#EFE7DC] text-[#3F4D44] transition-colors"
              aria-label="Fechar gaveta"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* BARRA DE NAVEGAÇÃO DE ABAS VISUAL */}
          {activeTab !== 'success' && (
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#ECE3D5] rounded-xl text-xs font-medium">
              <button
                onClick={() => setActiveTab('cart')}
                className={`py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'cart'
                    ? 'bg-[#243329] text-white shadow-xs font-semibold'
                    : 'text-[#5A6A60] hover:text-[#1F2B23]'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span className="truncate">1. Sacola</span>
              </button>

              <button
                onClick={() => cart.length > 0 && setActiveTab('payment_choice')}
                disabled={cart.length === 0}
                className={`py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'payment_choice'
                    ? 'bg-[#243329] text-white shadow-xs font-semibold'
                    : 'text-[#5A6A60] hover:text-[#1F2B23] disabled:opacity-50'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span className="truncate">2. Pagamento</span>
              </button>

              <button
                onClick={() => cart.length > 0 && handleGoToCardForm()}
                disabled={cart.length === 0}
                className={`py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'card_form'
                    ? 'bg-[#243329] text-white shadow-xs font-semibold'
                    : 'text-[#5A6A60] hover:text-[#1F2B23] disabled:opacity-50'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span className="truncate">3. Cartão</span>
              </button>
            </div>
          )}
        </div>

        {/* PROGRESSO DO FRETE GRÁTIS */}
        {activeTab !== 'success' && cart.length > 0 && (
          <div className="px-5 py-2.5 bg-[#F4EFE6] border-b border-[#E8DFD0]">
            <div className="flex items-center justify-between text-xs text-[#4F5D54] mb-1 font-medium">
              <span>
                {missingForFreeShipping === 0 ? (
                  <span className="text-[#3F634A] font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Parabéns! Frete Grátis garantido para todo o Brasil
                  </span>
                ) : (
                  <span>Faltam <strong>R$ {missingForFreeShipping}</strong> para Frete Grátis</span>
                )}
              </span>
              <span className="text-[11px] text-[#78887F] font-semibold">{freeShippingPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#E2D8C9] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#3F634A] transition-all duration-300 rounded-full"
                style={{ width: `${freeShippingPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* ================= CORPO DAS ABAS ================= */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          
          {/* ---------------- ABA 1: SACOLA DE PRODUTOS ---------------- */}
          {activeTab === 'cart' && (
            <>
              {cart.length === 0 ? (
                <div className="text-center py-16 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#EFE9DF] flex items-center justify-center mx-auto text-[#8C4E2D]">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif text-2xl text-[#2B3830]">
                    Sua sacola está vazia
                  </h4>
                  <p className="text-xs sm:text-sm text-[#6B7970] max-w-xs mx-auto leading-relaxed">
                    Explore os produtos da coleção botânica e monte o ritual sob medida para sua pele.
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      const el = document.getElementById('produtos');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="mt-2 px-6 py-2.5 rounded-full bg-[#243329] text-white text-xs uppercase tracking-wider font-semibold"
                  >
                    Ver Coleção
                  </button>
                </div>
              ) : (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between text-xs text-[#627267] pb-1">
                    <span>Produtos adicionados ao seu ritual:</span>
                    <button 
                      onClick={onClearCart}
                      className="text-[#9E4D3E] hover:underline"
                    >
                      Esvaziar sacola
                    </button>
                  </div>

                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="p-3.5 rounded-2xl bg-[#F6F2EA] border border-[#E4DCCE] flex gap-3.5 items-center justify-between shadow-2xs hover:border-[#D5C7B3] transition-all"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 rounded-xl object-cover border border-[#DDD3C3] shrink-0"
                        referrerPolicy="no-referrer"
                      />

                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-[#9C5B39]">
                          {item.product.ritualStep}
                        </span>
                        <h5 className="font-serif text-sm font-semibold text-[#1B261F] truncate leading-tight">
                          {item.product.name}
                        </h5>
                        <div className="flex items-baseline gap-2 mt-0.5">
                          <span className="text-xs font-bold text-[#1F2B23]">
                            R$ {item.product.price}
                          </span>
                          {item.product.originalPrice && (
                            <span className="text-[11px] line-through text-[#87968B]">
                              R$ {item.product.originalPrice}
                            </span>
                          )}
                        </div>

                        {/* Quantidade */}
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center border border-[#D5C9B8] rounded-full bg-[#FAF8F5]">
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                              className="p-1 px-2.5 text-[#49574D] hover:text-black transition-colors"
                              aria-label="Diminuir quantidade"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-semibold px-1 text-[#222E26] min-w-4 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                              className="p-1 px-2.5 text-[#49574D] hover:text-black transition-colors"
                              aria-label="Aumentar quantidade"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => onRemoveItem(item.product.id)}
                            className="text-[11px] text-[#9E4D3E] hover:underline flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            Remover
                          </button>
                        </div>
                      </div>

                      <div className="text-right shrink-0 pl-2">
                        <span className="font-serif font-bold text-base text-[#18231C]">
                          R$ {item.product.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ---------------- ABA 2: ESCOLHA DE PAGAMENTO (PIX OU CARTÃO) ---------------- */}
          {activeTab === 'payment_choice' && (
            <div className="space-y-4">
              
              {/* Card de Endereço de Envio Rápido */}
              <div className="p-3.5 rounded-2xl bg-[#F6F2EA] border border-[#E1D6C5] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#243329]">
                    <MapPin className="w-4 h-4 text-[#8C4E2D]" />
                    <span>Endereço de Entrega</span>
                  </div>
                  <button
                    onClick={() => setIsEditingAddress(!isEditingAddress)}
                    className="text-[11px] text-[#8C4E2D] hover:underline font-medium"
                  >
                    {isEditingAddress ? 'Salvar' : 'Alterar endereço'}
                  </button>
                </div>

                {!isEditingAddress ? (
                  <p className="text-xs text-[#526357]">
                    <strong>{shippingData.nome}</strong> • {shippingData.endereco}, {shippingData.cidade} (CEP {shippingData.cep})
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Nome completo"
                      value={shippingData.nome}
                      onChange={(e) => setShippingData({ ...shippingData, nome: e.target.value })}
                      className="col-span-2 px-3 py-1.5 text-xs rounded-xl bg-white border border-[#D5C8B6]"
                    />
                    <input
                      type="text"
                      placeholder="CEP"
                      value={shippingData.cep}
                      onChange={(e) => setShippingData({ ...shippingData, cep: e.target.value })}
                      className="px-3 py-1.5 text-xs rounded-xl bg-white border border-[#D5C8B6]"
                    />
                    <input
                      type="text"
                      placeholder="Cidade - UF"
                      value={shippingData.cidade}
                      onChange={(e) => setShippingData({ ...shippingData, cidade: e.target.value })}
                      className="px-3 py-1.5 text-xs rounded-xl bg-white border border-[#D5C8B6]"
                    />
                    <input
                      type="text"
                      placeholder="Endereço e número"
                      value={shippingData.endereco}
                      onChange={(e) => setShippingData({ ...shippingData, endereco: e.target.value })}
                      className="col-span-2 px-3 py-1.5 text-xs rounded-xl bg-white border border-[#D5C8B6]"
                    />
                  </div>
                )}
              </div>

              {/* Título de Seleção */}
              <div className="pt-1">
                <h4 className="text-xs uppercase tracking-wider font-bold text-[#4D5E53]">
                  Selecione como deseja pagar:
                </h4>
              </div>

              {/* OPÇÃO 1: PIX */}
              <div className={`p-4 rounded-2xl border transition-all ${
                pixMethodActive 
                  ? 'bg-[#F2F7F4] border-[#3F634A] shadow-sm ring-1 ring-[#3F634A]' 
                  : 'bg-[#FAF8F5] border-[#D9CEBD] hover:border-[#3F634A]'
              }`}>
                <div 
                  onClick={() => setPixMethodActive(!pixMethodActive)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#E8F3EB] text-[#2C5237] flex items-center justify-center shrink-0">
                      <QrCode className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-[#18231C]">PIX Instantâneo</span>
                        <span className="text-[10px] bg-[#3F634A] text-white px-2 py-0.5 rounded-full font-bold">
                          5% OFF Extra
                        </span>
                      </div>
                      <span className="text-xs text-[#59695E] block">
                        Aprovação imediata • Desconto aplicado direto no total
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-serif font-bold text-base text-[#2C5237] block">
                      R$ {Math.max(0, subtotalAfterCoupon + shippingCost - Math.round((subtotalAfterCoupon + shippingCost) * 0.05)).toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-[10px] text-[#3F634A] font-semibold">
                      Economize R$ {Math.round((subtotalAfterCoupon + shippingCost) * 0.05)}
                    </span>
                  </div>
                </div>

                {/* Sub-painel do PIX quando selecionado */}
                {pixMethodActive && (
                  <div className="mt-4 pt-4 border-t border-[#D5E3DA] space-y-3.5 animate-in fade-in duration-200">
                    <div className="p-3 bg-white rounded-xl border border-[#D1E0D6] flex flex-col sm:flex-row items-center gap-4">
                      <div className="w-28 h-28 bg-[#F4EFE6] border border-[#D5C7B4] rounded-lg p-1.5 flex items-center justify-center shrink-0">
                        <QrCode className="w-24 h-24 text-[#243329]" />
                      </div>
                      <div className="space-y-1.5 text-center sm:text-left flex-1">
                        <span className="text-xs font-bold text-[#243329] block">
                          Escaneie com o app do seu banco
                        </span>
                        <p className="text-[11px] text-[#69796F]">
                          O QR Code vence em 30 minutos. Ao pagar, seu pedido é aprovado instantaneamente.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] text-[#4F5E54] font-medium block">
                        Ou copie o código PIX:
                      </span>
                      <div className="flex items-center gap-2">
                        <input
                          readOnly
                          value={`00020126580014br.gov.bcb.pix0136aura-pagamento-loja-${finalTotalToPay}`}
                          className="flex-1 px-3 py-2 text-[10px] font-mono rounded-xl bg-white border border-[#D5C7B4] text-[#4E5C53]"
                        />
                        <button
                          type="button"
                          onClick={handleCopyPix}
                          className="px-3.5 py-2 rounded-xl bg-[#243329] text-white text-xs font-medium flex items-center gap-1 hover:bg-[#16211A] transition-colors shrink-0"
                        >
                          {pixCopied ? <CheckCircle2 className="w-3.5 h-3.5 text-[#E3A882]" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{pixCopied ? 'Copiado!' : 'Copiar'}</span>
                        </button>
                      </div>
                    </div>

                    <button
                      id="btn-confirmar-pix"
                      onClick={handleFinalizeWithPix}
                      disabled={isProcessing}
                      className="w-full py-3 rounded-full bg-[#3F634A] hover:bg-[#2F4D38] text-white text-xs uppercase tracking-wider font-semibold shadow-sm flex items-center justify-center gap-2 transition-all"
                    >
                      {isProcessing ? (
                        <span>Validando PIX...</span>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Já fiz o PIX / Confirmar Pedido</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* OPÇÃO 2: CARTÃO DE CRÉDITO (DIRECIONA PARA A OUTRA ABA DE ADICIONAR CARTÃO) */}
              <div 
                onClick={handleGoToCardForm}
                className="p-4 rounded-2xl bg-[#FAF8F5] border-2 border-[#243329] hover:bg-[#F5EFE6] transition-all cursor-pointer shadow-sm group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#243329] text-[#E3A882] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-[#18231C]">Cartão de Crédito</span>
                        <span className="text-[10px] bg-[#EAE1D3] text-[#703D22] px-2 py-0.5 rounded-full font-bold">
                          Até 6x Sem Juros
                        </span>
                      </div>
                      <span className="text-xs text-[#637269] block">
                        Visa, Mastercard, Elo, Amex, Hipercard
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right hidden sm:block">
                      <span className="font-serif font-bold text-sm text-[#18231C] block">
                        6x de R$ {((subtotalAfterCoupon + shippingCost) / 6).toFixed(2).replace('.', ',')}
                      </span>
                      <span className="text-[10px] text-[#8C4E2D] font-medium">
                        Adicionar dados &rarr;
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#EAE1D3] group-hover:bg-[#243329] group-hover:text-white flex items-center justify-center text-[#243329] transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-[#E3D8CA] flex items-center justify-between text-xs text-[#8C4E2D] font-medium">
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    Clique para abrir a aba e adicionar número, vencimento e CVV
                  </span>
                  <span className="underline font-semibold">
                    Adicionar Cartão
                  </span>
                </div>
              </div>

            </div>
          )}

          {/* ---------------- ABA 3: ADICIONAR CARTÃO COM NÚMEROS, VENC E CVV ---------------- */}
          {activeTab === 'card_form' && (
            <div className="space-y-4">
              
              {/* Botão de Retorno Rápido */}
              <div className="flex items-center justify-between pb-1">
                <button
                  onClick={() => setActiveTab('payment_choice')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8C4E2D] hover:underline"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Voltar às opções de pagamento</span>
                </button>
                <span className="text-[11px] text-[#69796E] flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-[#3F634A]" />
                  Criptografia Bancária SSL 256 bits
                </span>
              </div>

              {/* ================= PRÉVIA VISUAL DO CARTÃO EM TEMPO REAL ================= */}
              <div className="relative w-full aspect-[1.7/1] max-w-sm mx-auto rounded-2xl p-5 sm:p-6 text-white shadow-xl overflow-hidden bg-gradient-to-br from-[#1E2E24] via-[#24392D] to-[#121B15] border border-[#3D5244] flex flex-col justify-between">
                {/* Efeito de brilho botânico de fundo */}
                <div className="absolute -right-12 -top-12 w-36 h-36 bg-[#E3A882]/15 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -left-12 -bottom-12 w-36 h-36 bg-[#4B7357]/20 rounded-full blur-2xl pointer-events-none" />

                {/* Topo do Cartão: Chip & Bandeira */}
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    {/* Chip metálico */}
                    <div className="w-10 h-7 rounded-md bg-gradient-to-tr from-[#D4AF37] via-[#F3E5AB] to-[#AA771C] border border-[#8C6D1F] relative overflow-hidden shadow-inner flex items-center justify-center">
                      <div className="w-full h-px bg-[#8C6D1F]/50 absolute top-2" />
                      <div className="w-full h-px bg-[#8C6D1F]/50 absolute bottom-2" />
                      <div className="w-px h-full bg-[#8C6D1F]/50 absolute left-3" />
                      <div className="w-px h-full bg-[#8C6D1F]/50 absolute right-3" />
                    </div>
                    {/* Símbolo Contactless */}
                    <span className="text-[#A4B5AB] text-xs font-mono tracking-widest rotate-90">
                      )))
                    </span>
                  </div>

                  {/* Badge da Bandeira */}
                  <div className="px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-xs border border-white/20 text-xs font-bold tracking-wider">
                    {cardBrand.name}
                  </div>
                </div>

                {/* Centro: Número do Cartão Formatado */}
                <div className="my-auto pt-2 relative z-10">
                  <span className="text-[9px] uppercase tracking-widest text-[#93A79B] block mb-0.5">
                    Número do Cartão
                  </span>
                  <div className="font-mono text-lg sm:text-xl tracking-[0.18em] font-semibold text-[#FAF8F5] drop-shadow-sm truncate">
                    {cardData.number || '•••• •••• •••• ••••'}
                  </div>
                </div>

                {/* Base: Titular, Vencimento e CVV */}
                <div className="flex items-end justify-between relative z-10 pt-1">
                  <div className="max-w-[65%]">
                    <span className="text-[9px] uppercase tracking-widest text-[#93A79B] block">
                      Titular do Cartão
                    </span>
                    <span className="font-mono text-xs sm:text-sm font-semibold tracking-wider text-[#FAF8F5] truncate block uppercase">
                      {cardData.name || 'NOME IMPRESSO'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div>
                      <span className="text-[8px] uppercase tracking-widest text-[#93A79B] block text-center">
                        Validade
                      </span>
                      <span className="font-mono text-xs font-semibold tracking-wider text-[#FAF8F5] block text-center">
                        {cardData.expiry || 'MM/AA'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[8px] uppercase tracking-widest text-[#93A79B] block text-center">
                        CVV
                      </span>
                      <span className="font-mono text-xs font-semibold tracking-wider text-[#FAF8F5] block text-center">
                        {cardData.cvv ? '•••' : '•••'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ================= FORMULÁRIO DE ADICIONAR CARTÃO ================= */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#D8CABE] space-y-3.5 shadow-xs">
                
                {/* Campo 1: Número do Cartão */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-[#2F3E34]">
                      Número do Cartão
                    </label>
                    <span className="text-[11px] font-semibold text-[#8C4E2D]">
                      {cardBrand.name}
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="0000 0000 0000 0000"
                      value={cardData.number}
                      onChange={(e) => setCardData({ ...cardData, number: formatCardNumber(e.target.value) })}
                      className="w-full px-3.5 py-2.5 text-sm font-mono rounded-xl border border-[#D5C8B6] bg-white text-[#1F2B23] focus:outline-none focus:border-[#243329] pr-10"
                    />
                    <CreditCard className="w-5 h-5 text-[#8C4E2D] absolute right-3 top-2.5" />
                  </div>
                </div>

                {/* Campo 2: Nome Impresso no Cartão */}
                <div>
                  <label className="block text-xs font-bold text-[#2F3E34] mb-1">
                    Nome Impresso no Cartão
                  </label>
                  <input
                    type="text"
                    placeholder="Como está grafado no cartão"
                    value={cardData.name}
                    onChange={(e) => setCardData({ ...cardData, name: e.target.value.toUpperCase() })}
                    className="w-full px-3.5 py-2.5 text-xs uppercase font-medium rounded-xl border border-[#D5C8B6] bg-white text-[#1F2B23] focus:outline-none focus:border-[#243329]"
                  />
                </div>

                {/* Campos 3 & 4: Data de Vencimento e CVV em 2 Colunas */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#2F3E34] mb-1">
                      Data de Vencimento
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="MM/AA"
                      value={cardData.expiry}
                      onChange={(e) => setCardData({ ...cardData, expiry: formatExpiry(e.target.value) })}
                      className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border border-[#D5C8B6] bg-white text-[#1F2B23] focus:outline-none focus:border-[#243329]"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-[#2F3E34]">
                        CVV / Código
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowCvvTip(!showCvvTip)}
                        className="text-[#8C4E2D] hover:text-[#5E321A]"
                        title="O que é CVV?"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="relative">
                      <input
                        type={showCvvText ? 'text' : 'password'}
                        inputMode="numeric"
                        placeholder="3 ou 4 dígitos"
                        value={cardData.cvv}
                        onChange={(e) => setCardData({ ...cardData, cvv: formatCvv(e.target.value) })}
                        className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border border-[#D5C8B6] bg-white text-[#1F2B23] focus:outline-none focus:border-[#243329] pr-8"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCvvText(!showCvvText)}
                        className="absolute right-2.5 top-3 text-[#7A8A80] hover:text-black"
                      >
                        {showCvvText ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Dica flutuante do CVV */}
                {showCvvTip && (
                  <div className="p-2.5 rounded-xl bg-[#F0ECE1] border border-[#D8CABE] text-[11px] text-[#4E5E53] animate-in fade-in duration-150">
                    O <strong>CVV</strong> são os 3 dígitos localizados no verso do seu cartão (ou 4 dígitos na frente para cartões Amex).
                  </div>
                )}

                {/* Campo 5: Opções de Parcelamento */}
                <div>
                  <label className="block text-xs font-bold text-[#2F3E34] mb-1">
                    Número de Parcelas
                  </label>
                  <select
                    value={cardData.installments}
                    onChange={(e) => setCardData({ ...cardData, installments: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D5C8B6] bg-white text-[#1F2B23] focus:outline-none focus:border-[#243329]"
                  >
                    <option value="1">1x de R$ {(subtotalAfterCoupon + shippingCost).toFixed(2).replace('.', ',')} à vista sem juros</option>
                    <option value="2">2x de R$ {((subtotalAfterCoupon + shippingCost) / 2).toFixed(2).replace('.', ',')} sem juros</option>
                    <option value="3">3x de R$ {((subtotalAfterCoupon + shippingCost) / 3).toFixed(2).replace('.', ',')} sem juros</option>
                    <option value="4">4x de R$ {((subtotalAfterCoupon + shippingCost) / 4).toFixed(2).replace('.', ',')} sem juros</option>
                    <option value="5">5x de R$ {((subtotalAfterCoupon + shippingCost) / 5).toFixed(2).replace('.', ',')} sem juros</option>
                    <option value="6">6x de R$ {((subtotalAfterCoupon + shippingCost) / 6).toFixed(2).replace('.', ',')} sem juros</option>
                  </select>
                </div>

                {/* Checkbox: Salvar cartão com token */}
                <label className="flex items-center gap-2 pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cardData.saveCard}
                    onChange={(e) => setCardData({ ...cardData, saveCard: e.target.checked })}
                    className="rounded text-[#243329] focus:ring-[#243329]"
                  />
                  <span className="text-[11px] text-[#55665B]">
                    Salvar este cartão com segurança criptografada para compras futuras
                  </span>
                </label>
              </div>

            </div>
          )}

          {/* ---------------- ABA 4: SUCESSO & COMPROVANTE ---------------- */}
          {activeTab === 'success' && (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#EAF2ED] text-[#3F634A] mx-auto flex items-center justify-center shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              
              <h4 className="font-serif text-2xl text-[#18231C]">
                Pedido Realizado com Sucesso!
              </h4>

              <div className="p-3.5 rounded-2xl bg-[#F6F2EA] border border-[#E1D6C5] max-w-xs mx-auto space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-[#6B7970] font-semibold block">
                  Código do Pedido & Rastreamento
                </span>
                <span className="font-mono font-bold text-base text-[#243329] tracking-wider block">
                  {orderNumber}
                </span>
                <span className="text-[11px] text-[#3F634A] font-medium block">
                  {paymentTypeChosen === 'pix' ? 'Pago via PIX com 5% OFF' : `Pago no Cartão ${cardBrand.name} em ${cardData.installments}x`}
                </span>
              </div>

              <p className="text-xs text-[#505F55] max-w-sm mx-auto leading-relaxed">
                Confirmamos a sua transação no valor de <strong>R$ {finalTotalToPay.toFixed(2).replace('.', ',')}</strong>. 
                Os detalhes do ritual e código de envio climatizado foram enviados para <strong>{shippingData.email}</strong>.
              </p>

              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#DFD5C6] max-w-xs mx-auto text-left text-xs text-[#4F5E54] space-y-1">
                <div className="font-semibold text-[#18231C] flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#8C4E2D]" />
                  <span>Destino de Envio:</span>
                </div>
                <p className="text-[11px] text-[#55665B]">
                  {shippingData.endereco} • {shippingData.cidade} (CEP {shippingData.cep})
                </p>
              </div>

              <div className="pt-3">
                <button
                  onClick={handleResetOrder}
                  className="px-8 py-3 rounded-full bg-[#243329] hover:bg-[#16211A] text-white text-xs uppercase tracking-wider font-semibold transition-all shadow-md"
                >
                  Continuar na Aura Botânica
                </button>
              </div>
            </div>
          )}

        </div>

        {/* ================= RODAPÉ FIXO COM VALORES E BOTÃO DE AÇÃO ================= */}
        {cart.length > 0 && activeTab !== 'success' && (
          <div className="p-5 sm:p-6 border-t border-[#ECE3D5] bg-[#F4EFE6] space-y-3.5 shadow-inner">
            
            {/* Cupom (visível na sacola) */}
            {activeTab === 'cart' && (
              <div>
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Código de cupom"
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#D8CCBA] bg-[#FAF8F5] uppercase tracking-wider text-[#222E26] focus:outline-none focus:border-[#9C5B39]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold bg-[#243329] text-white rounded-xl uppercase tracking-wider hover:bg-[#16211A] transition-colors"
                  >
                    Aplicar
                  </button>
                </form>
                {couponMessage && (
                  <span className={`block text-[11px] mt-1 ${couponApplied ? 'text-[#3F634A] font-medium' : 'text-[#A04535]'}`}>
                    {couponMessage}
                  </span>
                )}
              </div>
            )}

            {/* Linhas de Valores e Descontos */}
            <div className="space-y-1.5 text-xs text-[#526156]">
              {totalSavingsCalculated > 0 && (
                <div className="p-2 rounded-xl bg-[#EAF2ED] border border-[#CDE0D4] text-[#2C5237] text-xs font-semibold flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#3F634A]" />
                    Economia total aplicada:
                  </span>
                  <span className="font-bold">R$ {totalSavingsCalculated}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} itens):</span>
                <span className="font-medium text-[#1E2922]">R$ {rawSubtotal}</span>
              </div>

              {couponApplied && (
                <div className="flex justify-between text-[#3F634A] font-medium">
                  <span>Cupom Boas-Vindas (15% OFF):</span>
                  <span>- R$ {discountAmount}</span>
                </div>
              )}

              {isPixSelected && (
                <div className="flex justify-between text-[#3F634A] font-medium">
                  <span>Desconto PIX Especial (5% extra):</span>
                  <span>- R$ {pixDiscount}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Frete Seguro Brasil:</span>
                <span className="text-[#3F634A] font-medium">
                  {shippingCost === 0 ? 'Grátis' : 'R$ 18,00'}
                </span>
              </div>

              <div className="pt-2 border-t border-[#DFD5C6] flex justify-between items-baseline">
                <span className="text-sm font-semibold text-[#18231C]">Total a Pagar:</span>
                <div className="text-right">
                  <span className="font-serif text-2xl font-bold text-[#18231C] block leading-none">
                    R$ {finalTotalToPay.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-[11px] text-[#637269] mt-0.5 block">
                    {activeTab === 'card_form' 
                      ? `${cardData.installments}x de R$ ${(finalTotalToPay / Number(cardData.installments)).toFixed(2).replace('.', ',')} sem juros`
                      : 'em até 6x sem juros no cartão ou 5% OFF no PIX'}
                  </span>
                </div>
              </div>
            </div>

            {/* BOTÕES DE AÇÃO ESPECÍFICOS POR ABA */}
            {activeTab === 'cart' && (
              <button
                id="btn-avancar-para-pagamento"
                onClick={handleGoToPaymentChoice}
                className="w-full py-3.5 rounded-full bg-[#243329] hover:bg-[#16211A] text-white text-xs uppercase tracking-wider font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <span>Avançar para Pagamento (PIX / Cartão)</span>
                <ArrowRight className="w-4 h-4 text-[#E3A882]" />
              </button>
            )}

            {activeTab === 'payment_choice' && (
              <div className="grid grid-cols-2 gap-2">
                <button
                  id="btn-escolher-pix-aba"
                  onClick={() => setPixMethodActive(true)}
                  className="py-3 px-2 rounded-full border-2 border-[#3F634A] bg-[#EAF2ED] text-[#243329] text-xs uppercase tracking-wider font-bold hover:bg-[#D5EADB] transition-all flex items-center justify-center gap-1.5"
                >
                  <QrCode className="w-4 h-4 text-[#3F634A]" />
                  <span>Pagar via PIX</span>
                </button>
                <button
                  id="btn-escolher-cartao-aba"
                  onClick={handleGoToCardForm}
                  className="py-3 px-2 rounded-full bg-[#243329] hover:bg-[#16211A] text-white text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <CreditCard className="w-4 h-4 text-[#E3A882]" />
                  <span>Adicionar Cartão</span>
                </button>
              </div>
            )}

            {activeTab === 'card_form' && (
              <button
                id="btn-pagar-com-cartao"
                onClick={handleFinalizeWithCard}
                disabled={isProcessing}
                className="w-full py-4 rounded-full bg-[#243329] hover:bg-[#16211A] text-white text-xs uppercase tracking-wider font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <span>Processando autorização segura...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-[#E3A882]" />
                    <span>Pagar R$ {finalTotalToPay.toFixed(2).replace('.', ',')} com Cartão</span>
                  </>
                )}
              </button>
            )}

            <div className="flex items-center justify-center gap-2 text-[11px] text-[#6A7B70] pt-1">
              <ShieldCheck className="w-4 h-4 text-[#3F634A]" />
              <span>Ambiente Criptografado de 256 bits • Garantia incondicional de 30 dias</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
