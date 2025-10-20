"use client";

import Image from "next/image";
import { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

interface Attribute {
  id: number;
  attribute_name: string;
  attribute_value: string;
  is_image: number;
}

interface Variant {
  id: number;
  sku: string;
  sell_price: string;
  discount_price: string;
  stock: number;
  images: string[];
  attributes: Attribute[];
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  images: string[];
  variants: Variant[];
}

interface Props {
  product: Product;
}

export default function ProductClient({ product }: Props) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(
    selectedVariant.images[0] || product.images[0]
  );
  const [isFavorite, setIsFavorite] = useState(false);

  const incrementQty = () => {
    if (quantity < selectedVariant.stock) setQuantity((prev) => prev + 1);
  };

  const decrementQty = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  // Select variant by attribute
  const selectVariantByAttr = (attrName: string, attrValue: string) => {
    const variant = product.variants.find((v) =>
      v.attributes.some(
        (a) => a.attribute_name === attrName && a.attribute_value === attrValue
      )
    );
    if (variant) {
      setSelectedVariant(variant);
      setMainImage(variant.images[0] || product.images[0]);
    }
  };

  // Get unique values for each attribute type
  const getUniqueAttributeValues = (attrName: string) => {
    const values = product.variants
      .map(
        (v) =>
          v.attributes.find((a) => a.attribute_name === attrName)
            ?.attribute_value
      )
      .filter(Boolean) as string[];
    return Array.from(new Set(values));
  };

  return (
    <div className="p-4 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Images */}
        <div>
          <div className="relative w-full h-96 border rounded-lg overflow-hidden">
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-cover"
              unoptimized
            />
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:scale-110 transition"
            >
              {isFavorite ? (
                <FaHeart className="text-red-500 text-xl" />
              ) : (
                <FaRegHeart className="text-gray-600 text-xl" />
              )}
            </button>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 mt-4">
            {[...selectedVariant.images, ...product.images]
              .filter((v, i, a) => a.indexOf(v) === i) // unique images
              .map((img, i) => (
                <div
                  key={i}
                  className="relative w-20 h-20 border rounded-md overflow-hidden cursor-pointer hover:ring-2 hover:ring-orange-500"
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

        {/* Product Details */}
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-semibold">{product.name}</h1>
          <p className="text-gray-700">{product.description}</p>

          {/* Price */}
          <div className="text-3xl font-bold text-orange-600 flex items-center gap-3">
            <span>৳ {selectedVariant.discount_price}</span>
            <span className="text-gray-400 line-through text-xl">
              ৳ {selectedVariant.sell_price}
            </span>
          </div>

          {/* Attribute Selectors */}
          <div className="mt-4 space-y-3">
            {["Color", "Storage", "Warranty"].map((attrName) => {
              const values = getUniqueAttributeValues(attrName);
              return values.length ? (
                <div key={attrName}>
                  <p className="font-medium">{attrName}:</p>
                  <div className="flex gap-2 flex-wrap mt-1">
                    {values.map((val) => (
                      <button
                        key={val}
                        className={`px-3 py-1 border rounded-md ${
                          selectedVariant.attributes.some(
                            (a) =>
                              a.attribute_name === attrName &&
                              a.attribute_value === val
                          )
                            ? "bg-orange-500 text-white"
                            : "bg-gray-100 text-gray-700"
                        }`}
                        onClick={() => selectVariantByAttr(attrName, val)}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null;
            })}
          </div>

          {/* Stock & Quantity */}
          <p className="text-sm mt-2">
            <span className="font-medium">Stock:</span>{" "}
            {selectedVariant.stock > 0 ? (
              <span className="text-green-600">
                {selectedVariant.stock} available
              </span>
            ) : (
              <span className="text-red-500">Out of stock</span>
            )}
          </p>

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
                className="px-3 py-1 hover:bg-gray-200"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart / Buy Now */}
          <div className="flex gap-4 mt-4">
            <button className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition">
              Add to Cart
            </button>
            <button className="flex-1 border border-orange-500 text-orange-500 py-3 rounded-lg font-medium hover:bg-orange-50 transition">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
