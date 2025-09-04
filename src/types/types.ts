export interface Product {
  id: number;
  name: string;
  size: string;
  imageUrl: string;
  category: string;
  shippedFrom: string;
  shippedTo: string[];
  price: number;
}

export interface CartItem {
  id: string;       // biasanya string unik, bisa pakai productId + variant
  name: string;
  price: number;
  qty: number;
  image: string;    // pakai imageUrl dari Product
}

export interface Step {
  number: number;
  icon: string;
  text: string;
  special?: boolean;
}

export interface VideoItem {
  id: number;
  video: string;
  poster: string;
}

export interface FilterOptions {
  categories: string[];
  shippedFrom: string[];
  shippedTo: string[];
}