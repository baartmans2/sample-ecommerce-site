import type { NextPage } from 'next';
import styles from '../styles/Page.module.css';

const Contact: NextPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        <h1>Contact</h1>
        <p>
          Email ZeroMoneyTeam@protonmail.com with any questions, requests, or
          issues with your order/purchase. Please include a subject line.
        </p>
      </div>
    </div>
  );
};

export default Contact;
