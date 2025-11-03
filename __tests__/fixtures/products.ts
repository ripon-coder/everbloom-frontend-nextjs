import { Product } from '@/types';

export const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  slug: 'test-product',
  description: 'This is a test product for testing purposes',
  price: 29.99,
  images: ['/images/products/test-product.jpg'],
  category: {
    id: '1',
    name: 'Electronics',
    slug: 'electronics'
  },
  brand: {
    id: '1',
    name: 'Test Brand',
    slug: 'test-brand'
  },
  stock: 10,
  rating: 4.5,
  reviews: [],
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
};

export const mockProducts: Product[] = [
  mockProduct,
  {
    ...mockProduct,
    id: '2',
    name: 'Another Product',
    slug: 'another-product',
    price: 19.99
  }
];