"use client";

import Image from "next/image";
import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/lib/cart";
import { toast } from "react-hot-toast";
import { clearCheckout, addToCheckout } from "@/lib/checkout";
import { Heart } from "lucide-react";
import WishlistButton from "@/components/WishlistButton";

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
  const router = useRouter();
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

  // Wishlist state
  const [isWishlisted, setIsWishlisted] = useState(false);

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

  // Calculate time remaining for flash sale
  useEffect(() => {
    if (!product.flash_sale_end_date) return;

    const calculateTimeLeft = () => {
      const endDate = new Date(product.flash_sale_end_date!).getTime();
      const now = new Date().getTime();
      const difference = endDate - now;

      if (difference <= 0) {
        return null; // Flash sale has ended
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Clean up interval
    return () => clearInterval(timer);
  }, [product.flash_sale_end_date]);

  // Calculate progress percentage
  const calculateProgress = () => {
    if (!product.flash_sale_start_date || !product.flash_sale_end_date || !timeLeft) return 0;
    
    const startDate = new Date(product.flash_sale_start_date).getTime();
    const endDate = new Date(product.flash_sale_end_date).getTime();
    const now = new Date().getTime();
    
    const totalDuration = endDate - startDate;
    const elapsed = now - startDate;
    
    return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = imageContainerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setLensPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };
  const handleMouseEnter = () => setIsZoomed(true);
  const handleMouseLeave = () => setIsZoomed(false);

  // Quantity
  const incrementQty = () =>
    selectedVariant &&
    quantity < selectedVariant.stock &&
    setQuantity((prev) => prev + 1);
  const decrementQty = () => quantity > 1 && setQuantity((prev) => prev - 1);

  // Attribute logic - Updated to allow deselection
  const findMatchingVariant = (attrs: Record<string, string>) =>
    product?.variants?.find((variant) =>
      Object.entries(attrs).every(([name, value]) =>
        variant.attributes.some(
          (a) => a.attribute_name === name && a.attribute_value === value
        )
      )
    ) || null;

  const handleAttributeSelect = (attrName: string, attrValue: string) => {
    // Check if this attribute is already selected
    const isCurrentlySelected = selectedAttributes[attrName] === attrValue;
    
    let updatedAttrs;
    if (isCurrentlySelected) {
      // Deselect the attribute
      updatedAttrs = { ...selectedAttributes };
      delete updatedAttrs[attrName];
    } else {
      // Select or change the attribute
      updatedAttrs = { ...selectedAttributes, [attrName]: attrValue };
    }

    setSelectedAttributes(updatedAttrs);

    // Try to find a matching variant with the updated attributes
    const matchedVariant = findMatchingVariant(updatedAttrs);
    
    if (matchedVariant) {
      setSelectedVariant(matchedVariant);
      setMainImage(
        matchedVariant.images?.[0] || product.images?.[0] || "/placeholder.png"
      );
      setQuantity(1);
    } else {
      // If no variant matches, reset to the first variant
      setSelectedVariant(firstVariant);
      setMainImage(
        firstVariant?.images?.[0] || product.images?.[0] || "/placeholder.png"
      );
      setQuantity(1);
    }
  };

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

          {/* Flash Sale Badge with Timer */}
          {product.flash_sale_name && (
            <div className="mb-2">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-red-500 text-white px-3 py-1 rounded-md text-sm font-medium flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                  </svg>
                  {product.flash_sale_name}
                </div>
                <span className="text-xs text-red-500 font-medium">Limited Time Offer</span>
              </div>
              
              {/* Countdown Timer - Compact Format */}
              {timeLeft ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-medium text-red-700 mb-2">Flash sale ends in:</span>
                    
                    {/* Timer Units */}
                    <div className="flex gap-1 mb-2">
                      {timeLeft.days > 0 && (
                        <div className="flex flex-col items-center">
                          <div className="bg-red-500 text-white rounded w-8 h-8 flex items-center justify-center text-xs font-bold">
                            {timeLeft.days.toString().padStart(2, '0')}
                          </div>
                          <div className="text-xs text-red-600 mt-1">d</div>
                        </div>
                      )}
                      
                      {timeLeft.days > 0 || timeLeft.hours > 0 ? (
                        <div className="flex flex-col items-center">
                          <div className="bg-red-500 text-white rounded w-8 h-8 flex items-center justify-center text-xs font-bold">
                            {timeLeft.hours.toString().padStart(2, '0')}
                          </div>
                          <div className="text-xs text-red-600 mt-1">h</div>
                        </div>
                      ) : null}
                      
                      <div className="flex flex-col items-center">
                        <div className="bg-red-500 text-white rounded w-8 h-8 flex items-center justify-center text-xs font-bold">
                          {timeLeft.minutes.toString().padStart(2, '0')}
                        </div>
                        <div className="text-xs text-red-600 mt-1">m</div>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <div className="bg-red-500 text-white rounded w-8 h-8 flex items-center justify-center text-xs font-bold">
                          {timeLeft.seconds.toString().padStart(2, '0')}
                        </div>
                        <div className="text-xs text-red-600 mt-1">s</div>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-red-200 rounded-full h-1.5">
                      <div 
                        className="bg-red-500 h-1.5 rounded-full transition-all duration-1000 ease-linear" 
                        style={{ width: `${calculateProgress()}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
                  <div className="text-center text-sm font-medium text-red-700">Flash sale has ended</div>
                </div>
              )}
            </div>
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
          <div className="flex items-center gap-4 mt-2">
            <p className="text-sm">
              <span className="font-medium">Stock:</span>{" "}
              {inStock ? (
                <span className="text-green-600">
                  {currentVariant?.stock} available
                </span>
              ) : (
                <span className="text-red-500">Out of stock</span>
              )}
            </p>

            {product.is_free_delivery && (
              <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-semibold border border-green-200">
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 10h2l3 9h8l3-9h2"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 16v4m-8-4v4"
                  />
                </svg>
                Free Delivery
              </div>
            )}
          </div>

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
                  className="flex-1 bg-orange-500 text-white hover:bg-orange-600 cursor-pointer"
                  onClick={() => {
                    if (!currentVariant || !allAttributesSelected) {
                      toast.error("Please select all product options", {
                        id: "attr-error",
                      });
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
                    });
                  }}
                >
                  Add to Cart
                </Button>

                <Button
                  className="flex-1 border border-orange-500 text-orange-500 hover:bg-orange-50 cursor-pointer"
                  onClick={() => {
                    if (!currentVariant || !allAttributesSelected) {
                      toast.error("Please select all product options", {
                        id: "attr-error",
                      });
                      return;
                    }
                    clearCheckout();
                    addToCheckout({
                      variant_id: currentVariant.id,
                      productId: product.id,
                      name: product.name,
                      quantity: quantity,
                      discount_price: Number(currentVariant.discount_price),
                    });
                    router.push("/checkout");
                  }}
                >
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