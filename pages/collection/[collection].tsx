import type { NextPage } from 'next';
import { Collection, FetchCollectionResult } from '../../utils/types';
import { GetServerSideProps } from 'next';
import { fetchCollection } from '../../utils/products';
import styles from '../../styles/Page.module.css';
import Link from 'next/link';
import Cart from '../../components/cart';

interface Props {
  collection: Collection;
}

const CollectionPage: NextPage<Props> = (props) => {
  return (
    <>
      <div className={styles.container}>
        <Cart />
        <h1>{props.collection.collection_name}</h1>
        <Link href='/'>Back</Link>
        <div className={styles.gallery}>
          {props.collection.products.map((product) => (
            <Link
              key={product.product_name}
              href={
                '/collection/' +
                props.collection.collection_url +
                '/' +
                product.id
              }
            >
              <div className={styles.galleryItem}>
                <h2>{product.product_name}</h2>
                <img src={'/' + product.image} />
                <h3>{product.price.toString()}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default CollectionPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const url: String = context.query.collection?.toString() || 'fail';
  const fetchCollectionResult: FetchCollectionResult = await fetchCollection(
    url
  );
  if (!fetchCollectionResult.exists) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      collection: fetchCollectionResult.collection,
    },
  };
};
