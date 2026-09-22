/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SelfcareRitual } from './components/SelfcareRitual';
import { OrganicIngredients } from './components/OrganicIngredients';
import { ProductCollection } from './components/ProductCollection';
import { Testimonials } from './components/Testimonials';
import { CallToAction } from './components/CallToAction';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { RoutineConsultant } from './components/RoutineConsultant';
import { MobileBottomNav } from './components/MobileBottomNav';
import { CartItem, Product, AIPricingState } from './types';
import { PRODUCTS_DATA } from './data/content';
import { trackAddToCart } from './utils/analytics';

export default function App() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS_DATA);
  const [cart, setCart] = useState<CartItem[]>([
    { product: PRODUCTS_DATA[0], quantity: 1 },
  ]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isConsultantOpen, setIsConsultantOpen] = useState<boolean>(false);
  const [consultantMode, setConsultantMode] = useState<'chatbot' | 'quiz' | 'benchmark'>('chatbot');
  const [activeProductModal, setActiveProductModal] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');

  // AI-Driven Dynamic Pricing State
  const [pricingState, setPricingState] = useState<AIPricingState>({
    lastUpdated: new Date().toISOString(),
    targetAverages: {
      ceraveAverage: 140,
      laRocheAverage: 250,
      vichyAverage: 260,
      auraAverage: 139,
      skinCeuticalsAverage: 505,
    },
    marketAnalysis: 'Tabela de preços calibrada por inteligência artificial com ancoragem nas médias de R$ 139 (produtos-chave Aura), R$ 140 (teto CeraVe), R$ 250 (paridade La Roche-Posay) e R$ 260 (paridade Vichy). Garante pureza botânica superior com economia comprovada frente aos dermocosméticos tradicionais.',
    totalSavingsComparedToMarket: 239,
  });
  const [isRecalibratingPricing, setIsRecalibratingPricing] = useState<boolean>(false);

  // Fetch current AI dynamic benchmarks on mount
  React.useEffect(() => {
    fetch('/api/pricing/benchmarks')
      .then((res) => res.json())
      .then((data) => {
        if (data.pricingState) {
          setPricingState(data.pricingState);
        }
        if (data.productsMap) {
          setProducts((prevProducts) =>
            prevProducts.map((prod) => {
              const override = data.productsMap[prod.id];
              return override ? { ...prod, ...override } : prod;
            })
          );
        }
      })
      .catch((err) => console.log('Usando benchmarks iniciais:', err));
  }, []);

  // Recalibrate prices via Gemini AI
  const handleRecalibratePricing = async () => {
    setIsRecalibratingPricing(true);
    try {
      const res = await fetch('/api/pricing/recalibrate', { method: 'POST' });
      const data = await res.json();
      if (data.pricingState) {
        setPricingState(data.pricingState);
      }
      if (data.productsMap) {
        setProducts((prevProducts) =>
          prevProducts.map((prod) => {
            const override = data.productsMap[prod.id];
            return override ? { ...prod, ...override } : prod;
          })
        );
        // Also update any items in the cart to match new pricing
        setCart((prevCart) =>
          prevCart.map((item) => {
            const override = data.productsMap[item.product.id];
            return override ? { ...item, product: { ...item.product, ...override } } : item;
          })
        );
      }
    } catch (err) {
      console.error('Erro ao recalibrar preços com IA:', err);
    } finally {
      setIsRecalibratingPricing(false);
    }
  };

  const handleOpenConsultant = (mode: 'chatbot' | 'quiz' | 'benchmark' = 'chatbot') => {
    setConsultantMode(mode);
    setIsConsultantOpen(true);
  };

  const handleAddToCart = (product: Product) => {
    trackAddToCart(product.name, product.price, product.id);
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleBuyNow = (product: Product) => {
    handleAddToCart(product);
    setIsCartOpen(true);
  };

  const handleSelectBundle = () => {
    // Add the top complete 4-step ritual bundle with maximum savings
    const completeKit = products.find((p) => p.id === 'kit-ritual-completo-4-passos') || products[0];
    handleAddToCart(completeKit);
    setIsCartOpen(true);
  };

  const handleAddRecommendedKit = (recommendedList: Product[]) => {
    recommendedList.forEach((p) => handleAddToCart(p));
    setIsCartOpen(true);
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleGoToPromotions = (category?: string) => {
    setSelectedCategory(category || 'kits');
    setIsConsultantOpen(false);
    scrollTo('produtos');
  };

  const handleOpenProductModal = (productIdOrStep: string) => {
    const foundProduct = products.find(
      (p) => p.id === productIdOrStep || p.ritualStep?.toLowerCase().includes(productIdOrStep.toLowerCase()) || p.name.toLowerCase().includes(productIdOrStep.toLowerCase())
    );
    if (foundProduct) {
      setActiveProductModal(foundProduct);
    } else {
      scrollTo('produtos');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#242A26] flex flex-col selection:bg-[#E2D9CC] selection:text-[#18211D] pb-16 sm:pb-0">
      {/* Navigation Header */}
      <Navbar
        cart={cart}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenConsultant={() => handleOpenConsultant('chatbot')}
      />

      <main className="flex-1">
        {/* Hero Section with clear value proposition and invitation */}
        <Hero
          onStartRitual={() => handleOpenConsultant('chatbot')}
          onExploreIngredients={() => scrollTo('ingredientes')}
          onViewCatalog={() => scrollTo('produtos')}
        />

        {/* Natural Product Collection with AI Dynamic Pricing Controller */}
        <ProductCollection
          products={products}
          onAddToCart={handleAddToCart}
          onSelectBundle={handleSelectBundle}
          onBuyNow={handleBuyNow}
          activeProductModal={activeProductModal}
          onCloseProductModal={() => setActiveProductModal(null)}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          pricingState={pricingState}
          isRecalibrating={isRecalibratingPricing}
          onRecalibratePricing={handleRecalibratePricing}
        />

        {/* The 4-Step Transformative Self-care Ritual */}
        <SelfcareRitual
          onSelectProduct={handleOpenProductModal}
          onOpenConsultant={handleOpenConsultant}
        />

        {/* Explicitly Requested: Benefits of Organic & Sustainable Ingredients */}
        <OrganicIngredients />

        {/* Explicitly Requested: Real Customer Testimonials & Skin Transformation */}
        <Testimonials />

        {/* Explicitly Requested: Clear & Inviting Call to Action Button with 15% OFF */}
        <CallToAction
          onClaimOffer={() => {
            scrollTo('produtos');
          }}
        />

        {/* Questions & Transparency */}
        <FaqSection />
      </main>

      {/* Minimalist Eco-Conscious Footer */}
      <Footer />

      {/* Interactive Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* Interactive Routine Skin Diagnostic Quiz Modal with Quest and Promo Redirection */}
      <RoutineConsultant
        isOpen={isConsultantOpen}
        onClose={() => setIsConsultantOpen(false)}
        onAddRecommendedKit={handleAddRecommendedKit}
        onGoToPromotions={handleGoToPromotions}
        initialMode={consultantMode}
      />

      {/* Mobile Native-like Bottom Navigation for Android & Mobile Web */}
      <MobileBottomNav
        cart={cart}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenConsultant={() => handleOpenConsultant('chatbot')}
        onNavigatePromotions={() => {
          setSelectedCategory('kits');
          scrollTo('produtos');
        }}
        onNavigateRitual={() => scrollTo('o-ritual')}
      />
    </div>
  );
}
