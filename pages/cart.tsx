import type { NextPage } from 'next';
import styles from '../styles/Page.module.css';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { Cart } from '../utils/types';
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const Cart: NextPage = () => {
  const [cart, setCart] = useState<Cart>(
    JSON.parse(
      Cookies.get('cart') ||
        JSON.stringify({
          products: [],
        })
    )
  );
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
  );

  const [isSSR, setIsSSR] = useState(true);
  const [success, setSuccess] = useState(false);
  const [canceled, setCanceled] = useState(false);

  useEffect(() => {
    setIsSSR(false);
    setSuccess(false);
    setCanceled(false);
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      setSuccess(true);
      console.log('success');
    } else if (query.get('cancelled')) {
      setCanceled(true);
    }
  }, []);

  function removeFromCart(productIndex: number) {
    const cart: Cart = JSON.parse(
      Cookies.get('cart') ||
        JSON.stringify({
          products: [],
        })
    );
    if (cart.products.length >= 1) {
      cart.products.splice(productIndex, 1);
      setCart(cart);
      Cookies.set('cart', JSON.stringify(cart));
    }
  }

  const proceedToCheckout = async () => {
    const res = await fetch('/api/checkout_sessions', {
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ cart: cart }),
      method: 'POST',
    });

    const body = await res.json();
    window.location.href = body.url;
  };

  return (
    <div className={styles.container}>
      <h1>{!isSSR && 'My Cart (' + cart.products.length + ')'}</h1>
      {success && (
        <h1>
          Your order has been placed. You will receive an email confirmation.
        </h1>
      )}
      {canceled && <h1>Order Canceled.</h1>}
      {!isSSR &&
        cart.products.map((product, index) => (
          <div key={index} className={styles.cartItem}>
            <img src={'/' + product.variant.image} />
            <span>
              {product.quantity +
                'x ' +
                product.product_name +
                ' - ' +
                product.variant.name +
                ' | ' +
                product.size +
                ' ($' +
                product.price +
                ')'}
            </span>

            <button
              onClick={(event: React.FormEvent<HTMLButtonElement>) =>
                removeFromCart(index)
              }
            >
              Remove
            </button>
          </div>
        ))}
      <Link href='/'>Continue Shopping</Link>
      <button
        disabled={cart.products.length == 0}
        onClick={(event: React.FormEvent<HTMLButtonElement>) =>
          proceedToCheckout()
        }
      >
        Proceed To Checkout
      </button>
    </div>
  );
};

export default Cart;
