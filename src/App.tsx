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
import { CartItem, Product } from './types';
import { PRODUCTS_DATA } from './data/content';
import { trackAddToCart } from './utils/analytics';

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([
    { product: PRODUCTS_DATA[0], quantity: 1 },
  ]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isConsultantOpen, setIsConsultantOpen] = useState<boolean>(false);
  const [activeProductModal, setActiveProductModal] = useState<Product | null>(null);

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
    const completeKit = PRODUCTS_DATA.find((p) => p.id === 'kit-ritual-completo-4-passos') || PRODUCTS_DATA[0];
    handleAddToCart(completeKit);
    setIsCartOpen(true);
  };

  const handleAddRecommendedKit = (products: Product[]) => {
    products.forEach((p) => handleAddToCart(p));
    setIsCartOpen(true);
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenProductModal = (productIdOrStep: string) => {
    const foundProduct = PRODUCTS_DATA.find(
      (p) => p.id === productIdOrStep || p.ritualStep?.toLowerCase().includes(productIdOrStep.toLowerCase()) || p.name.toLowerCase().includes(productIdOrStep.toLowerCase())
    );
    if (foundProduct) {
      setActiveProductModal(foundProduct);
    } else {
      scrollTo('produtos');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#242A26] flex flex-col selection:bg-[#E2D9CC] selection:text-[#18211D]">
      {/* Navigation Header */}
      <Navbar
        cart={cart}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenConsultant={() => setIsConsultantOpen(true)}
      />

      <main className="flex-1">
        {/* Hero Section with clear value proposition and invitation */}
        <Hero
          onStartRitual={() => setIsConsultantOpen(true)}
          onExploreIngredients={() => scrollTo('ingredientes')}
          onViewCatalog={() => scrollTo('produtos')}
        />

        {/* Natural Product Collection & Highlight Bundle - ELEVATED DIRECTLY BELOW HERO */}
        <ProductCollection
          onAddToCart={handleAddToCart}
          onSelectBundle={handleSelectBundle}
          onBuyNow={handleBuyNow}
          activeProductModal={activeProductModal}
          onCloseProductModal={() => setActiveProductModal(null)}
        />

        {/* The 3-Step Transformative Self-care Ritual */}
        <SelfcareRitual
          onSelectProduct={handleOpenProductModal}
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

      {/* Interactive Routine Skin Diagnostic Quiz Modal */}
      <RoutineConsultant
        isOpen={isConsultantOpen}
        onClose={() => setIsConsultantOpen(false)}
        onAddRecommendedKit={handleAddRecommendedKit}
      />
    </div>
  );
}
