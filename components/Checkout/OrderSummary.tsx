// components/Checkout/OrderSummary.tsx
"use client";

import { CheckoutVariant } from "@/hooks/useCheckout";
import Lottie from "lottie-react";
import CalculateIcon from "@/app/animations/calculate-hover-calculate.json";


interface Props {
  checkoutItems: CheckoutVariant[];
  checkoutTotals: any;
  shippingLoading: boolean;
  placeOrder: () => void;
  paymentLabel: string;
  orderLoading: boolean;
  variantLoading: boolean;
}

export default function OrderSummary({
  checkoutItems,
  checkoutTotals,
  shippingLoading,
  placeOrder,
  paymentLabel,
  orderLoading,
  variantLoading,
}: Props) {
  const hasFlash = Number(checkoutTotals?.flash_discount || 0) > 0;

  return (
    <div className="relative bg-white p-6 rounded-xl shadow-md overflow-hidden">
      {variantLoading && (
        <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center z-10 backdrop-blur-sm">
          {/* Lottie Animation */}
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

      <h3 className="text-lg font-semibold mb-5 border-b pb-2">
        Order Summary
      </h3>

      {/* 🟩 Product list */}
      <div className="space-y-4 text-sm">
        {checkoutItems.map((item) => {
          const regularTotal = Number(item.discount_price_cart) * item.quantity;
          const flashTotal = Number(item.discount_price) * item.quantity;

          return (
            <div
              key={item.key}
              className="flex justify-between items-center border-b last:border-0 border-gray-100 pb-3"
            >
              {/* Product Info */}
              <div className="flex flex-col">
                <span className="font-medium text-gray-800">{item.name}</span>
                <span className="text-gray-500 text-xs">
                  {item.quantity} pcs
                </span>
              </div>

              {/* Price Info */}
              <div className="text-right">
                {hasFlash ? (
                  <>
                    <div className="text-gray-400 line-through text-xs">
                      ৳ {flashTotal.toLocaleString()}
                    </div>
                    <div className="text-red-600 font-semibold text-sm">
                      ৳ {regularTotal.toLocaleString()}
                    </div>
                  </>
                ) : (
                  <div className="text-gray-800 font-medium">
                    ৳ {regularTotal.toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 🟩 Totals Section */}
      <div className="border-t mt-5 pt-4 space-y-2 text-sm">
        {/* Subtotal */}
        <div className="flex justify-between text-gray-700">
          <span>Subtotal</span>
          <span className="font-medium">
            ৳ {Number(checkoutTotals.subtotal).toLocaleString()}
          </span>
        </div>

        {/* Flash Discount */}
        {hasFlash && (
          <div className="flex justify-between text-sm text-red-600 bg-red-50 px-2 py-1 rounded-md">
            <span className="font-medium">Flash Sale Discount</span>
            <span>
              − ৳ {Number(checkoutTotals.flash_discount).toLocaleString()}
            </span>
          </div>
        )}

        {/* Coupon Discount */}
        {Number(checkoutTotals.coupon_discount) > 0 && (
          <div className="flex justify-between text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
            <span className="font-medium">Coupon Discount</span>
            <span>
              − ৳ {Number(checkoutTotals.coupon_discount).toLocaleString()}
            </span>
          </div>
        )}

        {/* Shipping */}
        <div className="flex justify-between text-gray-700">
          <span>Shipping</span>
          {shippingLoading ? (
            <div className="w-12 h-4 bg-gray-200 rounded animate-pulse" />
          ) : (
            <span className="font-medium">
              ৳ {Number(checkoutTotals.shipping).toLocaleString()}
            </span>
          )}
        </div>

        {/* Divider */}
        <div className="border-t my-2" />

        {/* Total */}
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-800">Total</span>
          {shippingLoading ? (
            <div className="w-16 h-5 bg-gray-200 rounded animate-pulse" />
          ) : (
            <span className="text-xl font-bold text-orange-600">
              ৳ {Number(checkoutTotals.total).toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {/* 🟩 Place Order */}
      <button
        onClick={placeOrder}
        disabled={orderLoading || variantLoading}
        className="w-full bg-orange-500 text-white py-3 mt-5 rounded-lg font-medium hover:bg-orange-600 transition text-lg cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {orderLoading ? "Placing..." : `Place Order (${paymentLabel})`}
      </button>
    </div>
  );
}
