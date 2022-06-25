import type { NextPage } from 'next';
import styles from '../styles/Page.module.css';

const Error404: NextPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        <h1>404 Error</h1>
        <p>The requested page could not be found.</p>
      </div>
    </div>
  );
};

export default Error404;
