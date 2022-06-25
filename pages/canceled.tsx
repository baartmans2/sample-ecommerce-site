import type { NextPage } from 'next';
import styles from '../styles/Page.module.css';
import Link from 'next/link';
const Success: NextPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        <h1>Order canceled.</h1>
        <Link href='/'>Return to shopping.</Link>
      </div>
    </div>
  );
};

export default Success;
