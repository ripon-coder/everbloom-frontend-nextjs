"use client";

import { useState } from "react";

interface Address {
  id: number;
  name: string;
  phone: string;
  address: string;
}

export default function AddressBookPage() {
  const [addresses, setAddresses] = useState<Address[]>([
    { id: 1, name: "John Doe", phone: "+880123456789", address: "Dhaka, Bangladesh" },
    { id: 2, name: "Jane Smith", phone: "+880987654321", address: "Chittagong, Bangladesh" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newAddress, setNewAddress] = useState({ name: "", phone: "", address: "" });

  const addAddress = () => {
    if (!newAddress.name || !newAddress.phone || !newAddress.address) return;
    setAddresses([
      { id: addresses.length + 1, ...newAddress }, // save at top
      ...addresses,
    ]);
    setNewAddress({ name: "", phone: "", address: "" });
    setShowModal(false);
  };

  const removeAddress = (id: number) => {
    setAddresses(addresses.filter((addr) => addr.id !== id));
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Address Book</h1>

        <div className="flex flex-col gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="bg-white border border-amber-600 p-4 rounded-md flex justify-between items-center"
            >
              <div>
                <p className="font-medium text-gray-800">{addr.name}</p>
                <p className="text-gray-500 text-sm">{addr.phone}</p>
                <p className="text-gray-500 text-sm whitespace-pre-line">{addr.address}</p>
              </div>
              <button
                onClick={() => removeAddress(addr.id)}
                className="text-red-500 border border-red-500 px-3 py-1 rounded-md hover:bg-red-50 transition"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Add Address Button */}
        <div className="mt-6">
          <button
            onClick={() => setShowModal(true)}
            className="bg-amber-500 text-white px-6 py-2 rounded-md hover:bg-amber-600 transition"
          >
            Add New Address
          </button>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Address</h2>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Name"
                  value={newAddress.name}
                  onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <input
                  type="text"
                  placeholder="Phone"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <textarea
                  placeholder="Address"
                  value={newAddress.address}
                  onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={addAddress}
                  className="bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600 transition"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
