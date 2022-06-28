import type { NextPage } from 'next';
import styles from '../styles/Page.module.css';
import Head from 'next/head';

const Error404: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>404 Error | Zero Money Team</title>
      </Head>
      <div className={styles.textContainer}>
        <h1>404 Error</h1>
        <p>The requested page could not be found.</p>
      </div>
    </div>
  );
};

export default Error404;
