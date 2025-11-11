"use client";

interface Props {
  paymentMethod: "cod" | "bkash" | "card";
  setPaymentMethod: (m: "cod" | "bkash" | "card") => void;
}

export default function PaymentMethod({ paymentMethod, setPaymentMethod }: Props) {
  const paymentFullLabels = {
    cod: "Cash on Delivery",
    bkash: "bKash / Mobile Banking",
    card: "Credit / Debit Card",
  };

  return (
    <div className="flex flex-col gap-3 mt-4">
      {(["cod", "bkash", "card"] as const).map((method) => {
        const isSelected = paymentMethod === method;
        return (
          <label
            key={method}
            className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer border transition ${
              isSelected
                ? "border-amber-500 bg-amber-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <input
              type="radio"
              checked={isSelected}
              onChange={() => setPaymentMethod(method)}
              className="hidden"
            />
            <span
              className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                isSelected
                  ? "border-amber-500 bg-amber-500"
                  : "border-gray-300 bg-white"
              }`}
            >
              {isSelected && <span className="w-2 h-2 rounded-full bg-white"></span>}
            </span>
            <span className="text-sm font-medium">
              {paymentFullLabels[method]}
            </span>
          </label>
        );
      })}

    </div>
  );
}
