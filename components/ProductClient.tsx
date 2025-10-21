// components/ProductClient.tsx
"use client";

import Image from "next/image";
import { useState, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/lib/cart";
import toast, { Toaster } from "react-hot-toast";

// Types
interface Attribute {
  id: number;
  product_variant_id: number;
  attribute_id: number;
  attribute_value_id: number;
  attribute_name: string;
  is_image: number;
  attribute_value: string;
}

interface Variant {
  id: number;
  sku: string;
  discount_price: string;
  sell_price: string;
  stock: number;
  images: string[];
  attributes: Attribute[];
}

interface Product {
  id: number;
  name: string;
  description?: string;
  images?: string[];
  variants?: Variant[];
  slug?: string;
}

interface Props {
  product: Product;
}

export default function ProductClient({ product }: Props) {
  const firstVariant = product?.variants?.[0] || null;
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    firstVariant
  );
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});
  const [mainImage, setMainImage] = useState(
    firstVariant?.images?.[0] || product?.images?.[0] || "/placeholder.png"
  );
  const [quantity, setQuantity] = useState(1);

  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Magnifier
  const [isZoomed, setIsZoomed] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const ZOOM = 2; // 2x zoom

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = imageContainerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setLensPos({ x, y });
  };

  const handleMouseEnter = () => setIsZoomed(true);
  const handleMouseLeave = () => setIsZoomed(false);

  // Quantity
  const incrementQty = () => {
    if (selectedVariant && quantity < selectedVariant.stock)
      setQuantity((prev) => prev + 1);
  };
  const decrementQty = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  // Find matching variant
  const findMatchingVariant = (attrs: Record<string, string>) => {
    if (!product?.variants) return null;
    return product.variants.find((variant) =>
      Object.entries(attrs).every(([name, value]) =>
        variant.attributes.some(
          (a) => a.attribute_name === name && a.attribute_value === value
        )
      )
    );
  };

  const handleAttributeSelect = (attrName: string, attrValue: string) => {
    const updatedAttrs = { ...selectedAttributes, [attrName]: attrValue };
    setSelectedAttributes(updatedAttrs);

    const matchedVariant = findMatchingVariant(updatedAttrs);
    if (matchedVariant) {
      setSelectedVariant(matchedVariant);
      setMainImage(
        matchedVariant.images?.[0] || product.images?.[0] || "/placeholder.png"
      );
      setQuantity(1);
    }
  };

  const allAttributes = useMemo(() => {
    const attrMap: Record<string, Set<string>> = {};
    product?.variants?.forEach((variant) =>
      variant.attributes.forEach((attr) => {
        if (!attrMap[attr.attribute_name])
          attrMap[attr.attribute_name] = new Set();
        attrMap[attr.attribute_name].add(attr.attribute_value);
      })
    );
    return Object.entries(attrMap).map(([name, values]) => ({
      name,
      values: Array.from(values),
    }));
  }, [product]);

  const getAvailableValues = (attrName: string) => {
    const otherAttrs = Object.entries(selectedAttributes).filter(
      ([n]) => n !== attrName
    );
    const validVariants =
      product?.variants?.filter((variant) =>
        otherAttrs.every(([name, value]) =>
          variant.attributes.some(
            (a) => a.attribute_name === name && a.attribute_value === value
          )
        )
      ) || [];

    const values = validVariants.flatMap((variant) =>
      variant.attributes
        .filter((a) => a.attribute_name === attrName)
        .map((a) => a.attribute_value)
    );

    return Array.from(new Set(values));
  };

  const currentVariant = selectedVariant;
  const inStock = (currentVariant?.stock ?? 0) > 0;
  const allAttributesSelected = allAttributes.every(
    (attr) => selectedAttributes[attr.name]
  );
  const allImages = Array.from(
    new Set([...(currentVariant?.images || []), ...(product.images || [])])
  );

  return (
    <div className="p-4 bg-white min-h-screen">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Image */}
        <div className="w-full">
          <div
            ref={imageContainerRef}
            className="relative w-full h-96 border rounded-lg overflow-hidden cursor-zoom-in"
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-cover"
              unoptimized
            />

            {/* Zoom Lens */}
            {isZoomed && (
              <div
                style={{
                  position: "absolute",
                  pointerEvents: "none",
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  border: "2px solid #FFA500",
                  backgroundImage: `url(${mainImage})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: `${imageContainerRef.current?.offsetWidth! * ZOOM}px ${
                    imageContainerRef.current?.offsetHeight! * ZOOM
                  }px`,
                  backgroundPosition: `-${lensPos.x * ZOOM - 75}px -${
                    lensPos.y * ZOOM - 75
                  }px`,
                  top: `${lensPos.y - 75}px`,
                  left: `${lensPos.x - 75}px`,
                  zIndex: 20,
                }}
              />
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 mt-4 flex-wrap">
            {allImages.map((img, i) => (
              <div
                key={i}
                className={`relative w-20 h-20 border rounded-md overflow-hidden cursor-pointer hover:ring-2 hover:ring-orange-500 ${
                  mainImage === img ? "ring-2 ring-orange-500" : ""
                }`}
                onClick={() => setMainImage(img)}
              >
                <Image
                  src={img}
                  alt={`${product.name}-thumb-${i}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Details */}
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-semibold">{product.name}</h1>
          <p className="text-gray-700">{product.description}</p>

          {currentVariant?.sku && (
            <p className="text-sm text-gray-600">
              <span className="font-medium">SKU:</span> {currentVariant.sku}
            </p>
          )}

          {/* Price */}
          <div className="text-3xl font-bold text-orange-600 flex items-center gap-3">
            <span>৳ {currentVariant?.discount_price}</span>
            {currentVariant?.discount_price !== currentVariant?.sell_price && (
              <span className="text-gray-400 line-through text-xl">
                ৳ {currentVariant?.sell_price}
              </span>
            )}
          </div>

          {/* Attributes */}
          <div className="mt-4 space-y-3">
            {allAttributes.map((attr) => {
              const availableValues = getAvailableValues(attr.name);
              return (
                <div key={attr.name}>
                  <p className="font-medium">{attr.name}:</p>
                  <div className="flex gap-2 flex-wrap mt-1">
                    {attr.values.map((val) => {
                      const isAvailable = availableValues.includes(val);
                      const isSelected = selectedAttributes[attr.name] === val;
                      return (
                        <button
                          key={val}
                          disabled={!isAvailable}
                          className={`px-3 py-1 border rounded-md ${
                            isSelected
                              ? "bg-orange-500 text-white"
                              : isAvailable
                              ? "bg-gray-100 text-gray-700 hover:bg-orange-100"
                              : "bg-gray-200 text-gray-400 cursor-not-allowed"
                          }`}
                          onClick={() =>
                            isAvailable && handleAttributeSelect(attr.name, val)
                          }
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stock */}
          <p className="text-sm mt-2">
            <span className="font-medium">Stock:</span>{" "}
            {inStock ? (
              <span className="text-green-600">
                {currentVariant?.stock} available
              </span>
            ) : (
              <span className="text-red-500">Out of stock</span>
            )}
          </p>

          {/* Quantity */}
          {currentVariant && inStock && (
            <div className="flex items-center gap-3 mt-2">
              <span className="text-sm font-medium">Quantity:</span>
              <div className="flex items-center border rounded-md">
                <button
                  onClick={decrementQty}
                  className="px-3 py-1 hover:bg-gray-200"
                >
                  -
                </button>
                <span className="px-4">{quantity}</span>
                <button
                  onClick={incrementQty}
                  className={`px-3 py-1 hover:bg-gray-200 ${
                    quantity >= currentVariant.stock
                      ? "cursor-not-allowed opacity-50"
                      : ""
                  }`}
                  disabled={quantity >= currentVariant.stock}
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4 mt-4">
            {inStock ? (
              <>
                <Button
                  className="flex-1 bg-orange-500 text-white hover:bg-orange-600 cursor-pointer"
                  onClick={() => {
                    if (!currentVariant || !allAttributesSelected) {
                      toast.error(
                        "Please select all product options before adding to cart"
                      );
                      return;
                    }

                    const selectedAttributeIds = currentVariant.attributes
                      .filter(
                        (attr) =>
                          selectedAttributes[attr.attribute_name] ===
                          attr.attribute_value
                      )
                      .map((attr) => attr.attribute_value_id);

                    addToCart({
                      productId: product.id,
                      variantId: currentVariant.id,
                      quantity,
                      name: product.name,
                      price: Number(currentVariant.discount_price),
                      image: mainImage,
                      sku: currentVariant.sku,
                      attributeIds: selectedAttributeIds,
                      slug: product.slug ?? "",
                    });
                  }}
                >
                  Add to Cart
                </Button>
                <Button className="flex-1 border border-orange-500 text-orange-500 hover:bg-orange-50 cursor-pointer">
                  Buy Now
                </Button>
              </>
            ) : (
              <Button className="flex-1 bg-gray-500 text-white hover:bg-gray-600 cursor-pointer">
                Request Stock
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
