// app/product/[slug]/page.tsx
import SingleProduct from "@/components/SingleProduct";
import ProductDescription from "@/components/ProductDescription";
import ProductReview from "@/components/ProductReview";
import { cookies } from "next/headers";
const siteName = process.env.NEXT_PUBLIC_SITE_NAME;
import { notFound } from "next/navigation";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// ✅ Dynamic Metadata for SEO
export async function generateMetadata({ params }: ProductPageProps) {
  // Await params before using its properties
  const { slug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL;

  try {
    const res = await fetch(`${baseUrl}/api/product?slug=${slug}`, {
      cache: "no-store",
    });
    const data = await res.json();
    const product = data?.data?.[0];

    if (!product) return { title: "Product Not Found" };

    const title = `${product.name} | ${siteName}`;
    const description =
      product.meta_description ||
      product.description?.slice(0, 150) ||
      "Find the best deals on your favorite products!";
    const image = product.images?.[0] || "/default-product.jpg";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `${baseUrl}/product/${slug}`,
        siteName: "YourShopName",
        images: [
          {
            url: image,
            width: 800,
            height: 600,
            alt: product.name,
          },
        ],
        locale: "en_US",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [image],
      },
    };
  } catch (error) {
    console.error("Metadata fetch error:", error);
    return { title: "Product | YourShopName" };
  }
}

// 🛒 Product Page
export default async function ProductPage({
  params,
  searchParams,
}: ProductPageProps) {
  // Await params and searchParams before using their properties
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  if (!slug) return notFound();

  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL;

  const flashSaleSlug =
    typeof resolvedSearchParams.flashsale === "string"
      ? resolvedSearchParams.flashsale
      : undefined;

  const cookieStore = await cookies(); // ✅ await যোগ করো
  const cookieHeader = Array.from(cookieStore.getAll())
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  try {
    const apiUrl = flashSaleSlug
      ? `${baseUrl}/api/product?slug=${slug}&flashsale=${flashSaleSlug}`
      : `${baseUrl}/api/product?slug=${slug}`;

    const res = await fetch(apiUrl, {
      cache: "no-store",
      headers: cookieHeader ? { cookie: cookieHeader } : undefined,
    });
    if (!res.ok) throw new Error(`Failed to fetch product: ${res.status}`);

    const data = await res.json();
    const product = data?.data?.[0];

    if (!product) return notFound();
    return (
      <>
        <SingleProduct product={product} />
        <ProductDescription description={product.description} />
        <ProductReview />
      </>
    );
  } catch (error) {
    console.error("Product fetch error:", error);
    return notFound();
  }
}
