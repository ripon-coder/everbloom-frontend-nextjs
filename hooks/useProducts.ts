import { useState, useEffect } from 'react';
import { Product, ApiResponse } from '@/types';

interface UseProductsOptions {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  perPage?: number;
}

export const useProducts = (options: UseProductsOptions = {}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });

  const fetchProducts = async (fetchOptions: UseProductsOptions = {}) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      if (options.category) params.set('category', options.category);
      if (options.brand) params.set('brand', options.brand);
      if (options.minPrice) params.set('min_price', options.minPrice.toString());
      if (options.maxPrice) params.set('max_price', options.maxPrice.toString());
      if (fetchOptions.page) params.set('page', fetchOptions.page.toString());
      if (fetchOptions.perPage) params.set('per_page', fetchOptions.perPage.toString());

      const response = await fetch(`/api/products?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse<{ products: Product[]; pagination: any }> = await response.json();

      if (data.success && data.data) {
        setProducts(data.data.products);
        setPagination({
          currentPage: data.data.pagination.current_page,
          totalPages: data.data.pagination.last_page,
          total: data.data.pagination.total
        });
      } else {
        throw new Error(data.message || 'Failed to fetch products');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(options);
  }, [options.category, options.brand, options.minPrice, options.maxPrice]);

  return {
    products,
    loading,
    error,
    pagination,
    refetch: fetchProducts
  };
};