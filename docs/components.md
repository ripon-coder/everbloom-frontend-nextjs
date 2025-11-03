# Component Documentation

This document describes the component architecture and usage in the Everbloom e-commerce application.

## Component Structure

The application follows a feature-based component organization:

```
components/
├── ui/                    # Reusable UI primitives
│   ├── Button
│   ├── Input
│   ├── Dialog
│   └── NavigationMenu
├── layout/                # Layout components
│   ├── Header
│   ├── Footer
│   ├── Sidebar
│   └── MainLayout
├── features/              # Feature-specific components
│   ├── auth/
│   ├── products/
│   ├── shopping/
│   ├── cart/
│   └── marketing/
└── shared/                # Shared utility components
    ├── LoadingSpinner
    ├── ErrorMessage
    └── Modal
```

## Usage Examples

### Layout Components

#### Header
```tsx
import { Header } from '@/components/layout';

<Header />
```

#### MainLayout
```tsx
import { MainLayout } from '@/components/layout';

<MainLayout showSidebar={true}>
  <div>Your page content</div>
</MainLayout>
```

### Product Components

#### ProductCard
```tsx
import { ProductCard } from '@/components/features/products';

<ProductCard
  product={productData}
  onAddToCart={handleAddToCart}
/>
```

#### ProductGrid
```tsx
import { ProductGrid } from '@/components/features/products';

<ProductGrid
  products={productsData}
  loading={isLoading}
/>
```

### Shopping Components

#### CategoryFilter
```tsx
import { CategoryFilter } from '@/components/features/shopping';

<CategoryFilter
  categories={categoriesData}
  onCategorySelect={handleCategorySelect}
/>
```

### Shared Components

#### LoadingSpinner
```tsx
import { LoadingSpinner } from '@/components/shared';

<LoadingSpinner size="md" />
```

#### ErrorMessage
```tsx
import { ErrorMessage } from '@/components/shared';

<ErrorMessage message="Something went wrong" />
```

## Custom Hooks

### useProducts
```tsx
import { useProducts } from '@/hooks';

const { products, loading, error, refetch } = useProducts({
  category: 'electronics',
  page: 1
});
```

### useAuth
```tsx
import { useAuth } from '@/hooks';

const { user, login, logout, isAuthenticated } = useAuth();
```

### useCart
```tsx
import { useCart } from '@/hooks';

const { cart, addItem, removeItem, itemCount, total } = useCart();
```

## Styling

All components use Tailwind CSS for styling. The application follows a consistent design system with:

- Consistent spacing and typography scales
- Responsive design patterns
- Hover and focus states
- Loading and error states

## Testing

Components are tested using Vitest and React Testing Library. Test files should be placed alongside components or in the `__tests__` directory.

Example test:
```tsx
import { render, screen } from '@/__tests__/utils/test-utils';
import { ProductCard } from '@/components/features/products';

test('renders product name', () => {
  render(<ProductCard product={mockProduct} />);
  expect(screen.getByText('Test Product')).toBeInTheDocument();
});
```