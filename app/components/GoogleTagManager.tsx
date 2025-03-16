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
    /*
    subscribe('custom_cart_viewed', (data) => {
      const cart = data.cart;
      if (cart?.lines.nodes.length) {
        window.dataLayer.push({
            event: 'viewed-cart',
            ecommerce: {
              total_amount: cart.cost.totalAmount.amount,
              items: cart.lines.nodes.map(item => ({
                item_id: item.merchandise.id,
                item_name: item.merchandise.product.title + (item.merchandise.title !== 'Default Title' ? ' ' + item.merchandise.title : ''),
                price: item.merchandise.price.amount,
                quantity: item.quantity,
                items_in_pack: item.attributes.map(attr => ({
                  item_name: attr.key,
                  quantity: attr.value,
                }))
              })),
            }
          });
      }
    });
*/
    subscribe('product_added_to_cart', (data) => {
      // Triggering a custom event in GTM when a product is viewed
      const cart = data.cart;
      if (cart?.lines.nodes.length) {
        window.dataLayer.push({
          event: 'add-to-cart',
          ecommerce: {
            total_amount: cart.cost.totalAmount.amount,
            items: cart.lines.nodes.map(item => ({
              item_id: item.merchandise.id,
              item_name: item.merchandise.product.title + (item.merchandise.title !== 'Default Title' ? ' ' + item.merchandise.title : ''),
              price: item.merchandise.price.amount,
              quantity: item.quantity,
              items_in_pack: item.attributes.map(attr => ({
                item_name: attr.key,
                quantity: attr.value,
              }))
            })),
          }
        });
      }
    });

     // NEW: Add specific handler for bundle added to cart
     subscribe('custom_bundle_added_to_cart', (data) => {
      const { bundle, items, totalValue } = data;
      window.dataLayer.push({
        event: 'bundle-add-to-cart',
        ecommerce: {
          bundle_id: bundle.id,
          bundle_title: bundle.title,
          total_amount: totalValue,
          items: items.map((item) => ({
            item_id: item.id,
            item_name: item.title + ' ' + item.size,
            price: parseFloat(item.price),
            quantity: item.quantity,
          }))
        }
      });
    });
    
    subscribe('custom_checkout', (data) => {
      // Triggering a custom event in GTM when a product is viewed
      const cart = data.cart;
      if (cart?.lines.nodes.length) {
        window.dataLayer.push({
          event: 'add-to-cart',
          ecommerce: {
            total_amount: cart.cost.totalAmount.amount,
            items: cart.lines.nodes.map(item => ({
              item_id: item.merchandise.id,
              item_name: item.merchandise.product.title + (item.merchandise.title !== 'Default Title' ? ' ' + item.merchandise.title : ''),
              price: item.merchandise.price.amount,
              quantity: item.quantity,
              items_in_pack: item.attributes.map(attr => ({
                item_name: attr.key,
                quantity: attr.value,
              }))
            }))
          }
        });
      }
    });
    ready();
  }, [subscribe, ready]);

  return null;
}