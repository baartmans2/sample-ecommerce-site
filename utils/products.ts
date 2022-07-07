import {
  FetchCollectionResult,
  Collection,
  Product,
  FetchProductResult,
} from './types';

import testCollections from '../content/test-collections.json';
import prodCollections from '../content/prod-collections.json';

const env = process.env.NODE_ENV;

const Collections = env == 'development' ? testCollections : prodCollections;

export function fetchCollection(url: String): FetchCollectionResult {
  const result: FetchCollectionResult = {
    exists: false,
    collection: {} as Collection,
  };
  Collections.forEach((collection) => {
    if (collection.collection_url == url) {
      result.exists = true;
      result.collection = collection;
    }
  });
  return result;
}

export function fetchProduct(
  collection_url: String,
  product_id: number
): FetchProductResult {
  const fetchCollectionResult: FetchCollectionResult =
    fetchCollection(collection_url);
  const result: FetchProductResult = {
    exists: false,
    product: {} as Product,
  };
  if (fetchCollectionResult.exists) {
    fetchCollectionResult.collection.products.forEach((product) => {
      if (product.id == product_id) {
        result.exists = true;
        result.product = product;
      }
    });
  }
  return result;
}
