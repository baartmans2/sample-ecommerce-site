import { buildCartFromCookie } from '../../utils/cart';
import { Cart, CartCookieItem } from '../../utils/types';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const cartCookie: Array<CartCookieItem> = req.body.items;
    const cart: Cart = buildCartFromCookie(cartCookie);
    res.status(200).json(cart);
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
