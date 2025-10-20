// app/product/[slug]/page.tsx
import ProductReview from "@/components/ProductReview";
import SingleProduct from "@/components/SingleProduct";
import ProductDescription from "@/components/ProductDescription";

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;

  // You can now pass slug down to children if they need it
  return (
    <>
      <SingleProduct slug={slug} />
      <ProductDescription />
      <ProductReview  />
    </>
  );
}
