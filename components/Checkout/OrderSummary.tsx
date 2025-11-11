"use client";

import { CheckoutVariant } from "@/hooks/useCheckout";

interface Props {
  checkoutItems: CheckoutVariant[];
  checkoutTotals: any;
  shippingLoading: boolean;
  placeOrder: () => void;
  paymentLabel: string;
  orderLoading: boolean;
}

export default function OrderSummary({
  checkoutItems,
  checkoutTotals,
  shippingLoading,
  placeOrder,
  paymentLabel,
  orderLoading,
}: Props) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

      {/* 🟩 Product list */}
      <div className="space-y-3 text-sm">
        {checkoutItems.map((item) => (
          <div key={item.key} className="flex justify-between">
            <span>
              {item.name} ({item.quantity}x)
            </span>
            <span>
              ৳ {(Number(item.discount_price) * item.quantity).toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {/* 🟩 Totals Section */}
      <div className="border-t mt-4 pt-3 space-y-2 text-sm">
        {/* Subtotal */}
        <div className="flex justify-between text-gray-700">
          <span>Subtotal</span>
          <span className="font-medium">
            ৳ {Number(checkoutTotals.subtotal).toLocaleString()}
          </span>
        </div>

        {/* Flash Discount */}
        {Number(checkoutTotals.flash_discount) > 0 && (
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
        disabled={orderLoading}
        className="w-full bg-orange-500 text-white py-3 mt-5 rounded-lg font-medium hover:bg-orange-600 transition text-lg cursor-pointer"
      >
        {orderLoading ? "Placing..." : `Place Order (${paymentLabel})`}
      </button>
    </div>
  );
}
