import {useAnalytics} from '@shopify/hydrogen';
import {useEffect} from 'react';

declare global {
  interface Window {
    dataLayer: any[];
  }
}

export function GoogleTagManager() {
  const {subscribe, register} = useAnalytics();
  const {ready} = register('Google Tag Manager');

  useEffect(() => {
    // Ensure `dataLayer` is defined
    if (!window.dataLayer) {
      window.dataLayer = [];
    }

    subscribe('product_viewed', () => {
      // Triggering a custom event in GTM when a product is viewed
      window.dataLayer.push({'event': 'viewed-product'});
    });
    
    subscribe('cart_updated', (data) => {
      // Triggering a custom event in GTM when a product is viewed
      const cart = data.cart;
      if (cart?.lines.nodes.length) {
        window.dataLayer.push({
          event: 'add-to-cart',
          ecommerce: {
            total_amount: cart.cost.totalAmount.amount,
            items: cart.lines.nodes.map(item => ({
              item_id: item.id,
              item_name: item.merchandise.title,
              price: item.cost.totalAmount.amount,
              quantity: item.quantity,
            })),
          }
        });
      }
    });
    ready();
  }, [subscribe, ready]);

  return null;
}