"use client";

import { useState } from "react";
import { FiCreditCard, FiMail, FiArrowRight } from "react-icons/fi";

export default function PaymentMethodPage() {
  const [selected, setSelected] = useState<string>("paypal");

  const paymentMethods = [
    {
      id: "paypal",
      name: "PayPal",
      description: "Pay with your PayPal account",
      icon: <FiMail size={24} />,
    },
    {
      id: "credit",
      name: "Credit/Debit Card",
      description: "Pay with your credit or debit card",
      icon: <FiCreditCard size={24} />,
    },
    {
      id: "stripe",
      name: "Stripe",
      description: "Secure online payment via Stripe",
      icon: <FiArrowRight size={24} />,
    },
  ];

  const handleSelect = (id: string) => {
    setSelected(id);
  };

  const handleProceed = () => {
    alert(`Proceed to pay with ${selected}`);
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="max-w-5xl mx-auto bg-white p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Select Payment Method</h1>

        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              onClick={() => handleSelect(method.id)}
              className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition ${
                selected === method.id ? "border-amber-500 bg-amber-50" : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="text-amber-500">{method.icon}</div>
                <div>
                  <p className="font-medium text-gray-800">{method.name}</p>
                  <p className="text-gray-500 text-sm">{method.description}</p>
                </div>
              </div>
              {selected === method.id && (
                <div className="text-amber-500 font-semibold">Selected</div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={handleProceed}
          className="mt-6 w-full bg-amber-500 text-white py-2 rounded-lg font-medium hover:bg-amber-600 transition"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
}
