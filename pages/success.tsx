import type { NextPage } from 'next';
import styles from '../styles/Page.module.css';
import Cookies from 'js-cookie';
import React, { useEffect } from 'react';
import Head from 'next/head';

const Success: NextPage = () => {
  useEffect(() => {
    Cookies.remove('cart');
  }, []);
  return (
    <div className={styles.container}>
      <Head>
        <title>Order Placed | Zero Money Team</title>
      </Head>
      <div className={styles.textContainer}>
        <h1>Order placed.</h1>
        <p>You will receive a confirmation email shortly.</p>
      </div>
    </div>
  );
};

export default Success;
