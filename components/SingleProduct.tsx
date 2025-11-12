"use client";

import Image from "next/image";
import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/lib/cart";
import { toast } from "react-hot-toast";
import { clearCheckout, addToCheckout } from "@/lib/checkout";
import WishlistButton from "@/components/WishlistButton";
import { trackCategoryView } from "@/lib/JustForYouTracker";


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
  category_id: number;
  name: string;
  short_description?: string;
  description?: string;
  is_free_delivery?: boolean;
  images?: string[];
  variants?: Variant[];
  slug?: string;
  is_wishlisted?: boolean;
  flash_sale_name?: string;
  flash_sale_slug?: string;
  flash_sale_start_date?: string;
  flash_sale_end_date?: string;
}

interface Props {
  product: Product;
}

export default function SingleProduct({ product }: Props) {

  useEffect(() => {
    if (product?.category_id) {
      trackCategoryView(product.category_id);
    }
  }, [product]);


  const router = useRouter();
  const firstVariant = product?.variants?.[0] || null;

  // ✅ Default variant & attributes selected
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    firstVariant
  );
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >(
    () =>
      firstVariant?.attributes?.reduce((acc, attr) => {
        acc[attr.attribute_name] = attr.attribute_value;
        return acc;
      }, {} as Record<string, string>) || {}
  );

  const [mainImage, setMainImage] = useState(
    firstVariant?.images?.[0] || product?.images?.[0] || "/placeholder.png"
  );
  const [quantity, setQuantity] = useState(1);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Zoom logic
  const [isZoomed, setIsZoomed] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const ZOOM = 2;

  // Flash sale timer state
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  // Flash sale countdown
  useEffect(() => {
    if (!product.flash_sale_end_date) return;

    const calculateTimeLeft = () => {
      const endDate = new Date(product.flash_sale_end_date!).getTime();
      const now = new Date().getTime();
      const difference = endDate - now;

      if (difference <= 0) return null;

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [product.flash_sale_end_date]);

  // Flash sale progress bar
  const calculateProgress = () => {
    if (
      !product.flash_sale_start_date ||
      !product.flash_sale_end_date ||
      !timeLeft
    )
      return 0;
    const startDate = new Date(product.flash_sale_start_date).getTime();
    const endDate = new Date(product.flash_sale_end_date).getTime();
    const now = new Date().getTime();
    const totalDuration = endDate - startDate;
    const elapsed = now - startDate;
    return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  };

  // Image zoom handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = imageContainerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setLensPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };
  const handleMouseEnter = () => setIsZoomed(true);
  const handleMouseLeave = () => setIsZoomed(false);

  // Quantity handlers
  const incrementQty = () =>
    selectedVariant &&
    quantity < selectedVariant.stock &&
    setQuantity((p) => p + 1);
  const decrementQty = () => quantity > 1 && setQuantity((p) => p - 1);

  // Attribute select logic
  const findMatchingVariant = (attrs: Record<string, string>) =>
    product?.variants?.find((variant) =>
      Object.entries(attrs).every(([name, value]) =>
        variant.attributes.some(
          (a) => a.attribute_name === name && a.attribute_value === value
        )
      )
    ) || null;

  const handleAttributeSelect = (attrName: string, attrValue: string) => {
    const isCurrentlySelected = selectedAttributes[attrName] === attrValue;

    let updatedAttrs;
    if (isCurrentlySelected) {
      updatedAttrs = { ...selectedAttributes };
      delete updatedAttrs[attrName];
    } else {
      updatedAttrs = { ...selectedAttributes, [attrName]: attrValue };
    }

    setSelectedAttributes(updatedAttrs);

    const matchedVariant = findMatchingVariant(updatedAttrs);

    if (matchedVariant) {
      setSelectedVariant(matchedVariant);
      setMainImage(
        matchedVariant.images?.[0] || product.images?.[0] || "/placeholder.png"
      );
      setQuantity(1);
    } else {
      setSelectedVariant(firstVariant);
      setMainImage(
        firstVariant?.images?.[0] || product.images?.[0] || "/placeholder.png"
      );
      setQuantity(1);
    }
  };

  // Collect attributes list
  const allAttributes = useMemo(() => {
    const attrMap: Record<string, Set<string>> = {};
    product?.variants?.forEach((v) =>
      v.attributes.forEach((a) => {
        if (!attrMap[a.attribute_name]) attrMap[a.attribute_name] = new Set();
        attrMap[a.attribute_name].add(a.attribute_value);
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
      product?.variants?.filter((v) =>
        otherAttrs.every(([name, value]) =>
          v.attributes.some(
            (a) => a.attribute_name === name && a.attribute_value === value
          )
        )
      ) || [];
    const values = validVariants.flatMap((v) =>
      v.attributes
        .filter((a) => a.attribute_name === attrName)
        .map((a) => a.attribute_value)
    );
    return Array.from(new Set(values));
  };

  const currentVariant = selectedVariant || firstVariant;
  const inStock = (currentVariant?.stock ?? 0) > 0;
  const allAttributesSelected = allAttributes.every(
    (attr) => selectedAttributes[attr.name]
  );
  const allImages = Array.from(
    new Set([...(currentVariant?.images || []), ...(product.images || [])])
  );

  return (
    <div className="p-4 bg-white min-h-screen">
      <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Images */}
        <div className="w-full relative">
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
                  backgroundSize: `${
                    imageContainerRef.current?.offsetWidth! * ZOOM
                  }px ${imageContainerRef.current?.offsetHeight! * ZOOM}px`,
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

        {/* Details */}
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-semibold">{product.name}</h1>
          <p className="text-gray-700">{product.short_description}</p>

          {currentVariant?.sku && (
            <p className="text-sm text-gray-600">
              <span className="font-medium">SKU:</span> {currentVariant.sku}
            </p>
          )}

          {/* Price + Wishlist */}
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-orange-600">
              ৳ {currentVariant?.discount_price}
            </span>
            {currentVariant?.discount_price !== currentVariant?.sell_price && (
              <span className="text-gray-400 line-through text-xl">
                ৳ {currentVariant?.sell_price}
              </span>
            )}
            <WishlistButton
              productId={product.id}
              isInitiallyWishlisted={product.is_wishlisted}
              className="w-7 h-7 ml-2"
            />
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
                          className={`px-3 py-1 border rounded-md transition-colors ${
                            isSelected
                              ? "bg-orange-500 text-white border-orange-500"
                              : isAvailable
                              ? "bg-gray-100 text-gray-700 hover:bg-orange-100 border-gray-300"
                              : "bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300"
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

          {/* Stock Info */}
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
                  disabled={quantity >= currentVariant.stock}
                  className={`px-3 py-1 hover:bg-gray-200 ${
                    quantity >= currentVariant.stock
                      ? "cursor-not-allowed opacity-50"
                      : ""
                  }`}
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
                  className="flex-1 bg-orange-500 text-white hover:bg-orange-600"
                  onClick={() => {
                    if (!currentVariant || !allAttributesSelected) {
                      toast.error("Please select all product options");
                      return;
                    }
                    addToCart({
                      productId: product.id,
                      variantId: currentVariant.id,
                      quantity,
                      name: product.name,
                      price: Number(currentVariant.discount_price),
                      image: mainImage,
                      slug: product.slug ?? "",
                      flash_sale: product.flash_sale_slug ?? "",
                    });
                  }}
                >
                  Add to Cart
                </Button>

                <Button
                  className="flex-1 border border-orange-500 text-orange-500 hover:bg-orange-50"
                  onClick={() => {
                    if (!currentVariant || !allAttributesSelected) {
                      toast.error("Please select all product options");
                      return;
                    }
                    clearCheckout();
                    addToCheckout({
                      variant_id: currentVariant.id,
                      productId: product.id,
                      name: product.name,
                      quantity: quantity,
                      discount_price: Number(currentVariant.discount_price),
                      flash_sale: product.flash_sale_slug ?? "",
                    });
                    router.push("/checkout");
                  }}
                >
                  Buy Now
                </Button>
              </>
            ) : (
              <Button className="flex-1 bg-gray-500 text-white hover:bg-gray-600">
                Request Stock
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
