import { setupServer } from 'msw/node';
import { rest } from 'msw';

// Mock API handlers
const handlers = [
  // Products API
  rest.get('/api/products', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: {
          products: [
            {
              id: '1',
              name: 'Test Product',
              slug: 'test-product',
              description: 'A test product',
              price: 29.99,
              images: ['/images/products/test.jpg'],
              category: { id: '1', name: 'Test Category', slug: 'test-category' },
              stock: 10
            }
          ],
          pagination: {
            current_page: 1,
            last_page: 1,
            per_page: 10,
            total: 1
          }
        }
      })
    );
  }),

  // Auth API
  rest.post('/api/auth/login', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: {
          user: {
            id: '1',
            email: 'test@example.com',
            name: 'Test User',
            role: 'user'
          },
          token: 'mock-token'
        }
      })
    );
  }),

  // Cart API
  rest.get('/api/cart', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: {
          id: '1',
          items: [],
          subtotal: 0,
          tax: 0,
          shipping: 0,
          total: 0
        }
      })
    );
  }),
];

export const server = setupServer(...handlers);