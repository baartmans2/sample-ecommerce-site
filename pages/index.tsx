import type { NextPage } from 'next';
import styles from '../styles/Page.module.css';
import Link from 'next/link';
import collections from '../content/collections.json';
import Cart from '../components/cart';

const Home: NextPage = () => {
  return (
    <>
      <Cart />
      <div className={styles.container}>
        <h1>Collections</h1>
        <div className={styles.gallery}>
          {collections.map((collection) => (
            <Link
              key={collection.collection_name}
              href={'/collection/' + collection.collection_url}
            >
              <div className={styles.galleryItem}>
                <h2>{collection.collection_name}</h2>
                <img src={collection.image} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
