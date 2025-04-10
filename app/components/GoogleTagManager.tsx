import {useAnalytics} from '@shopify/hydrogen';
import {useEffect} from 'react';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
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

    subscribe('product_added_to_cart', (data) => {
      // Triggering a custom event in GTM when a product is viewed
      const cart = data.cart;
      if (cart?.lines.nodes.length) {
        
        window.dataLayer.push({
          event: 'add-to-cart',
          ecommerce: {
            total_amount: cart.cost.totalAmount.amount,
            items: cart.lines.nodes.map(item => {
              // First create the base item object
              const itemData = {
                item_id: item.merchandise.id,
                item_name: item.merchandise.product.title + 
                  (item.merchandise.title !== 'Default Title' ? ' ' + item.merchandise.title : ''),
                price: item.merchandise.price.amount,
                quantity: item.quantity,
              };
              
              // Only add items_in_pack if there are attributes
              if (item.attributes && item.attributes.length > 0) {
                return {
                  ...itemData,
                  items_in_pack: item.attributes.map(attr => ({
                    item_name: attr.key,
                    quantity: attr.value,
                  }))
                };
              }
              
              // Return the item without items_in_pack if no attributes
              return itemData;
            }),
          }
        });
      }
    });


    ready();
  }, [subscribe, ready]);

  return null;
}