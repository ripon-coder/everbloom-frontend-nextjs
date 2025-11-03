import { Suspense } from "react";
import ProductGrid from "@/components/Product";
import Categories from "@/components/Categories";
import FlashSale from "@/components/FlashSale";
import { FlashSaleLoading, CategoriesLoading, ProductLoading } from "@/components/LoadingStates";

// Server-side data fetching function
async function getHomeData() {
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL || 'http://localhost:3000';

  try {
    // Mock API calls for now - these would be real API endpoints
    const [flashSaleData, categoriesData, featuredProducts] = await Promise.all([
      // fetch(`${baseUrl}/api/flash-sale`, { next: { revalidate: 300 } }),
      // fetch(`${baseUrl}/api/categories`, { next: { revalidate: 3600 } }),
      // fetch(`${baseUrl}/api/products?featured=true`, { next: { revalidate: 600 } })

      // For now, return mock data
      Promise.resolve({ active: true, endTime: "2025-09-17T22:00:00" }),
      Promise.resolve({ categories: [] }),
      Promise.resolve({ products: [] })
    ]);

    return {
      flashSale: flashSaleData,
      categories: categoriesData,
      products: featuredProducts
    };
  } catch (error) {
    console.error('Error fetching home data:', error);
    return {
      flashSale: { active: false, endTime: null },
      categories: { categories: [] },
      products: { products: [] }
    };
  }
}

// Metadata generation for SEO
export async function generateMetadata() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'E-Shop';
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL || 'http://localhost:3000';

  return {
    title: `Home - ${siteName}`,
    description: "Discover amazing deals on quality products. Shop our latest collection with fast shipping.",
    openGraph: {
      title: `Home - ${siteName}`,
      description: "Discover amazing deals on quality products",
      url: baseUrl,
      type: "website",
      images: [
        {
          url: `${baseUrl}/images/og-home.jpg`,
          width: 1200,
          height: 630,
          alt: `${siteName} - Shop Quality Products`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Home - ${siteName}`,
      description: "Discover amazing deals on quality products",
      images: [`${baseUrl}/images/og-home.jpg`],
    },
    alternates: {
      canonical: baseUrl,
    },
  };
}

export default async function Home() {
  // Server-side data fetching
  const homeData = await getHomeData();

  return (
    <>
      {/* Flash Sale Section with Suspense */}
      <Suspense fallback={<FlashSaleLoading />}>
        <FlashSale initialData={homeData.flashSale} />
      </Suspense>

      {/* Categories Section with Suspense */}
      <Suspense fallback={<CategoriesLoading />}>
        <Categories />
      </Suspense>

      {/* Products Section with Suspense */}
      <Suspense fallback={<ProductLoading />}>
        <Product />
      </Suspense>
    </>
  );
}
