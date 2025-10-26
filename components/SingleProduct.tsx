import ProductClient from "@/components/ProductClient";
import { notFound } from "next/navigation";

interface ProductPageProps {
  slug: string;
}

export default async function ProductPage({ slug }: ProductPageProps) {
  if (!slug) return notFound();
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL;
  try {
    const res = await fetch(`${baseUrl}/api/product?slug=${slug}`, {
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
