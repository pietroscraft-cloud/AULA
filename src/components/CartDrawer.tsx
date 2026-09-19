import React, { useState, useEffect } from 'react';
import { CartItem } from '../types';
import { 
  X, Trash2, Plus, Minus, ShoppingBag, ShieldCheck, Sparkles, 
  ArrowRight, Check, CreditCard, QrCode, Lock, ChevronLeft, Copy, CheckCircle2, Truck
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

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [couponCode, setCouponCode] = useState('BEMVINDA15');
  const [couponApplied, setCouponApplied] = useState(true);
  const [couponMessage, setCouponMessage] = useState<string | null>('Cupom aplicado: 15% OFF de boas-vindas');
  
  // Checkout flow: 'cart' | 'shipping' | 'payment' | 'success'
  const [step, setStep] = useState<'cart' | 'shipping' | 'payment' | 'success'>('cart');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Shipping form state
  const [shippingData, setShippingData] = useState({
    nome: 'Maria Clara Silva',
    email: 'maria.clara@email.com',
    telefone: '(11) 98765-4321',
    cep: '01310-100',
    endereco: 'Av. Paulista, 1578 - Apto 82',
    cidade: 'São Paulo - SP',
  });

  // Payment form state
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card'>('pix');
  const [pixCopied, setPixCopied] = useState(false);
  const [cardData, setCardData] = useState({
    number: '•••• •••• •••• 4589',
    name: 'MARIA C SILVA',
    expiry: '08/29',
    cvv: '890',
    installments: '3',
  });
  const [orderNumber, setOrderNumber] = useState('');

  const rawSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalOriginal = cart.reduce((sum, item) => sum + (item.product.originalPrice || item.product.price) * item.quantity, 0);
  const catalogSavings = Math.max(0, totalOriginal - rawSubtotal);
  const discountAmount = couponApplied ? Math.round(rawSubtotal * 0.15) : 0;
  const subtotalAfterCoupon = Math.max(0, rawSubtotal - discountAmount);

  const freeShippingThreshold = 180;
  const missingForFreeShipping = Math.max(0, freeShippingThreshold - rawSubtotal);
  const freeShippingPercent = Math.min(100, Math.round((rawSubtotal / freeShippingThreshold) * 100));
  const shippingCost = missingForFreeShipping === 0 ? 0 : 18;

  // Extra 5% off for PIX
  const pixDiscount = paymentMethod === 'pix' ? Math.round((subtotalAfterCoupon + shippingCost) * 0.05) : 0;
  const finalTotalToPay = Math.max(0, subtotalAfterCoupon + shippingCost - pixDiscount);
  const totalSavingsCalculated = catalogSavings + discountAmount + pixDiscount;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'BEMVINDA15') {
      setCouponApplied(true);
      setCouponMessage('Cupom ativado com sucesso! 15% OFF garantido.');
    } else {
      setCouponApplied(false);
      setCouponMessage('Cupom não encontrado. Experimente BEMVINDA15');
    }
  };

  useEffect(() => {
    if (isOpen && cart.length > 0 && step === 'cart') {
      trackBeginCheckout(finalTotalToPay, cart.reduce((s, i) => s + i.quantity, 0));
    }
  }, [isOpen, step]);

  const handleProceedToShipping = () => {
    setStep('shipping');
  };

  const handleProceedToPayment = () => {
    setStep('payment');
  };

  const handleFinalizePayment = () => {
    setIsProcessing(true);
    const newOrderCode = `AURA-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderNumber(newOrderCode);

    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');
      trackPurchase(newOrderCode, finalTotalToPay);
    }, 1400);
  };

  const handleCopyPix = () => {
    navigator.clipboard?.writeText('00020126580014br.gov.bcb.pix0136aura-botanica-pagamentos-oficial@pix.com.br520400005303986540' + finalTotalToPay.toFixed(2));
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 3000);
  };

  const handleResetOrder = () => {
    setStep('cart');
    onClearCart();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/45 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-lg bg-[#FAF8F5] h-full shadow-2xl flex flex-col border-l border-[#DFD5C6] relative animate-in slide-in-from-right duration-300">
        
        {/* Header com Navegação de Etapas */}
        <div className="p-5 sm:p-6 border-b border-[#ECE3D5] flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-3">
            {step !== 'cart' && step !== 'success' && (
              <button
                onClick={() => setStep(step === 'payment' ? 'shipping' : 'cart')}
                className="p-1.5 rounded-full hover:bg-[#EFE7DC] text-[#3F4D44] transition-colors"
                title="Voltar etapa"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#243329] text-[#E3A882] flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-lg sm:text-xl font-medium text-[#1A251E] leading-tight">
                  {step === 'cart' && 'Sua Sacola de Autocuidado'}
                  {step === 'shipping' && 'Entrega & Dados de Envio'}
                  {step === 'payment' && 'Pagamento Seguro'}
                  {step === 'success' && 'Pedido Confirmado!'}
                </h3>
                <span className="text-[11px] text-[#7A8A80]">
                  {step === 'cart' && `${cart.reduce((s, i) => s + i.quantity, 0)} produtos selecionados`}
                  {step === 'shipping' && 'Passo 2 de 3: Endereço'}
                  {step === 'payment' && 'Passo 3 de 3: Conclusão'}
                  {step === 'success' && 'Código do pedido gerado'}
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

        {/* Barra de Progresso do Frete Grátis (mostrada na sacola e no checkout) */}
        {step !== 'success' && cart.length > 0 && (
          <div className="px-6 py-2.5 bg-[#F4EFE6] border-b border-[#E8DFD0]">
            <div className="flex items-center justify-between text-xs text-[#4F5D54] mb-1 font-medium">
              <span>
                {missingForFreeShipping === 0 ? (
                  <span className="text-[#3F634A] font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Parabéns! Frete Grátis garantido
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

        {/* Conteúdo Dinâmico por Etapa */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {/* ETAPA 1: SACOLA DE PRODUTOS */}
          {step === 'cart' && (
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
                    Ver Produtos
                  </button>
                </div>
              ) : (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between text-xs text-[#627267] pb-1">
                    <span>Revise seus itens:</span>
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

                        {/* Quantity controls */}
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

          {/* ETAPA 2: DADOS DE ENTREGA */}
          {step === 'shipping' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-[#F6F2EA] border border-[#E3D9CC] space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#243329]">
                  <Truck className="w-4 h-4 text-[#8C4E2D]" />
                  <span>Envio Expresso Climatizado</span>
                </div>
                <p className="text-[11px] text-[#69796E]">
                  Frascos biofotônicos protegidos em embalagem 100% reciclável com rastreio em tempo real.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#2F3E34] mb-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={shippingData.nome}
                    onChange={(e) => setShippingData({ ...shippingData, nome: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D5C8B6] bg-white text-[#222E26] focus:outline-none focus:border-[#243329]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#2F3E34] mb-1">
                      E-mail (Rastreio)
                    </label>
                    <input
                      type="email"
                      value={shippingData.email}
                      onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D5C8B6] bg-white text-[#222E26] focus:outline-none focus:border-[#243329]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#2F3E34] mb-1">
                      WhatsApp / Celular
                    </label>
                    <input
                      type="text"
                      value={shippingData.telefone}
                      onChange={(e) => setShippingData({ ...shippingData, telefone: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D5C8B6] bg-white text-[#222E26] focus:outline-none focus:border-[#243329]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1">
                    <label className="block text-xs font-semibold text-[#2F3E34] mb-1">
                      CEP
                    </label>
                    <input
                      type="text"
                      value={shippingData.cep}
                      onChange={(e) => setShippingData({ ...shippingData, cep: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D5C8B6] bg-white text-[#222E26] focus:outline-none focus:border-[#243329]"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-[#2F3E34] mb-1">
                      Endereço e Número
                    </label>
                    <input
                      type="text"
                      value={shippingData.endereco}
                      onChange={(e) => setShippingData({ ...shippingData, endereco: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D5C8B6] bg-white text-[#222E26] focus:outline-none focus:border-[#243329]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2F3E34] mb-1">
                    Cidade / Estado
                  </label>
                  <input
                    type="text"
                    value={shippingData.cidade}
                    onChange={(e) => setShippingData({ ...shippingData, cidade: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D5C8B6] bg-white text-[#222E26] focus:outline-none focus:border-[#243329]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ETAPA 3: PAGAMENTO (PIX & CARTÃO) */}
          {step === 'payment' && (
            <div className="space-y-4">
              <div className="flex gap-2 p-1 rounded-2xl bg-[#EDE5D8] border border-[#D9CEBD]">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('pix')}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    paymentMethod === 'pix'
                      ? 'bg-[#243329] text-white shadow-sm'
                      : 'text-[#4A5950] hover:text-[#1F2B23]'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-[#E3A882]" />
                  <span>PIX (5% OFF)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('credit_card')}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    paymentMethod === 'credit_card'
                      ? 'bg-[#243329] text-white shadow-sm'
                      : 'text-[#4A5950] hover:text-[#1F2B23]'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-[#E3A882]" />
                  <span>Cartão de Crédito</span>
                </button>
              </div>

              {/* Seletor PIX */}
              {paymentMethod === 'pix' ? (
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#D8CABE] space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#243329] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#8C4E2D]" />
                      Chave PIX Instantânea com Desconto
                    </span>
                    <span className="text-xs font-bold text-[#3F634A] bg-[#EAF2ED] px-2 py-0.5 rounded-full">
                      5% OFF Extra
                    </span>
                  </div>

                  <div className="flex items-center justify-center p-4 bg-white rounded-xl border border-[#E3D8CA]">
                    <div className="text-center space-y-2">
                      <div className="w-36 h-36 mx-auto bg-[#F4EFE6] border border-[#D5C7B4] rounded-xl flex items-center justify-center p-2">
                        <QrCode className="w-32 h-32 text-[#243329]" />
                      </div>
                      <span className="text-[11px] text-[#69796F] block">
                        Aponte a câmera do aplicativo do seu banco
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[11px] text-[#4F5E54] font-medium">
                      Ou utilize o PIX Copia e Cola:
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
                </div>
              ) : (
                /* Seletor Cartão */
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#D8CABE] space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#2F3E34] mb-1">
                      Número do Cartão
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardData.number}
                        onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D5C8B6] bg-white text-[#222E26] pr-10"
                      />
                      <CreditCard className="w-4 h-4 text-[#8C4E2D] absolute right-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2F3E34] mb-1">
                      Nome Impresso no Cartão
                    </label>
                    <input
                      type="text"
                      value={cardData.name}
                      onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D5C8B6] bg-white text-[#222E26]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#2F3E34] mb-1">
                        Validade (MM/AA)
                      </label>
                      <input
                        type="text"
                        value={cardData.expiry}
                        onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D5C8B6] bg-white text-[#222E26]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#2F3E34] mb-1">
                        CVV / Segurança
                      </label>
                      <input
                        type="text"
                        value={cardData.cvv}
                        onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D5C8B6] bg-white text-[#222E26]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2F3E34] mb-1">
                      Opções de Parcelamento
                    </label>
                    <select
                      value={cardData.installments}
                      onChange={(e) => setCardData({ ...cardData, installments: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D5C8B6] bg-white text-[#222E26] focus:outline-none"
                    >
                      <option value="1">1x de R$ {finalTotalToPay.toFixed(2).replace('.', ',')} sem juros</option>
                      <option value="2">2x de R$ {(finalTotalToPay / 2).toFixed(2).replace('.', ',')} sem juros</option>
                      <option value="3">3x de R$ {(finalTotalToPay / 3).toFixed(2).replace('.', ',')} sem juros</option>
                      <option value="4">4x de R$ {(finalTotalToPay / 4).toFixed(2).replace('.', ',')} sem juros</option>
                      <option value="6">6x de R$ {(finalTotalToPay / 6).toFixed(2).replace('.', ',')} sem juros</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ETAPA 4: SUCESSO & COMPROVANTE */}
          {step === 'success' && (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#EAF2ED] text-[#3F634A] mx-auto flex items-center justify-center shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="font-serif text-2xl text-[#18231C]">
                Pedido Realizado com Sucesso!
              </h4>
              <div className="p-3 rounded-xl bg-[#F6F2EA] border border-[#E1D6C5] max-w-xs mx-auto">
                <span className="text-xs text-[#6B7970] block">Código de Rastreio & Pedido:</span>
                <span className="font-mono font-bold text-sm text-[#243329] tracking-wider">
                  {orderNumber}
                </span>
              </div>
              <p className="text-xs text-[#505F55] max-w-sm mx-auto leading-relaxed">
                Confirmamos seu pagamento no valor de <strong>R$ {finalTotalToPay.toFixed(2).replace('.', ',')}</strong>. 
                Os detalhes e código de acompanhamento foram enviados para <strong>{shippingData.email}</strong>.
              </p>
              <div className="pt-2">
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

        {/* Rodapé Fixo com Resumo de Valores e Ação Principal */}
        {cart.length > 0 && step !== 'success' && (
          <div className="p-5 sm:p-6 border-t border-[#ECE3D5] bg-[#F4EFE6] space-y-3.5 shadow-inner">
            {/* Cupom (visível apenas na sacola) */}
            {step === 'cart' && (
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

            {/* Cálculos de Preço */}
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

              {paymentMethod === 'pix' && step === 'payment' && (
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
                <span className="text-sm font-semibold text-[#18231C]">Total Final:</span>
                <div className="text-right">
                  <span className="font-serif text-2xl font-bold text-[#18231C] block leading-none">
                    R$ {finalTotalToPay.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-[11px] text-[#637269] mt-0.5 block">
                    em até 6x de R$ {(finalTotalToPay / 6).toFixed(2).replace('.', ',')} sem juros
                  </span>
                </div>
              </div>
            </div>

            {/* Botão de Ação por Etapa */}
            {step === 'cart' && (
              <button
                id="btn-continuar-para-entrega"
                onClick={handleProceedToShipping}
                className="w-full py-3.5 rounded-full bg-[#243329] hover:bg-[#16211A] text-white text-xs uppercase tracking-wider font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <span>Ir para Dados de Entrega</span>
                <ArrowRight className="w-4 h-4 text-[#E3A882]" />
              </button>
            )}

            {step === 'shipping' && (
              <button
                id="btn-continuar-para-pagamento"
                onClick={handleProceedToPayment}
                className="w-full py-3.5 rounded-full bg-[#243329] hover:bg-[#16211A] text-white text-xs uppercase tracking-wider font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <span>Avançar para o Pagamento</span>
                <ArrowRight className="w-4 h-4 text-[#E3A882]" />
              </button>
            )}

            {step === 'payment' && (
              <button
                id="btn-concluir-pagamento-real"
                onClick={handleFinalizePayment}
                disabled={isProcessing}
                className="w-full py-4 rounded-full bg-[#8C4E2D] hover:bg-[#733F23] text-white text-xs uppercase tracking-wider font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <span>Processando transação segura...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-[#FAF8F5]" />
                    <span>Confirmar Pagamento de R$ {finalTotalToPay.toFixed(2).replace('.', ',')}</span>
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
