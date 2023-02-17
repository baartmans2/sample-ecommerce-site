## Overview

This is an example small ecommerce website utilizing Stripe Checkout and Printful API to place and fufill orders.

Built using NextJS (React), Typescript, and Material-UI for some form components.

## Structure

All products are organized into collections, and stored along with their respective info in content/collections.json.

For each variant of a product, a stripe price ID is stored. This is used to transfer the client-side cart into a stripe checkout session.

After a checkout session is completed, it posts to the site webhook, which then creates the order using the Printful API.

## Development

```bash
npm run dev
# or
yarn dev
```

Open localhost:3000 to view site.

## Production

```bash
next build
next start
```
