import React, { useState, useEffect } from 'react';
import { CartItem } from '../types';
import { X, Trash2, Plus, Minus, ShoppingBag, ShieldCheck, Sparkles, ArrowRight, Check } from 'lucide-react';
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
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  if (!isOpen) return null;

  const rawSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalOriginal = cart.reduce((sum, item) => sum + (item.product.originalPrice || item.product.price) * item.quantity, 0);
  const catalogSavings = Math.max(0, totalOriginal - rawSubtotal);
  const discountAmount = couponApplied ? Math.round(rawSubtotal * 0.15) : 0;
  const finalTotal = Math.max(0, rawSubtotal - discountAmount);
  const totalSavingsCalculated = catalogSavings + discountAmount;

  const freeShippingThreshold = 180;
  const missingForFreeShipping = Math.max(0, freeShippingThreshold - rawSubtotal);
  const freeShippingPercent = Math.min(100, Math.round((rawSubtotal / freeShippingThreshold) * 100));
  const finalTotalWithShipping = finalTotal + (missingForFreeShipping === 0 ? 0 : 18);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'BEMVINDA15') {
      setCouponApplied(true);
    } else {
      alert('Cupom inválido. Tente BEMVINDA15');
    }
  };

  useEffect(() => {
    if (isOpen && cart.length > 0) {
      trackBeginCheckout(finalTotalWithShipping, cart.reduce((s, i) => s + i.quantity, 0));
    }
  }, [isOpen]);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderComplete(true);
      trackPurchase(`PEDIDO-${Date.now()}`, finalTotalWithShipping);
    }, 1200);
  };

  const handleResetOrder = () => {
    setOrderComplete(false);
    onClearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-[#FAF8F5] h-full shadow-2xl flex flex-col border-l border-[#DFD5C6] relative">
        
        {/* Header */}
        <div className="p-6 border-b border-[#ECE3D5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#243329]" />
            <h3 className="font-serif text-xl font-medium text-[#1A251E]">
              Sua Sacola de Autocuidado
            </h3>
            <span className="text-xs text-[#7A8A80]">
              ({cart.reduce((s, i) => s + i.quantity, 0)} itens)
            </span>
          </div>
          <button
            id="btn-fechar-carrinho"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#EFE7DC] text-[#3F4D44] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="px-6 py-3 bg-[#F4EFE6] border-b border-[#E8DFD0]">
          <div className="flex items-center justify-between text-xs text-[#4F5D54] mb-1.5 font-medium">
            <span>
              {missingForFreeShipping === 0 ? (
                <span className="text-[#3F634A] font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Parabéns! Você ganhou Frete Grátis
                </span>
              ) : (
                <span>Faltam R$ {missingForFreeShipping} para Frete Grátis</span>
              )}
            </span>
            <span className="text-[11px] text-[#78887F]">{freeShippingPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#E2D8C9] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#3F634A] transition-all duration-300 rounded-full"
              style={{ width: `${freeShippingPercent}%` }}
            />
          </div>
        </div>

        {/* Body content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {orderComplete ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#E5ECE7] text-[#3F634A] mx-auto flex items-center justify-center">
                <Sparkles className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-2xl text-[#18231C]">
                Ritual Confirmado com Sucesso!
              </h4>
              <p className="text-xs sm:text-sm text-[#505F55] max-w-xs mx-auto">
                Seu kit botânico e guia exclusivo de autocuidado já estão sendo carinhosamente preparados.
              </p>
              <div className="pt-4">
                <button
                  onClick={handleResetOrder}
                  className="px-6 py-3 rounded-full bg-[#243329] text-white text-xs uppercase tracking-wider font-semibold"
                >
                  Continuar Explorando
                </button>
              </div>
            </div>
          ) : cart.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <ShoppingBag className="w-12 h-12 text-[#D3C7B5] mx-auto" />
              <h4 className="font-serif text-xl text-[#2B3830]">
                Sua sacola está vazia
              </h4>
              <p className="text-xs text-[#6B7970] max-w-xs mx-auto">
                Escolha os produtos do seu ritual ou faça o diagnóstico para encontrar as fórmulas perfeitas para sua pele.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="p-3.5 rounded-2xl bg-[#F6F2EA] border border-[#E4DCCE] flex gap-3 items-center justify-between"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-14 h-14 rounded-xl object-cover border border-[#DDD3C3]"
                    referrerPolicy="no-referrer"
                  />

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase font-bold text-[#9C5B39]">
                      {item.product.ritualStep}
                    </span>
                    <h5 className="font-serif text-sm font-semibold text-[#1B261F] truncate">
                      {item.product.name}
                    </h5>
                    <span className="text-xs text-[#5C6B61] block">
                      R$ {item.product.price}
                    </span>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center border border-[#D5C9B8] rounded-full bg-[#FAF8F5]">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 px-2 text-[#49574D] hover:text-black"
                          aria-label="Diminuir quantidade"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-semibold px-1 text-[#222E26]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 px-2 text-[#49574D] hover:text-black"
                          aria-label="Aumentar quantidade"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-xs text-[#9E4D3E] hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        Remover
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-serif font-bold text-sm text-[#18231C]">
                      R$ {item.product.price * item.quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer & Checkout Area */}
        {cart.length > 0 && !orderComplete && (
          <div className="p-6 border-t border-[#ECE3D5] bg-[#F4EFE6] space-y-4">
            {/* Coupon form */}
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
                className="px-4 py-2 text-xs font-semibold bg-[#243329] text-white rounded-xl uppercase tracking-wider"
              >
                Aplicar
              </button>
            </form>

            {/* Calculations & Price Breakdown */}
            <div className="space-y-2 text-xs text-[#526156]">
              {/* Total savings alert */}
              {totalSavingsCalculated > 0 && (
                <div className="p-2.5 rounded-xl bg-[#EAF2ED] border border-[#CDE0D4] text-[#2C5237] text-xs font-semibold flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#3F634A]" />
                    Economia total no pedido:
                  </span>
                  <span className="font-bold">R$ {totalSavingsCalculated}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-medium text-[#1E2922]">R$ {rawSubtotal}</span>
              </div>

              {couponApplied && (
                <div className="flex justify-between text-[#3F634A] font-medium">
                  <span>Cupom Boas-Vindas (BEMVINDA15 - 15%):</span>
                  <span>- R$ {discountAmount}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Frete Brasil:</span>
                <span className="text-[#3F634A] font-medium">
                  {missingForFreeShipping === 0 ? 'Grátis' : 'R$ 18,00 (Grátis acima de R$ 180)'}
                </span>
              </div>

              {/* Final Total */}
              <div className="pt-2 border-t border-[#DFD5C6]">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-semibold text-[#18231C]">Total a Pagar:</span>
                  <div className="text-right">
                    <span className="font-serif text-2xl font-bold text-[#18231C] block">
                      R$ {finalTotalWithShipping}
                    </span>
                    <span className="text-[11px] text-[#637269]">
                      em até <strong>6x de R$ {(finalTotalWithShipping / 6).toFixed(2).replace('.', ',')}</strong> sem juros
                    </span>
                  </div>
                </div>

                {/* Pix bonus note */}
                <div className="mt-2 p-2 rounded-lg bg-[#FAF8F5] border border-[#E1D6C5] flex items-center justify-between text-[11px] text-[#8C4E2D] font-medium">
                  <span>⚡ Ou à vista no PIX com 5% OFF extra:</span>
                  <span className="font-bold">
                    R$ {(finalTotalWithShipping * 0.95).toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              id="btn-finalizar-ritual"
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full py-4 rounded-full bg-[#243329] hover:bg-[#16211A] text-white text-xs uppercase tracking-wider font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              {isCheckingOut ? (
                <span>Processando seu pedido seguro...</span>
              ) : (
                <>
                  <span>Concluir Compra Segura</span>
                  <ArrowRight className="w-4 h-4 text-[#E3A882]" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-[#6A7B70]">
              <ShieldCheck className="w-4 h-4 text-[#3F634A]" />
              <span>Garantia incondicional de 30 dias • Envio em até 24h úteis</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
