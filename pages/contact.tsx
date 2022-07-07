import type { NextPage } from 'next';
import styles from '../styles/Page.module.css';
import Head from 'next/head';

const Contact: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Contact | Zero Money Team</title>
      </Head>
      <div className={styles.textContainer}>
        <h1>Contact</h1>
        <p>
          Email mail@zeromoneyteam.com with any questions, requests, or issues
          with your order/purchase. Please include a subject line.
        </p>
      </div>
    </div>
  );
};

export default Contact;
