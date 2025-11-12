"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaTrash } from "react-icons/fa";
import { getCart, removeFromCart } from "@/lib/cart";
import { setCheckoutItems } from "@/lib/checkout";
import Lottie from "lottie-react";
import CalculateIcon from "@/app/animations/calculate-hover-calculate.json";

interface LocalCartItem {
  productId: number;
  variantId: number;
  quantity: number;
  image?: string;
  name?: string;
  sku?: string;
  price?: number;
  slug: string;
  flash_sale?: string;
}

interface VariantAPI {
  id: number;
  product_id: number;
  sku: string;
  buying_price?: string | null;
  sell_price?: string;
  discount_price_cart: string;
  discount_amount?: string | null;
  stock: number;
  weight: string;
  has_flash_sale?: boolean;
  flash_sale?: string;
  status: string;
  images: string[];
  attributes: {
    id: number;
    product_variant_id: number;
    attribute_id: number;
    attribute_value_id: number;
    attribute_name: string;
    is_image: number;
    attribute_value: string;
  }[];
}

export default function Cart() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<
    (VariantAPI & {
      quantity: number;
      fallbackImage?: string;
      name?: string;
      skuLocal?: string;
      slug: string;
      isDisabled?: boolean;
      isLoadingApi?: boolean;
    })[]
  >([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [cartLoaded, setCartLoaded] = useState(false);

  useEffect(() => {
    const localCart = getCart() as unknown as LocalCartItem[];
    if (!localCart || localCart.length === 0) {
      setCartLoaded(true);
      return;
    }

    // Skeleton loading items
    const initialCart = localCart.map((item) => ({
      id: item.variantId,
      product_id: item.productId,
      sku: "",
      discount_price_cart: String(item.price || 0),
      sell_price: "0",
      stock: 1,
      weight: "0",
      images: [],
      attributes: [],
      quantity: item.quantity,
      fallbackImage: item.image,
      name: item.name,
      skuLocal: item.sku || "Unknown SKU",
      slug: item.slug,
      flash_sale: item.flash_sale || undefined,
      status: "inactive",
      isDisabled: false,
      isLoadingApi: true,
    }));

    setCartItems(initialCart);

    // Request body for variant info
    const variantRequestBody = localCart.map((item) => ({
      product_id: item.productId,
      variants_id: item.variantId,
      flash_sale: item.flash_sale || null,
    }));

    fetch("/api/variants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(variantRequestBody),
    })
      .then((res) => res.json())
      .then((resData) => {
        if (!resData.status || !resData.data)
          throw new Error("No variants found");
        const variants: VariantAPI[] = resData.data;

        setCartItems((prevItems) =>
          prevItems.map((ci) => {
            const variant = variants.find((v) => v.id === ci.id);
            if (variant) {
              return {
                ...ci,
                ...variant,
                quantity: ci.quantity,
                fallbackImage: variant.images?.[0] || ci.fallbackImage,
                skuLocal: ci.skuLocal || variant.sku,
                isDisabled:
                  variant.stock <= 0 ||
                  variant.status?.toLowerCase() !== "active",
                isLoadingApi: false,
              };
            }
            return { ...ci, isDisabled: true, isLoadingApi: false };
          })
        );
      })
      .catch(() => {
        setCartItems((prevItems) =>
          prevItems.map((ci) => ({
            ...ci,
            isDisabled: true,
            isLoadingApi: false,
          }))
        );
      })
      .finally(() => setCartLoaded(true));
  }, []);

  const updateQty = (variantId: number, action: "inc" | "dec") => {
    setCartItems((items) =>
      items.map((item) => {
        if (item.id === variantId && !item.isDisabled) {
          const newQty =
            action === "inc"
              ? item.quantity + 1
              : Math.max(1, item.quantity - 1);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const removeItem = (variantId: number) => {
    removeFromCart(variantId);
    setCartItems((items) => items.filter((item) => item.id !== variantId));
    setSelectedItems((items) => items.filter((id) => id !== variantId));
  };

  const subtotal = cartItems
    .filter((item) => selectedItems.includes(item.id) && !item.isDisabled)
    .reduce(
      (acc, item) => acc + Number(item.discount_price_cart) * item.quantity,
      0
    );

  const hasStockExceeded = cartItems.some(
    (item) => selectedItems.includes(item.id) && item.quantity > item.stock
  );

  const total = subtotal;

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              🛒 Shopping Cart
            </h2>
            <Link href="/shop">
              <button className="bg-amber-500 text-white text-sm py-2 px-3 rounded-md hover:bg-amber-600 transition cursor-pointer">
                Continue Shopping
              </button>
            </Link>
          </div>

          {cartLoaded && cartItems.length === 0 ? (
            <p className="text-gray-500 text-center py-12 text-lg">
              Your cart is empty 🛍️
            </p>
          ) : (
            <div className="space-y-6">
              {cartItems.map((item) => {
                const imageSrc = item.fallbackImage || "/placeholder.png";
                const isStockExceeded = item.quantity > item.stock;

                return (
                  <div
                    key={item.id}
                    className={`flex flex-col md:flex-row items-start md:items-center justify-between border rounded-xl p-4 transition-shadow ${
                      item.isDisabled ? "opacity-50" : "shadow hover:shadow-md"
                    } ${
                      isStockExceeded && selectedItems.includes(item.id)
                        ? "border-red-500"
                        : "border-gray-200"
                    } bg-white`}
                  >
                    <div className="flex items-start gap-5">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        disabled={item.isDisabled || item.isLoadingApi}
                        onChange={() =>
                          setSelectedItems((prev) =>
                            prev.includes(item.id)
                              ? prev.filter((id) => id !== item.id)
                              : [...prev, item.id]
                          )
                        }
                        className="mt-2 w-5 h-5 cursor-pointer accent-orange-500"
                      />

                      <Link href={`/product/${item.slug}`}>
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden border cursor-pointer">
                          {item.isLoadingApi ? (
                            <div className="w-full h-full bg-gray-200 animate-pulse rounded" />
                          ) : (
                            <Image
                              src={imageSrc}
                              alt={item.name || item.skuLocal || ""}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          )}
                        </div>
                      </Link>

                      <div className="space-y-1">
                        <Link href={`/product/${item.slug}`}>
                          <h3 className="font-semibold text-lg text-gray-800 cursor-pointer hover:text-orange-600">
                            {item.name || item.skuLocal}
                          </h3>
                        </Link>

                        {item.has_flash_sale && (
                          <p className="inline-block text-xs bg-red-100 text-red-600 px-2 py-[2px] rounded-full font-semibold">
                            🔥 Flash Sale Active ({item.flash_sale || "N/A"})
                          </p>
                        )}

                        {item.attributes?.length > 0 && (
                          <p className="text-sm text-gray-500">
                            {item.attributes
                              .map(
                                (a) =>
                                  `${a.attribute_name}: ${a.attribute_value}`
                              )
                              .join(", ")}
                          </p>
                        )}

                        <p className="text-sm text-gray-600">
                          SKU: {item.sku || item.skuLocal || "Unknown SKU"}
                        </p>

                        <p className="text-orange-600 text-xl font-bold">
                          ৳ {Number(item.discount_price_cart)}
                        </p>

                        {item.stock === 0 && !item.isLoadingApi ? (
                          <p className="text-red-500 text-xs mt-1">
                            Out of stock
                          </p>
                        ) : (
                          selectedItems.includes(item.id) &&
                          item.quantity > item.stock && (
                            <p className="text-red-500 text-xs mt-1">
                              Not enough stock available.
                            </p>
                          )
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-4 md:mt-0">
                      <div className="flex items-center border rounded-md">
                        <button
                          onClick={() => updateQty(item.id, "dec")}
                          className="px-3 py-1 hover:bg-gray-100"
                          disabled={item.isDisabled || item.isLoadingApi}
                        >
                          -
                        </button>
                        <span className="px-4 font-medium text-gray-700">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, "inc")}
                          className="px-3 py-1 hover:bg-gray-100"
                          disabled={item.isDisabled || item.isLoadingApi}
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Cart Summary */}
        <div className="bg-white p-6 rounded-xl shadow-sm h-fit relative">
          {/* 🧮 Lottie Overlay Loader */}
          {cartItems.some((item) => item.isLoadingApi) && (
            <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center z-10 backdrop-blur-sm rounded-xl">
              <div className="w-20 h-20">
                <Lottie
                  animationData={CalculateIcon}
                  loop
                  autoplay
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
              <span className="text-gray-600 text-sm font-medium mt-2">
                Calculating summary...
              </span>
            </div>
          )}

          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Order Summary
          </h2>
          <div className="flex justify-between text-sm mb-2 text-gray-600">
            <span>Subtotal</span>
            <span>৳ {subtotal}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg border-t pt-2 text-gray-800">
            <span>Total</span>
            <span>৳ {total}</span>
          </div>

          <button
            disabled={
              selectedItems.length === 0 ||
              cartItems.some((item) => item.isLoadingApi) ||
              hasStockExceeded
            }
            onClick={() => {
              const checkoutData = cartItems
                .filter(
                  (item) => selectedItems.includes(item.id) && !item.isDisabled
                )
                .map((item) => ({
                  variant_id: item.id,
                  productId: item.product_id,
                  name: item.name || item.skuLocal || "Unknown Product",
                  quantity: item.quantity,
                  discount_price: Number(item.discount_price_cart),
                  flash_sale: item.flash_sale || undefined,
                }));

              setCheckoutItems(checkoutData);
              router.push("/checkout");
            }}
            className={`w-full mt-6 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition ${
              selectedItems.length === 0 ||
              cartItems.some((item) => item.isLoadingApi) ||
              hasStockExceeded
                ? "cursor-not-allowed bg-gray-300 hover:bg-gray-300"
                : ""
            }`}
          >
              Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
