// app/product/[slug]/page.tsx
import SingleProduct from "@/components/SingleProduct";
import ProductDescription from "@/components/ProductDescription";
import ProductReview from "@/components/ProductReview";
import { notFound } from "next/navigation";

interface ProductPageProps {
  params: { slug: string };
}

// ✅ Dynamic Metadata for SEO
export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = params;
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL;

  try {
    const res = await fetch(`${baseUrl}/api/product?slug=${slug}`, {
      cache: "no-store",
    });
    const data = await res.json();
    const product = data?.data?.[0];

    if (!product) return { title: "Product Not Found" };

    const title = `${product.name} | YourShopName`;
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
        type: "website", // ✅ FIXED
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
export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = params;
  if (!slug) return notFound();

  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL;

  try {
    const res = await fetch(`${baseUrl}/api/product?slug=${slug}`, {
      next: { revalidate: 60 },
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
