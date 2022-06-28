export interface ProductVariant {
  variant_id: number;
  product_id: number;
  image: string;
  name: string;
}

export interface Address {
  name: string;
  company: string;
  address1: string;
  address2: string;
  city: string;
  state_code: string;
  state_name: string;
  country_code: string;
  country_name: string;
  zip: string;
  phone: string;
  email: string;
  tax_number: string;
}

export interface PrintfulOrderItem {
  external_variant_id: string;
  quantity: number | null;
}

export interface PackingSlip {
  email: string;
  custom_order_id: string;
}

export interface PrintfulOrderRequest {
  recipient: Address;
  items: PrintfulOrderItem[];
  packing_slip: PackingSlip;
}

export interface ShirtSize {
  size: string;
  stripe_price_id: string;
}

export interface ShirtVariant {
  variant_id: number;
  name: string;
  image: string;
  secondary_image: string;
  sizes: ShirtSize[];
}

export interface Product {
  id: number;
  product_name: string;
  variants: ShirtVariant[];
  image: string;
  price: number;
}

export enum Size {
  SMALL,
  MEDIUM,
  LARGE,
  XL,
  XXL,
}

export interface CartProduct {
  id: number;
  product_name: string;
  variant: ShirtVariant;
  image: string;
  quantity: number;
  price: number;
  size: string;
  stripe_price_id: string;
}

export interface Cart {
  products: CartProduct[];
}

export interface CartCookieItem {
  price_id: string;
  quantity: number;
}

export interface Collection {
  collection_name: string;
  collection_url: string;
  image: string;
  products: Product[];
}

export interface FetchCollectionResult {
  exists: Boolean;
  collection: Collection;
}

export interface FetchProductResult {
  exists: Boolean;
  product: Product;
}
