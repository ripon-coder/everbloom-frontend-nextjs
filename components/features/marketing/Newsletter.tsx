"use client";
import { useState } from "react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">Newsletter</h3>
      <p className="text-gray-400 text-sm mb-4">
        Subscribe to get latest updates and offers.
      </p>
      <div className="w-full flex gap-0">
        <div className="flex-2">
          <input
            type="email"
            placeholder="Your email"
            className="px-4 py-2 rounded-l-lg focus:outline-none text-white w-full border border-amber-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <button className="border border-amber-500 bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-r-lg text-white font-medium w-full sm:w-auto cursor-pointer">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
}
