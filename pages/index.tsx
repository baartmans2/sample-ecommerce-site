import type { NextPage } from 'next';
import styles from '../styles/Page.module.css';
import Link from 'next/link';
import Head from 'next/head';
import Cart from '../components/cart';
import testCollections from '../content/test-collections.json';
import prodCollections from '../content/prod-collections.json';

const env = process.env.NODE_ENV;

const Collections = env == 'development' ? testCollections : prodCollections;

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Zero Money Team</title>
      </Head>
      <Cart />
      <div className={styles.container}>
        <h1>Collections</h1>
        <div className={styles.gallery}>
          {Collections.map((collection) => (
            <Link
              key={collection.collection_name}
              href={'/collection/' + collection.collection_url}
            >
              <div className={styles.galleryItem}>
                <h2>{collection.collection_name}</h2>
                <img src={'/' + collection.image} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
