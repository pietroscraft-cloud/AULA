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
  category: 'kits' | 'rosto' | 'limpeza' | 'solar' | 'mascaras';
  isBundle?: boolean;
  badge?: string;
  urgencyNote?: string;
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
