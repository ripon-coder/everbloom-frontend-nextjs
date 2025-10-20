import ProductClient from "@/components/ProductClient";
import { notFound } from "next/navigation";

interface ProductPageProps {
  slug: string;
}

export default async function ProductPage({ slug }: ProductPageProps) {
  console.log("Product slug:", slug);

  if (!slug) return notFound();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    // ✅ Correct API URL with query param
    const res = await fetch(`${baseUrl}/api/product?slug=${slug}`, {
      next: { revalidate: 10 },
    });

    if (!res.ok) throw new Error(`Failed to fetch product: ${res.status}`);

    const data = await res.json();
    const product = data?.data?.[0];

    if (!product) return notFound();

    return <ProductClient product={product} />;
  } catch (error) {
    console.error("Product fetch error:", error);
    return notFound();
  }
}
