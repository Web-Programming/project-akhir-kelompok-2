export interface Product {
  _id?: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  stock: number;
  imageUrl: string;
  quantity: number;
}