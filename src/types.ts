export interface Product {
  id: string;
  name: string;
  subtitle: string;
  volume: string;
  price: number;
  originalPrice?: number;
  savings?: number;
  installments?: string;
  pixPrice?: number;
  rating: number;
  reviewsCount: number;
  tags: string[];
  description: string;
  heroIngredient: string;
  benefits: string[];
  ritualStep: '1. Purificar' | '2. Nutrir' | '3. Hidratar' | '4. Proteger' | 'Tratamento Especial' | 'Kit Completo';
  image: string;
  category: 'kits' | 'rosto' | 'limpeza' | 'solar' | 'mascaras' | 'hidratacao';
  isBundle?: boolean;
  badge?: string;
  urgencyNote?: string;
  sensoryNotes?: string;
  texture?: string;
  aromatherapy?: string;
  aiBenchmarkTier?: 'R$ 139 (Média Aura)' | 'R$ 140 (CeraVe)' | 'R$ 250 (La Roche-Posay)' | 'R$ 260 (Vichy)';
  aiComparisonNote?: string;
  aiRationale?: string;
  lastAiUpdate?: string;
}

export interface AIPricingState {
  lastUpdated: string;
  targetAverages: {
    auraAverage: number;
    ceraveAverage: number;
    laRocheAverage: number;
    vichyAverage: number;
    skinCeuticalsAverage: number;
  };
  marketAnalysis: string;
  totalSavingsComparedToMarket: number;
  isCalibrating?: boolean;
  products?: Product[];
}

export interface Ingredient {
  id: string;
  name: string;
  scientificName: string;
  origin: string;
  category: 'Regeneração' | 'Hidratação' | 'Calmante' | 'Antioxidante';
  description: string;
  benefits: string[];
  sustainableCommitment: string;
  certifications: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  age: number;
  city: string;
  skinType: string;
  timeUsing: string;
  rating: number;
  title: string;
  quote: string;
  favoriteProduct: string;
  verified: boolean;
  avatarUrl?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
