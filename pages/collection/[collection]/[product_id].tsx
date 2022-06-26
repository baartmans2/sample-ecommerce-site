import type { NextPage } from 'next';
import styles from '../../../styles/Page.module.css';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { Product, ShirtVariant, Cart } from '../../../utils/types';
import { GetServerSideProps } from 'next';
import { FetchProductResult } from '../../../utils/types';
import { fetchProduct } from '../../../utils/products';
import React, { useState } from 'react';
import Cookies from 'js-cookie';
import CartPanel from '../../../components/cart';
import Router from 'next/router';
import Link from 'next/link';

interface Props {
  collection_url: string;
  product: Product;
}

const ProductPage: NextPage<Props> = (props) => {
  const [activeVariant, setActiveVariant] = useState<ShirtVariant>(
    props.product.variants[0]
  );
  const [size, setSize] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState<number>(1);
  const [priceID, setPriceID] = useState('');

  function handleVariantChange(event: SelectChangeEvent<string>) {
    props.product.variants.forEach((variant) => {
      if (variant.name === event.target.value) {
        setActiveVariant(variant);
        return;
      }
    });
  }

  function handleSizeChange(event: SelectChangeEvent<string>) {
    setSize(event.target.value);
    activeVariant.sizes.forEach((shirtSize) => {
      if (shirtSize.size === event.target.value) {
        setPriceID(shirtSize.stripe_price_id);
        return;
      }
    });
  }

  function handleQuantityChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    if (
      parseInt(event.target.value) >= 1 &&
      parseInt(event.target.value) < 11
    ) {
      setQuantity(parseInt(event.target.value));
    }
  }

  function handleFormSubmit(event: React.FormEvent<HTMLButtonElement>) {
    if (size === undefined) {
    } else {
      const cart: Cart = JSON.parse(
        Cookies.get('cart') ||
          JSON.stringify({
            products: [],
          })
      );
      cart.products.push({
        id: props.product.id,
        product_name: props.product.product_name,
        variant: activeVariant,
        image: activeVariant.image,
        quantity: quantity,
        price: props.product.price,
        size: size,
        stripe_price_id: priceID,
      });
      Cookies.set('cart', JSON.stringify(cart));
    }
    Router.push('/cart');
  }

  return (
    <>
      <CartPanel />
      <div className={styles.container}>
        <h1>{props.product.product_name}</h1>
        <Link href={'/collection/' + props.collection_url}>Back</Link>
        <div className={styles.productImages}>
          <img src={'/' + activeVariant.image} />
          {activeVariant.secondary_image != '' && (
            <img src={'/' + activeVariant.secondary_image} />
          )}
        </div>
        <div className={styles.productForm}>
          <div className={styles.productFormItem}>
            <InputLabel>Variant</InputLabel>
            <Select onChange={handleVariantChange} value={activeVariant.name}>
              {props.product.variants.map((variant, index) => (
                <MenuItem key={index} value={variant.name}>
                  {variant.name}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div className={styles.productFormItem}>
            <InputLabel>Size</InputLabel>
            <Select onChange={handleSizeChange} value={size}>
              {activeVariant.sizes.map((shirtSize, index) => (
                <MenuItem key={index} value={shirtSize.size}>
                  {shirtSize.size}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div className={styles.productFormItem}>
            <InputLabel>Quantity</InputLabel>
            <TextField
              onChange={handleQuantityChange}
              type='number'
              variant='outlined'
              value={quantity}
            />
          </div>
        </div>
        <h2>{'$' + props.product.price}</h2>
        <button onClick={handleFormSubmit} disabled={size === undefined}>
          Add To Cart
        </button>
      </div>
    </>
  );
};

export default ProductPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const collection_url: String = context.query.collection?.toString() || 'fail';
  const id: number =
    parseInt(context.query.product_id?.toString() || 'fail') || 0;

  const fetchProductResult: FetchProductResult = fetchProduct(
    collection_url,
    id
  );
  if (!fetchProductResult.exists) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      collection_url: collection_url,
      product: fetchProductResult.product,
    },
  };
};
