// lib/variants.ts
export interface Variant {
  id: number;
  product_id: number;
  sku: string;
  discount_price: number;
  stock: number;
  images: string[];
  attributes: { attribute_name: string; attribute_value: string }[];
}

export async function fetchVariant(variantId: number): Promise<Variant> {
  const res = await fetch(`/api/variant?variant_id=${variantId}`);
  if (!res.ok) throw new Error("Variant not found");

  const data = await res.json();

  // Check if data.data exists and has at least one element
  if (!data?.data || !Array.isArray(data.data) || data.data.length === 0) {
    throw new Error(`Variant ${variantId} not found`);
  }

  return data.data[0];
}
