import { sendMail } from '../../../utils/mail';
import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

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
    try {
      const event = req.body;

      switch (event.type) {
        case 'order_created': {
          console.log('created');
          await sendMail(
            event.data.order.recipient.email,
            'Your Order Has Been Placed',
            `Your order has been placed. You will receive another email in 5-10 days when your product has shipped, or if there are any unexpected issues regarded your order. Please contact mail@zeromoneyteam.com if you require any further assistance. Order ID: ${event.data.order.packing_slip.custom_order_id}`
          );
          break;
        }
        case 'package_shipped': {
          console.log('shipped');
          await sendMail(
            event.data.order.recipient.email,
            'Your Order Has Been Shipped',
            `Your order has been successfully processed. You should receive another confirmation email from the manufacturer shortly. Tracking URL: ${event.data.shipment.tracking_url}. Please contact mail@zeromoneyteam.com if you require any further assistance.`
          );
          break;
        }
        case 'order_failed': {
          console.log('failed');
          //refund
          const stripe = new Stripe(STRIPE_SECRET_KEY, {
            apiVersion: '2020-08-27',
          });

          try {
            const session: any = await stripe.checkout.sessions.retrieve(
              event.data.order.packing_slip.custom_order_id
            );

            const refund = await stripe.refunds.create({
              payment_intent: session.payment_intent,
            });

            await sendMail(
              event.data.order.recipient.email,
              'Error Processing Your Order',
              'There was an unexpected error processing your order. Your order has been canceled and a refund has been issued. Please contact mail@zeromoneyteam.com if you have any further issues.'
            );
          } catch (err: any) {
            console.log(err.message);
            await sendMail(
              event.data.order.recipient.email,
              'Error Processing Your Order',
              'There was an unexpected error processing your order, and we were unable to automatically issue a refund. Please contact mail@zeromoneyteam.com and include your order ID from your initial confirmation email.'
            );
          }

          break;
        }
        case 'order_canceled': {
          console.log('canceled');

          try {
            const stripe = new Stripe(STRIPE_SECRET_KEY, {
              apiVersion: '2020-08-27',
            });

            const session: any = await stripe.checkout.sessions.retrieve(
              event.data.order.packing_slip.custom_order_id
            );

            const refund = await stripe.refunds.create({
              payment_intent: session.payment_intent,
            });

            await sendMail(
              event.data.order.recipient.email,
              'Order Canceled.',
              'Your order has been canceled and a refund has been issued. Please contact mail@zeromoneyteam.com if you have any further issues.'
            );
          } catch (err: any) {
            console.log(err.message);
            await sendMail(
              event.data.order.recipient.email,
              'Error Cancelling your Order',
              'There was an unexpected error when cancelling your order, and we were unable to automatically issue a refund. Please contact mail@zeromoneyteam.com and include your order ID from your initial confirmation email.'
            );
          }
          break;
        }
      }
      res.status(200).json('Event Received');
    } catch (err: any) {
      console.log(err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
