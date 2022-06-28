import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { CartCookieItem } from '../utils/types';

const Cart = () => {
  const [itemsInCart, setItemsInCart] = useState<number>(1);

  useEffect(() => {
    const cart: CartCookieItem[] = JSON.parse(
      Cookies.get('cart') || JSON.stringify([])
    );
    setItemsInCart(cart.length);
  });

  if (itemsInCart > 0) {
    return (
      <section>
        <span>
          {' '}
          ({itemsInCart.toString()}) items in cart.{' '}
          <Link href='/cart'> View Cart.</Link>
        </span>
      </section>
    );
  } else {
    return <></>;
  }
};

export default Cart;
