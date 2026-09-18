declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
};

export const trackAddToCart = (productName: string, price: number, id: string) => {
  trackEvent('add_to_cart', {
    currency: 'BRL',
    value: price,
    items: [
      {
        item_id: id,
        item_name: productName,
        price: price,
        quantity: 1,
      },
    ],
  });
};

export const trackBeginCheckout = (value: number, itemsCount: number) => {
  trackEvent('begin_checkout', {
    currency: 'BRL',
    value,
    items_count: itemsCount,
  });
};

export const trackPurchase = (transactionId: string, value: number) => {
  trackEvent('purchase', {
    transaction_id: transactionId,
    currency: 'BRL',
    value,
  });
};
