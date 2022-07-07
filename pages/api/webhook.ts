import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { buffer } from 'micro';
import {
  Address,
  PrintfulOrderItem,
  PrintfulOrderRequest,
} from '../../utils/types';

import { sendMail } from '../../utils/mail';

export const config = {
  api: {
    bodyParser: false,
  },
};

const env = process.env.NODE_ENV;

const STRIPE_SECRET_KEY =
  env == 'development'
    ? process.env.STRIPE_SECRET_TEST_KEY!
    : process.env.STRIPE_SECRET_KEY!;

const STRIPE_ENDPOINT_SECRET =
  env == 'development'
    ? process.env.STRIPE_ENDPOINT_TEST_SECRET!
    : process.env.STRIPE_ENDPOINT_SECRET!;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const stripe = new Stripe(STRIPE_SECRET_KEY, {
        apiVersion: '2020-08-27',
      });
      const payload = await buffer(req);
      const sig = req.headers['stripe-signature'];
      let event: Stripe.Event;
      event = stripe.webhooks.constructEvent(
        payload,
        sig || '',
        STRIPE_ENDPOINT_SECRET
      );

      switch (event.type) {
        case 'checkout.session.completed': {
          console.log('Event Received');
          const session: any = event.data.object;

          const lineItems = await stripe.checkout.sessions.listLineItems(
            session.id
          );

          const recipient: Address = {
            name: session.customer_details.name,
            company: '',
            address1: session.customer_details.address.line1,
            address2: session.customer_details.address.line2,
            city: session.customer_details.address.city,
            state_code: session.customer_details.address.state,
            state_name: '',
            country_code: session.customer_details.address.country,
            country_name: '',
            zip: session.customer_details.address.postal_code,
            phone: session.customer_details.phone,
            email: session.customer_details.email,
            tax_number: '',
          };

          let items: PrintfulOrderItem[] = [];

          for (const item of lineItems.data) {
            if (typeof item.price?.product == 'string') {
              const product = await stripe.products.retrieve(
                item.price.product
              );
              items.push({
                external_variant_id: product.metadata.printful_variant_id,
                quantity: item.quantity,
              });
            }
          }

          const order: PrintfulOrderRequest = {
            recipient: recipient,
            items: items,
            packing_slip: {
              email: 'mail@zeromoneyteam.com',
              message: session.id,
            },
          };

          console.log('Creating New Order: ' + JSON.stringify(order));

          const orderRes = await fetch('https://api.printful.com/orders', {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Basic ${Buffer.from(
                process.env.PRINTFUL_ALT_API_KEY!
              ).toString('base64')}`,
            },
            body: JSON.stringify(order),
            method: 'POST',
          });

          const printfulOrderRes = await orderRes.json();
          console.log('Printful Response:');
          console.log(JSON.stringify(printfulOrderRes));
          switch (printfulOrderRes.code) {
            case 200: {
              //order created successfully
              console.log(
                'Order Successfully Created. Confirming for fufillment...'
              );
              //confirm order for fufillment
              const orderFufill = await fetch(
                `https://api.printful.com/orders/${printfulOrderRes.result.id}/confirm`,
                {
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Basic ${Buffer.from(
                      process.env.PRINTFUL_ALT_API_KEY!
                    ).toString('base64')}`,
                  },
                  method: 'POST',
                }
              );

              const orderFufillRes = await orderFufill.json();
              switch (orderFufillRes.code) {
                case 200: {
                  //send a mail to user that order has been successfully processed
                  //send mail to user
                  console.log('Order confirmed for fufillment:');
                  console.log(orderFufillRes);
                  /* await sendMail(
                    recipient.email,
                    'Your Order Has Been Processed',
                    `Your order has been successfully processed. You should receive another confirmation email from the manufacturer shortly. Tracking URL: ${orderFufillRes.result.shipments.tracking_url}`
                  ); */
                  break;
                }
                default: {
                  //order not confirmed
                  console.log(
                    'Error confirming order: ' + JSON.stringify(orderFufillRes)
                  );
                  console.log('Refunding Payment...');
                  //refund order
                  const refund = await stripe.refunds.create({
                    payment_intent: session.payment_intent,
                  });

                  //send mail to user
                  await sendMail(
                    recipient.email,
                    'Error Processing Your Order',
                    'There was an unexpected error processing your order. Your order has been canceled and a refund has been issued. Please contact mail@zeromoneyteam.com if you have any further issues.'
                  );

                  //order not created successfully
                  res
                    .status(400)
                    .json('Failed to confirm order. Refund Issued.');
                }
              }

              res.status(200).json('Order created successfully.');
              break;
            }
            default: {
              //order not created successfully
              console.log(
                'Error creating order: ' + JSON.stringify(printfulOrderRes)
              );
              console.log('Refunding Payment...');
              //refund order
              const refund = await stripe.refunds.create({
                payment_intent: session.payment_intent,
              });
              //send mail to user
              await sendMail(
                recipient.email,
                'Error Processing Your Order',
                'There was an unexpected error processing your order. Your order has been canceled and a refund has been issued. Please contact mail@zeromoneyteam.com if you have any further issues.'
              );

              res.status(400).json('Failed to create order. Refund Issued.');
            }
          }
          break;
        }
        default: {
          res.status(200).json('Webhook Event Received.');
          break;
        }
      }
    } catch (err: any) {
      console.log(err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
