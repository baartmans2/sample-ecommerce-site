import { CartCookieItem, Cart, CartProduct } from './types';
import testCollections from '../content/test-collections.json';
import prodCollections from '../content/prod-collections.json';

const env = process.env.NODE_ENV;

const Collections = env == 'development' ? testCollections : prodCollections;

export function buildCartFromCookie(cartCookie: CartCookieItem[]) {
  const products: CartProduct[] = [];
  for (const cartItem of cartCookie) {
    for (const collection of Collections) {
      for (const product of collection.products) {
        for (const variant of product.variants) {
          for (const size of variant.sizes) {
            if (size.stripe_price_id === cartItem.price_id) {
              products.push({
                id: product.id,
                product_name: product.product_name,
                variant: variant,
                image: variant.image,
                quantity: cartItem.quantity,
                price: product.price,
                size: size.size,
                stripe_price_id: cartItem.price_id,
              });
            }
          }
        }
      }
    }
  }
  const cart: Cart = {
    products: products,
  };

  return cart;
}
