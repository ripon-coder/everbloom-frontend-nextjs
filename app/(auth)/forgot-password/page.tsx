"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle sending reset password link here
    console.log("Reset link sent to:", email);
    setSubmitted(true);
  };

  return (
    <div className=" flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Forgot Password
        </h2>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-gray-600 text-sm mb-4">
              Enter your email address below and we’ll send you a link to reset your password.
            </p>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-amber-500 text-white py-3 rounded-lg font-medium hover:bg-amber-600 transition"
            >
              Send Reset Link
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-gray-700">
              A password reset link has been sent to <span className="font-medium">{email}</span>.
            </p>
            <a
              href="/login"
              className="text-amber-500 hover:underline font-medium"
            >
              Back to Login
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
