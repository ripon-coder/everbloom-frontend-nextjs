"use client";

import { useState } from "react";

interface Address {
  id: number;
  name: string;
  phone: string;
  address: string;
}

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [location, setLocation] = useState("inside"); // "inside" or "outside"
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  // Example order items
  const orderItems = [
    { id: 1, name: "Wireless Bluetooth Headphone", qty: 1, price: 1250 },
    { id: 2, name: "Smart Watch Pro Series", qty: 2, price: 1850 },
  ];

  // Example saved addresses
  const addressBook: Address[] = [
    { id: 1, name: "John Doe", phone: "+880123456789", address: "House 12, Road 3, Dhaka" },
    { id: 2, name: "Jane Smith", phone: "+880987654321", address: "Apartment 5B, Gulshan, Dhaka" },
  ];

  const subtotal = orderItems.reduce((acc, item) => acc + item.qty * item.price, 0);
  const deliveryCharge = location === "inside" ? 80 : 120;

  return (
    <div className="p-3 bg-gray-50 min-h-screen">
      <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side - Shipping & Payment */}
        <div className="md:col-span-2 bg-white p-4 space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Checkout</h2>

          {/* Shipping Address Selector */}
          <div>
            <h3 className="text-lg font-medium mb-2">Shipping Address</h3>
            <select
              value={selectedAddress?.id || ""}
              onChange={(e) => {
                const addr = addressBook.find(a => a.id === Number(e.target.value));
                setSelectedAddress(addr || null);
              }}
              className="border p-3 rounded-md w-full mb-4"
            >
              <option value="">-- Select Saved Address --</option>
              {addressBook.map(addr => (
                <option key={addr.id} value={addr.id}>
                  {addr.name} - {addr.address}
                </option>
              ))}
            </select>

            {/* Shipping Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                value={selectedAddress?.name || ""}
                className="border p-3 rounded-md w-full"
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={selectedAddress?.phone || ""}
                className="border p-3 rounded-md w-full"
              />
              <input
                type="text"
                placeholder="City"
                className="border p-3 rounded-md w-full"
              />
              <input
                type="text"
                placeholder="Postal Code"
                className="border p-3 rounded-md w-full"
              />
              <input
                type="text"
                placeholder="Country"
                className="border p-3 rounded-md w-full"
              />
            </div>
            <textarea
              placeholder="Full Address"
              value={selectedAddress?.address || ""}
              className="border p-3 rounded-md w-full mt-4"
              rows={3}
            />

            {/* Delivery Location */}
            <div className="mt-4">
              <span className="font-medium text-sm">Delivery Location:</span>
              <div className="flex gap-4 mt-2">
                <button
                  onClick={() => setLocation("inside")}
                  className={`px-4 py-2 border rounded-md text-sm ${
                    location === "inside"
                      ? "border-orange-500 bg-orange-50 text-orange-600"
                      : "hover:bg-gray-100"
                  }`}
                >
                  Inside Dhaka (৳80)
                </button>
                <button
                  onClick={() => setLocation("outside")}
                  className={`px-4 py-2 border rounded-md text-sm ${
                    location === "outside"
                      ? "border-orange-500 bg-orange-50 text-orange-600"
                      : "hover:bg-gray-100"
                  }`}
                >
                  Outside Dhaka (৳120)
                </button>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <h3 className="text-lg font-medium mb-2">Payment Method</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 border p-3 rounded-md cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
                <span>Cash on Delivery (COD)</span>
              </label>
              <label className="flex items-center gap-3 border p-3 rounded-md cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                />
                <span>Credit / Debit Card</span>
              </label>
              <label className="flex items-center gap-3 border p-3 rounded-md cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "bkash"}
                  onChange={() => setPaymentMethod("bkash")}
                />
                <span>bKash / Mobile Banking</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Side - Order Summary */}
        <div className="bg-white p-4 h-fit">
          <h3 className="text-lg font-medium mb-4">Order Summary</h3>
          <div className="space-y-3 text-sm">
            {orderItems.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>{item.name} (x{item.qty})</span>
                <span>৳ {item.price * item.qty}</span>
              </div>
            ))}
          </div>
          <div className="border-t mt-4 pt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>৳ {subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span>৳ {deliveryCharge}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>৳ {subtotal + deliveryCharge}</span>
            </div>
          </div>
          <button className="w-full mt-6 bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition">
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}
