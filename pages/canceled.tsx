import type { NextPage } from 'next';
import styles from '../styles/Page.module.css';
import Link from 'next/link';
import Head from 'next/head';

const Success: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Order Cancelled | Zero Money Team</title>
      </Head>
      <div className={styles.textContainer}>
        <h1>Order canceled.</h1>
        <p>
          The checkout session was aborted, and your order has been canceled. If
          you believe there was a mistake, please contact
          mail@zeromoneyteam.com.
        </p>
        <Link href='/'>Return to shopping.</Link>
      </div>
    </div>
  );
};

export default Success;
