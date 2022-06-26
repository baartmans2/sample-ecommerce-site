import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { Cart } from '../../utils/types';

interface LineItem {
  price: string;
  quantity: number;
}

const env = process.env.NODE_ENV;

const STRIPE_SECRET_KEY =
  env == 'development'
    ? process.env.STRIPE_SECRET_TEST_KEY!
    : process.env.STRIPE_SECRET_KEY!;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const cart: Cart = req.body.cart;

    if (!!!cart) {
      res.status(400).json('Invalid Request Format');
    }

    var lineItems: LineItem[] = [];

    cart.products.forEach((product) => {
      console.log(product.product_name);
      lineItems.push({
        price: product.stripe_price_id,
        quantity: product.quantity,
      });
    });

    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2020-08-27',
    });
    try {
      console.log('creating checkout session...');
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: 'payment',
        shipping_address_collection: {
          allowed_countries: ['US', 'CA'],
        },
        shipping_options: [
          {
            shipping_rate_data: {
              type: 'fixed_amount',
              fixed_amount: {
                amount: 0,
                currency: 'usd',
              },
              display_name: 'Free shipping',
              delivery_estimate: {
                minimum: {
                  unit: 'business_day',
                  value: 7,
                },
                maximum: {
                  unit: 'business_day',
                  value: 14,
                },
              },
            },
          },
        ],
        success_url: `${req.headers.origin}/success`,
        cancel_url: `${req.headers.origin}/canceled`,
      });
      res.status(200).json({ url: session.url });
    } catch (err: any) {
      console.log(err.message);
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
