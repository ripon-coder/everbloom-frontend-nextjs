"use client";

interface Props {
  couponCode: string;
  setCouponCode: (val: string) => void;
  applyCoupon: () => void;
  couponLoading: boolean;
  couponMessage: string;
}

export default function CouponSection({
  couponCode,
  setCouponCode,
  applyCoupon,
  couponLoading,
  couponMessage,
}: Props) {
  return (
    <div className="mt-4">
      <div className="flex gap-2 relative">
        <input
          type="text"
          placeholder="Enter coupon code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          className="border p-3 rounded flex-1"
        />
        <button
          onClick={applyCoupon}
          className="bg-amber-500 text-white px-4 py-3 rounded hover:bg-amber-600 transition text-sm cursor-pointer"
          disabled={couponLoading}
        >
          {couponLoading ? "Applying..." : "Apply"}
        </button>
      </div>
      {couponMessage && (
        <p
          className={`text-sm mt-1 ${
            couponMessage.includes("✔") ? "text-green-600" : "text-red-500"
          }`}
        >
          {couponMessage}
        </p>
      )}
    </div>
  );
}
