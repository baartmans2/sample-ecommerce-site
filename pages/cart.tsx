import type { NextPage } from 'next';
import styles from '../styles/Page.module.css';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { Cart, CartCookieItem, CartProduct } from '../utils/types';
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import Head from 'next/head';

const Cart: NextPage = () => {
  const [cart, setCart] = useState<CartCookieItem[]>(
    JSON.parse(Cookies.get('cart') || JSON.stringify([]))
  );
  const [expandedCart, setExpandedCart] = useState<Cart>({} as Cart);
  const [loading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('/api/getCartDetails', {
      body: JSON.stringify({ items: cart }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
      .then((res) => res.json())
      .then((expandedCart) => {
        setExpandedCart(expandedCart);
        setIsLoading(false);
      });

    /* const fetchCart = async () => {
      const res = await fetch('/api/getCartDetails', {
        body: JSON.stringify({ items: cart }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });
      const body = await res.json();
      const theCart: Cart = body.cart;
      console.log(theCart.products);
      setExpandedCart(theCart);
    };

    const result = fetchCart().catch(console.error);
    setIsLoading(false);
    console.log(expandedCart); */
  });

  function removeFromCart(productIndex: number) {
    if (cart.length >= 1) {
      cart.splice(productIndex, 1);
      setCart(cart);
      Cookies.set('cart', JSON.stringify(cart));
    }
  }

  const proceedToCheckout = async () => {
    const res = await fetch('/api/checkout_sessions', {
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cart: expandedCart }),
      method: 'POST',
    });

    const body = await res.json();
    window.location.href = body.url;
  };

  if (loading)
    return (
      <div className={styles.container}>
        <Head>
          <title>Cart | Zero Money Team</title>
        </Head>

        <h1>Loading...</h1>
      </div>
    );
  else
    return (
      <div className={styles.container}>
        <Head>
          <title>Cart | Zero Money Team</title>
        </Head>

        <h1>{'My Cart (' + expandedCart.products.length + ')'}</h1>
        {expandedCart.products.map((product, index) => (
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
                (product.price * product.quantity).toFixed(2) +
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
          disabled={expandedCart.products.length == 0}
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
