import { Suspense } from "react";
import ShopPageClient from "./ShopPageClient";
import { ShopLoading } from "@/components/LoadingStates";

// Server-side data fetching for initial page load
async function getInitialShopData(searchParams: { [key: string]: string | string[] | undefined }) {
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL || 'http://localhost:3000';

  try {
    // Extract search params for initial data fetch
    const params = new URLSearchParams();

    const category = searchParams.category as string;
    const brand = searchParams.brand as string;
    const minPrice = searchParams.min_price as string;
    const maxPrice = searchParams.max_price as string;

    if (category) params.set("category", category);
    if (brand) params.set("brand", brand);
    if (minPrice) params.set("min_price", minPrice);
    if (maxPrice) params.set("max_price", maxPrice);
    params.set("current_page", "1");
    params.set("per_page", "8");

    // Mock API calls - these would be real API endpoints
    const [productsResponse, filtersResponse] = await Promise.all([
      // fetch(`${baseUrl}/api/shop-products?${params.toString()}`, { next: { revalidate: 30 } }),
      // fetch(`${baseUrl}/api/shop-category-brand?category=${category || ''}`, { next: { revalidate: 3600 } }),

      // For now, return mock data
      Promise.resolve({
        data: {
          products: [],
          pagination: {
            current_page: 1,
            last_page: 1,
            total: 0
          }
        }
      }),
      Promise.resolve({
        data: {
          categories: [],
          brands: []
        }
      })
    ]);

    return {
      products: productsResponse.data.products,
      pagination: productsResponse.data.pagination,
      categories: filtersResponse.data.categories,
      brands: filtersResponse.data.brands,
      attributes: [], // Would fetch from /api/shop-attribute
    };
  } catch (error) {
    console.error('Error fetching initial shop data:', error);
    return {
      products: [],
      pagination: { current_page: 1, last_page: 1, total: 0 },
      categories: [],
      brands: [],
      attributes: [],
    };
  }
}

// Dynamic metadata generation for SEO
export async function generateMetadata({ searchParams }: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const category = searchParams.category as string;
  const brand = searchParams.brand as string;

  const title = category
    ? `${category} Products - E-Shop`
    : brand
    ? `${brand} Products - E-Shop`
    : "Shop All Products - E-Shop";

  const description = `Browse ${category || brand || 'all'} products with advanced filtering. Find the perfect items with our comprehensive product catalog.`;

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'E-Shop';
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL || 'http://localhost:3000';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/shop${category ? `?category=${category}` : brand ? `?brand=${brand}` : ''}`,
      type: "website",
      images: [
        {
          url: `${baseUrl}/images/og-shop.jpg`,
          width: 1200,
          height: 630,
          alt: `${title} - ${siteName}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/images/og-shop.jpg`],
    },
    alternates: {
      canonical: `${baseUrl}/shop`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

// Server Component wrapper
export default async function ShopPage({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Server-side initial data fetching
  const initialData = await getInitialShopData(searchParams);

  return (
    <>
      {/* Shop page with client-side interactivity and initial data */}
      <Suspense fallback={<ShopLoading />}>
        <ShopPageClient
          initialData={initialData}
          searchParams={searchParams}
        />
      </Suspense>
    </>
  );
}